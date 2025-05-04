import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import {
  setUserOnlineStatus,
  getUserOnlineStatus,
  getUserLastSeen,
  cacheFriends,
  getCachedFriends,
  getMultipleUserStatuses,
} from '../utils/redis';
import User from '../models/User.js';
import Friendship from '../models/Friendship.js';

/**
 * Kullanıcı servis sınıfı
 * Kullanıcı işlemlerini yönetir ve Redis önbelleği ile entegre çalışır
 */
class UserService {
  /**
   * Kullanıcı bilgilerini getir
   * @param {string} userId - Kullanıcı ID
   * @param {boolean} withFriends - Arkadaşları da getir
   * @returns {Promise<Object>} - Kullanıcı bilgileri
   */
  async getUserById(userId, withFriends = false) {
    try {

      const user = await User.findById(userId).select('-password -__v').lean()

      if (!user) return null;

      const redisStatus = await getUserOnlineStatus(userId);
      if (redisStatus) user.status = redisStatus;

      // Çevrimiçi durumunu ekle
      const status = await getUserOnlineStatus(userId);
      user.status = status;

      // Son görülme zamanını ekle
      if (status === 'offline') {
        user.lastSeen = await getUserLastSeen(userId);
      }

      // Arkadaşları getir
      if (withFriends && user.friends && user.friends.length > 0) {
        // Önce önbellekten kontrol et
        let friends = await getCachedFriends(userId);

        if (!friends) {
          // Önbellekte yoksa veritabanından getir
          friends = await db
            .collection('users')
            .find({
              _id: { $in: user.friends.map((id) => new ObjectId(id)) },
            })
            .project({
              password: 0,
              __v: 0,
            })
            .toArray();

          // Arkadaşların durumlarını ekle
          const friendIds = friends.map((f) => f._id.toString());
          const statuses = await getMultipleUserStatuses(friendIds);

          friends = friends.map((friend) => {
            const friendId = friend._id.toString();
            return {
              ...friend,
              status: statuses[friendId] || 'offline',
            };
          });

          // Önbelleğe al
          await cacheFriends(userId, friends);
        }

        user.friends = friends;
      }

      return user;
    } catch (error) {
      console.error('Kullanıcı getirme hatası:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find().select('-password -__v');
      return {
        users: users
      };
    } catch (error) {
      console.error('Kullanıcılar getirme hatası:', error);
      throw error;
    }
  }
  
  /**
   * Kullanıcıları filtreleme
   * @param {Object} filters - Filtreleme kriterleri (role, status, dateFrom, dateTo)
   * @param {number} limit - Sonuç limiti
   * @returns {Promise<Object>} - Filtrelenmiş kullanıcı listesi
   */
  async filterUsers(filters, limit = 100) {
    try {
      // Filtreleme koşullarını oluştur
      const filterConditions = {};
      
      // Rol filtresi
      if (filters.role) {
        filterConditions.role = filters.role;
      }
      
      // Durum filtresi (aktif/pasif)
      if (filters.status === 'active') {
        filterConditions.isActive = true;
      } else if (filters.status === 'inactive') {
        filterConditions.isActive = false;
      }
      
      // Tarih aralığı filtresi
      if (filters.dateFrom || filters.dateTo) {
        filterConditions.createdAt = {};
        
        if (filters.dateFrom) {
          filterConditions.createdAt.$gte = new Date(filters.dateFrom);
        }
        
        if (filters.dateTo) {
          filterConditions.createdAt.$lte = new Date(filters.dateTo);
        }
      }
      
      // Filtreleme sorgusunu çalıştır
      const users = await User.find(filterConditions)
        .select('-password -__v')
        .limit(limit);
      
      return {
        users: users
      };
    } catch (error) {
      console.error('Kullanıcı filtreleme hatası:', error);
      throw new Error('Kullanıcılar filtrelenirken bir hata oluştu');
    }
  }
  
  /**
   * Kullanıcıları hem arama hem filtreleme
   * @param {string} query - Arama sorgusu
   * @param {Object} filters - Filtreleme kriterleri
   * @param {number} limit - Sonuç limiti
   * @returns {Promise<Object>} - Filtrelenmiş ve aranmış kullanıcı listesi
   */
  async filterAndSearchUsers(query, filters, limit = 100) {
    try {
      if (!query || query.length < 2) {
        throw new Error('Arama sorgusu en az 2 karakter olmalıdır');
      }
      
      // Arama koşulları
      const searchConditions = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      };
      
      // Filtreleme koşulları
      const filterConditions = {};
      
      // Rol filtresi
      if (filters.role) {
        filterConditions.role = filters.role;
      }
      
      // Durum filtresi
      if (filters.status === 'active') {
        filterConditions.isActive = true;
      } else if (filters.status === 'inactive') {
        filterConditions.isActive = false;
      }
      
      // Tarih aralığı filtresi
      if (filters.dateFrom || filters.dateTo) {
        filterConditions.createdAt = {};
        
        if (filters.dateFrom) {
          filterConditions.createdAt.$gte = new Date(filters.dateFrom);
        }
        
        if (filters.dateTo) {
          filterConditions.createdAt.$lte = new Date(filters.dateTo);
        }
      }
      
      // Arama ve filtreleme koşullarını birleştir
      const combinedConditions = {
        $and: [
          searchConditions,
          filterConditions
        ]
      };
      
      // Sorguyu çalıştır
      const users = await User.find(combinedConditions)
        .select('-password -__v')
        .limit(limit);
      
      return {
        users: users
      };
    } catch (error) {
      console.error('Kullanıcı arama ve filtreleme hatası:', error);
      throw new Error('Kullanıcılar aranırken ve filtrelenirken bir hata oluştu');
    }
  }

  async deleteUser(event) {
    try {
      const userId = event.context.params.userId;
      const user = await User.findByIdAndDelete(userId);
      return user;
    } catch (error) {
      console.error('Kullanıcı silme hatası:', error);
      throw error;
    }
  }

  /**
   * Kullanıcı ara
   * @param {string} query - Arama sorgusu
   * @param {number} limit - Sonuç limiti
   * @param {string} currentUserId - Mevcut kullanıcı ID (kendisini hariç tutmak için, opsiyonel)
   * @returns {Promise<Array>} - Kullanıcı listesi
   */
  async searchUsers(query, limit = 10, currentUserId = null) {
    try {
      if (!query || query.length < 2) {
        throw new Error('Arama sorgusu en az 2 karakter olmalıdır');
      }

      // Sorgu koşullarını oluştur
      let searchConditions = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      };
      
      // Eğer currentUserId belirtilmişse, o kullanıcıyı hariç tut
      if (currentUserId) {
        searchConditions = {
          $and: [
            { _id: { $ne: currentUserId } },
            searchConditions
          ]
        };
      }

      // Kullanıcıları ara
      const users = await User.find(searchConditions)
        .select('-password -__v')
        .limit(limit);

      // Admin paneli için kullanılıyorsa, tüm kullanıcıları döndür
      if (!currentUserId) {
        return {
          users: users
        };
      }
      
      // Sosyal ağ özellikleri için arkadaşlık durumlarını kontrol et
      const friendships = await Friendship.find({
        $or: [
          {
            requester: currentUserId,
            recipient: { $in: users.map((u) => u._id) },
          },
          {
            recipient: currentUserId,
            requester: { $in: users.map((u) => u._id) },
          },
        ],
      });

      // Kullanıcılara arkadaşlık durumlarını ekle
      const usersWithFriendStatus = users.map((user) => {
        const userData = user.toObject();

        // Bu kullanıcı ile olan arkadaşlık durumunu bul
        const friendship = friendships.find(
          (f) =>
            (f.requester.toString() === currentUserId &&
              f.recipient.toString() === user._id.toString()) ||
            (f.recipient.toString() === currentUserId &&
              f.requester.toString() === user._id.toString()),
        );

        if (friendship) {
          userData.friendshipStatus = friendship.status;
          userData.isFriend = friendship.status === 'accepted';
          userData.isPending = friendship.status === 'pending';
          userData.isBlocked = friendship.status === 'blocked';
        } else {
          userData.friendshipStatus = null;
          userData.isFriend = false;
          userData.isPending = false;
          userData.isBlocked = false;
        }

        return userData;
      });

      return usersWithFriendStatus;
    } catch (error) {
      console.error('Kullanıcı arama hatası:', error);
      throw new Error('Kullanıcılar aranamadı');
    }
  }

  /**
   * Arkadaş ekle
   * @param {string} userId - Kullanıcı ID
   * @param {string} friendId - Arkadaş ID
   * @returns {Promise<Object>} - Eklenen arkadaş bilgileri
   */
  async addFriend(userId, friendId) {
    try {
      if (userId === friendId) {
        throw new Error('Kendinizi arkadaş olarak ekleyemezsiniz');
      }
      
      // Arkadaş olarak eklenecek kullanıcının varlığını kontrol et
      const friend = await User.findById(friendId).select('-password -__v');
      if (!friend) {
        throw new Error('Kullanıcı bulunamadı');
      }
      
      // Arkadaşlık durumunu kontrol et
      let friendship = await Friendship.findOne({
        $or: [
          { requester: userId, recipient: friendId },
          { requester: friendId, recipient: userId }
        ]
      });
      
      if (friendship) {
        // Zaten bir arkadaşlık kaydı var
        if (friendship.status === 'accepted') {
          throw new Error('Bu kullanıcı zaten arkadaşınız');
        } else if (friendship.status === 'blocked') {
          throw new Error('Bu kullanıcı engellendi');
        } else if (friendship.status === 'pending') {
          // Eğer karşı taraf isteği zaten gönderdiyse, kabul et
          if (friendship.requester.toString() === friendId) {
            friendship.status = 'accepted';
            await friendship.save();
            
            // Kullanıcıların friends listesini güncelle
            await User.findByIdAndUpdate(userId, 
              { $addToSet: { friends: friendId } });
            await User.findByIdAndUpdate(friendId, 
              { $addToSet: { friends: userId } });
            
            // Önbelleği temizle
            await cacheFriends(userId, null);
            await cacheFriends(friendId, null);
            
            return { ...friend.toObject(), status: friend.status || 'offline' };
          } else {
            throw new Error('Arkadaşlık isteği zaten gönderildi');
          }
        }
      } else {
        // Yeni bir arkadaşlık isteği oluştur
        friendship = new Friendship({
          requester: userId,
          recipient: friendId,
          status: 'pending'
        });
        await friendship.save();
        
        // Alıcının friendRequests listesine ekle
        await User.findByIdAndUpdate(friendId, 
          { $addToSet: { friendRequests: friendship._id } });
        
        return { message: 'Arkadaşlık isteği gönderildi' };
      }
    } catch (error) {
      console.error('Arkadaş ekleme hatası:', error);
      throw error;
    }
  }

  /**
   * Arkadaşlıktan çıkar
   * @param {string} userId - Kullanıcı ID
   * @param {string} friendId - Arkadaş ID
   * @returns {Promise<boolean>} - İşlem başarılı mı
   */
  async removeFriend(userId, friendId) {
    try {
      // Arkadaşlık durumunu bul
      const friendship = await Friendship.findOne({
        $or: [
          { requester: userId, recipient: friendId },
          { requester: friendId, recipient: userId }
        ]
      });
      
      if (!friendship || friendship.status !== 'accepted') {
        throw new Error('Bu kullanıcı arkadaşınız değil');
      }
      
      // Arkadaşlığı kaldır
      friendship.status = 'rejected';
      await friendship.save();
      
      // Kullanıcıların friends listesinden çıkar
      await User.findByIdAndUpdate(userId, 
        { $pull: { friends: friendId } });
      await User.findByIdAndUpdate(friendId, 
        { $pull: { friends: userId } });
      
      // Önbelleği temizle
      await cacheFriends(userId, null);
      await cacheFriends(friendId, null);
      
      return true;
    } catch (error) {
      console.error('Arkadaşlıktan çıkarma hatası:', error);
      throw error;
    }
  }

  /**
   * Kullanıcı durumunu güncelle
   * @param {string} userId - Kullanıcı ID
   * @param {string} status - Durum (online, away, busy, offline)
   * @returns {Promise<boolean>} - İşlem başarılı mı
   */
  async updateUserStatus(userId, status) {
    try {
      // Geçerli durumları kontrol et
      const validStatuses = ['online', 'away', 'busy', 'offline', 'invisible'];
      if (!validStatuses.includes(status)) {
        throw new Error('Geçersiz durum');
      }

      // Redis'te kullanıcı durumunu güncelle
      await setUserOnlineStatus(userId, status);

      const now = new Date();
      await User.findByIdAndUpdate(userId, { status, lastActive: now, ...(status === 'offline' ? { lastSeen: now } : {}) })

      return true;
    } catch (error) {
      console.error('Kullanıcı durumu güncelleme hatası:', error);
      throw error;
    }
  }

  /**
   * Kullanıcının arkadaşlarını getir
   * @param {string} userId - Kullanıcı ID
   * @returns {Promise<Array>} - Arkadaş listesi
   */
  async getUserFriends(userId) {
    try {
      // Önce önbellekten kontrol et
      const cachedFriends = await getCachedFriends(userId);
      if (cachedFriends) {
        return cachedFriends;
      }

      // Kullanıcının arkadaşlarını bul
      const user = await User.findOne({
        _id: new ObjectId(userId),
      })
        .select('friends')
        .lean();

      if (!user || !user.friends || !user.friends.length) {
        return [];
      }

      // Arkadaş detaylarını getir      
      const friends = await User.find({
        _id: { $in: user.friends.map((id) => new ObjectId(id)) },
      })
        .project({
          password: 0,
          __v: 0,
        })
        .toArray();

      // Arkadaşların durumlarını ekle
      const friendIds = friends.map((f) => f._id.toString());
      const statuses = await getMultipleUserStatuses(friendIds);

      const friendsWithStatus = friends.map((friend) => {
        const friendId = friend._id.toString();
        return {
          ...friend,
          status: statuses[friendId] || 'offline',
        };
      });

      // Önbelleğe al
      await cacheFriends(userId, friendsWithStatus);

      return friendsWithStatus;
    } catch (error) {
      console.error('Arkadaşları getirme hatası:', error);
      throw error;
    }
  }
  async getFriendRequests(userId) {
    try {
      // Gelen istekler
      const incomingRequests = await Friendship.find({
        recipient: userId,
        status: 'pending'
      }).populate('requester', 'name email avatar status lastSeen');
      
      // Giden istekler
      const outgoingRequests = await Friendship.find({
        requester: userId,
        status: 'pending'
      }).populate('recipient', 'name email avatar status lastSeen');
      
      return {
        incoming: incomingRequests.map(fr => ({
          _id: fr._id,
          user: fr.requester,
          createdAt: fr.createdAt
        })),
        outgoing: outgoingRequests.map(fr => ({
          _id: fr._id,
          user: fr.recipient,
          createdAt: fr.createdAt
        }))
      };
    } catch (error) {
      console.error('Arkadaşlık isteklerini getirme hatası:', error);
      throw error;
    }
  }
  
  // Arkadaşlık isteğini kabul et
  async acceptFriendRequest(requestId, userId) {
    try {
      const request = await Friendship.findById(requestId);
      
      if (!request) {
        throw new Error('Arkadaşlık isteği bulunamadı');
      }
      
      if (request.recipient.toString() !== userId) {
        throw new Error('Bu isteği kabul etme yetkiniz yok');
      }
      
      if (request.status !== 'pending') {
        throw new Error('Bu istek zaten işlendi');
      }
      
      // İsteği kabul et
      request.status = 'accepted';
      await request.save();
      
      // Kullanıcıların friends listesini güncelle
      const requesterId = request.requester;
      await User.findByIdAndUpdate(userId, 
        { $addToSet: { friends: requesterId }, $pull: { friendRequests: requestId } });
      await User.findByIdAndUpdate(requesterId, 
        { $addToSet: { friends: userId } });
      
      // Önbelleği temizle
      await cacheFriends(userId, null);
      await cacheFriends(requesterId, null);
      
      return true;
    } catch (error) {
      console.error('Arkadaşlık isteği kabul hatası:', error);
      throw error;
    }
  }
  
  // Kullanıcıyı engelle
  async blockUser(userId, targetId) {
    try {
      // Mevcut arkadaşlık durumunu kontrol et
      let friendship = await Friendship.findOne({
        $or: [
          { requester: userId, recipient: targetId },
          { requester: targetId, recipient: userId }
        ]
      });
      
      if (friendship) {
        // Mevcut arkadaşlığı güncelle
        friendship.status = 'blocked';
        friendship.blockedBy = userId;
        
        // Arkadaşlardan çıkar
        if (friendship.status === 'accepted') {
          await User.findByIdAndUpdate(userId, 
            { $pull: { friends: targetId } });
          await User.findByIdAndUpdate(targetId, 
            { $pull: { friends: userId } });
        }
      } else {
        // Yeni bir blok kaydı oluştur
        friendship = new Friendship({
          requester: userId,
          recipient: targetId,
          status: 'blocked',
          blockedBy: userId
        });
      }
      
      await friendship.save();
      
      // Önbelleği temizle
      await cacheFriends(userId, null);
      await cacheFriends(targetId, null);
      
      return true;
    } catch (error) {
      console.error('Kullanıcı engelleme hatası:', error);
      throw error;
    }
  }
}


// Singleton instance
const userService = new UserService();

export default userService;
