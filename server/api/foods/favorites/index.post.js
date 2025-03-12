import { defineEventHandler, readBody, createError } from 'h3';
import { Favorite } from '~/server/models/Favorite';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    // Get token from header
    const authHeader = event.node.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Yetkilendirme gerekli'
      });
    }

    const token = authHeader.split(' ')[1];
    let userId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      userId = decoded.userId;
    } catch (err) {
      throw createError({
        statusCode: 401,
        message: 'Geçersiz veya süresi dolmuş token'
      });
    }

    const { foodId } = await readBody(event);

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Yetkilendirme gerekli'
      });
    }

    const favorite = new Favorite({
      userId,
      foodId
    });

    await favorite.save();

    return {
      success: true,
      message: 'Besin favorilere eklendi'
    };
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      throw createError({
        statusCode: 400,
        message: 'Bu besin zaten favorilerinizde'
      });
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Favori ekleme başarısız'
    });
  }
});
