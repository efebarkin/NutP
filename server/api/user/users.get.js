import UserService from '~/server/services/userService.js';

export default defineEventHandler(async (event) => {
    return UserService.getAllUsers();
});