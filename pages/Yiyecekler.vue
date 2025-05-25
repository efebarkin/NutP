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
        <h1
          class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in"
        >
          Besin Veritabanı
        </h1>
        <p
          class="text-lg md:text-xl opacity-90 animate-slide-in"
        >
          Sağlıklı beslenme yolculuğunuzda size rehberlik
          ediyoruz
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

      <!-- Filtreler -->
      <div
        class="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 transition-all duration-300 hover:shadow-lg"
      >
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-lg font-semibold text-gray-800 flex items-center"
          >
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Besin Filtreleri
          </h3>
          <button
            @click="resetFilters"
            class="text-sm text-gray-500 hover:text-green-600 flex items-center transition-colors duration-200"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Filtreleri Sıfırla
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Protein Filtresi -->
          <div class="space-y-2">
            <label
              for="protein"
              class="block text-sm font-medium text-gray-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Protein Miktarı
            </label>
            <div class="relative">
              <select
                v-model="filter.protein"
                id="protein"
                class="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="">Tümü</option>
                <option
                  v-for="protein in proteinCategories"
                  :key="protein"
                  :value="protein"
                >
                  {{
                    protein === 'low'
                      ? 'Düşük (<10g)'
                      : protein === 'medium'
                      ? 'Orta (10-20g)'
                      : 'Yüksek (>20g)'
                  }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Kalori Filtresi -->
          <div class="space-y-2">
            <label
              for="calories"
              class="block text-sm font-medium text-gray-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1 text-green-500"
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
              Kalori Aralığı
            </label>
            <div class="flex space-x-2">
              <div class="relative flex-1">
                <input
                  v-model="filter.minCalories"
                  type="number"
                  placeholder="Min"
                  class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-400 text-sm"
                    >min</span
                  >
                </div>
              </div>
              <div class="relative flex-1">
                <input
                  v-model="filter.maxCalories"
                  type="number"
                  placeholder="Max"
                  class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-400 text-sm"
                    >max</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Kategori Filtresi -->
          <div class="space-y-2">
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Besin Kategorisi
            </label>
            <div class="relative">
              <select
                v-model="selectedCategory"
                id="category"
                class="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="">Tüm Kategoriler</option>
                <option
                  v-for="cat in stats.categories"
                  :key="cat._id"
                  :value="cat._id"
                >
                  {{ cat._id }} ({{ cat.count }})
                </option>
              </select>
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
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
              <div
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Uygula Butonu -->
        <div class="mt-6 flex justify-end">
          <button
            @click="applyFilters"
            class="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center"
            :disabled="loading"
          >
            <svg
              v-if="loading"
              class="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
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
            {{
              loading
                ? 'Yükleniyor...'
                : 'Filtreleri Uygula'
            }}
          </button>
        </div>
      </div>

      <!-- Yükleme Göstergesi -->
      <div
        v-if="loading"
        class="flex justify-center items-center py-12 mb-8"
      >
        <div class="flex flex-col items-center">
          <div
            class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mb-4"
          ></div>
          <p class="text-gray-600 text-lg">
            Besinler yükleniyor...
          </p>
        </div>
      </div>

      <!-- İstatistikler -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-green-50 border border-gray-100 hover:border-green-200 stat-card"
        >
          <div class="flex items-center space-x-4">
            <div
              class="p-3 bg-green-100 rounded-lg animate-pulse-slow"
            >
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
              <div class="text-2xl font-bold counter">
                {{ stats.totalFoods }}
              </div>
              <div class="text-sm text-gray-600">
                Toplam Besin
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-green-50 border border-gray-100 hover:border-green-200 stat-card delay-100"
        >
          <div class="flex items-center space-x-4">
            <div
              class="p-3 bg-green-100 rounded-lg animate-pulse-slow"
            >
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
              <div class="text-2xl font-bold counter">
                {{ stats.averageCalories }}
              </div>
              <div class="text-sm text-gray-600">
                Ortalama Kalori
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-green-50 border border-gray-100 hover:border-green-200 stat-card delay-200"
        >
          <div class="flex items-center space-x-4">
            <div
              class="p-3 bg-green-100 rounded-lg animate-pulse-slow"
            >
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
              <div class="text-2xl font-bold counter">
                {{ stats.totalCategories }}
              </div>
              <div class="text-sm text-gray-600">
                Kategori
              </div>
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
          class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-green-200 food-card relative"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Favorite Button (Top Right of Card) -->
          <button
            v-if="authStore.authenticated"
            @click.stop="addToFavorites(food)"
            class="absolute top-3 right-3 z-20 p-1.5 rounded-full transition-all duration-200 group/favbtn"
            :class="
              isFavorite(food._id)
                ? 'bg-red-100 text-red-500 hover:bg-red-200'
                : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500'
            "
            aria-label="Favorilere ekle/çıkar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              :fill="
                isFavorite(food._id)
                  ? 'currentColor'
                  : 'none'
              "
              viewBox="0 0 24 24"
              :stroke="
                isFavorite(food._id)
                  ? 'none'
                  : 'currentColor'
              "
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <!-- Modern Card Header -->
          <div class="p-5 pb-3">
            <div class="flex items-start space-x-4">
              <!-- Food Photo Avatar -->
              <div class="flex-shrink-0">
                <div class="relative">
                  <template v-if="food.photoUrl">
                    <img
                      :src="food.photoUrl"
                      :alt="food.name.tr"
                      class="w-16 h-16 rounded-xl object-cover ring-2 ring-green-100 group-hover:ring-green-300 transition-all duration-300"
                      @error="
                        handleImageError($event, food)
                      "
                    />
                  </template>
                  <template v-else>
                    <div
                      class="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center ring-2 ring-green-100 group-hover:ring-green-300 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-7 w-7 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Food Info -->
              <div class="flex-1 min-w-0">
                <!-- Wrapper for Name and Category, vertically stacked -->
                <div class="mb-2">
                  <!-- Added mb-2 for spacing below category -->
                  <h3
                    class="text-lg font-semibold text-gray-800 truncate group-hover:text-green-600 transition-colors"
                    :title="food.name"
                  >
                    {{ food.name.tr }}
                  </h3>
                  <!-- Category Badge (Under Name) -->
                  <span
                    class="mt-1 inline-block px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200"
                  >
                    {{ food.category }}
                  </span>
                </div>
                <!-- Old Category Badge location is removed -->
                <!-- Old Calorie Badge location is removed -->
              </div>
            </div>
          </div>

          <!-- Nutrition Grid -->
          <div class="px-5 pb-4">
            <div class="grid grid-cols-3 gap-3">
              <div
                class="text-center p-3 bg-blue-50 rounded-xl border border-blue-100"
              >
                <div
                  class="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-1 flex items-center justify-center"
                >
                  <span class="text-white text-xs font-bold"
                    >P</span
                  >
                </div>
                <div
                  class="text-xs font-semibold text-blue-700"
                >
                  Protein
                </div>
                <div
                  class="text-sm font-bold text-blue-800"
                >
                  {{ food.nutrients.protein.value
                  }}{{ food.nutrients.protein.unit }}
                </div>
              </div>

              <div
                class="text-center p-3 bg-yellow-50 rounded-xl border border-yellow-100"
              >
                <div
                  class="w-6 h-6 bg-yellow-500 rounded-full mx-auto mb-1 flex items-center justify-center"
                >
                  <span class="text-white text-xs font-bold"
                    >K</span
                  >
                </div>
                <div
                  class="text-xs font-semibold text-yellow-700"
                >
                  Karbonhidrat
                </div>
                <div
                  class="text-sm font-bold text-yellow-800"
                >
                  {{
                    food.nutrients.carbohydrate?.value ||
                    food.nutrients.carbohydrates?.value ||
                    0
                  }}{{
                    food.nutrients.carbohydrate?.unit ||
                    food.nutrients.carbohydrates?.unit ||
                    'G'
                  }}
                </div>
              </div>

              <div
                class="text-center p-3 bg-purple-50 rounded-xl border border-purple-100"
              >
                <div
                  class="w-6 h-6 bg-purple-500 rounded-full mx-auto mb-1 flex items-center justify-center"
                >
                  <span class="text-white text-xs font-bold"
                    >Y</span
                  >
                </div>
                <div
                  class="text-xs font-semibold text-purple-700"
                >
                  Yağ
                </div>
                <div
                  class="text-sm font-bold text-purple-800"
                >
                  {{ food.nutrients.fat.value
                  }}{{ food.nutrients.fat.unit }}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-5 pb-5">
            <div class="space-y-3">
              <!-- Quick Actions -->
              <div
                class="flex space-x-2"
                v-if="authStore.authenticated"
              >
                <!-- Calorie Display (New Location, replaces old Favorite Button) -->
                <div
                  class="flex-1 py-2 px-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 flex items-center justify-center text-sm"
                  title="Kalori"
                >
                  <svg
                    class="h-4 w-4 text-orange-500 mr-1.5"
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
                  <span class="font-medium text-gray-800">
                    {{ food.nutrients.energy.value }}
                    {{ food.nutrients.energy.unit }}
                  </span>
                </div>
                <!-- Old Favorite button is removed -->
                <!-- <button
                  @click="addToMeal(food)"
                  class="flex-1 py-2 px-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-medium border border-gray-200 hover:border-blue-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1.5"
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
                </button> -->
              </div>

              <!-- Main Action -->
              <button
                @click="showDetails(food)"
                class="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Detayları Göster
              </button>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Pagination -->
      <div class="flex justify-center mt-8 space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          :class="{
            'opacity-50 cursor-not-allowed':
              currentPage === 1,
          }"
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
        <span
          class="px-4 py-2 text-sm bg-green-50 text-green-700 font-medium rounded-lg"
        >
          {{ currentPage }} / {{ pagination.pages }}
        </span>
        <button
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          :class="{
            'opacity-50 cursor-not-allowed':
              currentPage === pagination.pages,
          }"
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
    <food-details-modal
      v-if="selectedFood"
      :selected-food="selectedFood"
      @close="selectedFood = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '~/stores/auth';
import FoodDetailsModal from '~/components/food/foodDetailsModal.vue';

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
const filter = ref({
  protein: '',
  minCalories: '',
  maxCalories: '',
});

const selectedCategory = ref('');
const proteinCategories = ['low', 'medium', 'high'];
const favoriteIds = ref(new Set());

// Filtreleri sıfırlama fonksiyonu
const resetFilters = () => {
  filter.value = {
    protein: '',
    minCalories: '',
    maxCalories: '',
  };
  selectedCategory.value = '';
  fetchFoods();
};

// Filtreleri uygulama fonksiyonu
const applyFilters = () => {
  fetchFoods();
};

// Favori besinleri getir
const fetchFavorites = async () => {
  if (!authStore.authenticated) return;

  try {
    const headers = authStore.getAuthHeader();
    const response = await $fetch('/api/favorites', {
      headers,
    });
    // Corrected line: response is the array, and each item has 'id'
    favoriteIds.value = new Set(
      response.map(fav => fav.id)
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
    // Optionally, inform the user via toast or other UI element
    // toast.error('Favoriler yüklenirken bir hata oluştu.');
  }
};

// Favoride olup olmadığını kontrol et
const isFavorite = foodId => {
  return favoriteIds.value.has(foodId);
};
// Besin listesini getir
const fetchFoods = async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/foods', {
      params: {
        page: currentPage.value,
        limit: itemsPerPage,
        search: searchQuery.value,
        category: selectedCategory.value,
        minProtein:
          filter.value.protein === 'low'
            ? 0
            : filter.value.protein === 'medium'
            ? 10
            : filter.value.protein === 'high'
            ? 20
            : '',
        maxProtein:
          filter.value.protein === 'low'
            ? 10
            : filter.value.protein === 'medium'
            ? 20
            : '',
        minCalories: filter.value.minCalories,
        maxCalories: filter.value.maxCalories,
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

// Favorilere ekle veya çıkar
const addToFavorites = async food => {
  if (!authStore.authenticated) {
    toast.info(
      'Favorilere eklemek için giriş yapmalısınız',
      {
        action: {
          text: 'Giriş Yap',
          onClick: () => navigateTo('/login'),
        },
      }
    );
    return;
  }

  const headers = authStore.getAuthHeader();
  const foodId = food._id;

  try {
    if (isFavorite(foodId)) {
      // Favorilerden çıkar (DELETE request)
      await $fetch(`/api/favorites/${foodId}`, {
        method: 'DELETE',
        headers,
      });
      favoriteIds.value.delete(foodId);
      toast.success('Besin favorilerden çıkarıldı');
    } else {
      // Favorilere ekle (POST request)
      const response = await $fetch('/api/favorites', {
        method: 'POST',
        body: { foodId }, // Ensure body is correctly formatted JSON
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      });

      // The backend's addFavoriteFood service handles the logic for already existing items.
      // If response.success is true, it means the item was added (or was already there and confirmed).
      if (response.success) {
        favoriteIds.value.add(foodId); // Ensure client-side set is updated
        // Use a generic success message or the one from backend if available and appropriate
        toast.success(
          response.message || 'Besin favorilere eklendi'
        );
      } else if (response.alreadyExists) {
        // This handles the specific case where the backend says it already exists.
        // Ensure client-side set reflects this, though isFavorite should have caught it.
        favoriteIds.value.add(foodId);
        toast.info(
          response.message || 'Besin zaten favorilerinizde'
        );
      } else {
        // Handle other non-success scenarios from POST if the backend returns them
        toast.error(
          response.message ||
            'Favori ekleme işlemi başarısız oldu.'
        );
      }
    }
  } catch (error) {
    console.error('Error in addToFavorites:', error);
    if (error.response?.status === 401) {
      toast.error(
        'Oturum süreniz dolmuş. Lütfen yeniden giriş yapın.'
      );
      navigateTo('/login');
    } else {
      // More specific error for remove vs add could be implemented if needed
      toast.error(
        'Favori işlemi sırasında bir hata oluştu.'
      );
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
      toast.error(
        'Oturum süreniz dolmuş. Lütfen yeniden giriş yapın.'
      );
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

// Resim yükleme hatası işleme
const handleImageError = (event, food) => {
  console.error(
    `Fotoğraf yükleme hatası (${food._id}):`,
    food.photoUrl
  );
  // Hatalı resim için gizle ve placeholder göster
  event.target.style.display = 'none';
};

onMounted(async () => {
  // Önce favorileri yükle (eğer giriş yapılmışsa)
  if (authStore.authenticated) {
    await fetchFavorites();
  }
  // Sonra besinleri yükle
  await fetchFoods();
});
</script>

<style>
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