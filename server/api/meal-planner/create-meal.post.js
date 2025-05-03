import { readBody } from 'h3';
import { Meal } from '~/server/models/Meal';
import { withErrorHandling, createBadRequestError } from '~/server/utils/apiUtils';
import { defineAuthenticatedHandler } from '~/server/utils/auth';

export default defineAuthenticatedHandler(withErrorHandling(async (event) => {
  const { user } = event.context.auth;
  const { name, foods, totalNutrients, notes } = await readBody(event);
  
  if (!name || !foods || !Array.isArray(foods) || foods.length === 0) {
    throw createBadRequestError('Geçersiz öğün bilgisi');
  }

  // Create new meal
  const newMeal = new Meal({
    userId: user._id,
    name,
    foods: foods.map(item => ({
      food: item.food,
      portion: item.portion
    })),
    totalNutrients,
    notes,
    createdAt: new Date()
  });

  await newMeal.save();
  await newMeal.populate('foods.food');

  return {
    success: true,
    message: 'Öğün başarıyla oluşturuldu',
    meal: newMeal
  };
}));
