<template>
  <transition name="modal">
    <div
      v-if="selectedFood"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
        <div
          class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-xl hover-lift"
          @click.stop
        >
          <div class="flex justify-between items-start mb-6">
            <div class="animate-fade-in">
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                {{ selectedFood.name.tr }}
                <span
                  class="ml-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full badge"
                >
                  {{ selectedFood.category }}
                </span>
              </h2>
              <p class="text-gray-600 mt-1">{{ selectedFood.name.en }}</p>
            </div>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="space-y-8 animate-slide-in">
            <!-- Temel Bilgiler -->
            <div
              class="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:bg-gray-100"
            >
              <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Temel Bilgiler
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="flex items-center space-x-2 p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <span class="text-gray-600 font-medium">Kategori:</span>
                  <span class="font-semibold text-green-700">{{ selectedFood.category }}</span>
                </div>
                <div
                  class="flex items-center space-x-2 p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <span class="text-gray-600 font-medium">Porsiyon:</span>
                  <span class="font-semibold text-green-700"
                    >{{ selectedFood.portions[0]?.weight }}g</span
                  >
                </div>
              </div>
            </div>

            <!-- Makro Besinler -->
            <div class="animate-fade-in" style="animation-delay: 100ms">
              <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Makro Besinler
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 hover:bg-red-50"
                >
                  <div class="flex items-center mb-2">
                    <span class="nutrient-dot dot-energy animate-pulse-slow"></span>
                    <span class="font-medium text-gray-700">Enerji</span>
                  </div>
                  <div class="text-xl font-bold text-gray-900">
                    {{ selectedFood.nutrients.energy.value }}
                    <span class="text-sm font-normal text-gray-600">{{
                      selectedFood.nutrients.energy.unit
                    }}</span>
                  </div>
                </div>
                <div
                  class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 hover:bg-blue-50"
                >
                  <div class="flex items-center mb-2">
                    <span class="nutrient-dot dot-protein animate-pulse-slow"></span>
                    <span class="font-medium text-gray-700">Protein</span>
                  </div>
                  <div class="text-xl font-bold text-gray-900">
                    <span v-if="selectedFood.nutrients && selectedFood.nutrients.protein && selectedFood.nutrients.protein.value !== undefined">
                      {{ selectedFood.nutrients.protein.value }}
                      <span class="text-sm font-normal text-gray-600">{{ selectedFood.nutrients.protein.unit }}</span>
                    </span>
                    <span v-else>Bilgi yok</span>
                  </div>
                </div>
                <div
                  class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 hover:bg-yellow-50"
                >
                  <div class="flex items-center mb-2">
                    <span class="nutrient-dot dot-carbs animate-pulse-slow"></span>
                    <span class="font-medium text-gray-700">Karbonhidrat</span>
                  </div>
                  <div class="text-xl font-bold text-gray-900">
                    <span v-if="selectedFood.nutrients && selectedFood.nutrients.carbohydrate && selectedFood.nutrients.carbohydrate.value !== undefined">
                        {{ selectedFood.nutrients.carbohydrate.value }}
                      <span class="text-sm font-normal text-gray-600">{{ selectedFood.nutrients.carbohydrate.unit }}</span>
                    </span>
                    <span v-else>Bilgi yok</span>
                  </div>
                </div>
                <div
                  class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 hover:bg-purple-50"
                >
                  <div class="flex items-center mb-2">
                    <span class="nutrient-dot dot-fat animate-pulse-slow"></span>
                    <span class="font-medium text-gray-700">Yağ</span>
                  </div>
                  <div class="text-xl font-bold text-gray-900">
                    <span v-if="selectedFood.nutrients && selectedFood.nutrients.fat && selectedFood.nutrients.fat.value !== undefined">
                        {{ selectedFood.nutrients.fat.value }}
                      <span class="text-sm font-normal text-gray-600">{{ selectedFood.nutrients.fat.unit }}</span>
                    </span>
                    <span v-else>Bilgi yok</span>
                    <span class="text-sm font-normal text-gray-600">{{
                      selectedFood.nutrients.fat.unit
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Diğer bölümler -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in"
              style="animation-delay: 200ms"
            >
              <!-- Yağ Profili -->
              <div>
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Yağ Profili
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Doymuş Yağ</span>
                    <span class="font-medium"
                      >{{ selectedFood.nutrients.saturatedFat?.value || 0 }}g</span
                    >
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Tekli Doymamış</span>
                    <span class="font-medium"
                      >{{ selectedFood.nutrients.monounsaturatedFat?.value || 0 }}g</span
                    >
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Çoklu Doymamış</span>
                    <span class="font-medium"
                      >{{ selectedFood.nutrients.polyunsaturatedFat?.value || 0 }}g</span
                    >
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600">Kolesterol</span>
                    <span class="font-medium"
                      >{{ selectedFood.nutrients.cholesterol?.value || 0 }}mg</span
                    >
                  </div>
                </div>
              </div>

              <!-- Vitaminler ve Mineraller -->
              <div>
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Vitaminler ve Mineraller
                </h3>
                <div class="space-y-3">
                  <template v-if="selectedFood.vitamins">
                    <div
                      v-for="(vitamin, key) in selectedFood.vitamins"
                      :key="key"
                      class="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span class="text-gray-600">Vitamin {{ key.toUpperCase() }}</span>
                      <span class="font-medium">{{ vitamin.value }} {{ vitamin.unit }}</span>
                    </div>
                  </template>
                  <template v-if="selectedFood.minerals">
                    <div
                      v-for="(mineral, key) in selectedFood.minerals"
                      :key="key"
                      class="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span class="text-gray-600">{{
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }}</span>
                      <span class="font-medium">{{ mineral.value }} {{ mineral.unit }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
    selectedFood: {
        type: Object,
        required: true,
        default: null
    }, 
});

const emit = defineEmits(['close']);

// Modalı kapatma fonksiyonu
const closeModal = () => {
    emit('close');
};
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.hover-lift {
  transition: transform 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
}

.nutrient-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.dot-energy {
  background-color: rgba(239, 68, 68, 0.7);
}

.dot-protein {
  background-color: rgba(59, 130, 246, 0.7);
}

.dot-carbs {
  background-color: rgba(234, 179, 8, 0.7);
}

.dot-fat {
  background-color: rgba(168, 85, 247, 0.7);
}

.badge {
  animation: pulse 2s infinite;
}

.animate-pulse-slow {
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in-out;
}

.animate-slide-in {
  animation: slide-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>