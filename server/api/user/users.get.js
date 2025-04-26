import UserService from '~/server/services/userService.js';

export default defineEventHandler(async (event) => {
    const users = await UserService.getAllUsers();
    return {users};
});