import { defineEventHandler, createError, getMethod } from 'h3';
import { verifyCsrfToken } from '../utils/csrf';

// Konfigürasyon
const config = {
  // CSRF koruması gerektirmeyen public endpoint'ler - regex formatında saklama
  publicEndpoints: new Set([
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/auth/csrf-token'
  ]),
  
  // CSRF koruması gerektirmeyen güvenli HTTP metodları
  safeMethods: new Set(['GET', 'HEAD', 'OPTIONS']),
  
  // CSRF kontrolü yapılacak path prefix'i
  apiPrefix: '/api'
};

/**
 * CSRF koruma middleware - tüm API istekleri için çalışır
 * @param {Object} event - Nuxt 3 HTTP event objesi
 */
export default defineEventHandler(async (event) => {
  // Sadece belirlenen prefix ile başlayan istekleri kontrol et
  const url = event.node.req.url || '';
  if (!url.startsWith(config.apiPrefix)) {
    return; // API isteği değilse atla
  }
  
  const method = getMethod(event);
  
  // Güvenli metodlar için CSRF kontrolü bypass et
  if (config.safeMethods.has(method)) {
    return;
  }
  
  // Public endpoint'ler için CSRF kontrolü bypass et
  if (isPublicEndpoint(url, config.publicEndpoints)) {
    return;
  }
  
  try {
    // CSRF token doğrulaması yap
    verifyCsrfToken(event);
  } catch (error) {
    // Yapılandırılmış hata loglaması
    logCsrfError(url, method, error);
    
    // İstemciye hata döndür
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'CSRF token geçersiz veya eksik. Lütfen sayfayı yenileyip tekrar deneyin.'
    });
  }
});

/**
 * URL'in public endpoint olup olmadığını kontrol eder
 * @param {string} url - Kontrol edilecek URL
 * @param {Set} publicEndpoints - Public endpoint'lerin saklandığı set
 * @returns {boolean} - URL public endpoint ise true döner
 */
function isPublicEndpoint(url, publicEndpoints) {
  for (const endpoint of publicEndpoints) {
    if (url.startsWith(endpoint)) {
      return true;
    }
  }
  return false;
}

/**
 * CSRF hatalarını yapılandırılmış şekilde loglar
 * @param {string} url - İstek URL'i
 * @param {string} method - HTTP metodu
 * @param {Error} error - Oluşan hata
 */
function logCsrfError(url, method, error) {
  console.error(`CSRF Doğrulama Hatası: ${method} ${url}`, {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
}