// server/plugins/socket.js
import { Server } from 'socket.io';
import { setupSocketHandlers } from '../socket/index.js';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('listen', (server) => {
    console.log('Socket.io sunucusu başlatılıyor...');
    
    try {
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
        allowEIO3: true // Socket.io v3 uyumluluğu için
      });
      
      // Socket.io işleyicilerini kur
      setupSocketHandlers(io);
      
      console.log('Socket.io sunucusu başarıyla başlatıldı');
    } catch (error) {
      console.error('Socket.io sunucusu başlatılırken hata:', error);
    }
  });
});