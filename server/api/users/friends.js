import { defineEventHandler } from 'h3';
import friendshipService from '../../services/friendshipService';

export default defineEventHandler(async (event) => {
  try {
    // Get the authenticated user from the request context
    const user = event.context.user;

    if (!user) {
      return {
        statusCode: 401,
        body: { error: 'Unauthorized' },
      };
    }

    // Use your existing friendshipService to get friends
    const friends = await friendshipService.getFriends(user._id); // id yerine _id kullanıyoruz

    return { friends };
  } catch (error) {
    console.error('Error fetching friends:', error);
    return {
      statusCode: 503,
      body: { error: 'Service unavailable', message: error.message },
    };
  }
});
