import UserService from '~/server/services/userService.js';
import { defineRoleHandler } from '~/server/utils/auth';

export default defineRoleHandler(['admin'], async (event) => {
    return UserService.deleteUser(event);
});