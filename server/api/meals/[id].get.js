import { defineEventHandler } from 'h3';
import { Meal } from '~/server/models/Meal';
import { ErrorTypes } from '~/server/utils/error';
import { getServerSession } from '~/server/utils/auth';

const handler = async (event) => {
  try {
    const session = await getServerSession(event);
    const user = session.user;
    const mealId = event.context.params.id;

    // Find meal
    const meal = await Meal.findOne({
      _id: mealId,
      userId: user._id
    }).populate('foods.food');

    if (!meal) {
      throw createError({
        statusCode: 404,
        message: 'Öğün bulunamadı'
      });
    }

    return { meal };
  } catch (error) {
    console.error('Get meal error:', error);
    throw error;
  }
};

export default defineEventHandler(handler);
