import authService from '~/server/services/authService';
import { verifyCsrfToken } from '~/server/utils/csrf';
import { defineAuthenticatedHandler } from '~/server/utils/auth';

export default defineAuthenticatedHandler(async (event) => {
  verifyCsrfToken(event);
  return await authService.refreshToken(event);
});
