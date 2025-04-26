import { defineEventHandler, readBody } from 'h3';
import { User } from '~/server/models/User';
import { createError } from 'h3';
import { registerSchema } from '~/server/validations/userValidation';

export default defineEventHandler(async (event) => {
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
      email,
      password,
      name,
      passwordConfirm
    });

    return {
      message: 'Kayıt başarılı',
      user: user.toJSON(),
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
});
