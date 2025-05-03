import { defineEventHandler } from 'h3';
import authService from '~/server/services/authService';

export default defineEventHandler(async (event) => {
  return authService.getCsrfToken(event);
});
