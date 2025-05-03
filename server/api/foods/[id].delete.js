import { defineRoleHandler } from '~/server/utils/auth';
import foodService from '~/server/services/foodService';

export default defineRoleHandler(['admin'], async (event) => {
    return foodService.deleteFood(event);
});