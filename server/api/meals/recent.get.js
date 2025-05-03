import MealService from '~/server/services/mealService';
import { defineAuthenticatedHandler } from '~/server/utils/auth';

export default defineAuthenticatedHandler(async (event) => {
  return MealService.getRecentMeals(event);
});
