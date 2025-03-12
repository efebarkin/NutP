import { eventHandler, getCookie, setCookie } from 'h3';
import csrf from 'csrf';

const tokens = new csrf();

export default eventHandler(async (event) => {
  try {
    // Mevcut token'ı kontrol et
    let token = getCookie(event, 'csrf-token');
    
    // Token yoksa yeni oluştur
    if (!token) {
      token = tokens.create(process.env.CSRF_SECRET || 'your-csrf-secret');
      setCookie(event, 'csrf-token', token, {
        httpOnly: true,
        sameSite: true
      });
    }

    return {
      token
    };
  } catch (error) {
    console.error('CSRF token error:', error);
    throw error;
  }
});
