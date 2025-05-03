import { createError } from 'h3';
import { defineAuthenticatedHandler } from '~/server/utils/auth';
import favoritesService from '~/server/services/favoritesService';

export default defineAuthenticatedHandler(async (event) => {
  try {
    // Kimlik doğrulama defineAuthenticatedHandler tarafından yapıldı
    const userId = event.context.auth.user._id; // id yerine _id kullanıyoruz
    
    const foodId = event.context.params.id;
    
    // Favori silme işlemini servis üzerinden yap
    const result = await favoritesService.removeFavoriteFood(userId, foodId);
    return result;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
});
