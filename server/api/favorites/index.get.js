import { defineAuthenticatedHandler } from '~/server/utils/auth';
import favoritesService from '~/server/services/favoritesService';

export default defineAuthenticatedHandler(async (event) => {
    return favoritesService.getFavoriteFoods(event);
});
