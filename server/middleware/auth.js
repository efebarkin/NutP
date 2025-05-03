import { defineEventHandler } from 'h3';
import { getServerSession, isPublicRoute } from '../utils/auth';

// Kimlik doğrulama, rol kontrolü ve diğer ilgili fonksiyonlar utils/auth.js'e taşındı
// Bu dosya sadece genel middleware olarak çalışıyor

// Default middleware handler that skips auth for public routes
export default defineEventHandler(async (event) => {
  try {
    const path = event.node.req.url;
    console.log('Auth middleware çalışıyor, path:', path);
    
    // Önce event.context objesini oluştur
    if (!event.context) {
      event.context = {};
    }
    
    // Skip auth for public routes
    if (isPublicRoute(path)) {
      console.log('Public route, auth atlanıyor:', path);
      return;
    }

    // Get session from token
    const session = await getServerSession(event);
    if (session && session.user) {
      console.log('Auth context oluşturuldu:', { userId: session.user._id, role: session.user.role });
      // Kullanıcı bilgilerini context'e ekle
      event.context.auth = { 
        user: session.user,
        authenticated: true,
        timestamp: Date.now()
      };
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Hata durumunda sessizce devam et
    return;
  }
});

// Not: defineAuthenticatedHandler, defineAdminHandler ve defineRoleHandler fonksiyonları
// utils/auth.js dosyasına taşındı. Bu fonksiyonları kullanmak için artık o dosyadan import edin.
