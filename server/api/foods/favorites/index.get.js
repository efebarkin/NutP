import { defineEventHandler, createError } from 'h3';
import { Favorite } from '~/server/models/Favorite';
import { Food } from '~/server/models/Food';

export default defineEventHandler(async (event) => {
  try {
    const { userId } = event.context.auth;

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Yetkilendirme gerekli'
      });
    }

    const favorites = await Favorite.find({ userId })
      .populate({
        path: 'foodId',
        model: Food,
        select: 'name calories protein fat carbs fiber'
      })
      .sort({ createdAt: -1 });

    return {
      favorites: favorites.map(fav => ({
        id: fav._id,
        food: fav.foodId
      }))
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Favorileri getirme başarısız'
    });
  }
});
