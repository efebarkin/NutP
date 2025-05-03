// server/api/friendship/sent-requests.get.js
import friendshipService from '~/server/services/friendshipService';
import { defineAuthenticatedHandler } from '~/server/utils/auth';

export default defineAuthenticatedHandler(async (event) => {
  return friendshipService.getSentFriendRequests(event);  
});
