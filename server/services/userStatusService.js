import UserStatus from '../models/UserStatus.js';
import User from '../models/User.js';
import { setUserOnlineStatus, getUserOnlineStatus } from '../utils/redis.js';

/**
 * Kullanıcı durumu servisi - Kullanıcıların çevrimiçi durumlarının yönetimi için
 */
const userStatusService = {
  /**
   * Kullanıcının durumunu günceller
   * @param {String} userId - Kullanıcı ID'si
   * @param {String} status - Durum (online, offline, away, busy, invisible)
   * @param {String} device - Cihaz (web, mobile, desktop)
   * @returns {Promise<Object>} - Güncellenen kullanıcı durumu
   */
  async updateUserStatus(userId, status, device = 'web') {
    try {
      // Geçerli bir durum mu kontrol et
      const validStatuses = ['online', 'offline', 'away', 'busy', 'invisible'];
      if (!validStatuses.includes(status)) {
        throw new Error('Geçersiz durum');
      }
      
      // Kullanıcının var olup olmadığını kontrol et
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }
      
      // Kullanıcının durumunu güncelle
      let userStatus = await UserStatus.findOne({ user: userId });
      
      if (!userStatus) {
        userStatus = new UserStatus({
          user: userId,
          status,
          device,
          lastActive: new Date(),
          lastSeen: new Date()
        });
      } else {
        userStatus.status = status;
        userStatus.device = device;
        userStatus.lastActive = new Date();
        
        if (status !== 'invisible') {
          userStatus.lastSeen = new Date();
        }
      }
      
      await userStatus.save();
      
      // User modelini de güncelle
      await User.findByIdAndUpdate(userId, {
        isOnline: status === 'online',
        lastSeen: status !== 'invisible' ? new Date() : user.lastSeen
      });
      
      // Redis'te kullanıcı durumunu güncelle (1 saat süreyle)
      await setUserOnlineStatus(userId, status, 3600);
      
      return userStatus;
    } catch (error) {
      console.error('Kullanıcı durumu güncelleme hatası:', error);
      throw new Error(error.message || 'Kullanıcı durumu güncellenemedi');
    }
  },
  
  /**
   * Kullanıcının durumunu getirir
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Object>} - Kullanıcı durumu
   */
  async getUserStatus(userId) {
    try {
      // Önce Redis'ten kontrol et
      const redisStatus = await getUserOnlineStatus(userId);
      
      if (redisStatus && redisStatus !== 'offline') {
        return { status: redisStatus };
      }
      
      // MongoDB'den kontrol et
      const userStatus = await UserStatus.findOne({ user: userId });
      
      if (!userStatus) {
        return { status: 'offline' };
      }
      
      return userStatus;
    } catch (error) {
      console.error('Kullanıcı durumu getirme hatası:', error);
      return { status: 'offline' };
    }
  },
  
  /**
   * Kullanıcının çevrimiçi olduğunu işaretler
   * @param {String} userId - Kullanıcı ID'si
   * @param {String} socketId - Socket ID
   * @param {String} device - Cihaz (web, mobile, desktop)
   * @returns {Promise<Object>} - Güncellenen kullanıcı durumu
   */
  async markUserOnline(userId, socketId, device = 'web') {
    try {
      // Kullanıcının var olup olmadığını kontrol et
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }
      
      // Kullanıcıyı çevrimiçi olarak işaretle
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date(),
        socketId
      });
      
      // Kullanıcı durumunu güncelle
      return await this.updateUserStatus(userId, 'online', device);
    } catch (error) {
      console.error('Kullanıcıyı çevrimiçi işaretleme hatası:', error);
      throw new Error('Kullanıcı çevrimiçi işaretlenemedi');
    }
  },
  
  /**
   * Kullanıcının çevrimdışı olduğunu işaretler
   * @param {String} userId - Kullanıcı ID'si
   * @returns {Promise<Object>} - Güncellenen kullanıcı durumu
   */
  async markUserOffline(userId) {
    try {
      // Kullanıcının var olup olmadığını kontrol et
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }
      
      // Kullanıcıyı çevrimdışı olarak işaretle
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
        socketId: null
      });
      
      // Kullanıcı durumunu güncelle
      return await this.updateUserStatus(userId, 'offline');
    } catch (error) {
      console.error('Kullanıcıyı çevrimdışı işaretleme hatası:', error);
      throw new Error('Kullanıcı çevrimdışı işaretlenemedi');
    }
  },
  
  /**
   * Birden çok kullanıcının durumunu getirir
   * @param {Array} userIds - Kullanıcı ID'leri dizisi
   * @returns {Promise<Object>} - Kullanıcı durumları
   */
  async getMultipleUserStatuses(userIds) {
    try {
      const statuses = {};
      
      // Her kullanıcı için durumu getir
      for (const userId of userIds) {
        const status = await this.getUserStatus(userId);
        statuses[userId] = status.status;
      }
      
      return statuses;
    } catch (error) {
      console.error('Kullanıcı durumlarını getirme hatası:', error);
      return {};
    }
  }
};

export default userStatusService;
