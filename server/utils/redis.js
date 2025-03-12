import { createClient } from 'redis';
import { promisify } from 'util';

// Redis istemcisini oluştur
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  legacyMode: false
});

// Bağlantı olaylarını dinle
redisClient.on('connect', () => {
  console.log('Redis bağlantısı başarıyla kuruldu');
});

redisClient.on('error', (err) => {
  console.error('Redis bağlantı hatası:', err);
});

// Redis istemcisini bağla
(async () => {
  await redisClient.connect().catch(console.error);
})();

// Redis fonksiyonlarını promisify ile Promise tabanlı hale getir
const getAsync = async (key) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('Redis get hatası:', error);
    return null;
  }
};

const setAsync = async (key, value, expiry = null) => {
  try {
    if (expiry) {
      return await redisClient.set(key, value, { EX: expiry });
    }
    return await redisClient.set(key, value);
  } catch (error) {
    console.error('Redis set hatası:', error);
    return null;
  }
};

const delAsync = async (key) => {
  try {
    return await redisClient.del(key);
  } catch (error) {
    console.error('Redis del hatası:', error);
    return null;
  }
};

const expireAsync = async (key, seconds) => {
  try {
    return await redisClient.expire(key, seconds);
  } catch (error) {
    console.error('Redis expire hatası:', error);
    return null;
  }
};

// Mesaj önbelleği için yardımcı fonksiyonlar
const getMessageKey = (conversationId) => `messages:${conversationId}`;
const getUserConversationsKey = (userId) => `user:conversations:${userId}`;
const getOnlineStatusKey = (userId) => `user:status:${userId}`;
const getTypingStatusKey = (conversationId, userId) => `typing:${conversationId}:${userId}`;
const getUserFriendsKey = (userId) => `user:friends:${userId}`;
const getUserLastSeenKey = (userId) => `user:lastseen:${userId}`;

// Mesaj önbelleği için fonksiyonlar
const cacheMessage = async (message) => {
  try {
    const key = getMessageKey(message.conversationId);
    // Mesajı JSON olarak dönüştür
    const messageJson = JSON.stringify(message);
    
    // Mesajı Redis listesine ekle (en yeni mesaj en başta)
    await redisClient.lPush(key, messageJson);
    
    // Listeyi belirli bir boyutta tut (son 100 mesaj)
    await redisClient.lTrim(key, 0, 99);
    
    // Mesaj önbelleğini 7 gün sakla
    await redisClient.expire(key, 60 * 60 * 24 * 7);
    
    return true;
  } catch (error) {
    console.error('Mesaj önbellekleme hatası:', error);
    return false;
  }
};

const getCachedMessages = async (conversationId, limit = 50) => {
  try {
    const key = getMessageKey(conversationId);
    
    // Redis'ten mesajları getir (0'dan limit-1'e kadar)
    const messages = await redisClient.lRange(key, 0, limit - 1);
    
    // JSON'dan nesnelere dönüştür
    return messages.map(msg => JSON.parse(msg));
  } catch (error) {
    console.error('Önbellekten mesaj getirme hatası:', error);
    return [];
  }
};

// Kullanıcı durumu için fonksiyonlar
const setUserOnlineStatus = async (userId, status, expiry = 3600) => {
  try {
    const key = getOnlineStatusKey(userId);
    await setAsync(key, status, expiry);
    
    // Eğer çevrimdışı ise, son görülme zamanını kaydet
    if (status === 'offline') {
      const lastSeenKey = getUserLastSeenKey(userId);
      await setAsync(lastSeenKey, new Date().toISOString(), 60 * 60 * 24 * 30); // 30 gün sakla
    }
    
    return true;
  } catch (error) {
    console.error('Kullanıcı durumu ayarlama hatası:', error);
    return false;
  }
};

const getUserOnlineStatus = async (userId) => {
  try {
    const key = getOnlineStatusKey(userId);
    const status = await getAsync(key);
    return status || 'offline';
  } catch (error) {
    console.error('Kullanıcı durumu getirme hatası:', error);
    return 'offline';
  }
};

const getUserLastSeen = async (userId) => {
  try {
    const key = getUserLastSeenKey(userId);
    const lastSeen = await getAsync(key);
    return lastSeen ? new Date(lastSeen) : null;
  } catch (error) {
    console.error('Kullanıcı son görülme zamanı getirme hatası:', error);
    return null;
  }
};

// Yazıyor durumu için fonksiyonlar
const setTypingStatus = async (conversationId, userId, isTyping) => {
  try {
    const key = getTypingStatusKey(conversationId, userId);
    if (isTyping) {
      // Yazıyor durumunu 10 saniye sakla
      await setAsync(key, 'true', 10);
    } else {
      await delAsync(key);
    }
    return true;
  } catch (error) {
    console.error('Yazıyor durumu ayarlama hatası:', error);
    return false;
  }
};

const getTypingStatus = async (conversationId, userId) => {
  try {
    const key = getTypingStatusKey(conversationId, userId);
    const isTyping = await getAsync(key);
    return isTyping === 'true';
  } catch (error) {
    console.error('Yazıyor durumu getirme hatası:', error);
    return false;
  }
};

// Kullanıcı arkadaşları için fonksiyonlar
const cacheFriends = async (userId, friends) => {
  try {
    const key = getUserFriendsKey(userId);
    const friendsJson = JSON.stringify(friends);
    
    // Arkadaşları önbelleğe al (1 gün sakla)
    await setAsync(key, friendsJson, 60 * 60 * 24);
    
    return true;
  } catch (error) {
    console.error('Arkadaşları önbellekleme hatası:', error);
    return false;
  }
};

const getCachedFriends = async (userId) => {
  try {
    const key = getUserFriendsKey(userId);
    const friendsJson = await getAsync(key);
    
    if (!friendsJson) {
      return null;
    }
    
    return JSON.parse(friendsJson);
  } catch (error) {
    console.error('Önbellekten arkadaşları getirme hatası:', error);
    return null;
  }
};

// Çoklu kullanıcı durumu kontrolü
const getMultipleUserStatuses = async (userIds) => {
  try {
    if (!userIds || !userIds.length) {
      return {};
    }
    
    // Her kullanıcı için durum anahtarını oluştur
    const keys = userIds.map(id => getOnlineStatusKey(id));
    
    // Çoklu get işlemi
    const pipeline = redisClient.multi();
    keys.forEach(key => {
      pipeline.get(key);
    });
    
    const results = await pipeline.exec();
    
    // Sonuçları kullanıcı ID'leri ile eşleştir
    const statuses = {};
    userIds.forEach((userId, index) => {
      statuses[userId] = results[index] || 'offline';
    });
    
    return statuses;
  } catch (error) {
    console.error('Çoklu kullanıcı durumu getirme hatası:', error);
    return {};
  }
};

export {
  redisClient,
  getAsync,
  setAsync,
  delAsync,
  expireAsync,
  cacheMessage,
  getCachedMessages,
  setUserOnlineStatus,
  getUserOnlineStatus,
  getUserLastSeen,
  setTypingStatus,
  getTypingStatus,
  cacheFriends,
  getCachedFriends,
  getMultipleUserStatuses,
  getMessageKey,
  getUserConversationsKey,
  getOnlineStatusKey,
  getTypingStatusKey,
  getUserFriendsKey,
  getUserLastSeenKey
};
