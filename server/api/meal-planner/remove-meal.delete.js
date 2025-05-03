import { readBody } from 'h3';
import { Meal } from '~/server/models/Meal';
import { withErrorHandling, createBadRequestError, createMealNotFoundError } from '~/server/utils/apiUtils';
import { defineAuthenticatedHandler } from '~/server/utils/auth';

export default defineAuthenticatedHandler(withErrorHandling(async (event) => {
  const { user } = event.context.auth;
  const { mealId } = await readBody(event);
  
  if (!mealId) {
    throw createBadRequestError('Öğün ID gerekli');
  }

  // Find and verify meal ownership
  const meal = await Meal.findOne({
    _id: mealId,
    userId: user._id
  });

  if (!meal) {
    throw createMealNotFoundError();
  }

  // Delete meal
  await meal.deleteOne();

  return {
    success: true,
    message: 'Öğün başarıyla silindi'
  };
}));
