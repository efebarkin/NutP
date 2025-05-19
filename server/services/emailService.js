import { readBody, createError } from 'h3';
import User from '~/server/models/User';
import { generateTokens, setAuthCookies } from '~/server/utils/auth';
import emailUtils from '~/server/utils/email';

class EmailService {
    async verifyEmail(event) {
        try {
            const { userId, code } = await readBody(event);
        
            if (!userId || !code) {
              throw createError({
                statusCode: 400,
                message: 'Kullanıcı ID ve doğrulama kodu gereklidir'
              });
            }
        
            // Find user with verification code
            const user = await User.findById(userId).select('+verificationCode +verificationCodeExpires');
            
            if (!user) {
              throw createError({
                statusCode: 404,
                message: 'Kullanıcı bulunamadı'
              });
            }
        
            // Check if verification code is valid and not expired
            if (!user.verificationCode || user.verificationCode !== code) {
              throw createError({
                statusCode: 400,
                message: 'Geçersiz doğrulama kodu'
              });
            }
        
            if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
              throw createError({
                statusCode: 400,
                message: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni bir kod talep edin.'
              });
            }
        
            console.log('Verification code is valid. Marking user as verified.');
            user.isVerified = true;
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            await user.save({ validateModifiedOnly: true });
        
            const rememberMe = true;
            // Generate tokens and set cookies for auto-login
            const tokens = generateTokens(user._id, event, rememberMe);
            console.log('Tokens generated:', tokens);
            
            // Store refresh token in the database
            user.refreshToken = tokens.refreshToken;
            await user.save({ validateModifiedOnly: true });
            console.log('Refresh token saved to the database.');
        
            // Set auth cookies with SameSite=None for cross-origin requests
            setAuthCookies(event, tokens, rememberMe);
            
            // Log success for debugging
            console.log('Auth cookies set successfully');
        
            // Return user info
            return {
              success: true,
              message: 'Email doğrulama başarılı',
              user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              }
            };
        } catch (error) {
            console.error('Email verification error:', error);
            throw createError({
              statusCode: error.statusCode || 500,
              message: error.message || 'Email doğrulama sırasında bir hata oluştu'
            });
        }
    }

    async resendVerificationEmail(event) {
        try {
            const { email } = await readBody(event);
        
            if (!email) {
              throw createError({
                statusCode: 400,
                message: 'Email adresi gereklidir'
              });
            }
        
            // Find user by email
            const user = await User.findOne({ email });
            
            if (!user) {
              throw createError({
                statusCode: 404,
                message: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'
              });
            }
        
            // If user is already verified
            if (user.isVerified) {
              throw createError({
                statusCode: 400,
                message: 'Bu hesap zaten doğrulanmış'
              });
            }
        
            // Generate new verification code
            const verificationCode = emailUtils.generateVerificationCode();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
            // Update user with new verification code
            user.verificationCode = verificationCode;
            user.verificationCodeExpires = verificationCodeExpires;
            await user.save({ validateModifiedOnly: true });
        
            // Send verification code via email
            await emailUtils.sendVerificationCode(email, verificationCode);
        
            return {
              success: true,
              message: 'Doğrulama kodu tekrar gönderildi',
              userId: user._id,
              email: user.email
            };
          } catch (error) {
            console.error('Resend verification error:', error);
            throw createError({
              statusCode: error.statusCode || 500,
              message: error.message || 'Doğrulama kodu gönderilirken bir hata oluştu'
            });
          }
    }
}

const emailService = new EmailService();

export default emailService;