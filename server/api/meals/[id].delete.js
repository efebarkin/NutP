import { defineEventHandler } from 'h3';
import { Meal } from '~/server/models/Meal';
import { ErrorTypes } from '~/server/utils/error';
import { getServerSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    const user = session.user;
    const mealId = event.context.params.id;

    // Find and delete meal
    const meal = await Meal.findOneAndDelete({
      _id: mealId,
      userId: user.id
    });

    if (!meal) {
      throw createError({
        statusCode: 404,
        message: ErrorTypes.MEAL_NOT_FOUND
      });
    }

    return {
      success: true,
      message: 'Öğün başarıyla silindi'
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || ErrorTypes.INTERNAL_SERVER_ERROR
    });
  }
});
