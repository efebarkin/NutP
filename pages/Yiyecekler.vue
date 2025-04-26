<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div
      class="bg-gradient-to-r from-green-500 to-green-600 text-white py-16 relative overflow-hidden"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute -right-10 -top-20 w-72 h-72 rounded-full bg-white opacity-10 floating-slow"
        ></div>
        <div
          class="absolute -left-20 -bottom-24 w-96 h-96 rounded-full bg-white opacity-10 floating"
        ></div>
      </div>
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Besin Veritabanı</h1>
        <p class="text-lg md:text-xl opacity-90 animate-slide-in">
          Sağlıklı beslenme yolculuğunuzda size rehberlik ediyoruz
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Arama ve Filtreleme -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 mb-8 transform hover:scale-[1.01] transition-all duration-300 border-t-4 border-green-500"
      >
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Besin ara..."
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                @input="handleSearch"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400 absolute left-3 top-3.5 animate-pulse-subtle"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- İstatistikler -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-green-50 border border-gray-100 hover:border-green-200 stat-card"
        >
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-green-100 rounded-lg animate-pulse-slow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-green-600"
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
            </div>
            <div>
              <div class="text-2xl font-bold counter">{{ stats.totalFoods }}</div>
              <div class="text-sm text-gray-600">Toplam Besin</div>
            </div>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-green-50 border border-gray-100 hover:border-green-200 stat-card delay-100"
        >
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-green-100 rounded-lg animate-pulse-slow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold counter">{{ stats.averageCalories }}</div>
              <div class="text-sm text-gray-600">Ortalama Kalori</div>
            </div>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-green-50 border border-gray-100 hover:border-green-200 stat-card delay-200"
        >
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-green-100 rounded-lg animate-pulse-slow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-green-600"
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
            </div>
            <div>
              <div class="text-2xl font-bold counter">{{ stats.totalCategories }}</div>
              <div class="text-sm text-gray-600">Kategori</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Besin Listesi -->
      <transition-group
        name="food-list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="(food, index) in foods"
          :key="food._id"
          class="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-green-200 food-card"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="p-6 relative">
            <div
              class="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-green-100 rounded-full opacity-50 group-hover:scale-125 transition-all duration-500"
            ></div>

            <div class="flex justify-between items-start mb-4 relative">
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors flex items-center space-x-2"
                >
                  {{ food.name.tr }}
                  <span
                    class="w-2 h-2 bg-green-500 rounded-full animate-ping-slow inline-block ml-2"
                  ></span>
                </h3>
                <p class="text-sm text-gray-600">{{ food.name.en }}</p>
              </div>
              <span
                class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full group-hover:bg-green-200 transition-colors"
              >
                {{ food.category }}
              </span>
            </div>

            <div class="space-y-3 relative">
              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 hover:border-green-100 transition-colors"
              >
                <span class="text-gray-600 flex items-center">
                  <span class="w-3 h-3 rounded-full bg-red-400 mr-2 opacity-75"></span>
                  Kalori
                </span>
                <span class="font-medium"
                  >{{ food.nutrients.energy.value }} {{ food.nutrients.energy.unit }}</span
                >
              </div>
              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 hover:border-green-100 transition-colors"
              >
                <span class="text-gray-600 flex items-center">
                  <span class="w-3 h-3 rounded-full bg-blue-400 mr-2 opacity-75"></span>
                  Protein
                </span>
                <span class="font-medium"
                  >{{ food.nutrients.protein.value }} {{ food.nutrients.protein.unit }}</span
                >
              </div>
              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 hover:border-green-100 transition-colors"
              >
                <span class="text-gray-600 flex items-center">
                  <span class="w-3 h-3 rounded-full bg-yellow-400 mr-2 opacity-75"></span>
                  Karbonhidrat
                </span>
                <span class="font-medium"
                  >{{ food.nutrients.carbohydrate?.value || food.nutrients.carbohydrates?.value || 0 }}
                  {{ food.nutrients.carbohydrate?.unit || food.nutrients.carbohydrates?.unit || 'G' }}</span
                >
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-600 flex items-center">
                  <span class="w-3 h-3 rounded-full bg-purple-400 mr-2 opacity-75"></span>
                  Yağ
                </span>
                <span class="font-medium"
                  >{{ food.nutrients.fat.value }} {{ food.nutrients.fat.unit }}</span
                >
              </div>
            </div>

            <div class="flex space-x-2 mt-4" v-if="authStore.authenticated">
              <button
                @click="addToFavorites(food)"
                class="px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors btn-hover flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Favorilere Ekle
              </button>
              <button
                @click="addToMeal(food)"
                class="px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors btn-hover flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Öğüne Ekle
              </button>
            </div>

            <button
              @click="showDetails(food)"
              class="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 btn-hover shadow-sm hover:shadow-md"
            >
              Detayları Göster
            </button>
          </div>
        </div>
      </transition-group>

      <!-- Pagination -->
      <div class="flex justify-center mt-8 space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          :disabled="currentPage === 1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Önceki
        </button>
        <span class="px-4 py-2 text-sm bg-green-50 text-green-700 font-medium rounded-lg">
          {{ currentPage }} / {{ pagination.pages }}
        </span>
        <button
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === pagination.pages }"
          :disabled="currentPage === pagination.pages"
        >
          Sonraki
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Detay Modalı -->
    <transition name="modal">
      <div
        v-if="selectedFood"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @click="selectedFood = null"
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
              @click="selectedFood = null"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '~/stores/auth';

const toast = useToast();
const authStore = useAuthStore();

const foods = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 12;
const selectedFood = ref(null);
const stats = ref({
  totalFoods: 0,
  averageCalories: 0,
  totalCategories: 0,
  categories: [],
});
const pagination = ref({
  total: 0,
  pages: 1,
});

// Besin listesini getir
const fetchFoods = async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/foods', {
      params: {
        page: currentPage.value,
        limit: itemsPerPage,
        search: searchQuery.value,
      },
    });
    foods.value = response.foods;
    pagination.value = response.pagination;
    stats.value = response.stats;
  } catch (error) {
    console.error('Error fetching foods:', error);
    toast.error('Besinler yüklenirken bir hata oluştu');
  } finally {
    loading.value = false;
  }
};

// Favorilere ekle
const addToFavorites = async food => {
  if (!authStore.authenticated) {
    toast.info('Favorilere eklemek için giriş yapmalısınız', {
      action: {
        text: 'Giriş Yap',
        onClick: () => navigateTo('/login'),
      },
    });
    return;
  }

  try {
    const headers = authStore.getAuthHeader();
    const response = await $fetch('/api/favorites', {
      method: 'POST',
      body: { foodId: food._id },
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

    if (response.alreadyExists) {
      toast.info(response.message);
    } else {
      toast.success(response.message);
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    if (error.response?.status === 401) {
      toast.error('Oturum süreniz dolmuş. Lütfen yeniden giriş yapın.');
      navigateTo('/login');
    } else {
      toast.error(error.data?.message || 'Favorilere eklenirken bir hata oluştu');
    }
  }
};

// Öğüne ekle
const addToMeal = async food => {
  if (!authStore.authenticated) {
    toast.info('Öğün oluşturmak için giriş yapmalısınız', {
      action: {
        text: 'Giriş Yap',
        onClick: () => navigateTo('/login'),
      },
    });
    return;
  }

  try {
    // Şu anki saat
    const now = new Date();
    const hour = now.getHours();

    // Saate göre öğün tipini belirle
    let mealType = 'snack';
    let mealName = 'Ara Öğün';

    if (hour >= 5 && hour < 11) {
      mealType = 'breakfast';
      mealName = 'Kahvaltı';
    } else if (hour >= 11 && hour < 15) {
      mealType = 'lunch';
      mealName = 'Öğle Yemeği';
    } else if (hour >= 15 && hour < 22) {
      mealType = 'dinner';
      mealName = 'Akşam Yemeği';
    }

    const headers = authStore.getAuthHeader();
    await $fetch('/api/meals', {
      method: 'POST',
      body: {
        name: mealName,
        type: mealType,
        date: now.toISOString(),
        foodId: food._id,
        quantity: 100,
      },
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

    toast.success(`Besin ${mealName} öğününe eklendi`);
  } catch (error) {
    console.error('Error adding to meal:', error);
    if (error.response?.status === 401) {
      toast.error('Oturum süreniz dolmuş. Lütfen yeniden giriş yapın.');
      navigateTo('/login');
    } else {
      toast.error('Öğüne eklenirken bir hata oluştu');
    }
  }
};

// Arama yap
const handleSearch = () => {
  currentPage.value = 1;
  fetchFoods();
};

// Sayfa değiştir
const changePage = page => {
  currentPage.value = page;
  fetchFoods();
};

// Detayları göster
const showDetails = food => {
  selectedFood.value = food;
};

onMounted(() => {
  fetchFoods();
});
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

.animate-fade-in {
  animation: fade-in 0.5s ease-in-out;
}

.animate-slide-in {
  animation: slide-in 0.5s ease-in-out;
}

.animate-pulse-subtle {
  animation: pulse-subtle 1.5s infinite ease-in-out;
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

@keyframes pulse-subtle {
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

.floating {
  animation: floating 3s infinite ease-in-out;
}

.floating-slow {
  animation: floating 6s infinite ease-in-out;
}

@keyframes floating {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.stat-card {
  transition: transform 0.3s ease-in-out;
}

.stat-card:hover {
  transform: scale(1.05);
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.counter {
  counter-reset: counter;
}

.counter::before {
  content: counter(counter) '. ';
  counter-increment: counter;
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

.food-list-move {
  transition: transform 0.5s ease;
}

.animate-ping-slow {
  animation: ping-slow 2s infinite ease-in-out;
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.btn-hover {
  transition: transform 0.2s ease-in-out;
}

.btn-hover:hover {
  transform: scale(1.05);
}
</style>