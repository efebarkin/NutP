import { defineEventHandler } from 'h3';
import foodService from '~/server/services/foodService';

export default defineEventHandler(async (event) => {
  return foodService.getFoods(event);
});
