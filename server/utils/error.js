// HTTP error kodları için yardımcı fonksiyonlar
import { createError as h3Error } from 'h3';

// Önceden tanımlanmış hata tipleri
export const ErrorTypes = {
  BAD_REQUEST: (message = 'Bad Request') => h3Error({
    statusCode: 400,
    statusMessage: 'Bad Request',
    message
  }),
  UNAUTHORIZED: (message = 'Unauthorized') => h3Error({
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message
  }),
  FORBIDDEN: (message = 'Forbidden') => h3Error({
    statusCode: 403,
    statusMessage: 'Forbidden',
    message
  }),
  NOT_FOUND: (message = 'Not Found') => h3Error({
    statusCode: 404,
    statusMessage: 'Not Found',
    message
  }),
  VALIDATION: (message = 'Validation Error') => h3Error({
    statusCode: 422,
    statusMessage: 'Unprocessable Entity',
    message
  }),
  INTERNAL: (message = 'Internal Server Error') => h3Error({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message
  }),
  SERVICE_UNAVAILABLE: (message = 'Service Unavailable') => h3Error({
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message
  })
};