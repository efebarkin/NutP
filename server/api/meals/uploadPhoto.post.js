import { defineAuthenticatedHandler } from '~/server/utils/auth';
import mealPhotoService from '~/server/services/mealPhotoService';

export default defineAuthenticatedHandler(async (event) => {
  return mealPhotoService.uploadMealPhoto(event);
});
