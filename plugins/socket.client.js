import { useSocketClient } from '~/composables/useSocketClient';

export default defineNuxtPlugin((nuxtApp) => {
  // Socket.io istemcisini başlat
  const { socket } = useSocketClient();
  
  // Socket.io istemcisini global olarak erişilebilir yap
  nuxtApp.provide('socket', socket);
});