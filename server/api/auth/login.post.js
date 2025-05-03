import { defineEventHandler } from 'h3';
import authService from '~/server/services/authService';
import { verifyCsrfToken } from '~/server/utils/csrf';

export default defineEventHandler(async (event) => {
  verifyCsrfToken(event);
  return await authService.login(event);
});
