import jwt from 'jsonwebtoken';
import { User } from '~/server/models/User';
import { defineEventHandler, getCookie, setCookie } from 'h3';
import { verifyToken, verifyRefreshToken, generateTokens } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
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

      // Return user data
      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
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
});
