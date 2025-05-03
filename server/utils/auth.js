import jwt from 'jsonwebtoken';
import { getCookie, setCookie, deleteCookie, createError, defineEventHandler } from 'h3';
import { User } from '../models/User';

// JWT anahtarları ve token süreleri için sabitler
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Token süreleri - Tek bir yerde tanımlanmış sabitler
const ACCESS_TOKEN_EXPIRY = '1h';  // Access token: 1 saat
const REFRESH_TOKEN_EXPIRY = '7d';  // Refresh token: 7 gün
const ACCESS_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 saat (milisaniye)
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 gün (milisaniye)

// Uygulama başlatıldığında JWT anahtarlarını kontrol et
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET ortam değişkeni gerekli');
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error('REFRESH_TOKEN_SECRET ortam değişkeni gerekli');
}

// Generate both access and refresh tokens
export const generateTokens = (userId) => {
  // Tanımlanmış sabitleri kullan
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  
  return { 
    accessToken, 
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY_MS // Tanımlanmış sabiti kullan
  };
};

// Verify access token
export const verifyToken = (token) => {
  if (!token) {
    return {
      decoded: null,
      expired: false
    };
  }
  
  try {
    return {
      decoded: jwt.verify(token, JWT_SECRET),
      expired: false
    };
  } catch (error) {
    return {
      decoded: null,
      expired: error.name === 'TokenExpiredError'
    };
  }
};

// Verify refresh token and return user if valid
export const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET || JWT_SECRET);
    if (!decoded?.userId) {
      return null;
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};

// Set both access and refresh token cookies
export const setAuthCookies = (event, tokens) => {
  // Set access token cookie
  setCookie(event, 'auth_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ACCESS_TOKEN_EXPIRY_MS
  });
  
  // Set refresh token cookie
  setCookie(event, 'refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_EXPIRY_MS
  });
};

// Clear all auth cookies
export const clearAuthCookies = (event) => {
  deleteCookie(event, 'auth_token');
  deleteCookie(event, 'refresh_token');
};

// İstek yolunun public olup olmadığını kontrol et
export const isPublicRoute = (path) => {
  const publicPaths = [
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
};

// Rol tabanlı erişim kontrolü için yardımcı fonksiyon
export const hasRole = (user, requiredRoles) => {
  if (!user || !user.role) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.some(role => user.role.includes(role));
  }
  
  return user.role.includes(requiredRoles);
};

// Get user session from token
export const getServerSession = async (event) => {
  try {
    const token = getCookie(event, 'auth_token');
    if (!token) {
      return null;
    }

    const { decoded, expired } = verifyToken(token);
    
    // Token geçerli değilse
    if (!decoded) {
      // Token süresi dolmuşsa ve refresh token varsa
      if (expired) {
        const refreshToken = getCookie(event, 'refresh_token');
        if (!refreshToken) {
          return null;
        }
        
        // Refresh token doğrulama
        const user = await verifyRefreshToken(refreshToken);
        if (!user) {
          return null;
        }
        
        // Yeni tokenlar oluştur
        const newTokens = generateTokens(user._id);
        setAuthCookies(event, newTokens);
        
        return {
          user: {
            _id: user._id, // id yerine _id kullanıyoruz
            email: user.email,
            name: user.name,
            role: user.role // Rol bilgisini ekle
          }
        };
      }
      return null;
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return null;
    }

    return {
      user: {
        _id: user._id, // id yerine _id kullanıyoruz
        email: user.email,
        name: user.name,
        role: user.role // Rol bilgisini ekle
      }
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
};

// Kimlik doğrulama gerektiren handler tanımlama
export const defineAuthenticatedHandler = (handler) => {
  return defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session || !session.user) {
      throw createError({
        statusCode: 401,
        message: 'Yetkilendirme gerekli'
      });
    }
    
    event.context = event.context || {};
    event.context.auth = { 
      user: session.user,
      authenticated: true,
      timestamp: Date.now()
    };
    
    return handler(event);
  });
};

// Admin rolü gerektiren handler tanımlama
export const defineAdminHandler = (handler) => {
  return defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session || !session.user) {
      throw createError({
        statusCode: 401,
        message: 'Yetkilendirme gerekli'
      });
    }
    
    if (!hasRole(session.user, 'admin')) {
      throw createError({
        statusCode: 403,
        message: 'Admin yetkisi gerekli'
      });
    }
    
    event.context = event.context || {};
    event.context.auth = { 
      user: session.user,
      authenticated: true,
      timestamp: Date.now()
    };
    
    return handler(event);
  });
};

// Belirli rolleri gerektiren handler tanımlama
export const defineRoleHandler = (allowedRoles, handler) => {
  return defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session || !session.user) {
      throw createError({
        statusCode: 401,
        message: 'Yetkilendirme gerekli'
      });
    }
    
    if (!hasRole(session.user, allowedRoles)) {
      throw createError({
        statusCode: 403,
        message: `Bu işlemi yapmak için yetkiniz yok: ${allowedRoles.join(', ')}` 
      });
    }
    
    event.context = event.context || {};
    event.context.auth = { 
      user: session.user,
      authenticated: true,
      timestamp: Date.now()
    };
    
    return handler(event);
  });
};
