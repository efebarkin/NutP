import UserService from '~/server/services/userService.js';

export default defineEventHandler(async (event) => {
    const { userId } = event.context.params;
    const user = await UserService.deleteUser(userId);
    return { user };
});