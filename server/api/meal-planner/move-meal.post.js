import { readBody } from 'h3';
import { Meal } from '~/server/models/Meal';
import { withErrorHandling, createBadRequestError, createMealNotFoundError } from '~/server/utils/apiUtils';
import { defineAuthenticatedHandler } from '~/server/utils/auth';

export default defineAuthenticatedHandler(withErrorHandling(async (event) => {
  const { mealId, newDate } = await readBody(event);
  const { user } = event.context.auth;

  if (!mealId || !newDate) {
    throw createBadRequestError('Öğün ID ve yeni tarih gerekli');
  }

  // Find meal and verify ownership
  const meal = await Meal.findOne({ _id: mealId, userId: user._id });
  if (!meal) {
    throw createMealNotFoundError();
  }

  // Update meal date
  meal.date = new Date(newDate);
  await meal.save();

  return {
    success: true,
    message: 'Öğün başarıyla taşındı',
    meal
  };
}));
