// server/plugins/socket.js
import { Server } from 'socket.io';
import { setupSocketHandlers } from '../socket/index.js';

export default defineNitroPlugin((nitroApp) => {
  // Sunucu başlatıldığında çalışacak
  nitroApp.hooks.hook('listen', (server) => {
    console.log('Socket.io sunucusu başlatılıyor...');

    if (!server) {
      console.error('Server instance is undefined');
      return;
    }

    try {
      // Socket.io sunucusunu oluştur
      const io = new Server(server, {
        cors: {
          origin: process.env.CLIENT_URL || '*',
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          credentials: true,
        },
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        pingTimeout: 30000,
        pingInterval: 10000,
        connectTimeout: 45000,
        allowEIO3: true, // Socket.io v3 uyumluluğu için
        // Güvenlik ayarları
        maxHttpBufferSize: 1e6, // 1MB
        perMessageDeflate: {
          threshold: 1024, // Sıkıştırma eşiği
        },
      });

      // Global olarak io nesnesini kaydet
      if (typeof globalThis !== 'undefined') {
        globalThis.$io = io;
        globalThis.io = io; // Eski kodlar için uyumluluk
      }

      // Socket.io işleyicilerini kur
      const result = setupSocketHandlers(io);

      if (result) {
        console.log('Socket.io sunucusu başarıyla başlatıldı');

        // Nitro app'e io nesnesini ekle
        nitroApp.io = io;

        // Periyodik olarak bağlantı durumunu kontrol et
        const interval = setInterval(() => {
          try {
            const sockets = io.sockets.sockets;
            const connectedCount = sockets ? sockets.size : 0;
            console.log(
              `Socket.io bağlantı durumu: ${connectedCount} aktif bağlantı`,
            );
          } catch (error) {
            console.error('Socket.io bağlantı durumu kontrolü hatası:', error);
          }
        }, 60000); // Her dakika

        // Nitro kapandığında interval'i temizle
        nitroApp.hooks.hook('close', () => {
          clearInterval(interval);
        });
      } else {
        console.error('Socket.io işleyicileri kurulamadı');
      }
    } catch (error) {
      console.error('Socket.io sunucusu başlatılırken hata:', error);
    }
  });
});
