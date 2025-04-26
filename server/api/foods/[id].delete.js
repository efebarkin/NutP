import { defineRoleHandler } from '~/server/middleware/auth';
import foodService from '~/server/services/foodService';

export default defineRoleHandler(['admin'], async (event) => {
    const id = event.context.params.id;
    await foodService.deleteFood(id);
    return { success: true };
  });