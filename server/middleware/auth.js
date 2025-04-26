import jwt from 'jsonwebtoken';
import { User } from '~/server/models/User';
import { defineEventHandler, createError, getCookie } from 'h3';
import { verifyToken, verifyRefreshToken, generateTokens, setAuthCookies, clearAuthCookies } from '~/server/utils/auth';

// Helper function to check if route is public
function isPublicRoute(path) {
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/auth/logout',
    '/api/foods/categories',
    '/api/foods/popular',
    '/api/foods/recent',
    '/api/foods/search',
    '/',
    '/login',
    '/register',
    '/glisemik-index'
  ];

  // Ana sayfa ve statik dosyalar için erişime izin ver
  if (path.startsWith('/_nuxt/') || 
      path.startsWith('/assets/') || 
      path === '/' || 
      path === '/favicon.ico') {
    return true;
  }

  return publicPaths.some(publicPath => path.startsWith(publicPath));
}

// Auth check function
const verifyAuth = async (event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'auth_token');
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Yetkilendirme gerekli'
      });
    }

    try {
      // Token'ı doğrula
      const { decoded, expired } = verifyToken(token);
      
      if (expired) {
        // Refresh token ile yenileme dene
        const refreshToken = getCookie(event, 'refresh_token');
        if (!refreshToken) {
          throw createError({
            statusCode: 401,
            message: 'Oturum süresi doldu'
          });
        }

        try {
          const user = await verifyRefreshToken(refreshToken);
          if (!user) {
            throw createError({
              statusCode: 401,
              message: 'Kullanıcı bulunamadı'
            });
          }

          // Yeni tokenlar oluştur
          const tokens = generateTokens(user._id);
          
          // Cookie'leri güncelle
          setAuthCookies(event, tokens);

          event.context.auth = { user };
        } catch (error) {
          // Refresh token da geçersizse çıkış yaptır
          clearAuthCookies(event);
          throw createError({
            statusCode: 401,
            message: 'Oturum süresi doldu, lütfen tekrar giriş yapın'
          });
        }
      } else if (decoded) {
        // Token geçerli, kullanıcıyı al
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
          throw createError({
            statusCode: 401,
            message: 'Kullanıcı bulunamadı'
          });
        }

        event.context.auth = { user };
      } else {
        throw createError({
          statusCode: 401,
          message: 'Geçersiz token'
        });
      }
    } catch (error) {
      throw createError({
        statusCode: 401,
        message: error.message || 'Geçersiz token'
      });
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
};

// Define authenticated handler wrapper
export const defineAuthenticatedHandler = (handler) => {
  return defineEventHandler(async (event) => {
    await verifyAuth(event);
    return handler(event);
  });
};

// Define admin handler wrapper
export const defineAdminHandler = (handler) => {
  return defineEventHandler(async (event) => {
    await verifyAuth(event);
    
    const rules = event.context.auth.user.role;

    if (!rules || !rules.includes('admin')) {
      throw createError({
        statusCode: 403,
        message: 'Admin yetkisi gerekli'
      });
    }

    return handler(event);
  });
};

export const defineRoleHandler = (allowedRoles, handler) => {
  return defineEventHandler(async (event) => {
    await verifyAuth(event);

    const userRoles = event.context.auth.user.role;
    if (!userRoles || !allowedRoles.some(role => userRoles.includes(role))) {
      throw createError({
        statusCode: 403,
        message: `Bu işlemi yapmak için yetkiniz yok: ${allowedRoles.join(', ')}`
      });
    }

    return handler(event);
  });
};

// Default middleware handler that skips auth for public routes
export default defineEventHandler(async (event) => {
  try {
    const path = event.node.req.url;

    // Skip auth for public routes
    if (isPublicRoute(path)) {
      return;
    }

    // Get token from cookie
    const token = getCookie(event, 'auth_token');
    if (!token) {
      return;
    }

    try {
      // Token'ı doğrula
      const { decoded, expired } = verifyToken(token);
      
      if (expired) {
        // Refresh token ile yenileme dene
        const refreshToken = getCookie(event, 'refresh_token');
        if (!refreshToken) {
          return;
        }

        try {
          const user = await verifyRefreshToken(refreshToken);
          if (!user) {
            return;
          }

          // Yeni tokenlar oluştur
          const tokens = generateTokens(user._id);
          
          // Cookie'leri güncelle
          setAuthCookies(event, tokens);

          event.context.auth = { user };
        } catch (error) {
          // Refresh token da geçersizse çıkış yaptır
          clearAuthCookies(event);
          return;
        }
      } else if (decoded) {
        // Token geçerli, kullanıcıyı al
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
          return;
        }

        event.context.auth = { user };
      }
    } catch (error) {
      return;
    }
  } catch (error) {
    return;
  }
});
