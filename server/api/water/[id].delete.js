import { defineAuthenticatedHandler } from '~/server/utils/auth';
import waterService from '~/server/services/waterService';

export default defineAuthenticatedHandler(async (event) => {
  return waterService.deleteWaterEntry(event);
});
