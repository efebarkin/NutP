<template>
  <div>
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="recentMeals.length === 0" class="text-center py-8">
      <p class="text-gray-600">Henüz kaydedilmiş öğün bulunmuyor.</p>
      <NuxtLink 
        to="/yiyecekler" 
        class="inline-block mt-4 text-blue-600 hover:text-blue-800"
      >
        Öğün oluşturmak için tıklayın
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="meal in recentMeals" :key="meal.id" 
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900 capitalize">
                {{ translateMealType(meal.type) }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ formatDate(meal.date) }}
              </p>
            </div>
          </div>

          <!-- Besinler Listesi -->
          <div class="space-y-2 mb-4">
            <p v-for="food in meal.foods.slice(0, 3)" :key="food.fdcId" 
              class="text-sm text-gray-600">
              {{ food.description }}
            </p>
            <p v-if="meal.foods.length > 3" class="text-sm text-gray-500 italic">
              ve {{ meal.foods.length - 3 }} diğer besin...
            </p>
          </div>

          <!-- Besin Değerleri -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Kalori:</span>
              <span class="font-medium">{{ meal.totalNutrients.calories }} kcal</span>
            </div>
            <div>
              <span class="text-gray-600">Protein:</span>
              <span class="font-medium">{{ meal.totalNutrients.protein }}g</span>
            </div>
          </div>
        </div>

        <div class="px-6 py-3 bg-gray-50 text-right">
          <NuxtLink 
            to="/ogun" 
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Detayları Görüntüle
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MealService from '~/server/services/mealService';

const mealService = new MealService();
const recentMeals = ref([]);
const loading = ref(true);

// Son öğünleri yükle
const loadRecentMeals = () => {
  try {
    const allMeals = mealService.getAllMeals();
    // Son 4 öğünü göster
    recentMeals.value = allMeals
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);
  } catch (error) {
    console.error('Error loading recent meals:', error);
  } finally {
    loading.value = false;
  }
};

// Öğün tipini Türkçeye çevir
const translateMealType = (type) => {
  const translations = {
    breakfast: 'Kahvaltı',
    lunch: 'Öğle Yemeği',
    dinner: 'Akşam Yemeği',
    snack: 'Ara Öğün'
  };
  return translations[type] || type;
};

// Tarihi formatla
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  loadRecentMeals();
});
</script>
