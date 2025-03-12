import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useNutritionStore = defineStore('nutrition', {
  state: () => ({
    foodPyramid: {
      levels: [
        {
          name: 'Tahıllar',
          description: 'Günde 6-11 porsiyon',
          foods: ['ekmek', 'pirinç', 'makarna', 'tahıl'],
          color: '#FFD700'
        },
        {
          name: 'Sebzeler',
          description: 'Günde 3-5 porsiyon',
          foods: ['yeşil yapraklılar', 'havuç', 'domates', 'patates'],
          color: '#90EE90'
        },
        {
          name: 'Meyveler',
          description: 'Günde 2-4 porsiyon',
          foods: ['elma', 'muz', 'portakal', 'üzüm'],
          color: '#FF6B6B'
        },
        {
          name: 'Süt Ürünleri',
          description: 'Günde 2-3 porsiyon',
          foods: ['süt', 'yoğurt', 'peynir'],
          color: '#87CEEB'
        },
        {
          name: 'Protein',
          description: 'Günde 2-3 porsiyon',
          foods: ['et', 'balık', 'yumurta', 'kurubaklagil'],
          color: '#DEB887'
        },
        {
          name: 'Yağlar ve Tatlılar',
          description: 'Az miktarda',
          foods: ['yağ', 'şeker', 'tatlı'],
          color: '#FFB6C1'
        }
      ]
    },
    seasonalFoods: {
      spring: [
        { name: 'Kuşkonmaz', benefits: ['A vitamini', 'Folat', 'Demir'], season: 'İlkbahar' },
        { name: 'Enginar', benefits: ['Antioksidan', 'Lif', 'K vitamini'], season: 'İlkbahar' },
        // Diğer ilkbahar sebze ve meyveleri
      ],
      summer: [
        { name: 'Domates', benefits: ['C vitamini', 'Likopen', 'Potasyum'], season: 'Yaz' },
        { name: 'Karpuz', benefits: ['A vitamini', 'C vitamini', 'Likopen'], season: 'Yaz' },
        // Diğer yaz sebze ve meyveleri
      ],
      autumn: [
        { name: 'Nar', benefits: ['Antioksidan', 'C vitamini', 'K vitamini'], season: 'Sonbahar' },
        { name: 'Balkabağı', benefits: ['A vitamini', 'Lif', 'Potasyum'], season: 'Sonbahar' },
        // Diğer sonbahar sebze ve meyveleri
      ],
      winter: [
        { name: 'Portakal', benefits: ['C vitamini', 'Folat', 'Potasyum'], season: 'Kış' },
        { name: 'Lahana', benefits: ['C vitamini', 'K vitamini', 'Lif'], season: 'Kış' },
        // Diğer kış sebze ve meyveleri
      ]
    },
    meals: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMeals() {
      const auth = useAuthStore();
      this.loading = true;
      try {
        const meals = await auth.fetchWithAuth('/api/meals');
        this.meals = meals;
      } catch (error) {
        console.error('Error fetching meals:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createMeal(mealData) {
      const auth = useAuthStore();
      this.loading = true;
      try {
        const meal = await auth.fetchWithAuth('/api/meals', {
          method: 'POST',
          body: mealData
        });
        this.meals.push(meal);
        return meal;
      } catch (error) {
        console.error('Error creating meal:', error);
        this.error = error.message;
        throw new Error('Meal creation failed');
      } finally {
        this.loading = false;
      }
    },

    async updateMeal(mealId, mealData) {
      const auth = useAuthStore();
      this.loading = true;
      try {
        const updatedMeal = await auth.fetchWithAuth(`/api/meals/${mealId}`, {
          method: 'PUT',
          body: mealData
        });
        const index = this.meals.findIndex(m => m._id === mealId);
        if (index !== -1) {
          this.meals[index] = updatedMeal;
        }
        return updatedMeal;
      } catch (error) {
        console.error('Error updating meal:', error);
        this.error = error.message;
        throw new Error('Meal update failed');
      } finally {
        this.loading = false;
      }
    },

    async deleteMeal(mealId) {
      const auth = useAuthStore();
      this.loading = true;
      try {
        await auth.fetchWithAuth(`/api/meals/${mealId}`, {
          method: 'DELETE'
        });
        this.meals = this.meals.filter(m => m._id !== mealId);
      } catch (error) {
        console.error('Error deleting meal:', error);
        this.error = error.message;
        throw new Error('Meal deletion failed');
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    getFoodPyramid: (state) => state.foodPyramid,
    getSeasonalFoods: (state) => state.seasonalFoods,
    getCurrentSeasonFoods: (state) => {
      const seasons = {
        winter: [12, 1, 2],
        spring: [3, 4, 5],
        summer: [6, 7, 8],
        autumn: [9, 10, 11]
      };
      
      const currentMonth = new Date().getMonth() + 1;
      const currentSeason = Object.entries(seasons).find(([_, months]) => 
        months.includes(currentMonth)
      )[0];
      
      return state.seasonalFoods[currentSeason];
    }
  }
});
