import Friendship from '../models/Friendship.js';
import User from '../models/User.js';
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
  async sendFriendRequest(requesterId, recipientId) {
    try {
      // Kullanıcıların kendilerine istek göndermesini engelle
      if (requesterId === recipientId) {
        throw new Error('Kendinize arkadaşlık isteği gönderemezsiniz');
      }
      
      // Kullanıcıların var olup olmadığını kontrol et
      const [requester, recipient] = await Promise.all([
        User.findById(requesterId),
        User.findById(recipientId)
      ]);
      
      if (!requester || !recipient) {
        throw new Error('Kullanıcı bulunamadı');
      }
      
      // Zaten bir arkadaşlık isteği var mı kontrol et
      const existingFriendship = await Friendship.findOne({
        $or: [
          { requester: requesterId, recipient: recipientId },
          { requester: recipientId, recipient: requesterId }
        ]
      });
      
      if (existingFriendship) {
        if (existingFriendship.status === 'pending') {
          throw new Error('Zaten bekleyen bir arkadaşlık isteği var');
        } else if (existingFriendship.status === 'accepted') {
          throw new Error('Bu kullanıcı zaten arkadaşınız');
        } else if (existingFriendship.status === 'blocked') {
          throw new Error('Bu kullanıcı ile arkadaşlık isteği gönderemezsiniz');
        }
        
        // Reddedilmiş bir istek varsa, durumunu güncelle
        existingFriendship.status = 'pending';
        existingFriendship.requester = requesterId;
        existingFriendship.recipient = recipientId;
        await existingFriendship.save();
        
        return existingFriendship;
      }
      
      // Yeni arkadaşlık isteği oluştur
      const friendship = new Friendship({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
      });
      
      await friendship.save();
      
      // Alıcının arkadaşlık istekleri listesini güncelle
      await User.findByIdAndUpdate(recipientId, {
        $addToSet: { friendRequests: friendship._id }
      });
      
      return friendship;
    } catch (error) {
      console.error('Arkadaşlık isteği gönderme hatası:', error);
      throw new Error(error.message || 'Arkadaşlık isteği gönderilemedi');
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
  async getFriendRequests(userId) {
    try {
      const user = await User.findById(userId)
        .populate({
          path: 'friendRequests',
          populate: {
            path: 'requester',
            select: 'name avatar'
          }
        });
      
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }
      
      // Sadece bekleyen istekleri filtrele
      const pendingRequests = user.friendRequests.filter(
        request => request.status === 'pending' && 
                  request.recipient.toString() === userId
      );
      
      return pendingRequests;
    } catch (error) {
      console.error('Arkadaşlık istekleri getirme hatası:', error);
      throw new Error('Arkadaşlık istekleri getirilemedi');
    }
  },
  
  /**
   * Kullanıcının arkadaşlarını getirir
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Array>} - Arkadaşlar dizisi
   */
  async getFriends(userId) {
    try {
      const user = await User.findById(userId)
        .populate({
          path: 'friends',
          select: 'name avatar isOnline lastSeen'
        });
      
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }
      
      return user.friends;
    } catch (error) {
      console.error('Arkadaşları getirme hatası:', error);
      throw new Error('Arkadaşlar getirilemedi');
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
