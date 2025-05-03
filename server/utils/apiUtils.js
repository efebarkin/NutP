/**
 * API endpoint'leri için ortak utility fonksiyonları
 */
import { createError } from 'h3';

/**
 * API handler'ları için try-catch wrapper
 * Bu fonksiyon, API handler'larındaki try-catch bloklarını standartlaştırır
 * 
 * @param {Function} handler - API handler fonksiyonu
 * @returns {Function} - try-catch ile sarmalanmış handler
 */
export const withErrorHandling = (handler) => {
  return async (event) => {
    try {
      return await handler(event);
    } catch (error) {
      console.error(`API Hatası: ${error.message}`, error);
      
      // Zaten HTTP hatası ise doğrudan fırlat
      if (error.statusCode && error.expose) {
        throw error;
      }
      
      // Mongoose validation hatası kontrolü
      if (error.name === 'ValidationError') {
        throw createError({
          statusCode: 400,
          message: 'Geçersiz veri formatı: ' + Object.values(error.errors).map(e => e.message).join(', ')
        });
      }
      
      // Mongoose CastError (genellikle ObjectId hataları)
      if (error.name === 'CastError') {
        throw createError({
          statusCode: 400,
          message: `Geçersiz ${error.path} formatı: ${error.value}`
        });
      }
      
      // Genel hata mesajı
      throw createError({
        statusCode: 500,
        message: 'İşlem sırasında bir hata oluştu'
      });
    }
  };
};

/**
 * Kullanıcı bulunamadı hatası oluştur
 * @returns {Error} - HTTP 404 hatası
 */
export const createUserNotFoundError = () => {
  return createError({
    statusCode: 404,
    message: 'Kullanıcı bulunamadı'
  });
};

/**
 * Besin bulunamadı hatası oluştur
 * @returns {Error} - HTTP 404 hatası
 */
export const createFoodNotFoundError = () => {
  return createError({
    statusCode: 404,
    message: 'Besin bulunamadı'
  });
};

/**
 * Öğün bulunamadı hatası oluştur
 * @returns {Error} - HTTP 404 hatası
 */
export const createMealNotFoundError = () => {
  return createError({
    statusCode: 404,
    message: 'Öğün bulunamadı'
  });
};

/**
 * Geçersiz istek hatası oluştur
 * @param {string} message - Hata mesajı
 * @returns {Error} - HTTP 400 hatası
 */
export const createBadRequestError = (message) => {
  return createError({
    statusCode: 400,
    message: message || 'Geçersiz istek'
  });
};

/**
 * Yetkilendirme hatası oluştur
 * @returns {Error} - HTTP 401 hatası
 */
export const createUnauthorizedError = () => {
  return createError({
    statusCode: 401,
    message: 'Yetkilendirme gerekli'
  });
};

/**
 * Yetki hatası oluştur
 * @param {string} roles - Gerekli roller
 * @returns {Error} - HTTP 403 hatası
 */
export const createForbiddenError = (roles) => {
  return createError({
    statusCode: 403,
    message: roles 
      ? `Bu işlemi yapmak için yetkiniz yok: ${roles}` 
      : 'Bu işlemi yapmak için yetkiniz yok'
  });
};
