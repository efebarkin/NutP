// server/api/friendship/requests.get.js
import { defineEventHandler, getHeaders, createError, getCookie, parseCookies } from 'h3';
import jwt from 'jsonwebtoken';
import Friendship from '../../models/Friendship.js';

export default defineEventHandler(async (event) => {
  try {
    // Token'ı farklı kaynaklardan almayı dene
    let token = null;
    
    // 1. Authorization header'dan token'ı al
    const authHeader = getHeaders(event).authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('Token Authorization header\'dan alındı');
    }
    
    // 2. auth_token cookie'sinden token'ı al
    if (!token) {
      token = getCookie(event, 'auth_token');
      if (token) {
        console.log('Token auth_token cookie\'den alındı');
      }
    }
    
    // 3. socket_token cookie'sinden token'ı al
    if (!token) {
      token = getCookie(event, 'socket_token');
      if (token) {
        console.log('Token socket_token cookie\'den alındı');
      }
    }
    
    // 4. Tüm cookie'leri kontrol et
    if (!token) {
      const cookies = parseCookies(event);
      console.log('Mevcut cookie\'ler:', Object.keys(cookies));
    }
    
    // Hala token yoksa hata döndür
    if (!token) {
      console.error('Token bulunamadı, tüm kaynaklar kontrol edildi');
      return createError({
        statusCode: 401,
        message: 'Unauthorized - Token not provided'
      });
    }
    
    console.log('Token bulundu:', !!token);
    
    // Token'ı doğrula
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      return createError({
        statusCode: 401,
        message: 'Unauthorized - Invalid token'
      });
    }
    
    if (!decoded || !decoded.userId) {
      console.error('Geçersiz token içeriği:', decoded);
      return createError({
        statusCode: 401,
        message: 'Unauthorized - Invalid token payload'
      });
    }
    
    console.log('Token doğrulandı, userId:', decoded.userId);
    
    // Kullanıcıya gelen arkadaşlık isteklerini getir
    const requests = await Friendship.find({
      recipient: decoded.userId,
      status: 'pending'
    }).populate('requester', 'name email avatar status lastSeen customStatus');
    
    return {
      success: true,
      requests: requests || []
    };
  } catch (error) {
    console.error('Arkadaşlık istekleri getirilirken hata:', error);
    return createError({
      statusCode: 500,
      message: 'Internal Server Error'
    });
  }
});
