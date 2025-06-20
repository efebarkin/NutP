import { defineAuthenticatedHandler } from '~/server/utils/auth';
import mealService from '~/server/services/mealService';

/**
 * API endpoint to get daily meal entries
 * GET /api/meals/daily?date=YYYY-MM-DD
 */
export default defineAuthenticatedHandler(async (event) => {
  return mealService.getDailyMealEntries(event);
});
