import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getConversationHandlers } from './handlers/conversations';
import { getMessageHandlers } from './handlers/messages';
import { getUserHandlers } from './handlers/users';
import { getFriendshipHandlers } from './handlers/friendship';
import {
  setUserOnlineStatus,
  getUserOnlineStatus,
  isRedisConnected,
} from '../utils/redis';

// Kullanıcı bağlantılarını saklamak için
const connectedUsers = new Map();

// Güvenlik için rate limiting
const rateLimiter = new Map();
const RATE_LIMIT = {
  MAX_EVENTS: 100, // 10 saniyede maksimum 100 olay
  WINDOW_MS: 10000, // 10 saniye
  BLOCK_DURATION: 60000, // 1 dakika blok
};

// Loglama yardımcı fonksiyonu
const logSocketEvent = (type, userId, event, data = null) => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    type,
    userId,
    event,
    ...(data && {
      data: typeof data === 'object' ? JSON.stringify(data) : data,
    }),
  };

  // Hassas verileri maskele
  if (logData.data && typeof logData.data === 'string') {
    // Token, şifre gibi hassas verileri maskele
    logData.data = logData.data.replace(
      /(token|password|auth)["']?\s*:\s*["']?[^"',}\s]+/gi,
      '$1:"***"',
    );
  }

  console.log(
    `[SOCKET:${type}] ${timestamp} - User: ${userId} - Event: ${event}${data ? ' - Data: ' + logData.data : ''}`,
  );
};

// Rate limiting kontrolü
const checkRateLimit = (userId) => {
  const now = Date.now();

  if (!rateLimiter.has(userId)) {
    rateLimiter.set(userId, {
      count: 1,
      firstRequest: now,
      blocked: false,
      blockUntil: 0,
    });
    return true;
  }

  const userLimit = rateLimiter.get(userId);

  // Kullanıcı bloklanmış mı kontrol et
  if (userLimit.blocked) {
    if (now > userLimit.blockUntil) {
      // Blok süresini geçtiyse sıfırla
      rateLimiter.set(userId, {
        count: 1,
        firstRequest: now,
        blocked: false,
        blockUntil: 0,
      });
      return true;
    }
    return false;
  }

  // Zaman penceresi içinde mi kontrol et
  if (now - userLimit.firstRequest < RATE_LIMIT.WINDOW_MS) {
    userLimit.count++;

    // Limit aşıldı mı kontrol et
    if (userLimit.count > RATE_LIMIT.MAX_EVENTS) {
      userLimit.blocked = true;
      userLimit.blockUntil = now + RATE_LIMIT.BLOCK_DURATION;
      console.warn(
        `Rate limit exceeded for user ${userId}. Blocked for ${RATE_LIMIT.BLOCK_DURATION / 1000} seconds.`,
      );
      return false;
    }
  } else {
    // Yeni zaman penceresi başlat
    userLimit.count = 1;
    userLimit.firstRequest = now;
  }

  rateLimiter.set(userId, userLimit);
  return true;
};

export const setupSocketHandlers = (io) => {
  if (!io) {
    console.error('Socket.io instance is undefined');
    return null;
  }

  try {
    // JWT doğrulama middleware'i
    io.use(async (socket, next) => {
      try {
        console.log('Socket bağlantı isteği alındı');
        
        // Handshake bilgilerini detaylı logla
        const handshakeInfo = {
          id: socket.id,
          address: socket.handshake.address,
          authPresent: !!socket.handshake.auth,
          queryPresent: !!socket.handshake.query,
          headersPresent: !!socket.handshake.headers,
          authUserId: socket.handshake.auth?.userId || 'Yok',
          queryUserId: socket.handshake.query?.userId || 'Yok',
          authToken: socket.handshake.auth?.token ? 'Mevcut' : 'Yok',
          queryToken: socket.handshake.query?.token ? 'Mevcut' : 'Yok',
          headerAuth: socket.handshake.headers?.authorization ? 'Mevcut' : 'Yok',
          cookiePresent: socket.handshake.headers?.cookie ? 'Mevcut' : 'Yok'
        };
        
        console.log('Socket handshake detayları:', JSON.stringify(handshakeInfo, null, 2));
        
        // Token'ı farklı yerlerden almayı dene
        let token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
          socket.handshake.query?.token;

        // Cookie'den token'ı almayı dene
        if (!token && socket.handshake.headers?.cookie) {
          const cookies = socket.handshake.headers.cookie.split(';');
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'auth_token' || name === 'socket_token') {
              token = decodeURIComponent(value);
              console.log(`Token ${name} cookie'den alındı`);
              break;
            }
          }
        }

        console.log('Socket auth token kontrolü:', !!token);

        // Kullanıcı ID'sini query veya auth'dan almayı dene
        const queryUserId = socket.handshake.query?.userId || socket.handshake.auth?.userId;
        
        // Token yoksa ama userId varsa, userId ile devam et (geliştirme modunda)
        if (!token && queryUserId && process.env.NODE_ENV === 'development') {
          console.log('Geliştirme modu: Token bulunamadı, ancak userId mevcut:', queryUserId);
          socket.userId = queryUserId;
          socket.tokenExpired = true;
          return next();
        }
        
        if (!token) {
          console.error('Socket bağlantısı için token ve userId bulunamadı');
          return next(new Error('Authentication error: Token not provided'));
        }
        
        try {
          // Token'ı doğrula
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          // Kullanıcı ID'sini socket'e ekle
          socket.userId = decoded.userId;
          console.log('Socket için token doğrulandı, userId:', decoded.userId);
          
          // Token'dan çıkarılan userId ile query/auth'dan gelen userId karşılaştır
          if (queryUserId && queryUserId !== decoded.userId.toString()) {
            console.warn('Token userId ile query/auth userId uyuşmuyor:', {
              tokenUserId: decoded.userId,
              queryUserId
            });
            
            // Güvenlik nedeniyle token'dan gelen userId'yi kullan
            socket.userId = decoded.userId;
          }
          
          // Kullanıcı ID'sini connectedUsers Map'ine ekle
          if (socket.userId) {
            connectedUsers.set(socket.userId.toString(), socket.id);
            console.log(`Kullanıcı bağlandı ve connectedUsers'a eklendi: ${socket.userId} -> ${socket.id}`);
            console.log('Güncel bağlı kullanıcılar:', Array.from(connectedUsers.entries()));
          }
          
          // Bağlantıyı kabul et
          return next();
        } catch (verifyError) {
          console.error('Token doğrulama hatası:', verifyError.message);
          
          // Token süresi dolmuşsa, userId'yi çıkarmayı dene
          if (verifyError.name === 'TokenExpiredError' || verifyError.name === 'JsonWebTokenError') {
            console.log('Token geçersiz veya süresi dolmuş, alternatif doğrulama deneniyor...');
            
            try {
              // Süresi dolmuş token'dan userId'yi çıkar
              const decodedExpired = jwt.decode(token);
              
              // Eğer token'dan userId çıkarılabildiyse veya query/auth'dan userId geldiyse
              if ((decodedExpired && decodedExpired.userId) || queryUserId) {
                // Öncelikle token'dan çıkarılan userId'yi kullan, yoksa query/auth'dan geleni kullan
                socket.userId = (decodedExpired && decodedExpired.userId) ? decodedExpired.userId : queryUserId;
                console.log('Alternatif doğrulama başarılı, userId:', socket.userId);
                
                // Bağlantıyı kabul et, ancak istemciye token yenilemesi gerektiğini bildir
                socket.tokenExpired = true;
                return next();
              }
            } catch (decodeError) {
              console.error('Token decode hatası:', decodeError.message);
            }
          }
          
          // Eğer query/auth'dan userId geldiyse, token hatası olsa bile bağlantıya izin ver
          if (queryUserId) {
            console.log('Token doğrulanamadı, ancak queryUserId mevcut:', queryUserId);
            socket.userId = queryUserId;
            socket.tokenExpired = true;
            return next();
          }
          
          return next(new Error('Authentication error: ' + verifyError.message));
        }
      } catch (error) {
        console.error('Socket auth middleware hatası:', error);
        return next(new Error('Authentication error: ' + error.message));
      }
    });

    // Bağlantı olayları
    io.on('connection', (socket) => {
      try {
        const userId = socket.userId;
        logSocketEvent('CONNECTION', userId, 'connected', {
          ip: socket.handshake.address,
        });

        // Kullanıcıyı bağlı kullanıcılar listesine ekle
        connectedUsers.set(userId, socket.id);

        // Kullanıcının çevrimiçi olduğunu Redis'e kaydet
        setUserOnlineStatus(userId, 'online').catch((err) =>
          logSocketEvent('ERROR', userId, 'redis_error', err.message),
        );

        // Kullanıcının çevrimiçi olduğunu bildir
        io.emit('user_status_change', {
          userId: userId,
          status: 'online',
        });

        // Olay işleyicilerini kaydet ve rate limiting ile koru
        const registerEventHandler = (event, handler) => {
          socket.on(event, async (...args) => {
            try {
              // Rate limiting kontrolü
              if (!checkRateLimit(userId)) {
                logSocketEvent(
                  'RATE_LIMIT',
                  userId,
                  event,
                  'Rate limit exceeded',
                );

                // Callback varsa hata döndür
                const callback =
                  args.length > 0 && typeof args[args.length - 1] === 'function'
                    ? args[args.length - 1]
                    : null;

                if (callback) {
                  return callback({
                    success: false,
                    error: 'Too many requests. Please try again later.',
                  });
                }
                return;
              }

              // Olayı logla (hassas veriler hariç)
              const eventData =
                args.length > 0 && typeof args[0] === 'object' ? args[0] : null;
              logSocketEvent('EVENT', userId, event, eventData);

              // İşleyiciyi çağır
              await handler(...args);
            } catch (error) {
              logSocketEvent('ERROR', userId, event, error.message);

              // Callback varsa hata döndür
              const callback =
                args.length > 0 && typeof args[args.length - 1] === 'function'
                  ? args[args.length - 1]
                  : null;

              if (callback) {
                return callback({
                  success: false,
                  error: 'An error occurred while processing your request.',
                });
              }
            }
          });
        };

        // Konuşma işleyicileri
        try {
          const conversationHandlers = getConversationHandlers(
            io,
            socket,
            connectedUsers,
          );
          Object.entries(conversationHandlers).forEach(([event, handler]) => {
            registerEventHandler(event, handler);
          });
        } catch (error) {
          logSocketEvent(
            'ERROR',
            userId,
            'setup_conversation_handlers',
            error.message,
          );
        }

        // Mesaj işleyicileri
        try {
          const messageHandlers = getMessageHandlers(
            io,
            socket,
            connectedUsers,
          );
          Object.entries(messageHandlers).forEach(([event, handler]) => {
            registerEventHandler(event, handler);
          });
        } catch (error) {
          logSocketEvent(
            'ERROR',
            userId,
            'setup_message_handlers',
            error.message,
          );
        }

        // Arkadaşlık işleyicileri
        try {
          const friendshipHandlers = getFriendshipHandlers(
            io,
            socket,
            connectedUsers,
          );
          Object.entries(friendshipHandlers).forEach(([event, handler]) => {
            registerEventHandler(event, handler);
          });
        } catch (error) {
          logSocketEvent(
            'ERROR',
            userId,
            'setup_friendship_handlers',
            error.message,
          );
        }

        // Kullanıcı işleyicileri
        try {
          const userHandlers = getUserHandlers(io, socket, connectedUsers);
          Object.entries(userHandlers).forEach(([event, handler]) => {
            registerEventHandler(event, handler);
          });
        } catch (error) {
          logSocketEvent('ERROR', userId, 'setup_user_handlers', error.message);
        }

        // Ping-pong mekanizması
        registerEventHandler('ping', (callback) => {
          if (typeof callback === 'function') {
            callback({ success: true, time: Date.now() });
          }
        });

        // Bağlantı kesildiğinde
        socket.on('disconnect', async (reason) => {
          try {
            logSocketEvent('DISCONNECT', userId, 'disconnected', { reason });

            // Kullanıcıyı bağlı kullanıcılar listesinden çıkar
            connectedUsers.delete(userId);

            // Rate limiter'dan temizle
            rateLimiter.delete(userId);

            // Kullanıcının çevrimdışı olduğunu Redis'e kaydet
            // Ancak 1 saat süreyle "son görülme" bilgisini sakla
            await setUserOnlineStatus(userId, 'offline', 3600).catch((err) =>
              logSocketEvent('ERROR', userId, 'redis_error', err.message),
            );

            // Kullanıcının çevrimdışı olduğunu bildir
            io.emit('user_status_change', {
              userId: userId,
              status: 'offline',
            });

            // Eğer disconnect işleyicisi tanımlanmışsa çağır
            if (userHandlers && userHandlers.disconnect) {
              try {
                await userHandlers.disconnect();
              } catch (error) {
                logSocketEvent(
                  'ERROR',
                  userId,
                  'disconnect_handler',
                  error.message,
                );
              }
            }
          } catch (error) {
            logSocketEvent('ERROR', userId, 'disconnect_error', error.message);
          }
        });

        // Hata olayı
        socket.on('error', (error) => {
          logSocketEvent('ERROR', userId, 'socket_error', error.message);
        });
      } catch (error) {
        console.error('Error in socket connection handler:', error);
      }
    });

    // Periyodik olarak bağlantı durumunu kontrol et
    setInterval(() => {
      const connectedCount = connectedUsers.size;
      console.log(
        `[SOCKET:INFO] ${new Date().toISOString()} - Connected users: ${connectedCount}`,
      );
    }, 60000); // Her dakika

    return io;
  } catch (error) {
    console.error('Error setting up socket handlers:', error);
    return null;
  }
};

export const setupSocket = (server) => {
  if (!server) {
    console.error('HTTP server is undefined');
    return null;
  }

  try {
    // Socket.io sunucusunu başlat
    const io = new Server(server, {
      path: '/socket.io',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true, // Socket.io v3 ile geriye uyumluluk
    });

    console.log('Socket.io server started with path: /socket.io');

    // Olay işleyicilerini ayarla
    setupSocketHandlers(io);

    return io;
  } catch (error) {
    console.error('Socket.io server setup error:', error);
    return null;
  }
};
