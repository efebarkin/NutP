import uploadUtility from '../utils/uploadUtility.js';
import Meal from '../models/Meal';
import { createError } from 'h3';

// Multer middleware for meal photo uploads
const uploadMiddleware = uploadUtility.createMulterMiddleware({
  fields: [
    { name: 'photo', maxCount: 1 },
    { name: 'mealId', maxCount: 1 },
  ],
  fileSize: 10 * 1024 * 1024, // 10MB limit
});

class MealPhotoService {
  async uploadMealPhoto(event) {
    try {
      // Dosyayı ve form verilerini al
      await uploadMiddleware(event.node.req, event.node.res);
      const files = event.node.req.files;
      const body = event.node.req.body;

      if (!files || !files.photo || !files.photo[0]) {
        throw createError({
          statusCode: 400,
          message: 'Fotoğraf dosyası bulunamadı',
        });
      }

      const file = files.photo[0];
      const mealId = body.mealId;

      // Upload optimized image using shared utility
      const uploadResult = await uploadUtility.uploadOptimizedImage(
        file.buffer,
        {
          folder: 'meals',
          optimization: {
            width: 800,
            height: 600,
            quality: 80,
          },
          format: 'jpeg',
        },
      );

      console.log('Öğün fotoğrafı yüklendi:', uploadResult.url);

      // Eğer mealId varsa, meal'i güncelle
      if (mealId) {
        try {
          await Meal.findByIdAndUpdate(mealId, {
            photoUrl: uploadResult.url,
          });
          console.log('Meal photoUrl güncellendi:', mealId);
        } catch (updateError) {
          console.error('Meal güncelleme hatası:', updateError);
          // Optional: If this specific error should also throw an HTTP error:
          // throw createError({
          //   statusCode: 500, // Or another appropriate code
          //   message: 'Meal fotoğrafı güncellenirken bir hata oluştu',
          //   cause: updateError
          // });
        }
      }

      return {
        success: true,
        photoUrl: uploadResult.url,
        fileName: uploadResult.key,
        originalSize: uploadResult.originalSize,
        optimizedSize: uploadResult.optimizedSize,
        compressionRatio: uploadResult.compressionRatio,
      };
    } catch (error) {
      console.error('Öğün fotoğrafı yükleme hatası:', error);
      if (error.statusCode) throw error; // Re-throw if already a createError
      throw createError({
        statusCode: 500,
        message: 'Fotoğraf yüklenirken bir hata oluştu',
        cause: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  async deleteMealPhoto(photoUrl) {
    try {
      if (!photoUrl) {
        throw createError({ statusCode: 400, message: 'PhotoUrl is required' });
      }

      console.log('[MealPhotoService] Attempting to delete photo:', photoUrl);

      const deleteResult = await uploadUtility.deleteFromS3(photoUrl);

      console.log(
        '[MealPhotoService] Photo successfully deleted from S3:',
        deleteResult,
      );

      return {
        success: true,
        message: 'Photo deleted successfully',
        key: deleteResult.key,
      };
    } catch (error) {
      console.error('[MealPhotoService] Error deleting photo from S3:', {
        photoUrl,
        error: error.message,
        stack: error.stack,
      });
      if (error.statusCode) throw error; // Re-throw if already a createError
      throw createError({
        statusCode: 500,
        message: `Failed to delete photo: ${error.message}`,
        cause: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
}

export default new MealPhotoService();
