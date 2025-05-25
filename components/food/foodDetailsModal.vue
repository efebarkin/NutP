<template>
  <transition name="modal-fade">
    <div
      v-if="selectedFood"
      class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50"
      @click="closeModal"
    >
      <div
        class="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto flex flex-col"
        @click.stop
      >
        <!-- Header with Food Image -->
        <div class="relative">
          <!-- Food Image -->
          <div
            class="h-72 sm:h-80 w-full overflow-hidden rounded-t-xl"
            :class="{
              'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900':
                !selectedFood.photoUrl,
            }"
          >
            <template v-if="selectedFood.photoUrl">
              <img
                :src="selectedFood.photoUrl"
                :alt="selectedFood.name.tr"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </template>
            <template v-else>
              <div
                class="w-full h-full flex flex-col items-center justify-center text-emerald-500 dark:text-emerald-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-20 w-20 sm:h-24 sm:w-24 mb-3 opacity-70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p class="text-lg sm:text-xl font-medium">
                  {{ selectedFood.name.tr }}
                </p>
                <p class="text-sm sm:text-base opacity-80">
                  Görsel Yok
                </p>
              </div>
            </template>
          </div>

          <!-- Gradient Overlay for Text Contrast -->
          <div
            v-if="selectedFood.photoUrl"
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-t-xl"
          ></div>

          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors duration-200 z-20"
            aria-label="Kapat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Food Title Overlay -->
          <div
            class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white z-10"
          >
            <div class="animate-fade-in-up">
              <h2
                class="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 leading-tight"
              >
                {{ selectedFood.name.tr }}
              </h2>
              <p
                class="text-base sm:text-lg text-white/80 mb-2"
              >
                {{ selectedFood.name.en }}
              </p>
              <span
                class="px-3 py-1 bg-white/25 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full"
              >
                {{ selectedFood.category }}
              </span>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div
          class="p-6 sm:p-8 space-y-6 sm:space-y-8 flex-grow"
        >
          <!-- Temel Bilgiler -->
          <div
            class="bg-white dark:bg-slate-800 rounded-lg p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h3
              class="text-lg sm:text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-500 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 sm:h-6 sm:w-6 mr-2.5 opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Temel Bilgiler
            </h3>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm sm:text-base"
            >
              <div
                class="flex justify-between items-center py-1.5"
              >
                <span
                  class="text-slate-600 dark:text-slate-400 font-medium"
                  >Kategori:</span
                >
                <span
                  class="font-semibold text-emerald-600 dark:text-emerald-400"
                  >{{ selectedFood.category }}</span
                >
              </div>
              <div
                class="flex justify-between items-center py-1.5"
              >
                <span
                  class="text-slate-600 dark:text-slate-400 font-medium"
                  >Porsiyon:</span
                >
                <span
                  class="font-semibold text-emerald-600 dark:text-emerald-400"
                  >{{
                    selectedFood.portions[0]?.weight
                  }}g</span
                >
              </div>
            </div>
          </div>

          <!-- Makro Besinler -->
          <div
            class="animate-fade-in-up"
            style="animation-delay: 100ms"
          >
            <h3
              class="text-lg sm:text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-500 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 sm:h-6 sm:w-6 mr-2.5 opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A7.962 7.962 0 0112 2c2.498 0 4.73 1.03 6.343 2.686C21.5 6.343 22 9 22 10c0-2 .5-5-2.343-6.657z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 12V2M12 12L6.343 7.343M12 12l5.657-4.657"
                />
              </svg>
              Makro Besinler (100g başına)
            </h3>
            <div
              class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
            >
              <!-- Energy -->
              <div
                class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <span
                  class="nutrient-icon bg-red-100 dark:bg-red-700/50 text-red-600 dark:text-red-400"
                >
                  🔥
                </span>
                <span
                  class="font-medium text-slate-700 dark:text-slate-300 mt-2 text-xs sm:text-sm"
                  >Enerji</span
                >
                <div
                  class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5"
                >
                  {{ selectedFood.nutrients.energy.value }}
                  <span
                    class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400"
                    >{{
                      selectedFood.nutrients.energy.unit
                    }}</span
                  >
                </div>
              </div>
              <!-- Protein -->
              <div
                class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <span
                  class="nutrient-icon bg-blue-100 dark:bg-blue-700/50 text-blue-600 dark:text-blue-400"
                >
                  💪
                </span>
                <span
                  class="font-medium text-slate-700 dark:text-slate-300 mt-2 text-xs sm:text-sm"
                  >Protein</span
                >
                <div
                  class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5"
                >
                  <span
                    v-if="
                      selectedFood.nutrients?.protein
                        ?.value !== undefined
                    "
                  >
                    {{
                      selectedFood.nutrients.protein.value
                    }}
                    <span
                      class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400"
                      >{{
                        selectedFood.nutrients.protein.unit
                      }}</span
                    >
                  </span>
                  <span
                    v-else
                    class="text-sm text-slate-500 dark:text-slate-400"
                    >N/A</span
                  >
                </div>
              </div>
              <!-- Carbohydrate -->
              <div
                class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <span
                  class="nutrient-icon bg-yellow-100 dark:bg-yellow-700/50 text-yellow-600 dark:text-yellow-400"
                >
                  🍞
                </span>
                <span
                  class="font-medium text-slate-700 dark:text-slate-300 mt-2 text-xs sm:text-sm"
                  >Karbonhidrat</span
                >
                <div
                  class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5"
                >
                  <span
                    v-if="
                      selectedFood.nutrients?.carbohydrate
                        ?.value !== undefined
                    "
                  >
                    {{
                      selectedFood.nutrients.carbohydrate
                        .value
                    }}
                    <span
                      class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400"
                      >{{
                        selectedFood.nutrients.carbohydrate
                          .unit
                      }}</span
                    >
                  </span>
                  <span
                    v-else
                    class="text-sm text-slate-500 dark:text-slate-400"
                    >N/A</span
                  >
                </div>
              </div>
              <!-- Fat -->
              <div
                class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <span
                  class="nutrient-icon bg-purple-100 dark:bg-purple-700/50 text-purple-600 dark:text-purple-400"
                >
                  🧈
                </span>
                <span
                  class="font-medium text-slate-700 dark:text-slate-300 mt-2 text-xs sm:text-sm"
                  >Yağ</span
                >
                <div
                  class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5"
                >
                  <span
                    v-if="
                      selectedFood.nutrients?.fat?.value !==
                      undefined
                    "
                  >
                    {{ selectedFood.nutrients.fat.value }}
                    <span
                      class="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400"
                      >{{
                        selectedFood.nutrients.fat.unit
                      }}</span
                    >
                  </span>
                  <span
                    v-else
                    class="text-sm text-slate-500 dark:text-slate-400"
                    >N/A</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Diğer bölümler -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 animate-fade-in-up"
            style="animation-delay: 200ms"
          >
            <!-- Yağ Profili -->
            <div
              class="bg-white dark:bg-slate-800 rounded-lg p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3
                class="text-lg sm:text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-500 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 sm:h-6 sm:w-6 mr-2.5 opacity-80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Yağ Profili
              </h3>
              <div class="space-y-2.5 text-sm sm:text-base">
                <div
                  class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-700/50"
                >
                  <span
                    class="text-slate-600 dark:text-slate-400"
                    >Doymuş Yağ</span
                  >
                  <span
                    class="font-medium text-slate-700 dark:text-slate-300"
                    >{{
                      selectedFood.nutrients.saturatedFat
                        ?.value || 0
                    }}g</span
                  >
                </div>
                <div
                  class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-700/50"
                >
                  <span
                    class="text-slate-600 dark:text-slate-400"
                    >Tekli Doymamış</span
                  >
                  <span
                    class="font-medium text-slate-700 dark:text-slate-300"
                    >{{
                      selectedFood.nutrients
                        .monounsaturatedFat?.value || 0
                    }}g</span
                  >
                </div>
                <div
                  class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-700/50"
                >
                  <span
                    class="text-slate-600 dark:text-slate-400"
                    >Çoklu Doymamış</span
                  >
                  <span
                    class="font-medium text-slate-700 dark:text-slate-300"
                    >{{
                      selectedFood.nutrients
                        .polyunsaturatedFat?.value || 0
                    }}g</span
                  >
                </div>
                <div
                  class="flex justify-between items-center py-1.5"
                >
                  <span
                    class="text-slate-600 dark:text-slate-400"
                    >Kolesterol</span
                  >
                  <span
                    class="font-medium text-slate-700 dark:text-slate-300"
                    >{{
                      selectedFood.nutrients.cholesterol
                        ?.value || 0
                    }}mg</span
                  >
                </div>
              </div>
            </div>

            <!-- Vitaminler ve Mineraller -->
            <div
              class="bg-white dark:bg-slate-800 rounded-lg p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3
                class="text-lg sm:text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-500 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 sm:h-6 sm:w-6 mr-2.5 opacity-80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Vitaminler & Mineraller
              </h3>
              <div
                class="space-y-2.5 text-sm sm:text-base max-h-60 overflow-y-auto pr-2"
              >
                <template v-if="hasVitaminsOrMinerals">
                  <template
                    v-if="
                      selectedFood.vitamins &&
                      Object.keys(selectedFood.vitamins)
                        .length > 0
                    "
                  >
                    <div
                      v-for="(
                        vitamin, key
                      ) in selectedFood.vitamins"
                      :key="`vit-${key}`"
                      class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-700/50"
                    >
                      <span
                        class="text-slate-600 dark:text-slate-400"
                        >Vitamin
                        {{ key.toUpperCase() }}</span
                      >
                      <span
                        class="font-medium text-slate-700 dark:text-slate-300"
                        >{{ vitamin.value }}
                        {{ vitamin.unit }}</span
                      >
                    </div>
                  </template>
                  <template
                    v-if="
                      selectedFood.minerals &&
                      Object.keys(selectedFood.minerals)
                        .length > 0
                    "
                  >
                    <div
                      v-for="(
                        mineral, key
                      ) in selectedFood.minerals"
                      :key="`min-${key}`"
                      class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0"
                    >
                      <span
                        class="text-slate-600 dark:text-slate-400"
                        >{{
                          key.charAt(0).toUpperCase() +
                          key.slice(1)
                        }}</span
                      >
                      <span
                        class="font-medium text-slate-700 dark:text-slate-300"
                        >{{ mineral.value }}
                        {{ mineral.unit }}</span
                      >
                    </div>
                  </template>
                </template>
                <template v-else>
                  <p
                    class="text-slate-500 dark:text-slate-400 text-center py-4"
                  >
                    Bu besin için detaylı vitamin ve mineral
                    bilgisi bulunmamaktadır.
                  </p>
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
import { computed } from 'vue';

useHead({});

const props = defineProps({
  selectedFood: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const handleImageError = event => {
  console.warn(
    'Fotoğraf yüklenemedi, varsayılan gösteriliyor:',
    props.selectedFood.photoUrl
  );
  // The v-else template will handle showing the placeholder
};

const hasVitaminsOrMinerals = computed(() => {
  const hasVitamins =
    props.selectedFood?.vitamins &&
    Object.keys(props.selectedFood.vitamins).length > 0;
  const hasMinerals =
    props.selectedFood?.minerals &&
    Object.keys(props.selectedFood.minerals).length > 0;
  return hasVitamins || hasMinerals;
});
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .dark\:bg-slate-900,
.modal-fade-enter-active .bg-slate-50,
.modal-fade-leave-active .dark\:bg-slate-900,
.modal-fade-leave-active .bg-slate-50 {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from .dark\:bg-slate-900,
.modal-fade-enter-from .bg-slate-50,
.modal-fade-leave-to .dark\:bg-slate-900,
.modal-fade-leave-to .bg-slate-50 {
  transform: scale(0.95) translateY(10px);
}

.nutrient-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* sm:w-10 */
  height: 40px; /* sm:h-10 */
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 1.25rem; /* text-xl */
}

/* Improved animation for content sections */
.animate-fade-in-up {
  animation: fade-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)
    both;
  animation-delay: var(--animation-delay, 0s);
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar for vitamin/mineral list - optional */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}
.max-h-60::-webkit-scrollbar-track {
  background: transparent;
}
.max-h-60::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.dark .max-h-60::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>