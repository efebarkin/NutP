import authServiceInstance from '~/server/services/authService';
import { verifyCsrfToken } from '~/server/utils/csrf';
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    verifyCsrfToken(event);
    const result = await authServiceInstance.refreshToken(event);
    return result;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({ statusCode: 500, message: 'An unexpected error occurred during token refresh processing.' });
  }
});
