import { defineRoleHandler } from '~/server/utils/auth';
import foodService from '~/server/services/foodService';

export default defineRoleHandler(['admin', 'nutritionist'], async (event) => {
    const id = event.context.params.id;
    return await foodService.updateFood(id, event);
})
