import { defineEventHandler } from 'h3';
import authService from '~/server/services/authService';

// CSRF token'ı kimlik doğrulaması olmadan alınabilmelidir
// Çünkü login işlemi için de CSRF token gereklidir
export default defineEventHandler(async (event) => {
  return await authService.getCsrfToken(event);
});
