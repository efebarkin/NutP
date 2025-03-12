import { defineEventHandler, getQuery } from 'h3';
import userService from '../../services/userService';

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

    // Get query parameters
    const query = getQuery(event);
    const searchQuery = query.q;
    const limit = parseInt(query.limit) || 10;

    if (!searchQuery || searchQuery.length < 2) {
      return {
        statusCode: 400,
        body: { error: 'Search query must be at least 2 characters' },
      };
    }

    // Use userService to search users
    const users = await userService.searchUsers(searchQuery, limit, user.id);

    return { users };
  } catch (error) {
    console.error('Error searching users:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error', message: error.message },
    };
  }
});
