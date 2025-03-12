import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { getUserConversationsKey, setAsync, getAsync, delAsync } from '../utils/redis.js';

/**
 * Konuşma servisi - Konuşmaların oluşturulması ve yönetilmesi için
 */
const conversationService = {
  /**
   * İki kullanıcı arasında konuşma oluşturur veya mevcut konuşmayı getirir
   * @param {String} userId1 - Birinci kullanıcı ID'si
   * @param {String} userId2 - İkinci kullanıcı ID'si
   * @returns {Promise<Object>} - Konuşma nesnesi
   */
  async getOrCreateConversation(userId1, userId2) {
    try {
      // İki kullanıcı arasında mevcut bir konuşma var mı kontrol et
      let conversation = await Conversation.findOne({
        participants: { $all: [userId1, userId2] }
      });
      
      // Konuşma yoksa yeni bir konuşma oluştur
      if (!conversation) {
        conversation = new Conversation({
          participants: [userId1, userId2],
          unreadCount: new Map([
            [userId1.toString(), 0],
            [userId2.toString(), 0]
          ]),
          typing: new Map([
            [userId1.toString(), false],
            [userId2.toString(), false]
          ])
        });
        
        await conversation.save();
        
        // Kullanıcıların konuşma listesini güncelle
        await User.findByIdAndUpdate(userId1, {
          $addToSet: { conversations: conversation._id }
        });
        
        await User.findByIdAndUpdate(userId2, {
          $addToSet: { conversations: conversation._id }
        });
      }
      
      return conversation;
    } catch (error) {
      console.error('Konuşma oluşturma hatası:', error);
      throw new Error('Konuşma oluşturulamadı');
    }
  },
  
  /**
   * Kullanıcının tüm konuşmalarını getirir
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Array>} - Konuşmalar dizisi
   */
  async getUserConversations(userId) {
    try {
      // Redis'ten önbelleklenmiş konuşmaları kontrol et
      const cacheKey = getUserConversationsKey(userId);
      const cachedConversations = await getAsync(cacheKey);
      
      if (cachedConversations) {
        return JSON.parse(cachedConversations);
      }
      
      // MongoDB'den konuşmaları getir
      const conversations = await Conversation.find({
        participants: userId,
        isActive: true
      })
      .populate({
        path: 'participants',
        select: 'name avatar isOnline lastSeen'
      })
      .populate({
        path: 'lastMessage',
        select: 'content createdAt read sender'
      })
      .sort({ updatedAt: -1 });
      
      // Konuşmaları Redis'e önbelleğe al (1 saat)
      await setAsync(cacheKey, JSON.stringify(conversations), 3600);
      
      return conversations;
    } catch (error) {
      console.error('Kullanıcı konuşmalarını getirme hatası:', error);
      throw new Error('Konuşmalar getirilemedi');
    }
  },
  
  /**
   * Belirli bir konuşmayı ID'ye göre getirir
   * @param {String} conversationId - Konuşma ID'si
   * @param {String} userId - İsteği yapan kullanıcı ID'si (yetkilendirme için)
   * @returns {Promise<Object>} - Konuşma nesnesi
   */
  async getConversationById(conversationId, userId) {
    try {
      const conversation = await Conversation.findById(conversationId)
        .populate({
          path: 'participants',
          select: 'name avatar isOnline lastSeen'
        })
        .populate({
          path: 'lastMessage',
          select: 'content createdAt read sender'
        });
      
      if (!conversation) {
        throw new Error('Konuşma bulunamadı');
      }
      
      // Kullanıcının bu konuşmaya erişim yetkisi var mı kontrol et
      if (!conversation.participants.some(p => p._id.toString() === userId)) {
        throw new Error('Bu konuşmaya erişim yetkiniz yok');
      }
      
      return conversation;
    } catch (error) {
      console.error('Konuşma getirme hatası:', error);
      throw new Error('Konuşma getirilemedi');
    }
  },
  
  /**
   * Konuşmayı arşivler (soft delete)
   * @param {String} conversationId - Konuşma ID'si
   * @param {String} userId - İsteği yapan kullanıcı ID'si
   * @returns {Promise<Object>} - İşlem sonucu
   */
  async archiveConversation(conversationId, userId) {
    try {
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        throw new Error('Konuşma bulunamadı');
      }
      
      // Kullanıcının bu konuşmaya erişim yetkisi var mı kontrol et
      if (!conversation.participants.some(p => p.toString() === userId)) {
        throw new Error('Bu konuşmaya erişim yetkiniz yok');
      }
      
      // Konuşmayı arşivle (soft delete)
      conversation.isActive = false;
      await conversation.save();
      
      // Redis önbelleğini temizle
      const cacheKey = getUserConversationsKey(userId);
      await delAsync(cacheKey);
      
      return { success: true, message: 'Konuşma başarıyla arşivlendi' };
    } catch (error) {
      console.error('Konuşma arşivleme hatası:', error);
      throw new Error('Konuşma arşivlenemedi');
    }
  },
  
  /**
   * Konuşmadaki okunmamış mesaj sayısını getirir
   * @param {String} conversationId - Konuşma ID'si
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Number>} - Okunmamış mesaj sayısı
   */
  async getUnreadCount(conversationId, userId) {
    try {
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        throw new Error('Konuşma bulunamadı');
      }
      
      return conversation.unreadCount.get(userId) || 0;
    } catch (error) {
      console.error('Okunmamış mesaj sayısı getirme hatası:', error);
      return 0;
    }
  },
  
  /**
   * Kullanıcının tüm konuşmalarındaki toplam okunmamış mesaj sayısını getirir
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Number>} - Toplam okunmamış mesaj sayısı
   */
  async getTotalUnreadCount(userId) {
    try {
      const conversations = await Conversation.find({
        participants: userId,
        isActive: true
      });
      
      let totalUnread = 0;
      
      for (const conversation of conversations) {
        totalUnread += conversation.unreadCount.get(userId) || 0;
      }
      
      return totalUnread;
    } catch (error) {
      console.error('Toplam okunmamış mesaj sayısı getirme hatası:', error);
      return 0;
    }
  }
};

export default conversationService;
