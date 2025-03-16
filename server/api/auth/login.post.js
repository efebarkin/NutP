import { defineEventHandler, readBody, createError, setCookie } from 'h3';
import bcrypt from 'bcryptjs';
import { User } from '~/server/models/User';
import { generateTokens, setAuthCookies } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    // Wrap the readBody call in a try-catch to handle JSON parsing errors gracefully
    let email, password;
    try {
      const body = await readBody(event);
      email = body.email;
      password = body.password;
    } catch (error) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz istek formatı. Lütfen geçerli bir JSON verisi gönderin.'
      });
    }

    // Validate input
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email ve şifre gerekli'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Geçersiz email veya şifre'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Geçersiz email veya şifre'
      });
    }

    // Generate tokens using the auth utility
    const tokens = generateTokens(user._id);
    
    // Set auth cookies using the utility function
    setAuthCookies(event, tokens);

    // Return user info without sensitive data
    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        token: tokens.accessToken,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Giriş yapılırken bir hata oluştu'
    });
  }
});
