import { defineAuthenticatedHandler } from '~/server/utils/auth';
import mealPDFService from '~/server/services/mealPDFService';
import { getRouterParams, getQuery, setHeader, createError } from 'h3';

export default defineAuthenticatedHandler(async (event) => {
  try {
    const { id } = getRouterParams(event);
    const query = getQuery(event);
    const userLanguage = query.lang || 'tr';

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Öğün ID gerekli',
      });
    }

    const pdfResult = await mealPDFService.generateMealPDF(
      id,
      userLanguage,
      event, // Pass the event object directly
    );

    // PDF response headers
    setHeader(event, 'Content-Type', 'application/pdf');

    // Sanitize filename for basic filename parameter (ASCII only)
    const asciiFilename = pdfResult.filename.replace(/[^\x20-\x7E]/g, '_');
    // Use filename* for UTF-8 support, and basic filename as fallback
    setHeader(
      event,
      'Content-Disposition',
      `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(
        pdfResult.filename,
      )}`,
    );
    setHeader(event, 'Content-Length', pdfResult.buffer.length);

    return pdfResult.buffer;
  } catch (error) {
    console.error('PDF export hatası:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'PDF oluşturulurken bir hata oluştu',
    });
  }
});
