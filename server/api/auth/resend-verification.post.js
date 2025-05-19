import { defineEventHandler } from 'h3';
import emailService from '~/server/services/emaiService';

export default defineEventHandler(async (event) => {
  return emailService.resendVerificationEmail(event);
});
