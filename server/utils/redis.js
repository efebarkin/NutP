import { createClient } from 'redis';

//Redis islemcisini olustur
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  legacyMode: false,
});

// Yeniden bağlanma denemesi için değişkenler
let isConnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_INTERVAL = 5000; // 5 saniye

//Baglantı olaylarını dinle
redisClient.on('connect', () => {
  console.log('Redis bağlantısı başarıyla kuruldu');
  reconnectAttempts = 0; // Bağlantı başarılı olduğunda sayacı sıfırla
});

redisClient.on('error', (err) => {
  console.error('Redis bağlantı hatası:', err);

  // Bağlantı hatası durumunda yeniden bağlanma
  if (!isConnecting && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    isConnecting = true;
    reconnectAttempts++;

    console.log(
      `Redis yeniden bağlanma denemesi ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`,
    );

    setTimeout(async () => {
      try {
        await redisClient.connect();
        isConnecting = false;
      } catch (reconnectError) {
        console.error('Redis yeniden bağlanma hatası:', reconnectError);
        isConnecting = false;
      }
    }, RECONNECT_INTERVAL);
  }
});

//Redis istemcisini bagla
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('İlk Redis bağlantı hatası:', error);
    // İlk bağlantı hatası durumunda yeniden bağlanma mekanizması otomatik çalışacak
  }
})();

//Redis anahtar isimleri icin yardimci fonksiyonlar
const getMessageKey = (conversationId) => `messages:${conversationId}`;
const getUserConversationsKey = (userId) => `user:conversations:${userId}`;
const getOnlineStatusKey = (userId) => `user:status:${userId}`;
const getTypingStatusKey = (conversationId, userId) =>
  `typing:${conversationId}:${userId}`;
const getUserFriendsKey = (userId) => `user:friends:${userId}`;
const getUserLastSeenKey = (userId) => `user:lastseen:${userId}`;

// TTL değerleri için sabitler
const TTL = {
  MESSAGES: 60 * 60 * 24 * 7, // 7 gün
  CONVERSATIONS: 60 * 60 * 3, // 3 saat
  ONLINE_STATUS: 60 * 60, // 1 saat
  TYPING_STATUS: 10, // 10 saniye
  FRIENDS: 60 * 60 * 24, // 1 gün
  LAST_SEEN: 60 * 60 * 24 * 7, // 7 gün
};

//Temel Redis islemleri
const getAsync = async (key) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('Redis getAsync hatası:', error);
    return null; // Hata durumunda null döndür
  }
};

const setAsync = async (key, value, expiry = null) => {
  try {
    if (expiry) {
      return await redisClient.set(key, value, { EX: expiry });
    }
    return await redisClient.set(key, value);
  } catch (error) {
    console.error('Redis setAsync hatası:', error);
    return false; // Hata durumunda false döndür
  }
};

const delAsync = async (key) => {
  try {
    return await redisClient.del(key);
  } catch (error) {
    console.error('Redis delAsync hatası:', error);
    return 0; // Hata durumunda 0 döndür
  }
};

const expireAsync = async (key, seconds) => {
  try {
    return await redisClient.expire(key, seconds);
  } catch (error) {
    console.error('Redis expireAsync hatası:', error);
    return false; // Hata durumunda false döndür
  }
};

//Mesaj önbelleği için fonksiyonlar
const cacheMessage = async (message) => {
  try {
    const key = getMessageKey(message.conversationId);
    //Mesajı JSON olarak dönüştür
    const messageJson = JSON.stringify(message);

    //Mesajı Redis listesine ekle
    await redisClient.rPush(key, messageJson);

    //Mesajı son 100 mesaj olarak ayarla
    await redisClient.lTrim(key, 0, 99);

    //Mesaj önbelleğini TTL değeri kadar sakla
    await expireAsync(key, TTL.MESSAGES);
    return true;
  } catch (error) {
    console.error('Mesaj önbellekleme hatası:', error);
    return false; // Hata durumunda false döndür
  }
};

const getCachedMessages = async (conversationId, limit = 50) => {
  try {
    const key = getMessageKey(conversationId);

    //Redis listesinden mesajları al
    const messages = await redisClient.lRange(key, 0, limit - 1);

    //JSON olarak dönüştür
    return messages.map((message) => JSON.parse(message));
  } catch (error) {
    console.error('Önbellekten mesaj getirme hatası:', error);
    return []; // Hata durumunda boş dizi döndür
  }
};

//Kullanıcı durumu için fonksiyonlar
const setUserOnlineStatus = async (
  userId,
  status,
  expiry = TTL.ONLINE_STATUS,
) => {
  try {
    const key = getOnlineStatusKey(userId);
    await setAsync(key, status, expiry);

    //Eğer çevrimdışı ise son görülme zamanını güncelle
    if (status === 'offline') {
      const lastSeenKey = getUserLastSeenKey(userId);
      await setAsync(lastSeenKey, new Date().toISOString(), TTL.LAST_SEEN);
    }
    return true;
  } catch (error) {
    console.error('Kullanıcı durumu ayarlaması hatası:', error);
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
    console.error('Son görülme zamanı getirme hatası:', error);
    return null;
  }
};

//yazıyor durumu için fonksiyonlar
const setTypingStatus = async (conversationId, userId, isTyping) => {
  try {
    const key = getTypingStatusKey(conversationId, userId);
    if (isTyping) {
      // Yazıyor durumunu TTL değeri kadar sakla
      await setAsync(key, 'true', TTL.TYPING_STATUS);
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

// Arkadaş durumu için fonksiyonlar
const cacheFriends = async (userId, friends) => {
  try {
    const key = getUserFriendsKey(userId);

    // Eğer friends null ise, önbelleği temizle
    if (friends === null) {
      await delAsync(key);
      return true;
    }

    const friendsJson = JSON.stringify(friends);

    // Arkadaşları önbelleğe al (TTL değeri kadar sakla)
    await setAsync(key, friendsJson, TTL.FRIENDS);

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
    const keys = userIds.map((id) => getOnlineStatusKey(id));

    // Çoklu get işlemi için pipeline kullan
    const pipeline = redisClient.multi();
    keys.forEach((key) => {
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

// Redis bağlantı durumunu kontrol et
const isRedisConnected = () => {
  return redisClient.isOpen;
};

// Redis bağlantısını kapat
const closeRedisConnection = async () => {
  try {
    await redisClient.quit();
    return true;
  } catch (error) {
    console.error('Redis bağlantısını kapatma hatası:', error);
    return false;
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
  getUserLastSeenKey,
  isRedisConnected,
  closeRedisConnection,
  TTL,
};
