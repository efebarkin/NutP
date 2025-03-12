import { useRuntimeConfig } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Global fetch instance
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include', // Cookie'leri gönder
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  // API methods
  const apiMethods = {
    // Foods
    async searchFoods(query) {
      try {
        const response = await api('/api/foods/search', {
          method: 'POST',
          body: { query }
        });
        return response;
      } catch (error) {
        console.error('Food search error:', error);
        throw error;
      }
    },

    // Favorites
    async addToFavorites(foodId) {
      try {
        const response = await api('/api/favorites', {
          method: 'POST',
          body: { foodId }
        });
        return response;
      } catch (error) {
        console.error('Add to favorites error:', error);
        throw error;
      }
    },

    async getFavorites() {
      try {
        const response = await api('/api/favorites', {
          method: 'GET'
        });
        return response;
      } catch (error) {
        console.error('Get favorites error:', error);
        throw error;
      }
    },

    // Meals
    async createMeal(mealData) {
      try {
        const response = await api('/api/meals', {
          method: 'POST',
          body: mealData
        });
        return response;
      } catch (error) {
        console.error('Create meal error:', error);
        throw error;
      }
    },

    async getMeals() {
      try {
        const response = await api('/api/meals', {
          method: 'GET'
        });
        return response;
      } catch (error) {
        console.error('Get meals error:', error);
        throw error;
      }
    }
  };

  // Global error handler
  nuxtApp.hook('app:error', (..._args) => {
    console.log('Global error caught');
  });

  // Provide the fetch instance as well for custom API calls
  return {
    provide: {
      api: apiMethods,
      apiFetch: api
    }
  };
});
