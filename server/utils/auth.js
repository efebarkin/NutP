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

if (JWT_SECRET === REFRESH_TOKEN_SECRET) {
  console.warn('SECURITY WARNING: JWT_SECRET and REFRESH_TOKEN_SECRET should not be the same!');
}

// Generate both access and refresh tokens with enhanced security
export const generateTokens = (userId, event = null) => {
  let fingerprint = null;
  if (event && event.node && event.node.req) {
    const clientIp = event.node.req.headers['x-forwarded-for'] || 
                     event.node.req.connection.remoteAddress;
    const userAgent = event.node.req.headers['user-agent'];
    fingerprint = `${clientIp}|${userAgent?.substring(0, 50)}`;
  }
  
  const tokenPayload = { 
    userId,
    fingerprint, 
    iat: Math.floor(Date.now() / 1000),
    jti: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  };
  
  const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  
  const refreshTokenPayload = {
    userId,
    jti: tokenPayload.jti 
  };
  const refreshToken = jwt.sign(refreshTokenPayload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

  return { 
    accessToken, 
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY_MS,
    fingerprint 
  };
};

// Clear both auth_token and refresh_token cookies
export const clearAuthCookies = (event) => {
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  deleteCookie(event, 'refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
};

export const verifyAccessToken = async (token, event = null) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded?.userId) {
      return null;
    }

    if (event && decoded.fingerprint) {
      let currentFingerprint = null;
      if (event.node && event.node.req) {
        const clientIp = event.node.req.headers['x-forwarded-for'] || 
                         event.node.req.connection.remoteAddress;
        const userAgent = event.node.req.headers['user-agent'];
        currentFingerprint = `${clientIp}|${userAgent?.substring(0, 50)}`;
      }
      if (decoded.fingerprint !== currentFingerprint) {
        console.warn('Access token fingerprint mismatch.');
        return null;
      }
    }

    const user = await User.findById(decoded.userId).select('-password');
    return user || null;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    if (!decoded?.userId) {
      return null;
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.warn('Refresh token verification failed:', error.message); 
    return null;
  }
};

// Set both access and refresh token cookies
export const setAuthCookies = (event, tokens) => {
  // Get client IP and user agent for additional security
  const clientIp = event.node.req.headers['x-forwarded-for'] || 
                   event.node.req.connection.remoteAddress;
  const userAgent = event.node.req.headers['user-agent'];
  
  // Set access token cookie with stricter settings
  setCookie(event, 'auth_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Daha sıkı SameSite politikası
    maxAge: ACCESS_TOKEN_EXPIRY_MS,
    path: '/' // Tüm sitede geçerli
  });
  
  // Set refresh token cookie with stricter settings
  setCookie(event, 'refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Daha sıkı SameSite politikası
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
    path: '/' // Tüm sitede geçerli
  });
  
  // Kullanıcı oturum bilgilerini sakla (IP ve tarayıcı bilgisi)
  // Bu bilgiler daha sonra token doğrulanırken kontrol edilebilir
  if (event.context && event.context.auth && event.context.auth.user) {
    try {
      // Oturum bilgilerini kullanıcı belgesine ekle
      const userId = event.context.auth.user._id;
      if (userId) {
        // Burada veritabanına oturum bilgilerini kaydedebilirsiniz
        // Örneğin: await User.findByIdAndUpdate(userId, { lastSession: { ip: clientIp, userAgent, timestamp: Date.now() } });
        console.log(`Oturum bilgileri kaydedildi: ${userId}, ${clientIp}, ${userAgent?.substring(0, 50)}`);
      }
    } catch (error) {
      console.error('Oturum bilgileri kaydedilirken hata:', error);
    }
  }
};

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
  console.log('[getServerSession] Entered function.'); // New log
  try {
    const authToken = getCookie(event, 'auth_token');
    console.log('[getServerSession] auth_token from cookie:', authToken ? 'found' : 'NOT_FOUND'); // New log

    if (!authToken) {
      console.log('[getServerSession] Auth token (auth_token) not found. Attempting refresh token check.');
      const refreshToken = getCookie(event, 'refresh_token');
      console.log('[getServerSession] refresh_token from cookie:', refreshToken ? 'found' : 'NOT_FOUND'); // New log
      if (!refreshToken) {
        console.log('[getServerSession] Refresh token (refresh_token) also not found. Returning null.');
        return null;
      }
      
      console.log('[getServerSession] Refresh token found, attempting to verify it.');
      const userFromRefreshToken = await verifyRefreshToken(refreshToken, event); // Pass event for fingerprinting if verifyRefreshToken uses it
      if (!userFromRefreshToken) {
        console.log('[getServerSession] Refresh token is invalid or user not found. Returning null.');
        // Consider clearing refresh_token cookie here if invalid
        // clearCookie(event, 'refresh_token'); 
        return null;
      }
      
      console.log('[getServerSession] Refresh token VALID for user ID:', userFromRefreshToken._id, '. Generating new tokens.');
      const newTokens = generateTokens(userFromRefreshToken._id, event);
      setAuthCookies(event, newTokens);
      
      console.log('[getServerSession] New tokens generated and cookies set. Returning session for user ID:', userFromRefreshToken._id);
      return {
        user: {
          _id: userFromRefreshToken._id,
          email: userFromRefreshToken.email,
          name: userFromRefreshToken.name,
          role: userFromRefreshToken.role,
          // lastLogin: new Date().toISOString() // Sourced from user object if available, or set here
          lastLogin: userFromRefreshToken.lastLogin || new Date().toISOString()
        }
      };
    }

    // Auth token was found, proceed to verify it
    console.log('[getServerSession] Auth token (auth_token) found, verifying it.');
    const { decoded, expired } = verifyToken(authToken); // Assuming verifyToken is synchronous or doesn't need event for fingerprint
    
    if (!decoded) {
      if (expired) {
        console.log('[getServerSession] Auth token (auth_token) is EXPIRED. This state should ideally have been caught by the !authToken block above after a page refresh if refresh token logic is primary for session re-establishment without auth_token.');
        // This path (auth_token found but expired) might indicate that the initial !authToken check for some reason
        // didn't lead to refresh token logic, or this is a mid-session expiry.
        // For consistency, if auth_token is expired, we should rely on refresh token logic as above.
        // To avoid code duplication, could refactor or ensure the initial !authToken block is robust.
        // For now, explicitly calling refresh logic if auth_token is expired:
        const refreshToken = getCookie(event, 'refresh_token');
        console.log('[getServerSession] Auth token expired, refresh_token from cookie:', refreshToken ? 'found' : 'NOT_FOUND');
        if (!refreshToken) {
          console.log('[getServerSession] Auth token expired and Refresh token (refresh_token) also not found. Returning null.');
          return null;
        }
        const userFromRefreshTokenOnExpiry = await verifyRefreshToken(refreshToken, event);
        if (!userFromRefreshTokenOnExpiry) {
          console.log('[getServerSession] Auth token expired and Refresh token is invalid. Returning null.');
          return null;
        }
        console.log('[getServerSession] Auth token expired. Refresh token VALID for user ID:', userFromRefreshTokenOnExpiry._id, '. Generating new tokens.');
        const newTokensOnExpiry = generateTokens(userFromRefreshTokenOnExpiry._id, event);
        setAuthCookies(event, newTokensOnExpiry);
        console.log('[getServerSession] New tokens generated (due to expired auth_token). Returning session for user ID:', userFromRefreshTokenOnExpiry._id);
        return {
          user: {
            _id: userFromRefreshTokenOnExpiry._id,
            email: userFromRefreshTokenOnExpiry.email,
            name: userFromRefreshTokenOnExpiry.name,
            role: userFromRefreshTokenOnExpiry.role,
            lastLogin: userFromRefreshTokenOnExpiry.lastLogin || new Date().toISOString()
          }
        };
      }
      console.log('[getServerSession] Auth token (auth_token) is INVALID (but not expired marker). Returning null.');
      // Consider clearing auth_token cookie if invalid
      // clearCookie(event, 'auth_token'); 
      return null;
    }

    // Auth token is valid and decoded
    console.log('[getServerSession] Auth token (auth_token) is VALID and DECODED for userId:', decoded.userId);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log('[getServerSession] Auth token valid, but user ID', decoded.userId, 'not found in DB. Returning null.');
      return null;
    }
    
    // Fingerprint check (if enabled in token)
    if (decoded.fingerprint) {
      const clientIp = getCookie(event, 'client_ip') || event.node.req.headers['x-forwarded-for'] || event.node.req.socket.remoteAddress;
      const userAgent = event.node.req.headers['user-agent'];
      const currentFingerprint = `${clientIp}|${userAgent?.substring(0, 50)}`; // Ensure consistency with generation
      
      console.log('[getServerSession] Token fingerprint check. Decoded:', decoded.fingerprint, 'Current:', currentFingerprint);
      if (decoded.fingerprint !== currentFingerprint) {
        console.warn('[getServerSession] FINGERPRINT MISMATCH. Potential token theft. Returning null.');
        // Consider aggressive action: clear all auth cookies
        // clearAuthCookies(event);
        return null;
      }
      console.log('[getServerSession] Fingerprint MATCHED.');
    }

    console.log('[getServerSession] Session fully validated with auth_token. User ID:', user._id);
    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLogin: user.lastLogin || new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('[getServerSession] CRITICAL ERROR in getServerSession:', error);
    return null;
  }
};

// Belirli rolleri gerektiren handler tanımlama
export const defineRoleHandler = (allowedRoles, handler) => {
  return defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.user) {
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

// Utility for defining authenticated routes (checks for access token)
export const defineAuthenticatedHandler = (handler) => {
  return defineEventHandler(async (event) => {
    const authToken = getCookie(event, 'auth_token');
    if (!authToken) {
      throw createError({ statusCode: 401, message: 'Access token required (auth_token cookie missing)' });
    }

    try {
      const user = await verifyAccessToken(authToken, event); 
      if (!user) {
        throw createError({ statusCode: 401, message: 'Invalid access token' });
      }
      event.context.auth = { user }; 
      return handler(event);
    } catch (error) {
      // If it's a 401, rethrow it as is (e.g. token expired, client should refresh)
      if (error.statusCode === 401) throw error; 
      // For other errors during verification, log and throw a generic 500
      console.error("Error in authenticated handler's verifyAccessToken call:", error);
      throw createError({ statusCode: 500, message: 'Internal server error during authentication check' });
    }
  });
};
