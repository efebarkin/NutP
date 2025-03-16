import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import {
  cacheMessage,
  getCachedMessages,
  setTypingStatus,
  getTypingStatus,
  TTL,
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

      // İlk durum güncellemesini ekle
      message.statusUpdates.push({
        status: 'sent',
        timestamp: new Date(),
        updatedBy: message.sender,
      });

      await message.save();

      // Sonra Redis'e önbelleğe al
      await cacheMessage({
        _id: message._id.toString(),
        sender: message.sender.toString(),
        receiver: message.receiver.toString(),
        content: message.content,
        conversationId: message.conversationId,
        createdAt: message.createdAt,
        status: message.status,
        attachments: message.attachments || [],
        messageType: message.messageType,
        replyTo: message.replyTo,
      });

      // Konuşmayı güncelle
      const conversation = await Conversation.findById(message.conversationId);
      if (conversation) {
        // Son mesaj önizlemesini güncelle
        await conversation.updateLastMessagePreview(message);

        // Okunmamış mesaj sayısını artır
        const unreadCount =
          conversation.unreadCount.get(message.receiver.toString()) || 0;
        conversation.unreadCount.set(
          message.receiver.toString(),
          unreadCount + 1,
        );
        conversation.markModified('unreadCount');

        await conversation.save();
      }

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
        .populate('receiver', 'name avatar')
        .populate('replyTo', 'content sender');

      // Mesajları Redis'e önbelleğe al
      for (const message of messages) {
        await cacheMessage({
          _id: message._id.toString(),
          sender: message.sender._id.toString(),
          receiver: message.receiver._id.toString(),
          content: message.content,
          conversationId: message.conversationId,
          createdAt: message.createdAt,
          status: message.status,
          attachments: message.attachments || [],
          messageType: message.messageType,
          replyTo: message.replyTo,
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
   * @param {String} userId - Okuyan kullanıcı ID'si
   * @returns {Promise<Object>} - Güncellenen mesaj
   */
  async markAsRead(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Mesaj bulunamadı');
      }

      // Mesaj zaten okunmuşsa işlem yapma
      if (
        message.status === 'read' &&
        message.readBy.some((r) => r.user.toString() === userId)
      ) {
        return message;
      }

      // Mesaj durumunu güncelle
      await message.updateStatus('read', userId);

      // Redis'teki mesajı güncelle
      const cachedMessages = await getCachedMessages(message.conversationId);
      const messageIndex = cachedMessages.findIndex((m) => m._id === messageId);

      if (messageIndex !== -1) {
        cachedMessages[messageIndex].status = 'read';
        await cacheMessage(cachedMessages[messageIndex]);
      }

      // Konuşmadaki okunmamış mesaj sayısını güncelle
      const conversation = await Conversation.findById(message.conversationId);
      if (conversation) {
        await conversation.resetUnreadCount(userId);
      }

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
      // MongoDB'deki mesajları bul
      const messages = await Message.find({
        conversationId,
        receiver: userId,
        status: { $ne: 'read' },
      });

      // Her mesajı okundu olarak işaretle
      for (const message of messages) {
        await message.updateStatus('read', userId);
      }

      // Konuşmadaki okunmamış mesaj sayısını sıfırla
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        await conversation.resetUnreadCount(userId);
      }

      // Redis'teki mesajları güncelle
      const cachedMessages = await getCachedMessages(conversationId);

      for (const message of cachedMessages) {
        if (message.receiver === userId && message.status !== 'read') {
          message.status = 'read';
          await cacheMessage(message);
        }
      }

      return {
        success: true,
        message: 'Tüm mesajlar okundu olarak işaretlendi',
        count: messages.length,
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
      // Redis'te yazıyor durumunu ayarla
      await setTypingStatus(conversationId, userId, isTyping);

      // Konuşmadaki typing durumunu güncelle
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        await conversation.updateTypingStatus(userId, isTyping);
      }

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
      await message.softDelete(userId);

      // Konuşmanın son mesajı bu ise, son mesaj önizlemesini güncelle
      const conversation = await Conversation.findById(message.conversationId);
      if (
        conversation &&
        conversation.lastMessage &&
        conversation.lastMessage.toString() === message._id.toString()
      ) {
        // Son mesaj önizlemesini güncelle
        conversation.lastMessagePreview = {
          content: '[Bu mesaj silindi]',
          sender: message.sender,
          timestamp: message.createdAt,
          type: 'deleted',
        };

        await conversation.save();
      }

      return { success: true, message: 'Mesaj başarıyla silindi' };
    } catch (error) {
      console.error('Mesaj silme hatası:', error);
      throw new Error('Mesaj silinemedi');
    }
  },

  /**
   * Mesajı düzenler
   * @param {String} messageId - Mesaj ID'si
   * @param {String} userId - Düzenleme işlemini yapan kullanıcı ID'si
   * @param {String} newContent - Yeni mesaj içeriği
   * @returns {Promise<Object>} - Düzenlenen mesaj
   */
  async editMessage(messageId, userId, newContent) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Mesaj bulunamadı');
      }

      // Mesajı düzenle
      await message.editContent(newContent, userId);

      // Konuşmanın son mesajı bu ise, son mesaj önizlemesini güncelle
      const conversation = await Conversation.findById(message.conversationId);
      if (
        conversation &&
        conversation.lastMessage &&
        conversation.lastMessage.toString() === message._id.toString()
      ) {
        // Son mesaj önizlemesini güncelle
        await conversation.updateLastMessagePreview(message);
      }

      return message;
    } catch (error) {
      console.error('Mesaj düzenleme hatası:', error);
      throw new Error(error.message || 'Mesaj düzenlenemedi');
    }
  },

  /**
   * Mesaja tepki ekler veya kaldırır
   * @param {String} messageId - Mesaj ID'si
   * @param {String} userId - Tepki ekleyen kullanıcı ID'si
   * @param {String} emoji - Emoji
   * @returns {Promise<Object>} - Güncellenen mesaj
   */
  async toggleReaction(messageId, userId, emoji) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Mesaj bulunamadı');
      }

      // Tepkiyi ekle veya kaldır
      await message.addReaction(emoji, userId);

      return message;
    } catch (error) {
      console.error('Mesaj tepki ekleme hatası:', error);
      throw new Error('Mesaja tepki eklenemedi');
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
        isActive: true,
      })
        .sort({ lastActivity: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate({
          path: 'participants',
          select: 'name avatar isOnline lastSeen',
        })
        .populate({
          path: 'lastMessage',
          select: 'content createdAt sender status messageType attachments',
        });

      // Her konuşma için okunmamış mesaj sayısını hesapla
      const conversationsWithDetails = conversations.map((conversation) => {
        const unreadCount =
          conversation.unreadCount.get(userId.toString()) || 0;

        // Konuşma ayarlarını getir
        const isPinned =
          conversation.settings.pinned?.get(userId.toString()) || false;
        const isMuted =
          conversation.settings.muted?.get(userId.toString()) || false;
        const isArchived =
          conversation.settings.archived?.get(userId.toString()) || false;

        return {
          ...conversation.toObject(),
          unreadCount,
          isPinned,
          isMuted,
          isArchived,
        };
      });

      // Önce sabitlenmiş konuşmaları göster
      conversationsWithDetails.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });

      return conversationsWithDetails;
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
        isActive: true,
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
        unreadCount: new Map([
          [userId.toString(), 0],
          [participantId.toString(), 0],
        ]),
        typing: new Map([
          [userId.toString(), { isTyping: false, lastActivity: new Date() }],
          [
            participantId.toString(),
            { isTyping: false, lastActivity: new Date() },
          ],
        ]),
        settings: {
          notifications: new Map([
            [userId.toString(), true],
            [participantId.toString(), true],
          ]),
          pinned: new Map([
            [userId.toString(), false],
            [participantId.toString(), false],
          ]),
          archived: new Map([
            [userId.toString(), false],
            [participantId.toString(), false],
          ]),
          muted: new Map([
            [userId.toString(), false],
            [participantId.toString(), false],
          ]),
        },
      });

      await conversation.save();

      // Katılımcıları doldur
      await conversation.populate({
        path: 'participants',
        select: 'name avatar isOnline lastSeen',
      });

      // Kullanıcıların konuşma listesini güncelle
      await User.findByIdAndUpdate(userId, {
        $addToSet: { conversations: conversation._id },
      });

      await User.findByIdAndUpdate(participantId, {
        $addToSet: { conversations: conversation._id },
      });

      return conversation;
    } catch (error) {
      console.error('Konuşma oluşturma hatası:', error);
      throw new Error('Konuşma oluşturulamadı');
    }
  },

  /**
   * Konuşma ayarlarını günceller
   * @param {String} conversationId - Konuşma ID'si
   * @param {String} userId - Kullanıcı ID'si
   * @param {String} settingType - Ayar türü (notifications, pinned, archived, muted)
   * @param {Boolean} value - Ayar değeri
   * @returns {Promise<Object>} - Güncellenen konuşma
   */
  async updateConversationSetting(conversationId, userId, settingType, value) {
    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        throw new Error('Konuşma bulunamadı');
      }

      // Kullanıcının bu konuşmaya erişim yetkisi var mı kontrol et
      if (!conversation.participants.some((p) => p.toString() === userId)) {
        throw new Error('Bu konuşmaya erişim yetkiniz yok');
      }

      // Geçerli ayar türlerini kontrol et
      const validSettingTypes = [
        'notifications',
        'pinned',
        'archived',
        'muted',
      ];
      if (!validSettingTypes.includes(settingType)) {
        throw new Error('Geçersiz ayar türü');
      }

      // Ayarı güncelle
      await conversation.updateSettings(userId, settingType, value);

      return conversation;
    } catch (error) {
      console.error('Konuşma ayarları güncelleme hatası:', error);
      throw new Error(error.message || 'Konuşma ayarları güncellenemedi');
    }
  },
};

export default messageService;
