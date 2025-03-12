import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getConversationHandlers } from './handlers/conversations';
import { getMessageHandlers } from './handlers/messages';
import { getUserHandlers } from './handlers/users';
import { setUserOnlineStatus, getUserOnlineStatus } from '../utils/redis';

// Kullanıcı bağlantılarını saklamak için
const connectedUsers = new Map();

export const setupSocketHandlers = (io) => {
  // JWT doğrulama middleware'i
  io.use(async (socket, next) => {
    try {
      // Token'ı farklı yerlerden almayı dene
      const token = socket.handshake.auth?.token || 
                   socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
                   socket.handshake.query?.token;
      
      console.log('Socket auth token kontrolü:', !!token);
      console.log('Socket handshake:', {
        auth: socket.handshake.auth,
        query: socket.handshake.query,
        headers: socket.handshake.headers?.authorization ? 'Mevcut' : 'Yok'
      });
      
      if (!token) {
        console.warn('Socket authentication error: Token not provided');
        return next(new Error('Authentication error: Token not provided'));
      }
      
      try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.userId) {
          console.warn('Socket authentication error: Invalid token');
          return next(new Error('Authentication error: Invalid token'));
        }
        
        // Kullanıcı bilgisini socket'e ekle
        socket.userId = decoded.userId;
        console.log(`Socket authentication başarılı: User ID ${decoded.userId}`);
        
        next();
      } catch (tokenError) {
        console.error('Token verification error:', tokenError.message);
        return next(new Error('Authentication error: ' + tokenError.message));
      }
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: ' + error.message));
    }
  });

  // Bağlantı olayları
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Kullanıcıyı bağlı kullanıcılar listesine ekle
    connectedUsers.set(socket.userId, socket.id);
    
    // Kullanıcının çevrimiçi olduğunu Redis'e kaydet
    setUserOnlineStatus(socket.userId, 'online');
    
    // Kullanıcının çevrimiçi olduğunu bildir
    io.emit('user_status_change', {
      userId: socket.userId,
      status: 'online'
    });
    
    // Konuşma işleyicileri
    const conversationHandlers = getConversationHandlers(io, socket, connectedUsers);
    Object.entries(conversationHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
    
    // Mesaj işleyicileri
    const messageHandlers = getMessageHandlers(io, socket, connectedUsers);
    Object.entries(messageHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
    
    // Kullanıcı işleyicileri
    const userHandlers = getUserHandlers(io, socket, connectedUsers);
    Object.entries(userHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
    
    // Bağlantı kesildiğinde
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      // Kullanıcıyı bağlı kullanıcılar listesinden çıkar
      connectedUsers.delete(socket.userId);
      
      // Kullanıcının çevrimdışı olduğunu Redis'e kaydet
      // Ancak 1 saat süreyle "son görülme" bilgisini sakla
      await setUserOnlineStatus(socket.userId, 'offline', 3600);
      
      // Kullanıcının çevrimdışı olduğunu bildir
      io.emit('user_status_change', {
        userId: socket.userId,
        status: 'offline'
      });
      
      // Eğer disconnect işleyicisi tanımlanmışsa çağır
      if (userHandlers.disconnect) {
        await userHandlers.disconnect();
      }
    });
  });
};

export default function (server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    pingTimeout: 30000,
    pingInterval: 10000,
    connectTimeout: 45000,
    allowEIO3: true
  });

  // Socket işleyicilerini kur
  setupSocketHandlers(io);

  return io;
}
