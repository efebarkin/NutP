import { defineEventHandler, readBody } from 'h3';
import { Meal } from '~/server/models/Meal';
import Food from '~/server/models/Food';
import { ErrorTypes } from '~/server/utils/error';
import { getServerSession } from '~/server/utils/auth';

const handler = async (event) => {
  try {
    const session = await getServerSession(event);
    const user = session.user;
    const mealId = event.context.params.id;
    const updateData = await readBody(event);

    // Find and update meal
    const meal = await Meal.findOneAndUpdate(
      {
        _id: mealId,
        userId: user._id
      },
      { $set: updateData },
      { new: true }
    ).populate('foods.food');

    if (!meal) {
      throw createError({
        statusCode: 404,
        message: 'Öğün bulunamadı'
      });
    }

    return { meal };
  } catch (error) {
    console.error('Update meal error:', error);
    throw error;
  }
};

export default defineEventHandler(handler);
