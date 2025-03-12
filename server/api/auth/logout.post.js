import { defineEventHandler, setCookie, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Cookie'leri geçmiş bir tarihle expire et
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // 1970'e set et
      maxAge: 0,
      path: '/'
      // Domain belirtilmediğinde, mevcut domain kullanılır
    };

    // Auth token'ı sil
    setCookie(event, 'auth_token', '', {
      ...cookieOptions,
      sameSite: 'lax'
    });
    
    // Refresh token'ı sil
    setCookie(event, 'refresh_token', '', {
      ...cookieOptions,
      sameSite: 'lax'
    });

    // CSRF token'ı sil
    setCookie(event, 'csrf-token', '', {
      ...cookieOptions,
      sameSite: 'strict'
    });

    return {
      success: true,
      message: 'Başarıyla çıkış yapıldı'
    };
  } catch (error) {
    console.error('Logout error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Çıkış yapılırken bir hata oluştu'
    });
  }
});
