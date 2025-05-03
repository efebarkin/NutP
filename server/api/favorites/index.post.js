import { readBody, createError } from 'h3';
import { defineAuthenticatedHandler } from '~/server/utils/auth';
import favoritesService from '~/server/services/favoritesService';

export default defineAuthenticatedHandler(async (event) => {
  try {
    // Kimlik doğrulama defineAuthenticatedHandler tarafından yapıldı
    const userId = event.context.auth.user._id; // id yerine _id kullanıyoruz
    
    const { foodId } = await readBody(event);
    
    // Favori ekleme işlemini servis üzerinden yap
    const result = await favoritesService.addFavoriteFood(userId, foodId);
    return result;
  } catch (error) {
    console.error('Add to favorites error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Besin favorilere eklenirken bir hata oluştu'
    });
  }
});
