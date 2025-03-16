// utils/emitter.js
// Bileşenler arası iletişim için basit bir event bus

import mitt from 'mitt';

// Mitt event emitter oluştur
export const emitter = mitt();

// Kullanım:
// import { emitter } from '~/utils/emitter';
// 
// Olay yayınlama:
// emitter.emit('eventName', data);
// 
// Olay dinleme:
// emitter.on('eventName', (data) => { ... });
// 
// Dinlemeyi durdurma:
// emitter.off('eventName', handler);
