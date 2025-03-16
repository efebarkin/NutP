// server/api/auth/socket-token.post.js
import { defineEventHandler, getHeader, readBody, createError } from 'h3';
import jwt from 'jsonwebtoken';
import { User } from '~/server/models/User';

export default defineEventHandler(async (event) => {
  try {
    // Authorization header'dan token'ı al
    const authHeader = getHeader(event, 'Authorization');
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('Token Authorization header\'dan alındı');
    }
    
    // Token kontrolü
    console.log('Token bulundu:', !!token);
    
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - Token not provided'
      });
    }
    
    // Token'ı doğrula
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Kullanıcı ID'sini al
      const userId = decoded.userId;
      
      // Kullanıcıyı kontrol et
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw createError({
          statusCode: 404,
          message: 'User not found'
        });
      }
      
      // Socket.io için özel token oluştur (daha uzun süreli)
      const socketToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Socket token'ı 24 saat geçerli olsun
      );
      
      return {
        success: true,
        token: socketToken
      };
    } catch (verifyError) {
      console.error('Token doğrulama hatası:', verifyError.message);
      
      // Token süresi dolmuşsa özel hata mesajı döndür
      if (verifyError.name === 'TokenExpiredError') {
        throw createError({
          statusCode: 401,
          message: 'Token expired'
        });
      }
      
      throw createError({
        statusCode: 401,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Socket token oluşturma hatası:', error.message);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
});
