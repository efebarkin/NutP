/**
 * HTTP güvenlik başlıklarını uygulayan middleware
 * Bu middleware, güvenlik başlıklarını tüm HTTP yanıtlarına ekler
 */
import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  // Content-Security-Policy (CSP) - XSS saldırılarına karşı koruma
  event.node.res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://kit.fontawesome.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
    "img-src 'self' data: blob: https: http:; " +
    "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://ka-f.fontawesome.com; " +
    "connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.google.com https://ka-f.fontawesome.com;"
  );

  // X-Content-Type-Options - MIME sniffing'e karşı koruma
  event.node.res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options - Clickjacking saldırılarına karşı koruma
  event.node.res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // X-XSS-Protection - XSS saldırılarına karşı ek koruma (modern tarayıcılarda CSP ile değiştirilmiştir)
  event.node.res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict-Transport-Security (HSTS) - HTTPS kullanımını zorunlu kılar
  event.node.res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Referrer-Policy - Referrer bilgisinin ne kadar paylaşılacağını kontrol eder
  event.node.res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy (Feature-Policy'nin yerini almıştır) - Tarayıcı özelliklerini kısıtlar
  event.node.res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  );

  // Cache-Control - Tarayıcı önbelleğini kontrol eder
  event.node.res.setHeader('Cache-Control', 'no-store, max-age=0');
});
