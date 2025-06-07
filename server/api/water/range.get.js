import { defineAuthenticatedHandler } from '~/server/utils/auth';
import waterService from '~/server/services/waterService';

/**
 * API endpoint to get water entries by date range for calendar view
 * GET /api/water/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export default defineAuthenticatedHandler(async (event) => {
  return waterService.getWaterEntriesByDateRange(event);
});
