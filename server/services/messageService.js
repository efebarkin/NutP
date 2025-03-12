import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import {
  cacheMessage,
  getCachedMessages,
  setTypingStatus,
  getTypingStatus,
} from '../utils/redis.js';

/**
 * Mesaj servisi - Mesajların oluşturulması, alınması ve yönetilmesi için
 */
const messageService = {
  /**
   * Yeni bir mesaj oluşturur, Redis'e önbelleğe alır ve MongoDB'ye kaydeder
   * @param {Object} messageData - Mesaj verileri
   * @returns {Promise<Object>} - Oluşturulan mesaj
   */
  async createMessage(messageData) {
    try {
      // Önce MongoDB'ye kaydet
      const message = new Message(messageData);
      await message.save();

      // Sonra Redis'e önbelleğe al
      await cacheMessage({
        _id: message._id.toString(),
        sender: message.sender.toString(),
        receiver: message.receiver.toString(),
        content: message.content,
        conversationId: message.conversationId,
        createdAt: message.createdAt,
        read: message.read,
        attachments: message.attachments || [],
      });

      // Konuşmayı güncelle
      await Conversation.findOneAndUpdate(
        { _id: message.conversationId },
        {
          lastMessage: message._id,
          $inc: { [`unreadCount.${message.receiver}`]: 1 },
        },
        { new: true },
      );

      return message;
    } catch (error) {
      console.error('Mesaj oluşturma hatası:', error);
      throw new Error('Mesaj gönderilemedi');
    }
  },

  /**
   * Belirli bir konuşmaya ait mesajları getirir
   * @param {String} conversationId - Konuşma ID'si
   * @param {Number} limit - Getirilecek mesaj sayısı
   * @param {Number} skip - Atlanacak mesaj sayısı
   * @returns {Promise<Array>} - Mesajlar dizisi
   */
  async getMessages(conversationId, limit = 50, skip = 0) {
    try {
      // Önce Redis'ten mesajları kontrol et
      const cachedMessages = await getCachedMessages(conversationId, limit);

      if (cachedMessages.length >= limit) {
        return cachedMessages;
      }

      // Redis'te yeterli mesaj yoksa MongoDB'den getir
      const messages = await Message.find({
        conversationId,
        deleted: false,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar');

      // Mesajları Redis'e önbelleğe al
      for (const message of messages) {
        await cacheMessage({
          _id: message._id.toString(),
          sender: message.sender._id.toString(),
          receiver: message.receiver._id.toString(),
          content: message.content,
          conversationId: message.conversationId,
          createdAt: message.createdAt,
          read: message.read,
          attachments: message.attachments || [],
        });
      }

      return messages;
    } catch (error) {
      console.error('Mesaj getirme hatası:', error);
      throw new Error('Mesajlar getirilemedi');
    }
  },

  /**
   * Mesajı okundu olarak işaretler
   * @param {String} messageId - Mesaj ID'si
   * @returns {Promise<Object>} - Güncellenen mesaj
   */
  async markAsRead(messageId) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { read: true, readAt: new Date() },
        { new: true },
      );

      if (!message) {
        throw new Error('Mesaj bulunamadı');
      }

      // Redis'teki mesajı güncelle
      const cachedMessages = await getCachedMessages(message.conversationId);
      const messageIndex = cachedMessages.findIndex((m) => m._id === messageId);

      if (messageIndex !== -1) {
        cachedMessages[messageIndex].read = true;
        cachedMessages[messageIndex].readAt = new Date();
        await cacheMessage(cachedMessages[messageIndex]);
      }

      // Konuşmadaki okunmamış mesaj sayısını güncelle
      await Conversation.findByIdAndUpdate(message.conversationId, {
        $set: { [`unreadCount.${message.receiver}`]: 0 },
      });

      return message;
    } catch (error) {
      console.error('Mesajı okundu işaretleme hatası:', error);
      throw new Error('Mesaj okundu olarak işaretlenemedi');
    }
  },

  /**
   * Belirli bir kullanıcının tüm mesajlarını okundu olarak işaretler
   * @param {String} userId - Kullanıcı ID'si
   * @param {String} conversationId - Konuşma ID'si
   * @returns {Promise<Object>} - Sonuç
   */
  async markAllAsRead(userId, conversationId) {
    try {
      // MongoDB'deki mesajları güncelle
      await Message.updateMany(
        { conversationId, receiver: userId, read: false },
        { read: true, readAt: new Date() },
      );

      // Konuşmadaki okunmamış mesaj sayısını sıfırla
      await Conversation.findByIdAndUpdate(conversationId, {
        $set: { [`unreadCount.${userId}`]: 0 },
      });

      // Redis'teki mesajları güncelle
      const cachedMessages = await getCachedMessages(conversationId);

      for (const message of cachedMessages) {
        if (message.receiver === userId && !message.read) {
          message.read = true;
          message.readAt = new Date();
          await cacheMessage(message);
        }
      }

      return {
        success: true,
        message: 'Tüm mesajlar okundu olarak işaretlendi',
      };
    } catch (error) {
      console.error('Tüm mesajları okundu işaretleme hatası:', error);
      throw new Error('Mesajlar okundu olarak işaretlenemedi');
    }
  },

  /**
   * Kullanıcının yazıyor durumunu ayarlar
   * @param {String} conversationId - Konuşma ID'si
   * @param {String} userId - Kullanıcı ID'si
   * @param {Boolean} isTyping - Yazıyor durumu
   * @returns {Promise<Boolean>} - İşlem sonucu
   */
  async setTypingStatus(conversationId, userId, isTyping) {
    try {
      await setTypingStatus(conversationId, userId, isTyping);

      // Konuşmadaki typing durumunu güncelle
      await Conversation.findByIdAndUpdate(conversationId, {
        $set: { [`typing.${userId}`]: isTyping },
      });

      return true;
    } catch (error) {
      console.error('Yazıyor durumu ayarlama hatası:', error);
      return false;
    }
  },

  /**
   * Kullanıcının yazıyor durumunu getirir
   * @param {String} conversationId - Konuşma ID'si
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Boolean>} - Yazıyor durumu
   */
  async getTypingStatus(conversationId, userId) {
    try {
      return await getTypingStatus(conversationId, userId);
    } catch (error) {
      console.error('Yazıyor durumu getirme hatası:', error);
      return false;
    }
  },

  /**
   * Mesajı siler (soft delete)
   * @param {String} messageId - Mesaj ID'si
   * @param {String} userId - Silme işlemini yapan kullanıcı ID'si
   * @returns {Promise<Object>} - Silme sonucu
   */
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Mesaj bulunamadı');
      }

      // Kullanıcı mesajın göndereni değilse silme işlemi yapılamaz
      if (message.sender.toString() !== userId) {
        throw new Error('Bu mesajı silme yetkiniz yok');
      }

      // Mesajı soft delete ile işaretle
      message.deleted = true;
      message.deletedFor.push({ user: userId, deletedAt: new Date() });
      await message.save();

      return { success: true, message: 'Mesaj başarıyla silindi' };
    } catch (error) {
      console.error('Mesaj silme hatası:', error);
      throw new Error('Mesaj silinemedi');
    }
  },

  /**
   * Kullanıcının arkadaşlarını getirir
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Array>} - Arkadaşlar dizisi
   */
  async getFriends(userId) {
    try {
      const user = await User.findById(userId).populate({
        path: 'friends',
        select: 'name avatar bio isOnline lastSeen',
      });

      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      return user.friends || [];
    } catch (error) {
      console.error('Arkadaşları getirme hatası:', error);
      throw new Error('Arkadaşlar getirilemedi');
    }
  },

  /**
   * Kullanıcının konuşmalarını getirir
   * @param {String} userId - Kullanıcı ID'si
   * @param {Number} limit - Getirilecek konuşma sayısı
   * @param {Number} skip - Atlanacak konuşma sayısı
   * @returns {Promise<Array>} - Konuşmalar dizisi
   */
  async getConversations(userId, limit = 10, skip = 0) {
    try {
      // Kullanıcının katıldığı konuşmaları bul
      const conversations = await Conversation.find({
        participants: userId,
        deleted: false,
      })
        .sort({ updatedAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate({
          path: 'participants',
          select: 'name avatar isOnline lastSeen',
        })
        .populate({
          path: 'lastMessage',
          select: 'content createdAt sender read',
        });

      // Her konuşma için okunmamış mesaj sayısını hesapla
      const conversationsWithUnreadCount = await Promise.all(
        conversations.map(async (conversation) => {
          const unreadCount = await Message.countDocuments({
            conversationId: conversation._id,
            receiver: userId,
            read: false,
          });

          return {
            ...conversation.toObject(),
            unreadCount,
          };
        }),
      );

      return conversationsWithUnreadCount;
    } catch (error) {
      console.error('Konuşmaları getirme hatası:', error);
      throw new Error('Konuşmalar getirilemedi');
    }
  },

  /**
   * Yeni bir konuşma oluşturur
   * @param {String} userId - Kullanıcı ID'si
   * @param {String} participantId - Diğer katılımcı ID'si
   * @returns {Promise<Object>} - Oluşturulan konuşma
   */
  async createConversation(userId, participantId) {
    try {
      // Konuşma zaten var mı kontrol et
      let conversation = await Conversation.findOne({
        participants: { $all: [userId, participantId] },
        deleted: false,
      }).populate({
        path: 'participants',
        select: 'name avatar isOnline lastSeen',
      });

      if (conversation) {
        return conversation;
      }

      // Yeni konuşma oluştur
      conversation = new Conversation({
        participants: [userId, participantId],
        createdBy: userId,
      });

      await conversation.save();

      // Katılımcıları doldur
      await conversation.populate({
        path: 'participants',
        select: 'name avatar isOnline lastSeen',
      });

      return conversation;
    } catch (error) {
      console.error('Konuşma oluşturma hatası:', error);
      throw new Error('Konuşma oluşturulamadı');
    }
  },
};

export default messageService;
