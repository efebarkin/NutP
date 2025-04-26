import { defineEventHandler, readBody, createError, setCookie } from 'h3';
import bcrypt from 'bcryptjs';
import { User } from '~/server/models/User';
import { generateTokens, setAuthCookies } from '~/server/utils/auth';
import { loginSchema } from '~/server/validations/userValidation';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    //Zod validation
    const result = loginSchema.safeParse(body);

    //Validation error
    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: 'Validation error'
      });
    }
    //Validation successful
    const { email, password } = result.data;

    //Find user and select password
    const user = await User.findOne({ email }).select('+password');
    //User control
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Geçersiz email veya şifre'
      });
    }

    //Password verification
    const isMatch = await bcrypt.compare(password, user.password);
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
