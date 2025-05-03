import friendshipService from '~/server/services/friendshipService';
import { defineAuthenticatedHandler } from '~/server/utils/auth';

export default defineAuthenticatedHandler(async (event) => {
    return friendshipService.getFriends(event);
});