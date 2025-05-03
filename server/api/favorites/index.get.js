import { createError } from 'h3';
import { defineAuthenticatedHandler } from '~/server/utils/auth';
import favoritesService from '~/server/services/favoritesService';

export default defineAuthenticatedHandler(async (event) => {
  try {
    // Kimlik doğrulama defineAuthenticatedHandler tarafından yapıldı
    const userId = event.context.auth.user._id; // id yerine _id kullanıyoruz
    
    // Favori besinleri servis üzerinden al
    const favorites = await favoritesService.getFavoriteFoods(userId);
    return favorites;
  } catch (error) {
    console.error('Error fetching favorite foods:', error);
    throw createError({ 
      statusCode: error.statusCode || 500,
      message: error.message || 'Favori besinler getirilirken bir hata oluştu'
    });
  }
});
