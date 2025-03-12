import { defineEventHandler, readBody } from 'h3';
import { User } from '~/server/models/User';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, name } = body;

    // Validasyon
    if (!email || !password || !name) {
      throw createError({
        statusCode: 400,
        message: 'Tüm alanlar gerekli'
      });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz email formatı'
      });
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'Şifre en az 6 karakter olmalı'
      });
    }

    // Email kullanımda mı kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Bu email adresi zaten kullanımda'
      });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    return {
      message: 'Kayıt başarılı',
      user: user.toJSON()
    };
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
});
