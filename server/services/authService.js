import { generateTokens, setAuthCookies, getServerSession, verifyRefreshToken, clearAuthCookies, verifyToken } from '../utils/auth';
import { verifyCsrfToken, csrfCookieOptions, csrfCookieClearOptions, CSRF_COOKIE_NAME } from '~/server/utils/csrf';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { loginSchema, registerSchema} from '../validations/userValidation';
import { createError, setCookie, getCookie, readBody } from 'h3';


class AuthService {

    async login(event) {
        try{

            const body = await readBody(event);
            //Validation
            const result = loginSchema.safeParse(body);
            //Validation error
            if (!result.success) {
                throw createError({
                    statusCode: 400,
                    message: 'Validation error'
                });
            }
            //Validation success
            const { email, password } = result.data;
     
            //User check
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                throw createError({
                    statusCode: 401,
                    message: 'Geçersiz email veya şifre'
                });
            }
     
            //Password verification - User modelindeki verifyPassword metodunu kullan
            const isMatch = await user.verifyPassword(password);
            if (!isMatch) {
                throw createError({
                    statusCode: 401,
                    message: 'Geçersiz email veya şifre'
                });
            }

            //Generate tokens
            const tokens = generateTokens(user._id);

            //Set auth cookies
            setAuthCookies(event, tokens);
                
            //Return user info
            return {
                success: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role, // Add role to the response
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            };
        }catch(error){
            throw createError({
                statusCode: error.statusCode || 500,
                message: error.message || 'Giriş yapılırken bir hata oluştu'
            });
        }
      
    }

    async logout(event){
        try {
            // CSRF token doğrulaması yap
            verifyCsrfToken(event);
            
            // Kullanıcının oturum durumunu kontrol et
            const session = await getServerSession(event);
            if (!session || !session.user) {
              // Zaten oturum açık değilse 401 dön
              throw createError({
                statusCode: 401,
                message: 'Oturum açık değil'
              });
            }
            // Cookie'leri geçmiş bir tarihle expire et
            const cookieOptions = {
              secure: process.env.NODE_ENV === 'production',
              expires: new Date(0), // 1970'e set et
              maxAge: 0,
              path: '/'
              // Domain belirtilmediğinde, mevcut domain kullanılır
            };
        
            // Auth token'ı sil
            setCookie(event, 'auth_token', '', {
              ...cookieOptions,
              httpOnly: true,
              sameSite: 'lax'
            });
            
            // Refresh token'ı sil
            setCookie(event, 'refresh_token', '', {
              ...cookieOptions,
              httpOnly: true,
              sameSite: 'lax'
            });
        
            // CSRF token'ı sil
            setCookie(event, CSRF_COOKIE_NAME, '', csrfCookieClearOptions);
        
            // Kullanıcı bilgilerini temizle ve yanıt dön
            return {
              success: true,
              message: 'Başarıyla çıkış yapıldı'
            };
          } catch (error) {
            // Sadece beklenmeyen hataları logla
            if (!error.statusCode || error.statusCode === 500) {
              console.error('Logout error:', error);
            }
            
            throw createError({
              statusCode: error.statusCode || 500,
              message: error.message || 'Çıkış yapılırken bir hata oluştu'
            });
          }
    }

    async register(event){
        try {
            const body = await readBody(event);
            // Zod validasyonu
            const result = registerSchema.safeParse(body);
            if (!result.success) {
              // Hata detaylarını dön
              throw createError({
                statusCode: 400,
                message: 'Validasyon hatası',
                data: result.error.format()
              });
            }
            const { email, password, name, passwordConfirm } = result.data;
        
            // Yeni kullanıcı oluştur
            const user = await User.create({
              name,
              email,
              password,
              passwordConfirm
            });
        
            // Kullanıcı için token oluştur
            const tokens = generateTokens(user._id);
            
            // Token'ları cookie'ye kaydet
            setAuthCookies(event, tokens);
        
            // Kullanıcı bilgilerini ve token'ı döndür (otomatik giriş için)
            return {
              success: true,
              message: 'Kayıt başarılı',
              user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                token: tokens.accessToken,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              }
            };
        
          } catch (error) {
            // Mongoose validasyon hatalarını daha anlamlı hata mesajlarına dönüştür
            if (error.name === 'ValidationError') {
              const validationErrors = Object.values(error.errors).map(err => err.message);
              throw createError({
                statusCode: 400,
                message: validationErrors.join(', ')
              });
            }
            
            // MongoDB duplicate key hatası (email unique kontrolü)
            if (error.code === 11000) {
              throw createError({
                statusCode: 409,
                message: 'Bu email adresi zaten kullanımda'
              });
            }
        
            console.error('Register error:', error);
            throw createError({
              statusCode: 500,
              message: 'Kayıt işlemi sırasında bir hata oluştu'
            });
          }
    }
    
    async refreshToken(event){
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
                role: user.role, // Add role to the response
                token: tokens.accessToken
              }
            };
          } catch (error) {
            clearAuthCookies(event);
            throw createError({
              statusCode: error.statusCode || 401,
              message: error.message || 'Token refresh failed'
            });
          }
    }

    async updatePassword(event){
        try {
            // 1) URL'den kullanıcı ID'sini ve body'den şifre bilgilerini al
            const { currentPassword, newPassword, passwordConfirm } = await readBody(event);
            
            // Giriş yapmış kullanıcının bilgilerini al
            const authUser = event.context.auth.user;
            
            // Kullanıcının kendi şifresini değiştirdiğinden emin ol
            if (authUser._id.toString() !== authUser._id && !authUser.role.includes('admin')) {
              throw createError({
                statusCode: 403,
                message: 'Başka bir kullanıcının şifresini değiştirme yetkiniz yok'
              });
            }
            
            // 2) Kullanıcıyı bul (password alanını da dahil et)
            const user = await User.findById(authUser._id).select('+password');
                if (!user) {
                  throw createError({
                    statusCode: 404,
                    message: 'Kullanıcı bulunamadı'
                  });
                }
                
            // 3) Mevcut şifre doğru mu kontrol et
            if (!(await user.verifyPassword(currentPassword))) {
              throw createError({
                statusCode: 401,
                message: 'Mevcut şifre yanlış'
              });
            }
            
            // 4) Yeni şifre ve onay şifresi eşleşiyor mu kontrol et
            if (newPassword !== passwordConfirm) {
              throw createError({
                statusCode: 400,
                message: 'Yeni şifre ve onay şifresi eşleşmiyor'
              });
            }
            
            // 5) Şifre güncelleme
            user.password = newPassword;
            user.passwordConfirm = passwordConfirm;
            await user.save();
            
            // 6) Kullanıcıya başarılı yanıt dön
            return {
              success: true,
              message: 'Şifre başarıyla güncellendi'
            };
          } catch (error) {
            console.error('Şifre güncelleme hatası:', error);
            throw createError({
              statusCode: error.statusCode || 500,
              message: error.message || 'Şifre güncellenirken bir hata oluştu'
            });
          }
    }

    async session(event){
        try {
            // Get token from cookie
            const token = getCookie(event, 'auth_token');
            if (!token) {
              return null;
            }
        
            try {
              // Verify and check if token needs refresh
              const { userId, needsRefresh } = await verifyToken(token);
              
              // Get user from database
              const user = await User.findById(userId).select('-password');
              if (!user) {
                return null;
              }
        
              // Token yenileme gerekiyorsa
              if (needsRefresh) {
                const refreshToken = getCookie(event, 'refresh_token');
                if (refreshToken) {
                  try {
                    // Refresh token doğrulama
                    await verifyRefreshToken(refreshToken);
                    
                    // Yeni tokenlar oluştur
                    const { accessToken, refreshToken: newRefreshToken, expiresIn } = generateTokens(userId);
                    
                    // Cookie'leri güncelle
                    setCookie(event, 'auth_token', accessToken, {
                      httpOnly: true,
                      secure: process.env.NODE_ENV === 'production',
                      sameSite: 'lax',
                      maxAge: expiresIn
                    });
                    
                    setCookie(event, 'refresh_token', newRefreshToken, {
                      httpOnly: true,
                      secure: process.env.NODE_ENV === 'production',
                      sameSite: 'lax',
                      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
                    });
                  } catch (refreshError) {
                    console.error('Token refresh error:', refreshError);
                    // Refresh hatası durumunda sessiz kal
                  }
                }
              }
        
              // Return user data with role
              return {
                user: {
                  id: user._id,
                  email: user.email,
                  name: user.name,
                  role: user.role, // Rol bilgisini ekle
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt
                },
                needsRefresh
              };
            } catch (tokenError) {
              // Access token geçersiz, refresh token ile dene
              const refreshToken = getCookie(event, 'refresh_token');
              if (!refreshToken) {
                return null;
              }
        
              try {
                const userId = await verifyRefreshToken(refreshToken);
                const user = await User.findById(userId).select('-password');
                
                if (!user) {
                  return null;
                }
        
                // Yeni tokenlar oluştur
                const { accessToken, refreshToken: newRefreshToken, expiresIn } = generateTokens(userId);
                
                // Cookie'leri güncelle
                setCookie(event, 'auth_token', accessToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  maxAge: expiresIn
                });
                
                setCookie(event, 'refresh_token', newRefreshToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
                });
        
                return {
                  user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role, // Rol bilgisini ekle
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                  },
                  needsRefresh: false
                };
              } catch (refreshError) {
                console.error('Session refresh error:', refreshError);
                return null;
              }
            }
          } catch (error) {
            console.error('Session error:', error);
            return null;
          }
    }

    async getCsrfToken(event){
        try {
            // Mevcut Token'ı Çerezden Oku
            let token = getCookie(event, CSRF_COOKIE_NAME);
        
            // Token yoksa veya her istekte yenilemek istiyorsak yeni token oluştur
            // Her istekte yenilemek daha güvenlidir
            if (!token) {
              token = generateCsrfToken();
              setCookie(event, CSRF_COOKIE_NAME, token, csrfCookieOptions);
            }
        
            // Token'ı İstemciye Gönder
            // İstemci bu token'ı alıp sonraki state değiştiren (POST, PUT, DELETE)
            // isteklerinde X-CSRF-Token başlığı ile geri göndermelidir
            return {
              csrfToken: token,
              expiresIn: csrfCookieOptions.maxAge
            };
        
          } catch (error) {
            console.error('CSRF token oluşturma/alma hatası:', error);
            // Hata durumunda istemciye genel bir hata dönelim
            throw createError({
              statusCode: 500,
              statusMessage: 'Internal Server Error',
              message: 'CSRF token işlemi sırasında bir hata oluştu.',
            });
          }
    }

    async getSocketToken(event){
        try {
            // Oturum açmış kullanıcıyı al - defineAuthenticatedHandler ile çağrıldığı için
            // event.context.auth.user içinde kullanıcı bilgisi olmalı
            const user = event.context.auth?.user;
            
            if (!user || !user._id) {
              throw createError({
                statusCode: 401,
                message: 'Unauthorized - User not authenticated'
              });
            }
        
            // Create a JWT token for socket authentication
            const token = jwt.sign(
              { userId: user._id || user.id }, // Hem _id hem de id desteği
              process.env.JWT_SECRET,
              { expiresIn: '1h' },
            );
        
            return { token };
          } catch (error) {
            console.error('Error generating socket token:', error);
            throw createError({
              statusCode: 500,
              message: 'Error generating socket token'
            });
          }
    }
}

const authService = new AuthService();

export default authService;