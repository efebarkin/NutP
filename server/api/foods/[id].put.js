import { defineRoleHandler } from '~/server/utils/auth';
import foodService from '~/server/services/foodService';

export default defineRoleHandler(['admin', 'nutritionist'], async (event) => {
    return foodService.updateFood(event);
})
