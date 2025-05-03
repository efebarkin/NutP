import { defineAuthenticatedHandler } from '~/server/utils/auth';
import foodService from '~/server/services/foodService';

export default defineAuthenticatedHandler(async (event) => {
    const id = event.context.params.id;
    return await foodService.getFoodById(id);
})