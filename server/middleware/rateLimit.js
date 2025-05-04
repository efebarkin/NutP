/**
 * API isteklerini sınırlayan rate limiting middleware
 * Bu middleware, belirli bir IP adresinden gelen istekleri sınırlar
 */
import { defineEventHandler, createError } from 'h3';

// Basit bir in-memory rate limiter
// Üretim ortamında Redis gibi bir çözüm kullanmak daha iyi olur
const ipRequests = new Map();
const windowMs = 15 * 60 * 1000; // 15 dakika
const maxRequests = 1000; // 15 dakikada maksimum 100 istek

// Periyodik olarak eski kayıtları temizle
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequests.entries()) {
    if (now - data.windowStart > windowMs) {
      ipRequests.delete(ip);
    }
  }
}, 5 * 60 * 1000); // 5 dakikada bir temizle

export default defineEventHandler((event) => {
  // IP adresini al
  const ip = event.node.req.headers['x-forwarded-for'] || 
             event.node.req.socket.remoteAddress || 
             'unknown';
  
  const now = Date.now();
  
  // IP için veri yoksa oluştur
  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, {
      windowStart: now,
      count: 1
    });
    return;
  }
  
  // IP için mevcut veriyi al
  const data = ipRequests.get(ip);
  
  // Zaman penceresi geçmişse sıfırla
  if (now - data.windowStart > windowMs) {
    data.windowStart = now;
    data.count = 1;
    return;
  }
  
  // İstek sayısını artır
  data.count++;
  
  // Limit aşıldıysa hata döndür
  if (data.count > maxRequests) {
    throw createError({
      statusCode: 429,
      message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
      headers: {
        'Retry-After': Math.ceil((data.windowStart + windowMs - now) / 1000),
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': 0,
        'X-RateLimit-Reset': Math.ceil((data.windowStart + windowMs) / 1000)
      }
    });
  }
  
  // Rate limit başlıklarını ekle
  event.node.res.setHeader('X-RateLimit-Limit', maxRequests);
  event.node.res.setHeader('X-RateLimit-Remaining', maxRequests - data.count);
  event.node.res.setHeader('X-RateLimit-Reset', Math.ceil((data.windowStart + windowMs) / 1000));
});
