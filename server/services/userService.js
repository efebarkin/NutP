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
      const client = await getMongoClient();
      const db = client.db();

      const projection = {
        password: 0,
        __v: 0,
      };

      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(userId) }, { projection });

      if (!user) {
        return null;
      }

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

  /**
   * Kullanıcı ara
   * @param {string} query - Arama sorgusu
   * @param {number} limit - Sonuç limiti
   * @param {string} currentUserId - Mevcut kullanıcı ID (kendisini hariç tutmak için)
   * @returns {Promise<Array>} - Kullanıcı listesi
   */
  async searchUsers(query, limit = 10, currentUserId) {
    try {
      if (!query || query.length < 2) {
        throw new Error('Arama sorgusu en az 2 karakter olmalıdır');
      }

      // getMongoClient kullanımını kaldır ve doğrudan mongoose ile sorgu yap
      const users = await User.find({
        $and: [
          { _id: { $ne: currentUserId } }, // Mevcut kullanıcıyı hariç tut
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } },
            ],
          },
        ],
      })
        .select('name email avatar isOnline lastSeen')
        .limit(limit);

      // Arkadaşlık durumlarını kontrol et
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

      const client = await getMongoClient();
      const db = client.db();

      // Arkadaş olarak eklenecek kullanıcının varlığını kontrol et
      const friend = await db
        .collection('users')
        .findOne(
          { _id: new ObjectId(friendId) },
          { projection: { password: 0, __v: 0 } },
        );

      if (!friend) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Kullanıcıyı güncelle (arkadaş listesine ekle)
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(userId) },
          { $addToSet: { friends: new ObjectId(friendId) } },
        );

      // Diğer kullanıcıyı da güncelle (karşılıklı arkadaşlık)
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(friendId) },
          { $addToSet: { friends: new ObjectId(userId) } },
        );

      // Arkadaş durumunu ekle
      const status = await getUserOnlineStatus(friendId);
      friend.status = status;

      // Önbelleği temizle
      await cacheFriends(userId, null);
      await cacheFriends(friendId, null);

      return friend;
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
      const client = await getMongoClient();
      const db = client.db();

      // Kullanıcıyı güncelle (arkadaş listesinden çıkar)
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { friends: new ObjectId(friendId) } },
        );

      // Diğer kullanıcıyı da güncelle (karşılıklı arkadaşlık)
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(friendId) },
          { $pull: { friends: new ObjectId(userId) } },
        );

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
      const validStatuses = ['online', 'away', 'busy', 'offline'];
      if (!validStatuses.includes(status)) {
        throw new Error('Geçersiz durum');
      }

      // Redis'te kullanıcı durumunu güncelle
      await setUserOnlineStatus(userId, status);

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

      const client = await getMongoClient();
      const db = client.db();

      // Kullanıcının arkadaşlarını bul
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(userId) }, { projection: { friends: 1 } });

      if (!user || !user.friends || !user.friends.length) {
        return [];
      }

      // Arkadaş detaylarını getir
      const friends = await db
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
}

// Singleton instance
const userService = new UserService();

export default userService;
