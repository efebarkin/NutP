import { defineEventHandler, readBody } from 'h3';
import foodService from '~/server/services/foodService';

export default defineEventHandler(async (event) => {
    const foodData = await readBody(event);
    return await foodService.addFood(foodData);
});
