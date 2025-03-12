import { defineEventHandler, createError } from 'h3';
import { Meal } from '~/server/models/Meal';
import { defineAuthenticatedHandler } from '~/server/middleware/auth';

export default defineAuthenticatedHandler(async (event) => {
  try {
    // Find meals and populate food details
    const meals = await Meal.find({ userId: event.context.auth.user._id })
      .populate({
        path: 'foods.foodId',
        model: 'Food',
        select: 'name nutrients category portionSize servingSize image'
      })
      .sort({ date: -1 });

    return { meals };
  } catch (error) {
    console.error('Get meals error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Öğünler getirilirken bir hata oluştu'
    });
  }
});
