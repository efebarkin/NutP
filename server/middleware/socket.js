import { defineEventHandler } from 'h3';
import { setupSocket } from '../socket';

let io;

export default defineEventHandler((event) => {
  // Socket.io yolunu kontrol et ve Vue Router tarafından işlenmesini engelle
  const url = event.node.req.url;
  if (url && url.startsWith('/socket.io')) {
    // Socket.io isteklerini işleme, Vue Router'a gönderme
    event.context._notRouted = true;
  }

  // Socket.io sunucusunu bir kez başlat
  if (!io && event.node.req.socket.server) {
    console.log('Setting up Socket.io server');
    io = setupSocket(event.node.req.socket.server);
    
    if (io) {
      console.log('Socket.io server başarıyla başlatıldı');
      event.context.io = io;
    } else {
      console.error('Socket.io server başlatılamadı');
    }
  }
});
