import { getCookie, createError } from 'h3';
// Server tarafında config'e erişim için
import csrf from 'csrf';

// CSRF token üretici/doğrulayıcı instance'ı oluştur
let tokens = null;
let csrfSecret = null;

// CSRF token cookie adı - tüm kodda tutarlı olması için sabit tanımla
export const CSRF_COOKIE_NAME = 'csrf_token';

// CSRF secret'i ve token instance'ını al
function getTokens() {
  if (tokens) return tokens;
  
  // Doğrudan process.env'den CSRF secret'i al
  csrfSecret = process.env.CSRF_SECRET;
  
  if (!csrfSecret) {
    console.error('CRITICAL: CSRF_SECRET tanımlanmamış!');
    return null;
  }
  
  tokens = new csrf();
  return tokens;
}

// CSRF token doğrulama middleware'i
export const verifyCsrfToken = (event) => {
  // CSRF koruması aktif mi kontrol et
  const csrfEnabled = process.env.CSRF_ENABLED !== 'false';
  if (!csrfEnabled) {
    console.log('CSRF koruması devre dışı bırakıldı');
    return true;
  }
  
  // Token instance'ını al
  const tokenInstance = getTokens();
  if (!tokenInstance) {
    console.error('CRITICAL: CSRF token instance oluşturulamadı!');
    throw createError({
      statusCode: 500,
      statusMessage: 'Sunucu Yapılandırma Hatası',
      message: 'CSRF koruması için gerekli yapılandırma eksik.',
    });
  }

  // Cookie'den CSRF token'ı al
  const cookieToken = getCookie(event, CSRF_COOKIE_NAME);
  
  // Header'dan gelen token'ı al
  const headerToken = event.node.req.headers['x-csrf-token'];
  
  // Form verilerinden gelen token'ı al (gerekirse)
  // Bu örnekte sadece header'dan alıyoruz
  
  // Token'ı doğrula
  if (!cookieToken || !headerToken || !tokenInstance.verify(csrfSecret, headerToken)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'CSRF token geçersiz veya eksik.',
    });
  }
  
  return true;
};

// CSRF token cookie ayarları
export const csrfCookieOptions = {
  httpOnly: false,
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 3600 * 24 // 24 saat
};

// CSRF token'i silmek için cookie ayarları
export const csrfCookieClearOptions = {
  httpOnly: false,
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 0,
  expires: new Date(0) // 1970'e set et
};

// CSRF token oluşturma
export const generateCsrfToken = () => {
  // CSRF koruması aktif mi kontrol et
  const csrfEnabled = process.env.CSRF_ENABLED !== 'false';
  if (!csrfEnabled) {
    // CSRF koruması devre dışı bırakıldıysa dummy token dön
    return 'csrf-disabled';
  }
  
  // Token instance'ını al
  const tokenInstance = getTokens();
  if (!tokenInstance) {
    console.error('CRITICAL: CSRF token instance oluşturulamadı!');
    throw new Error('CSRF koruması için gerekli yapılandırma eksik.');
  }
  
  return tokenInstance.create(csrfSecret);
};
