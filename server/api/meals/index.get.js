import { defineAuthenticatedHandler } from '~/server/utils/auth';
import MealService from '~/server/services/mealService';

export default defineAuthenticatedHandler(async (event) => {
  return MealService.getUserMeals(event);
});
