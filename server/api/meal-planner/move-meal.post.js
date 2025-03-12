import { defineEventHandler, readBody } from 'h3';
import { ErrorTypes } from '~/server/utils/error';
import { Meal } from '~/server/models/meal';

export default defineEventHandler(async (event) => {
  try {
    const { mealId, newDate } = await readBody(event);
    const user = event.context.user;

    if (!user) {
      throw ErrorTypes.UNAUTHORIZED('Kullanıcı bulunamadı');
    }

    if (!mealId || !newDate) {
      throw ErrorTypes.BAD_REQUEST('Öğün ID ve yeni tarih gerekli');
    }

    // Find meal and verify ownership
    const meal = await Meal.findOne({ _id: mealId, userId: user._id });
    if (!meal) {
      throw ErrorTypes.NOT_FOUND('Öğün bulunamadı');
    }

    // Update meal date
    meal.date = new Date(newDate);
    await meal.save();

    return {
      message: 'Öğün başarıyla taşındı',
      meal
    };
  } catch (error) {
    console.error('Move meal error:', error);
    throw error;
  }
});
