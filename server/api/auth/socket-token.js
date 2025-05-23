import authService from '~/server/services/authService';
import { defineAuthenticatedHandler } from '~/server/utils/auth';

export default defineAuthenticatedHandler(async (event) => {
  return authService.getSocketToken(event);
});
