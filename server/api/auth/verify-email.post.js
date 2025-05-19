import { defineEventHandler } from 'h3';
import emailService from '~/server/services/emailService';
import { verifyCsrfToken } from '~/server/utils/csrf';

export default defineEventHandler(async (event) => {
  verifyCsrfToken(event);
  return emailService.verifyEmail(event);
});
