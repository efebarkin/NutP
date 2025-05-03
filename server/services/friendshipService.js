import Friendship from '../models/Friendship.js';
import { defineEventHandler, getHeaders, createError, getCookie, parseCookies } from 'h3';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import conversationService from './conversationService.js';

/**
 * Arkadaşlık servisi - Arkadaşlık isteklerinin yönetimi için
 */
const friendshipService = {
  /**
   * Arkadaşlık isteği gönderir
   * @param {String} requesterId - İstek gönderen kullanıcı ID'si
   * @param {String} recipientId - İstek alan kullanıcı ID'si
   * @returns {Promise<Object>} - Oluşturulan arkadaşlık isteği
   */
  async sendFriendRequest(event) {
    try {
      // Token'ı farklı kaynaklardan almayı dene
      let token = null;
      
      // 1. Authorization header'dan token'ı al
      const authHeader = getHeaders(event).authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('Token Authorization header\'dan alındı');
      }
      
      // 2. auth_token cookie'sinden token'ı al
      if (!token) {
        token = getCookie(event, 'auth_token');
        if (token) {
          console.log('Token auth_token cookie\'den alındı');
        }
      }
      
      // 3. socket_token cookie'sinden token'ı al
      if (!token) {
        token = getCookie(event, 'socket_token');
        if (token) {
          console.log('Token socket_token cookie\'den alındı');
        }
      }
      
      // 4. Tüm cookie'leri kontrol et
      if (!token) {
        const cookies = parseCookies(event);
        console.log('Mevcut cookie\'ler:', Object.keys(cookies));
      }
      
      // Hala token yoksa hata döndür
      if (!token) {
        console.error('Token bulunamadı, tüm kaynaklar kontrol edildi');
        return createError({
          statusCode: 401,
          message: 'Unauthorized - Token not provided'
        });
      }
      
      console.log('Token bulundu:', !!token);
      
      // Token'ı doğrula
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      } catch (error) {
        console.error('Token doğrulama hatası:', error);
        return createError({
          statusCode: 401,
          message: 'Unauthorized - Invalid token'
        });
      }
      
      if (!decoded || !decoded.userId) {
        console.error('Geçersiz token içeriği:', decoded);
        return createError({
          statusCode: 401,
          message: 'Unauthorized - Invalid token payload'
        });
      }
      
      console.log('Token doğrulandı, userId:', decoded.userId);
      
      // Kullanıcının gönderdiği arkadaşlık isteklerini getir
      const sentRequests = await Friendship.find({
        requester: decoded.userId,
        status: 'pending'
      }).populate('recipient', 'name email avatar status lastSeen customStatus');
      
      return {
        success: true,
        sentRequests: sentRequests || []
      };
    } catch (error) {
      console.error('Gönderilen arkadaşlık istekleri getirilirken hata:', error);
      return createError({
        statusCode: 500,
        message: 'Internal Server Error'
      });
    }
  },
  
  /**
   * Arkadaşlık isteğini kabul eder
   * @param {String} friendshipId - Arkadaşlık isteği ID'si
   * @param {String} userId - İsteği kabul eden kullanıcı ID'si
   * @returns {Promise<Object>} - Güncellenen arkadaşlık isteği
   */
  async acceptFriendRequest(friendshipId, userId) {
    try {
      const friendship = await Friendship.findById(friendshipId);
      
      if (!friendship) {
        throw new Error('Arkadaşlık isteği bulunamadı');
      }
      
      // Kullanıcının bu isteği kabul etme yetkisi var mı kontrol et
      if (friendship.recipient.toString() !== userId) {
        throw new Error('Bu isteği kabul etme yetkiniz yok');
      }
      
      // İsteğin durumunu kontrol et
      if (friendship.status !== 'pending') {
        throw new Error('Bu istek zaten işlenmiş');
      }
      
      // İsteği kabul et
      friendship.status = 'accepted';
      await friendship.save();
      
      // Kullanıcıların arkadaş listelerini güncelle
      await User.findByIdAndUpdate(friendship.requester, {
        $addToSet: { friends: friendship.recipient },
        $pull: { friendRequests: friendship._id }
      });
      
      await User.findByIdAndUpdate(friendship.recipient, {
        $addToSet: { friends: friendship.requester },
        $pull: { friendRequests: friendship._id }
      });
      
      // İki kullanıcı arasında bir konuşma oluştur
      await conversationService.getOrCreateConversation(
        friendship.requester,
        friendship.recipient
      );
      
      return friendship;
    } catch (error) {
      console.error('Arkadaşlık isteği kabul etme hatası:', error);
      throw new Error(error.message || 'Arkadaşlık isteği kabul edilemedi');
    }
  },
  
  /**
   * Arkadaşlık isteğini reddeder
   * @param {String} friendshipId - Arkadaşlık isteği ID'si
   * @param {String} userId - İsteği reddeden kullanıcı ID'si
   * @returns {Promise<Object>} - Güncellenen arkadaşlık isteği
   */
  async rejectFriendRequest(friendshipId, userId) {
    try {
      const friendship = await Friendship.findById(friendshipId);
      
      if (!friendship) {
        throw new Error('Arkadaşlık isteği bulunamadı');
      }
      
      // Kullanıcının bu isteği reddetme yetkisi var mı kontrol et
      if (friendship.recipient.toString() !== userId) {
        throw new Error('Bu isteği reddetme yetkiniz yok');
      }
      
      // İsteğin durumunu kontrol et
      if (friendship.status !== 'pending') {
        throw new Error('Bu istek zaten işlenmiş');
      }
      
      // İsteği reddet
      friendship.status = 'rejected';
      await friendship.save();
      
      // Kullanıcının arkadaşlık istekleri listesini güncelle
      await User.findByIdAndUpdate(friendship.recipient, {
        $pull: { friendRequests: friendship._id }
      });
      
      return friendship;
    } catch (error) {
      console.error('Arkadaşlık isteği reddetme hatası:', error);
      throw new Error(error.message || 'Arkadaşlık isteği reddedilemedi');
    }
  },
  
  /**
   * Kullanıcıyı engeller
   * @param {String} userId - Engelleme işlemini yapan kullanıcı ID'si
   * @param {String} blockedUserId - Engellenen kullanıcı ID'si
   * @returns {Promise<Object>} - Engelleme sonucu
   */
  async blockUser(userId, blockedUserId) {
    try {
      // Kullanıcıların kendilerini engellemesini engelle
      if (userId === blockedUserId) {
        throw new Error('Kendinizi engelleyemezsiniz');
      }
      
      // Zaten bir arkadaşlık ilişkisi var mı kontrol et
      let friendship = await Friendship.findOne({
        $or: [
          { requester: userId, recipient: blockedUserId },
          { requester: blockedUserId, recipient: userId }
        ]
      });
      
      if (friendship) {
        // Mevcut ilişkiyi engelleme olarak güncelle
        friendship.status = 'blocked';
        friendship.blockedBy = userId;
        await friendship.save();
      } else {
        // Yeni bir engelleme ilişkisi oluştur
        friendship = new Friendship({
          requester: userId,
          recipient: blockedUserId,
          status: 'blocked',
          blockedBy: userId
        });
        
        await friendship.save();
      }
      
      // Kullanıcıların arkadaş listelerini güncelle
      await User.findByIdAndUpdate(userId, {
        $pull: { friends: blockedUserId, friendRequests: friendship._id }
      });
      
      await User.findByIdAndUpdate(blockedUserId, {
        $pull: { friends: userId, friendRequests: friendship._id }
      });
      
      return { success: true, message: 'Kullanıcı başarıyla engellendi' };
    } catch (error) {
      console.error('Kullanıcı engelleme hatası:', error);
      throw new Error(error.message || 'Kullanıcı engellenemedi');
    }
  },
  
  /**
   * Kullanıcının engelini kaldırır
   * @param {String} userId - Engeli kaldıran kullanıcı ID'si
   * @param {String} blockedUserId - Engeli kaldırılan kullanıcı ID'si
   * @returns {Promise<Object>} - İşlem sonucu
   */
  async unblockUser(userId, blockedUserId) {
    try {
      // Engelleme ilişkisini bul
      const friendship = await Friendship.findOne({
        status: 'blocked',
        blockedBy: userId,
        $or: [
          { requester: userId, recipient: blockedUserId },
          { requester: blockedUserId, recipient: userId }
        ]
      });
      
      if (!friendship) {
        throw new Error('Engellenen kullanıcı bulunamadı');
      }
      
      // Engelleme ilişkisini sil
      await friendship.deleteOne();
      
      return { success: true, message: 'Kullanıcının engeli başarıyla kaldırıldı' };
    } catch (error) {
      console.error('Kullanıcı engeli kaldırma hatası:', error);
      throw new Error(error.message || 'Kullanıcının engeli kaldırılamadı');
    }
  },
  
  /**
   * Arkadaşlıktan çıkarır
   * @param {String} userId - Arkadaşlıktan çıkarma işlemini yapan kullanıcı ID'si
   * @param {String} friendId - Arkadaşlıktan çıkarılan kullanıcı ID'si
   * @returns {Promise<Object>} - İşlem sonucu
   */
  async removeFriend(userId, friendId) {
    try {
      // Arkadaşlık ilişkisini bul
      const friendship = await Friendship.findOne({
        status: 'accepted',
        $or: [
          { requester: userId, recipient: friendId },
          { requester: friendId, recipient: userId }
        ]
      });
      
      if (!friendship) {
        throw new Error('Arkadaşlık ilişkisi bulunamadı');
      }
      
      // Arkadaşlık ilişkisini sil
      await friendship.deleteOne();
      
      // Kullanıcıların arkadaş listelerini güncelle
      await User.findByIdAndUpdate(userId, {
        $pull: { friends: friendId }
      });
      
      await User.findByIdAndUpdate(friendId, {
        $pull: { friends: userId }
      });
      
      return { success: true, message: 'Arkadaşlıktan başarıyla çıkarıldı' };
    } catch (error) {
      console.error('Arkadaşlıktan çıkarma hatası:', error);
      throw new Error(error.message || 'Arkadaşlıktan çıkarılamadı');
    }
  },
  
  /**
   * Kullanıcının arkadaşlık isteklerini getirir
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Array>} - Arkadaşlık istekleri dizisi
   */
  async getFriendRequests(event) {
    try {
      // Token'ı farklı kaynaklardan almayı dene
      let token = null;
      
      // 1. Authorization header'dan token'ı al
      const authHeader = getHeaders(event).authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('Token Authorization header\'dan alındı');
      }
      
      // 2. auth_token cookie'sinden token'ı al
      if (!token) {
        token = getCookie(event, 'auth_token');
        if (token) {
          console.log('Token auth_token cookie\'den alındı');
        }
      }
      
      // 3. socket_token cookie'sinden token'ı al
      if (!token) {
        token = getCookie(event, 'socket_token');
        if (token) {
          console.log('Token socket_token cookie\'den alındı');
        }
      }
      
      // 4. Tüm cookie'leri kontrol et
      if (!token) {
        const cookies = parseCookies(event);
        console.log('Mevcut cookie\'ler:', Object.keys(cookies));
      }
      
      // Hala token yoksa hata döndür
      if (!token) {
        console.error('Token bulunamadı, tüm kaynaklar kontrol edildi');
        return createError({
          statusCode: 401,
          message: 'Unauthorized - Token not provided'
        });
      }
      
      console.log('Token bulundu:', !!token);
      
      // Token'ı doğrula
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      } catch (error) {
        console.error('Token doğrulama hatası:', error);
        return createError({
          statusCode: 401,
          message: 'Unauthorized - Invalid token'
        });
      }
      
      if (!decoded || !decoded.userId) {
        console.error('Geçersiz token içeriği:', decoded);
        return createError({
          statusCode: 401,
          message: 'Unauthorized - Invalid token payload'
        });
      }
      
      console.log('Token doğrulandı, userId:', decoded.userId);
      
      // Kullanıcıya gelen arkadaşlık isteklerini getir
      const requests = await Friendship.find({
        recipient: decoded.userId,
        status: 'pending'
      }).populate('requester', 'name email avatar status lastSeen customStatus');
      
      return {
        success: true,
        requests: requests || []
      };
    } catch (error) {
      console.error('Arkadaşlık istekleri getirilirken hata:', error);
      return createError({
        statusCode: 500,
        message: 'Internal Server Error'
      });
    }
  },
  
  /**
   * Kullanıcının arkadaşlarını getirir
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Array>} - Arkadaşlar dizisi
   */
  async getFriends(event) {
    try {
      // Token'ı farklı kaynaklardan almayı dene
      let token = null;
      
      // 1. Authorization header'dan token'ı al
      const authHeader = getHeaders(event).authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('Token Authorization header\'dan alındı');
      }
      
      // 2. auth_token cookie'sinden token'ı al
      if (!token) {
        token = getCookie(event, 'auth_token');
        if (token) {
          console.log('Token auth_token cookie\'den alındı');
        }
      }
      
      // 3. socket_token cookie'sinden token'ı al
      if (!token) {
        token = getCookie(event, 'socket_token');
        if (token) {
          console.log('Token socket_token cookie\'den alındı');
        }
      }
      
      // 4. Tüm cookie'leri kontrol et
      if (!token) {
        const cookies = parseCookies(event);
        console.log('Mevcut cookie\'ler:', Object.keys(cookies));
      }
      
      // Hala token yoksa hata döndür
      if (!token) {
        console.error('Token bulunamadı, tüm kaynaklar kontrol edildi');
        return createError({
          statusCode: 401,
          message: 'Unauthorized - Token not provided'
        });
      }
      
      console.log('Token bulundu:', !!token);
      
      // Token'ı doğrula
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      } catch (error) {
        console.error('Token doğrulama hatası:', error);
        return createError({
          statusCode: 401,
          message: 'Unauthorized - Invalid token'
        });
      }
      
      if (!decoded || !decoded.userId) {
        console.error('Geçersiz token içeriği:', decoded);
        return createError({
          statusCode: 401,
          message: 'Unauthorized - Invalid token payload'
        });
      }
      
      console.log('Token doğrulandı, userId:', decoded.userId);
      
      // Kullanıcıyı bul ve arkadaşlarını getir
      const user = await User.findById(decoded.userId)
        .populate('friends', 'name email avatar status lastSeen customStatus')
        .lean();
      
      if (!user) {
        console.error('Kullanıcı bulunamadı, userId:', decoded.userId);
        return createError({
          statusCode: 404,
          message: 'User not found'
        });
      }
      
      // Arkadaşları döndür
      return {
        success: true,
        friends: user.friends || []
      };
    } catch (error) {
      console.error('Arkadaşlar getirilirken hata:', error);
      return createError({
        statusCode: 500,
        message: 'Internal Server Error'
      });
    }
  },
  
  /**
   * Kullanıcının engellediği kullanıcıları getirir
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Array>} - Engellenen kullanıcılar dizisi
   */
  async getBlockedUsers(userId) {
    try {
      const blockedFriendships = await Friendship.find({
        status: 'blocked',
        blockedBy: userId
      }).populate({
        path: 'requester recipient',
        select: 'name avatar'
      });
      
      // Engellenen kullanıcıları çıkar
      const blockedUsers = blockedFriendships.map(friendship => {
        return friendship.requester._id.toString() === userId
          ? friendship.recipient
          : friendship.requester;
      });
      
      return blockedUsers;
    } catch (error) {
      console.error('Engellenen kullanıcıları getirme hatası:', error);
      throw new Error('Engellenen kullanıcılar getirilemedi');
    }
  }
};

export default friendshipService;
