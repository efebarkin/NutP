import { defineEventHandler, getQuery } from 'h3';
import conversationService from '../../services/conversationService';

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
    const limit = parseInt(query.limit) || 10;
    const skip = parseInt(query.skip) || 0;

    // Use your existing conversationService to get conversations
    const conversations = await conversationService.getUserConversations(
      user._id, // id yerine _id kullanıyoruz
    );

    // Apply limit and skip
    const limitedConversations = conversations.slice(skip, skip + limit);

    return limitedConversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error', message: error.message },
    };
  }
});
