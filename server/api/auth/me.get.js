import { defineEventHandler, getCookie, createError } from 'h3';
import jwt from 'jsonwebtoken';
import { User } from '~/server/models/User';
import { verifyToken } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    // Cookie'den token al
    const token = getCookie(event, 'auth_token');
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Yetkilendirme başarısız'
      });
    }

    // Token'ı doğrula
    const { decoded, expired } = verifyToken(token);
    
    if (!decoded) {
      if (expired) {
        throw createError({
          statusCode: 401,
          message: 'Token süresi doldu'
        });
      }
      throw createError({
        statusCode: 401,
        message: 'Geçersiz token'
      });
    }
    
    // Kullanıcıyı ID'ye göre bul
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Kullanıcı bulunamadı'
      });
    }

    return {
      user: user.toJSON()
    };
  } catch (error) {
    console.error('Get user error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Sunucu hatası'
    });
  }
});
