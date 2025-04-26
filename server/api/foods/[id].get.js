import { defineEventHandler } from 'h3';
import foodService from '~/server/services/foodService';

export default defineEventHandler(async (event) => {
    const id = event.context.params.id;
    return await foodService.getFoodById(id);
})