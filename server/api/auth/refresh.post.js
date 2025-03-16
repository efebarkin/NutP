import { defineEventHandler, getCookie, createError } from 'h3';
import { verifyRefreshToken, generateTokens, setAuthCookies, clearAuthCookies } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    // Refresh token'ı kontrol et
    const refreshToken = getCookie(event, 'refresh_token');
    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        message: 'Refresh token required'
      });
    }

    // Refresh token'ı doğrula ve kullanıcıyı al
    const user = await verifyRefreshToken(refreshToken);
    if (!user) {
      clearAuthCookies(event);
      throw createError({
        statusCode: 401,
        message: 'Invalid refresh token'
      });
    }

    // Yeni tokenları oluştur
    const tokens = generateTokens(user._id);
    
    // Yeni tokenları cookie'ye kaydet
    setAuthCookies(event, tokens);

    return { 
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        token: tokens.accessToken,
        isAdmin: user.isAdmin || false
      }
    };
  } catch (error) {
    clearAuthCookies(event);
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || 'Token refresh failed'
    });
  }
});
