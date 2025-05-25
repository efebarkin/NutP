/**
 * Middleware'leri sıralı olarak yükleyen ana dosya
 * Middleware'lerin yükleme sırası önemlidir
 */
import { defineEventHandler, createError } from 'h3';

// Middleware'leri sıralı olarak çalıştır
export default defineEventHandler(async (event) => {
  try {
    // 1. Rate limiting - Aşırı istekleri sınırla
    await import('./rateLimit').then((m) => m.default(event));

    // 2. Güvenlik başlıkları - HTTP güvenlik başlıklarını ekle
    await import('./securityHeaders').then((m) => m.default(event));

    // 3. Kimlik doğrulama - Kullanıcı kimliğini doğrula
    await import('./auth').then((m) => m.default(event));

    // 4. CSRF koruması - CSRF saldırılarına karşı koruma
    await import('./csrfProtection').then((m) => m.default(event));

    // 5. Socket - WebSocket işlemleri için
    if (event.path.startsWith('/api/socket')) {
      await import('./socket').then((m) => m.default(event));
    }
  } catch (error) {
    // Middleware'lerden gelen hataları işle
    if (error.statusCode && error.expose) {
      throw error; // HTTP hatalarını doğrudan fırlat
    }

    console.error('Middleware error:', error);
    throw createError({
      statusCode: 500,
      message: 'Sunucu hatası',
    });
  }
});
