import { defineEventHandler } from 'h3';
import setupSocket from '../socket';

let io;

export default defineEventHandler((event) => {
  // Socket.io sunucusunu bir kez başlat
  if (!io && event.node.req.socket.server) {
    console.log('Setting up Socket.io server');
    io = setupSocket(event.node.req.socket.server);
    event.context.io = io;
  }
});
