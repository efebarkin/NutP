import jwt from 'jsonwebtoken';
import { defineEventHandler, readBody, getCookie } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Get user from session or cookie
    let user = event.context.user;

    // If no user in context, try to get from cookie or localStorage
    if (!user) {
      // Try to get user ID from request
      const body = await readBody(event).catch(() => ({}));
      const userId = body.userId;

      if (userId) {
        // Create a token with just the user ID
        const token = jwt.sign(
          { userId },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '1h' },
        );

        return { token };
      }

      return {
        statusCode: 401,
        body: { error: 'Unauthorized' },
      };
    }

    // Create a JWT token for socket authentication
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' },
    );

    return { token };
  } catch (error) {
    console.error('Error generating socket token:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }
});
