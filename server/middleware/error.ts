import { H3Event, createError as h3Error } from 'h3';

export default defineEventHandler((event: H3Event) => {
  // Error handler'ı ekle
  event.context.error = (error: any) => {
    // Eğer hata zaten H3Error ise direkt kullan
    if (error.statusCode) {
      throw error;
    }

    // Diğer hataları H3Error'a çevir
    console.error('Application error:', error);
    throw h3Error({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  };
});
