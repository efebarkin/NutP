import { defineEventHandler, getHeader, setHeaders, getCookie, setCookie } from "h3";
import csrf from "csrf";
import { ErrorTypes } from "../utils/error";

const tokens = new csrf();

function generateToken() {
  return tokens.create(process.env.CSRF_SECRET || 'your-csrf-secret');
}

export default defineEventHandler(async (event) => {
  // Security headers
  setHeaders(event, {
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://accounts.google.com https://*.fontawesome.com https://kit.fontawesome.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.fontawesome.com https://cdnjs.cloudflare.com;
      font-src 'self' https://fonts.gstatic.com https://*.fontawesome.com https://cdnjs.cloudflare.com;
      img-src 'self' data: https:;
      connect-src 'self' https://accounts.google.com https://ka-f.fontawesome.com;
    `.replace(/\s+/g, ' ').trim(),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Download-Options': 'noopen',
    'X-DNS-Prefetch-Control': 'off',
    'X-Permitted-Cross-Domain-Policies': 'none'
  });

  // CSRF koruması
  if (event.node.req.method !== 'GET' && event.node.req.method !== 'HEAD') {
    const token = getCookie(event, 'csrf-token');
    const headerToken = getHeader(event, 'x-csrf-token');

    if (!headerToken) {
      // CSRF token header eksikse, yeni bir token oluştur ve cookie olarak kaydet
      const newToken = generateToken();
      setCookie(event, 'csrf-token', newToken, {
        httpOnly: true,
        sameSite: true
      });
      return; // İlk istekte token oluştur ve devam et
    }

    if (token !== headerToken) {
      throw ErrorTypes.FORBIDDEN('Invalid CSRF token');
    }
  }
});
