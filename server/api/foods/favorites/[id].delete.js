import { defineEventHandler, createError } from 'h3';
import { Favorite } from '~/server/models/Favorite';

export default defineEventHandler(async (event) => {
  try {
    const { userId } = event.context.auth;
    const favoriteId = event.context.params.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Yetkilendirme gerekli'
      });
    }

    const favorite = await Favorite.findOneAndDelete({
      _id: favoriteId,
      userId
    });

    if (!favorite) {
      throw createError({
        statusCode: 404,
        message: 'Favori bulunamadı'
      });
    }

    return {
      success: true,
      message: 'Favori silindi'
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Favori silme başarısız'
    });
  }
});
