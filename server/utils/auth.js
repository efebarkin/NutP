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

// Generate both access and refresh tokens with enhanced security
export const generateTokens = (userId, event = null) => {
  // Kullanıcı parmak izi oluştur (IP ve tarayıcı bilgileri)
  let fingerprint = null;
  
  if (event && event.node && event.node.req) {
    const clientIp = event.node.req.headers['x-forwarded-for'] || 
                     event.node.req.connection.remoteAddress;
    const userAgent = event.node.req.headers['user-agent'];
    
    // Basit bir parmak izi oluştur
    fingerprint = `${clientIp}|${userAgent?.substring(0, 50)}`;
  }
  
  // Token içeriğine ek güvenlik bilgileri ekle
  const tokenPayload = { 
    userId,
    fingerprint,
    iat: Math.floor(Date.now() / 1000), // Token oluşturma zamanı
    jti: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) // Benzersiz token ID'si
  };
  
  // Tanımlanmış sabitleri kullan
  const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ userId, jti: tokenPayload.jti }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  
  return { 
    accessToken, 
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY_MS, // Tanımlanmış sabiti kullan
    fingerprint // Parmak izi bilgisini döndür (debug için)
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
    // Access token'i al
    const token = getCookie(event, 'auth_token');
    if (!token) {
      console.log('Auth token bulunamadı');
      return null;
    }

    // Token'i doğrula
    const { decoded, expired } = verifyToken(token);
    
    // Token geçerli değilse
    if (!decoded) {
      // Token süresi dolmuşsa ve refresh token varsa
      if (expired) {
        console.log('Access token süresi dolmuş, refresh token kontrol ediliyor');
        const refreshToken = getCookie(event, 'refresh_token');
        if (!refreshToken) {
          console.log('Refresh token bulunamadı');
          return null;
        }
        
        // Refresh token doğrulama
        const user = await verifyRefreshToken(refreshToken);
        if (!user) {
          console.log('Refresh token geçersiz');
          return null;
        }
        
        // Yeni tokenlar oluştur - event parametresini geçerek parmak izi oluştur
        const newTokens = generateTokens(user._id, event);
        setAuthCookies(event, newTokens);
        
        console.log('Yeni token oluşturuldu, kullanıcı ID:', user._id);
        return {
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            lastLogin: new Date().toISOString()
          }
        };
      }
      console.log('Token geçersiz ve süresi dolmamış');
      return null;
    }

    // Kullanıcıyı veritabanından bul
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log('Token geçerli fakat kullanıcı bulunamadı');
      return null;
    }
    
    // // Kullanıcı aktif mi kontrol et
    // if (user.isActive === false) {
    //   console.log('Kullanıcı devre dışı bırakılmış');
    //   return null;
    // }
    
    // Güvenlik kontrolü: Token'da ek bilgiler varsa kontrol et
    if (decoded.fingerprint) {
      const clientIp = event.node.req.headers['x-forwarded-for'] || 
                       event.node.req.connection.remoteAddress;
      const userAgent = event.node.req.headers['user-agent'];
      
      // Basit bir parmak izi kontrolü
      const currentFingerprint = `${clientIp}|${userAgent?.substring(0, 50)}`;
      if (decoded.fingerprint !== currentFingerprint) {
        console.log('Token parmak izi eşleşmiyor, potansiyel token çalma girişimi');
        // Burada güvenlik ihlali kaydı tutabilirsiniz
        return null;
      }
    }

    console.log('Oturum doğrulandı, kullanıcı ID:', user._id);
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
