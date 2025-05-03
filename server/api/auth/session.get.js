import { defineEventHandler } from 'h3';
import authService from '~/server/services/authService';

// Session endpoint'i oturum durumunu kontrol etmek için kullanılır
// Bu nedenle kimlik doğrulaması olmadan erişilebilir olmalıdır
export default defineEventHandler(async (event) => {
  return await authService.session(event);
});
