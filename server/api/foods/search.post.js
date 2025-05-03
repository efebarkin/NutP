import { defineAuthenticatedHandler } from '~/server/utils/auth';
import foodService from '~/server/services/foodService';

export default defineAuthenticatedHandler(async (event) => {
  return foodService.searchFoodsPost(event);
});
