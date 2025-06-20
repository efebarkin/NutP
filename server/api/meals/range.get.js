import { defineAuthenticatedHandler } from '~/server/utils/auth';
import mealService from '~/server/services/mealService';

/**
 * API endpoint to get meal entries by date range for calendar view
 * GET /api/meals/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export default defineAuthenticatedHandler(async (event) => {
  return mealService.getMealEntriesByDateRange(event);
});
