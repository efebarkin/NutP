import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useMealPlannerStore = defineStore('mealPlanner', {
  state: () => ({
    weeklyPlan: {
      monday: { breakfast: null, lunch: null, dinner: null, snacks: [] },
      tuesday: { breakfast: null, lunch: null, dinner: null, snacks: [] },
      wednesday: { breakfast: null, lunch: null, dinner: null, snacks: [] },
      thursday: { breakfast: null, lunch: null, dinner: null, snacks: [] },
      friday: { breakfast: null, lunch: null, dinner: null, snacks: [] },
      saturday: { breakfast: null, lunch: null, dinner: null, snacks: [] },
      sunday: { breakfast: null, lunch: null, dinner: null, snacks: [] }
    },
    loading: false,
    error: null
  }),

  getters: {
    getWeeklyPlan: (state) => state.weeklyPlan,
    getDayPlan: (state) => (day) => state.weeklyPlan[day],
    getTotalCalories: (state) => (day) => {
      const dayPlan = state.weeklyPlan[day];
      let total = 0;

      // Ana öğünlerin kalorilerini topla
      ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
        if (dayPlan[mealType]) {
          total += dayPlan[mealType].calories || 0;
        }
      });

      // Ara öğünlerin kalorilerini topla
      dayPlan.snacks.forEach(snack => {
        total += snack.calories || 0;
      });

      return total;
    }
  },

  actions: {
    async fetchWeeklyPlan() {
      this.loading = true;
      this.error = null;

      try {
        const auth = useAuthStore();
        const response = await auth.fetchWithAuth('/api/meal-planner/weekly-plan');
        const data = await response.json();
        this.weeklyPlan = data;
      } catch (error) {
        console.error('Weekly plan fetch error:', error);
        this.error = error.message || 'Haftalık plan yüklenirken bir hata oluştu';
      } finally {
        this.loading = false;
      }
    },

    async saveMealToDay({ day, mealType, meal }) {
      this.loading = true;
      this.error = null;

      try {
        const auth = useAuthStore();
        // API'ye kaydet
        const response = await auth.fetchWithAuth('/api/meal-planner/save-meal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ day, mealType, meal })
        });
        
        await response.json();

        // State'i güncelle
        if (mealType === 'snacks') {
          this.weeklyPlan[day][mealType].push(meal);
        } else {
          this.weeklyPlan[day][mealType] = meal;
        }
      } catch (error) {
        console.error('Meal save error:', error);
        this.error = error.message || 'Öğün kaydedilirken bir hata oluştu';
      } finally {
        this.loading = false;
      }
    },

    async removeMealFromDay({ day, mealType, mealIndex }) {
      this.loading = true;
      this.error = null;

      try {
        const auth = useAuthStore();
        // API'ye bildir
        const response = await auth.fetchWithAuth('/api/meal-planner/remove-meal', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ day, mealType, mealIndex })
        });
        
        await response.json();

        // State'i güncelle
        if (mealType === 'snacks') {
          this.weeklyPlan[day][mealType].splice(mealIndex, 1);
        } else {
          this.weeklyPlan[day][mealType] = null;
        }
      } catch (error) {
        console.error('Meal remove error:', error);
        this.error = error.message || 'Öğün silinirken bir hata oluştu';
      } finally {
        this.loading = false;
      }
    },

    async moveMeal({ fromDay, fromMealType, toDay, toMealType, meal, mealIndex }) {
      this.loading = true;
      this.error = null;

      try {
        const auth = useAuthStore();
        const response = await auth.fetchWithAuth('/api/meal-planner/move-meal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fromDay,
            fromMealType,
            toDay,
            toMealType,
            meal,
            mealIndex
          })
        });
        
        await response.json();

        // Remove from original position
        if (fromMealType === 'snacks') {
          this.weeklyPlan[fromDay][fromMealType].splice(mealIndex, 1);
        } else {
          this.weeklyPlan[fromDay][fromMealType] = null;
        }

        // Add to new position
        if (toMealType === 'snacks') {
          this.weeklyPlan[toDay][toMealType].push(meal);
        } else {
          this.weeklyPlan[toDay][toMealType] = meal;
        }
      } catch (error) {
        console.error('Meal move error:', error);
        this.error = error.message || 'Öğün taşınırken bir hata oluştu';
      } finally {
        this.loading = false;
      }
    }
  }
});
