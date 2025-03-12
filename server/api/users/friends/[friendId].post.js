import { defineEventHandler } from 'h3';
import friendshipService from '../../../services/friendshipService';

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

    // Get the friend ID from the URL
    const friendId = event.context.params.friendId;

    if (!friendId) {
      return {
        statusCode: 400,
        body: { error: 'Friend ID is required' },
      };
    }

    // Use your existing friendshipService to send a friend request
    const friendship = await friendshipService.sendFriendRequest(
      user.id,
      friendId,
    );

    return {
      success: true,
      message: 'Arkadaşlık isteği gönderildi',
      friendship,
    };
  } catch (error) {
    console.error('Error sending friend request:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error', message: error.message },
    };
  }
});
