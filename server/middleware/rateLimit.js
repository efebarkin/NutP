import { defineEventHandler, createError } from 'h3';

// Endpoint bazlı rate limit konfigürasyonu
const rateLimitConfig = {
  // Kritik authentication endpoint'leri
  '/api/auth/login': {
    windowMs: 15 * 60 * 1000, // 15 dakika
    maxRequests: 10, // 7 deneme
    message: 'Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.',
    blockDuration: 15 * 60 * 1000, // 15 dakika blok
  },

  '/api/auth/register': {
    windowMs: 15 * 60 * 1000, // 15 dakika
    maxRequests: 10, // 3 kayıt
    message: 'Çok fazla kayıt denemesi. 15 dakika sonra tekrar deneyin.',
    blockDuration: 24 * 60 * 60 * 1000, // 24 saat blok
  },

  '/api/auth/verify-email': {
    windowMs: 5 * 60 * 1000, // 5 dakika
    maxRequests: 3, // 3 deneme
    message: 'Çok fazla doğrulama kodu talebi. 5 dakika sonra tekrar deneyin.',
  },

  '/api/auth/refresh': {
    windowMs: 1 * 60 * 1000, // 1 dakika
    maxRequests: 10, // 10 refresh
    message: 'Token yenileme limitine ulaştınız.',
  },

  '/api/auth/forgot-password': {
    windowMs: 60 * 60 * 1000, // 1 saat
    maxRequests: 3, // 3 şifre sıfırlama
    message: 'Çok fazla şifre sıfırlama talebi.',
  },

  // Genel API endpoint'leri
  '/api/': {
    windowMs: 15 * 60 * 1000, // 15 dakika
    maxRequests: 100, // 100 istek
    message: 'API istek limitine ulaştınız.',
  },

  // Upload endpoint'leri
  '/api/upload': {
    windowMs: 60 * 60 * 1000, // 1 saat
    maxRequests: 20, // 20 upload
    message: 'Upload limitine ulaştınız.',
  },
};

// In-memory store (production'da Redis kullanın)
const requestStore = new Map();
const blockedIPs = new Map();

// IP adresini al
function getClientIP(event) {
  return (
    event.node.req.headers['x-forwarded-for']?.split(',')[0] ||
    event.node.req.headers['x-real-ip'] ||
    event.node.req.connection.remoteAddress ||
    event.node.req.socket.remoteAddress
  );
}

// Rate limit kontrolü
function checkRateLimit(ip, path, config) {
  const key = `${ip}:${path}`;
  const now = Date.now();

  // Mevcut kayıtları al
  if (!requestStore.has(key)) {
    requestStore.set(key, []);
  }

  const requests = requestStore.get(key);

  // Eski kayıtları temizle
  const validRequests = requests.filter((time) => now - time < config.windowMs);

  // Limit kontrolü
  if (validRequests.length >= config.maxRequests) {
    // Block duration varsa IP'yi blokla
    if (config.blockDuration) {
      blockedIPs.set(ip, now + config.blockDuration);
    }
    return false;
  }

  // Yeni isteği kaydet
  validRequests.push(now);
  requestStore.set(key, validRequests);

  return true;
}

// Bloklu IP kontrolü
function isIPBlocked(ip) {
  if (!blockedIPs.has(ip)) return false;

  const blockExpiry = blockedIPs.get(ip);
  if (Date.now() > blockExpiry) {
    blockedIPs.delete(ip);
    return false;
  }

  return true;
}

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || '';
  const method = event.node.req.method || 'GET';

  // Sadece riskli metodları kontrol et
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return;
  }

  const clientIP = getClientIP(event);

  // IP bloğu kontrolü
  if (isIPBlocked(clientIP)) {
    console.log(`Blocked IP attempted access: ${clientIP} to ${path}`);
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message:
        'IP adresiniz geçici olarak engellenmiştir. Daha sonra tekrar deneyin.',
    });
  }

  // En spesifik konfigürasyonu bul
  let matchedConfig = null;
  let matchedPath = '';

  for (const [configPath, config] of Object.entries(rateLimitConfig)) {
    if (path.startsWith(configPath) && configPath.length > matchedPath.length) {
      matchedConfig = config;
      matchedPath = configPath;
    }
  }

  // Konfigürasyon bulunamadıysa varsayılan kullan
  if (!matchedConfig) {
    matchedConfig = {
      windowMs: 15 * 60 * 1000,
      maxRequests: 200,
      message: 'Çok fazla istek gönderdiniz.',
    };
    matchedPath = 'default';
  }

  // Rate limit kontrolü
  if (!checkRateLimit(clientIP, matchedPath, matchedConfig)) {
    console.log(
      `Rate limit exceeded: ${clientIP} to ${path} (${matchedConfig.maxRequests} requests in ${matchedConfig.windowMs}ms)`,
    );

    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: matchedConfig.message,
      data: {
        retryAfter: Math.ceil(matchedConfig.windowMs / 1000),
        limit: matchedConfig.maxRequests,
        window: matchedConfig.windowMs,
      },
    });
  }
});

// Memory temizleme (her 10 dakikada bir)
setInterval(
  () => {
    const now = Date.now();

    // Eski istekleri temizle
    for (const [key, requests] of requestStore.entries()) {
      const validRequests = requests.filter(
        (time) => now - time < 24 * 60 * 60 * 1000,
      ); // 24 saat
      if (validRequests.length === 0) {
        requestStore.delete(key);
      } else {
        requestStore.set(key, validRequests);
      }
    }

    // Süresi dolmuş IP bloklarını temizle
    for (const [ip, expiry] of blockedIPs.entries()) {
      if (now > expiry) {
        blockedIPs.delete(ip);
      }
    }
  },
  10 * 60 * 1000,
);
