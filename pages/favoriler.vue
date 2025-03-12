<template>
  <div class="bg-gradient-to-br from-green-50 to-green-100 min-h-screen relative overflow-hidden">
    <!-- Decorative Food Icons Background -->
    <div class="food-icons-container absolute inset-0 overflow-hidden pointer-events-none">
      <!-- First layer of icons -->
      <i class="fas fa-apple-alt text-green-500 opacity-30 absolute text-2xl" style="top: 15%; left: 10%; animation-delay: 0.5s;"></i>
      <i class="fas fa-carrot text-orange-500 opacity-30 absolute text-3xl" style="top: 25%; left: 85%; animation-delay: 1.2s;"></i>
      <i class="fas fa-lemon text-yellow-500 opacity-30 absolute text-2xl" style="top: 45%; left: 5%; animation-delay: 2.1s;"></i>
      <i class="fas fa-fish text-blue-500 opacity-30 absolute text-3xl" style="top: 65%; left: 92%; animation-delay: 0.7s;"></i>
      <i class="fas fa-egg text-gray-500 opacity-30 absolute text-2xl" style="top: 85%; left: 15%; animation-delay: 1.5s;"></i>
      <i class="fas fa-cheese text-yellow-500 opacity-30 absolute text-3xl" style="top: 10%; left: 40%; animation-delay: 2.3s;"></i>
      <i class="fas fa-bread-slice text-yellow-500 opacity-30 absolute text-2xl" style="top: 30%; left: 60%; animation-delay: 0.9s;"></i>
      <i class="fas fa-pepper-hot text-red-500 opacity-30 absolute text-2xl" style="top: 50%; left: 80%; animation-delay: 1.8s;"></i>
      <i class="fas fa-drumstick-bite text-orange-500 opacity-30 absolute text-3xl" style="top: 70%; left: 30%; animation-delay: 2.5s;"></i>
      <i class="fas fa-ice-cream text-pink-500 opacity-30 absolute text-2xl" style="top: 90%; left: 50%; animation-delay: 0.3s;"></i>
      <i class="fas fa-seedling text-green-500 opacity-30 absolute text-3xl" style="top: 20%; left: 25%; animation-delay: 1.1s;"></i>
      <i class="fas fa-cookie text-yellow-500 opacity-30 absolute text-2xl" style="top: 40%; left: 45%; animation-delay: 2.7s;"></i>
      <i class="fas fa-candy-cane text-red-500 opacity-30 absolute text-2xl" style="top: 60%; left: 65%; animation-delay: 0.6s;"></i>
      <i class="fas fa-apple-alt text-green-500 opacity-30 absolute text-3xl" style="top: 80%; left: 75%; animation-delay: 1.4s;"></i>
      <i class="fas fa-pizza-slice text-orange-500 opacity-30 absolute text-3xl" style="top: 5%; left: 70%; animation-delay: 2.2s;"></i>
      <i class="fas fa-hamburger text-yellow-500 opacity-30 absolute text-2xl" style="top: 35%; left: 15%; animation-delay: 0.8s;"></i>
      <i class="fas fa-bacon text-red-500 opacity-30 absolute text-2xl" style="top: 55%; left: 35%; animation-delay: 1.7s;"></i>
      <i class="fas fa-coffee text-amber-700 opacity-30 absolute text-3xl" style="top: 75%; left: 55%; animation-delay: 2.4s;"></i>
      <i class="fas fa-wine-bottle text-green-500 opacity-30 absolute text-2xl" style="top: 95%; left: 85%; animation-delay: 0.4s;"></i>
      <i class="fas fa-wheat text-yellow-500 opacity-30 absolute text-3xl" style="top: 15%; left: 95%; animation-delay: 1.3s;"></i>
      
      <!-- Second layer of icons -->
      <i class="fas fa-apple-alt text-red-500 opacity-30 absolute text-xl" style="top: 8%; left: 22%; animation-delay: 0.2s;"></i>
      <i class="fas fa-carrot text-orange-500 opacity-30 absolute text-2xl" style="top: 18%; left: 78%; animation-delay: 1.9s;"></i>
      <i class="fas fa-lemon text-yellow-500 opacity-30 absolute text-xl" style="top: 38%; left: 12%; animation-delay: 2.8s;"></i>
      <i class="fas fa-fish text-blue-500 opacity-30 absolute text-2xl" style="top: 58%; left: 88%; animation-delay: 1.0s;"></i>
      <i class="fas fa-egg text-gray-500 opacity-30 absolute text-xl" style="top: 78%; left: 8%; animation-delay: 1.8s;"></i>
      <i class="fas fa-cheese text-yellow-500 opacity-30 absolute text-2xl" style="top: 3%; left: 48%; animation-delay: 2.6s;"></i>
      <i class="fas fa-bread-slice text-yellow-500 opacity-30 absolute text-xl" style="top: 23%; left: 68%; animation-delay: 0.7s;"></i>
      <i class="fas fa-pepper-hot text-red-500 opacity-30 absolute text-xl" style="top: 43%; left: 88%; animation-delay: 1.5s;"></i>
      <i class="fas fa-drumstick-bite text-orange-500 opacity-30 absolute text-2xl" style="top: 63%; left: 38%; animation-delay: 2.2s;"></i>
      <i class="fas fa-ice-cream text-pink-500 opacity-30 absolute text-xl" style="top: 83%; left: 58%; animation-delay: 0.1s;"></i>
      <i class="fas fa-seedling text-green-500 opacity-30 absolute text-2xl" style="top: 13%; left: 33%; animation-delay: 0.9s;"></i>
      <i class="fas fa-cookie text-yellow-500 opacity-30 absolute text-xl" style="top: 33%; left: 53%; animation-delay: 2.4s;"></i>
      <i class="fas fa-candy-cane text-red-500 opacity-30 absolute text-xl" style="top: 53%; left: 73%; animation-delay: 0.3s;"></i>
      <i class="fas fa-apple-alt text-green-500 opacity-30 absolute text-2xl" style="top: 73%; left: 83%; animation-delay: 1.1s;"></i>
      <i class="fas fa-pizza-slice text-orange-500 opacity-30 absolute text-2xl" style="top: 12%; left: 62%; animation-delay: 1.9s;"></i>
      <i class="fas fa-hamburger text-yellow-500 opacity-30 absolute text-xl" style="top: 28%; left: 7%; animation-delay: 0.5s;"></i>
      <i class="fas fa-bacon text-red-500 opacity-30 absolute text-xl" style="top: 48%; left: 27%; animation-delay: 1.4s;"></i>
      <i class="fas fa-coffee text-amber-700 opacity-30 absolute text-2xl" style="top: 68%; left: 47%; animation-delay: 2.1s;"></i>
      <i class="fas fa-wine-bottle text-green-500 opacity-30 absolute text-xl" style="top: 88%; left: 77%; animation-delay: 0.2s;"></i>
      <i class="fas fa-wheat text-yellow-500 opacity-30 absolute text-2xl" style="top: 8%; left: 87%; animation-delay: 1.0s;"></i>
      
      <!-- Third layer of icons -->
      <i class="fas fa-apple-alt text-red-500 opacity-30 absolute text-2xl" style="top: 22%; left: 18%; animation-delay: 0.7s;"></i>
      <i class="fas fa-carrot text-orange-500 opacity-30 absolute text-3xl" style="top: 32%; left: 93%; animation-delay: 1.5s;"></i>
      <i class="fas fa-lemon text-yellow-500 opacity-30 absolute text-2xl" style="top: 52%; left: 3%; animation-delay: 2.3s;"></i>
      <i class="fas fa-fish text-blue-500 opacity-30 absolute text-3xl" style="top: 72%; left: 98%; animation-delay: 0.9s;"></i>
      <i class="fas fa-egg text-gray-500 opacity-30 absolute text-2xl" style="top: 92%; left: 23%; animation-delay: 1.7s;"></i>
      <i class="fas fa-cheese text-yellow-500 opacity-30 absolute text-3xl" style="top: 17%; left: 52%; animation-delay: 2.5s;"></i>
      <i class="fas fa-bread-slice text-yellow-500 opacity-30 absolute text-2xl" style="top: 37%; left: 72%; animation-delay: 1.1s;"></i>
      <i class="fas fa-pepper-hot text-red-500 opacity-30 absolute text-2xl" style="top: 57%; left: 92%; animation-delay: 2.0s;"></i>
      <i class="fas fa-drumstick-bite text-orange-500 opacity-30 absolute text-3xl" style="top: 77%; left: 42%; animation-delay: 2.7s;"></i>
      <i class="fas fa-ice-cream text-pink-500 opacity-30 absolute text-2xl" style="top: 97%; left: 62%; animation-delay: 0.5s;"></i>
      <i class="fas fa-seedling text-green-500 opacity-30 absolute text-3xl" style="top: 27%; left: 37%; animation-delay: 1.3s;"></i>
      <i class="fas fa-cookie text-yellow-500 opacity-30 absolute text-2xl" style="top: 47%; left: 57%; animation-delay: 2.9s;"></i>
      <i class="fas fa-candy-cane text-red-500 opacity-30 absolute text-2xl" style="top: 67%; left: 77%; animation-delay: 0.8s;"></i>
      <i class="fas fa-apple-alt text-green-500 opacity-30 absolute text-3xl" style="top: 87%; left: 97%; animation-delay: 1.6s;"></i>
      <i class="fas fa-pizza-slice text-orange-500 opacity-30 absolute text-3xl" style="top: 2%; left: 82%; animation-delay: 2.4s;"></i>
    </div>

    <div class="container mx-auto px-4 py-8 relative z-10">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 animate-fade-in">
        <span class="text-green-600">Favori</span> Besinlerim
      </h1>
      
      <div v-if="loading" class="text-center py-4">
        <span class="text-gray-600 shimmer">Yükleniyor...</span>
      </div>
      
      <div v-else-if="favorites.length === 0" class="text-center py-8 animate-fade-in">
        <p class="text-gray-600 mb-4">Henüz favori besininiz yok.</p>
        <NuxtLink 
          to="/yiyecekler" 
          class="text-green-600 hover:text-green-700 font-medium mt-2 inline-block btn-hover"
        >
          Besin Kataloğuna Git
        </NuxtLink>
      </div>
      
      <div v-else class="space-y-4 max-w-3xl mx-auto">
        <transition-group name="food-list" tag="div" class="space-y-4">
          <div 
            v-for="(favorite, index) in favorites" 
            :key="favorite.id"
            class="bg-white border border-green-100 rounded-lg p-5 hover-lift card-hover group"
            :style="{ animationDelay: index * 0.1 + 's' }"
          >
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <div class="flex items-center">
                  <div>
                    <h3 class="font-medium text-lg group-hover:text-green-600 transition-colors">
                      {{ favorite?.name?.tr || 'İsimsiz' }}
                    </h3>
                    <p v-if="favorite?.category?.name?.tr" class="text-xs text-gray-500">
                      {{ favorite.category.name.tr }}
                    </p>
                  </div>
                </div>
                
                <div class="mt-3 flex flex-wrap gap-4">
                  <div class="flex items-center text-sm text-gray-700 badge">
                    <i class="fas fa-fire-alt text-orange-500 w-5"></i>
                    <span>{{ favorite?.nutrients?.energy?.value || 0 }} {{ favorite?.nutrients?.energy?.unit?.toLowerCase() || 'kcal' }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-700 badge">
                    <i class="fas fa-egg text-blue-500 w-5"></i>
                    <span>{{ favorite?.nutrients?.protein?.value || 0 }}{{ favorite?.nutrients?.protein?.unit?.toLowerCase() || 'g' }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-700 badge">
                    <i class="fas fa-bread-slice text-yellow-500 w-5"></i>
                    <span>{{ favorite?.nutrients?.carbohydrates?.value || 0 }}{{ favorite?.nutrients?.carbohydrates?.unit?.toLowerCase() || 'g' }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-700 badge">
                    <i class="fas fa-cheese text-green-500 w-5"></i>
                    <span>{{ favorite?.nutrients?.fat?.value || 0 }}{{ favorite?.nutrients?.fat?.unit?.toLowerCase() || 'g' }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-700 badge">
                    <i class="fas fa-weight text-purple-500 w-5"></i>
                    <span>{{ favorite?.portionSize?.value || 100 }}{{ favorite?.portionSize?.unit?.toLowerCase() || 'g' }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <button
                  @click="addToMeal(favorite)"
                  class="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center space-x-1 btn-hover"
                >
                  <i class="fas fa-plus text-xs"></i>
                  <span>Öğüne Ekle</span>
                </button>
                
                <button
                  @click="removeFavorite(favorite.id)"
                  class="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                  :disabled="removing[favorite.id]"
                >
                  <i class="fas fa-heart text-xl pulse"></i>
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '~/stores/auth';

const toast = useToast();
const authStore = useAuthStore();
const favorites = ref([]);
const loading = ref(true);
const removing = ref({});

// Favorileri getir
const fetchFavorites = async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/favorites', {
      headers: authStore.getAuthHeader()
    });

    // API yanıtını kontrol et ve düzenle
    if (!response || !Array.isArray(response)) {
      favorites.value = [];
      return;
    }

    // Her bir favori besini işle
    favorites.value = response.map(fav => {
      // Temel favori objesi
      const favorite = {
        id: fav._id || fav.id,
        name: {
          tr: fav.name?.tr || fav.food?.name?.tr || fav.food?.tr || fav.name || 'İsimsiz'
        },
        category: fav.category || fav.food?.category || {},
        nutrients: {
          energy: {
            value: fav.nutrients?.energy?.value || fav.food?.nutrients?.energy?.value || fav.calories || 0,
            unit: 'kcal'
          },
          protein: {
            value: fav.nutrients?.protein?.value || fav.food?.nutrients?.protein?.value || fav.protein || 0,
            unit: 'g'
          },
          fat: {
            value: fav.nutrients?.fat?.value || fav.food?.nutrients?.fat?.value || fav.fat || 0,
            unit: 'g'
          },
          carbohydrates: {
            value: fav.nutrients?.carbohydrates?.value || fav.food?.nutrients?.carbohydrates?.value || fav.carbs || 0,
            unit: 'g'
          },
          fiber: {
            value: fav.nutrients?.fiber?.value || fav.food?.nutrients?.fiber?.value || 0,
            unit: 'g'
          },
          sugar: {
            value: fav.nutrients?.sugar?.value || fav.food?.nutrients?.sugar?.value || 0,
            unit: 'g'
          }
        },
        portionSize: {
          value: fav.portionSize?.value || fav.food?.portionSize?.value || 100,
          unit: fav.portionSize?.unit || fav.food?.portionSize?.unit || 'g'
        }
      };

      return favorite;
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    toast.error('Favoriler yüklenirken bir hata oluştu');
    favorites.value = [];
  } finally {
    loading.value = false;
  }
};

// Favoriyi kaldır
const removeFavorite = async (favoriteId) => {
  try {
    removing.value[favoriteId] = true;
    await $fetch(`/api/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: authStore.getAuthHeader()
    });
    favorites.value = favorites.value.filter(f => f.id !== favoriteId);
    toast.success('Favori başarıyla kaldırıldı');
  } catch (error) {
    console.error('Error removing favorite:', error);
    toast.error('Favori kaldırılırken bir hata oluştu');
  } finally {
    removing.value[favoriteId] = false;
  }
};

// Öğüne ekle
const addToMeal = async (food) => {
  try {
    await $fetch('/api/meals', {
      method: 'POST',
      body: {
        foodId: food._id,
        quantity: 1,
        mealType: 'breakfast',
        date: new Date().toISOString()
      },
      headers: authStore.getAuthHeader()
    });
    toast.success('Besin öğüne eklendi');
  } catch (error) {
    console.error('Error adding to meal:', error);
    toast.error('Öğüne eklenirken bir hata oluştu');
  }
};

onMounted(() => {
  fetchFavorites();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.food-list-enter-active,
.food-list-leave-active {
  transition: all 0.5s ease;
}

.food-list-enter-from,
.food-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.shimmer {
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.2) 50%,
    rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.badge {
  position: relative;
  overflow: hidden;
}

.badge::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  animation: badge-shine 3s infinite;
}

@keyframes badge-shine {
  0% {
    left: -100%;
    top: -100%;
  }
  100% {
    left: 100%;
    top: 100%;
  }
}

.food-icons-container i {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}
</style>
