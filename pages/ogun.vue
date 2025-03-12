<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Ana Başlık ve Dashboard Nav -->
      <header class="mb-8 bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden border-t-4 border-green-500">
        <!-- Dekoratif arka plan deseni -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute right-0 bottom-0">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.9 25.7C39.8 20.5 35.4 16.2 30.2 13.1C25 10 19.1 8.1 13 7.7C6.9 7.3 0.8 8.4 -4.7 11C-10.2 13.6 -14.9 17.6 -18.3 22.6C-21.7 27.6 -23.7 33.4 -24.2 39.5C-24.7 45.6 -23.7 51.7 -21.2 57.3C-18.7 62.9 -14.8 67.7 -9.9 71.2C-5 74.7 0.7 76.8 6.8 77.4" stroke="#34C759" stroke-width="15" stroke-linecap="round"/>
              <path d="M142.9 125.7C139.8 120.5 135.4 116.2 130.2 113.1C125 110 119.1 108.1 113 107.7C106.9 107.3 100.8 108.4 95.3 111C89.8 113.6 85.1 117.6 81.7 122.6C78.3 127.6 76.3 133.4 75.8 139.5C75.3 145.6 76.3 151.7 78.8 157.3C81.3 162.9 85.2 167.7 90.1 171.2C95 174.7 100.7 176.8 106.8 177.4" stroke="#34C759" stroke-width="15" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 flex items-center relative z-10">
          <span class="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl text-white mr-4 shadow-lg transform transition-transform hover:scale-110">
            <i class="fas fa-leaf"></i>
          </span>
          <span class="relative">
            Beslenme Günlüğüm
            <span class="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-500 rounded"></span>
          </span>
        </h1>
        
        <div class="flex items-center space-x-3 relative z-10">
          <button class="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-green-600 transition-all shadow-sm hover:shadow border border-gray-200 flex items-center">
            <i class="fas fa-chart-pie mr-2"></i>İstatistikler
          </button>
          <button class="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-green-600 transition-all shadow-sm hover:shadow border border-gray-200 flex items-center">
            <i class="fas fa-cog mr-2"></i>Ayarlar
          </button>
        </div>
      </header>

      <!-- Ana İçerik Bölümü - Yana Yerleştirilmiş Kartlar -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Sol Panel - Öğün Oluşturma -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden relative">
            <!-- Dekoratif arka plan deseni -->
            <div class="absolute top-0 right-0 w-40 h-40 opacity-5">
              <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="80" cy="80" r="50" stroke="#34C759" stroke-width="60" stroke-dasharray="1 10" />
              </svg>
            </div>
            
            <!-- Öğün Tipi Seçimi - Tab Görünümü -->
            <div class="flex items-center justify-between border-b border-gray-100 relative z-10">
              <div 
                v-for="type in mealTypes" 
                :key="type.value" 
                class="flex-1 text-center py-4 cursor-pointer transition-all flex flex-col items-center"
                :class="mealForm.type === type.value ? getMealTypeActiveClass(type.value) : `hover:bg-gray-50 text-${getMealTypeColor(type.value).replace('bg-', '')}`"
                @click="mealForm.type = type.value"
              >
                <i :class="`fas ${type.icon} text-lg mb-1`"></i>
                <span class="text-sm font-medium">{{ type.label }}</span>
              </div>
            </div>

            <!-- Öğün Detayları Formu -->
            <form @submit.prevent="createMeal" class="p-6 space-y-6 relative z-10">
              <div class="bg-white rounded-2xl p-5 shadow-sm">
                <h3 class="text-lg font-semibold mb-4 flex items-center" :class="`text-${getMealTypeColor(mealForm.type).replace('bg-', '')}`">
                  <i class="fas fa-utensils mr-2" :class="`text-${getMealTypeColor(mealForm.type).replace('bg-', '')}`"></i>
                  Öğün Bilgileri
                </h3>
                
                <div class="flex flex-col mb-6">
                  <label for="meal-name" class="text-sm font-medium mb-1 ml-1" :class="`text-${getMealTypeColor(mealForm.type).replace('bg-', '')}`">Öğün Adı</label>
                  <input
                    id="meal-name"
                    v-model="mealForm.name"
                    type="text"
                    class="px-4 py-3 bg-white rounded-xl border transition-all text-lg font-medium text-gray-900"
                    :class="`border-gray-200 focus:ring-2 focus:ring-${getMealTypeColor(mealForm.type).replace('bg-', '')} focus:border-${getMealTypeColor(mealForm.type).replace('bg-', '')}`"
                    placeholder="Öğün adı..."
                    required
                  >
                </div>

                <div class="flex gap-4 items-center">
                  <div class="w-full">
                    <label for="meal-date" class="text-sm font-medium mb-1 ml-1" :class="`text-${getMealTypeColor(mealForm.type).replace('bg-', '')}`">Tarih ve Saat</label>
                    <input
                      id="meal-date"
                      v-model="mealForm.date"
                      type="datetime-local"
                      class="w-full px-4 py-3 bg-white rounded-xl border transition-all"
                      :class="`border-gray-200 focus:ring-2 focus:ring-${getMealTypeColor(mealForm.type).replace('bg-', '')} focus:border-${getMealTypeColor(mealForm.type).replace('bg-', '')}`"
                      required
                    >
                  </div>
                </div>
              </div>

              <!-- Besin Arama - Genişletilmiş Arama UX -->
              <div class="relative transition-all duration-300">
                <div class="flex items-center mb-4">
                  <div class="flex-1 h-px bg-gray-200"></div>
                  <span class="px-4 py-1 text-white text-xs font-bold rounded-full mx-3 shadow-sm" :class="getMealTypeColor(mealForm.type)">BESİN EKLE</span>
                  <div class="flex-1 h-px bg-gray-200"></div>
                </div>

                <div class="bg-white p-5 rounded-2xl shadow-sm">
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="w-full pl-12 pr-4 py-4 bg-white rounded-xl border transition-all text-lg"
                      :class="`border-gray-200 focus:ring-2 focus:ring-${getMealTypeColor(mealForm.type).replace('bg-', '')} focus:border-${getMealTypeColor(mealForm.type).replace('bg-', '')}`"
                      placeholder="Besin adı yazın..."
                      @input="debounceSearch"
                    >
                    <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                      <i class="fas fa-search text-lg" :class="`text-${getMealTypeColor(mealForm.type).replace('bg-', '')}`"></i>
                    </div>
                  </div>

                  <!-- Arama Sonuçları - Zenginleştirilmiş Görünüm -->
                  <div 
                    v-if="searchResults.length > 0" 
                    class="mt-3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 animate-expandDown"
                  >
                    <div class="p-2 text-white text-xs font-medium" :class="getMealTypeColor(mealForm.type)">
                      {{ searchResults.length }} sonuç bulundu
                    </div>
                    <div class="max-h-60 overflow-y-auto">
                      <div
                        v-for="food in searchResults"
                        :key="food._id"
                        class="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-all border-b border-gray-50 group"
                        @click="selectFood(food)"
                      >
                        <div class="flex items-center">
                          <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform" 
                               :class="`bg-${getMealTypeColor(mealForm.type).replace('bg-', '')}/20 text-${getMealTypeColor(mealForm.type).replace('bg-', '')}`">
                            <i class="fas fa-apple-alt"></i>
                          </div>
                          <span class="font-medium" :class="`text-${getMealTypeColor(mealForm.type).replace('bg-', '')}`">{{ food.name?.tr || food.name }}</span>
                        </div>
                        <div class="flex flex-col items-end">
                          <div class="text-sm font-bold" :class="`text-${getMealTypeColor(mealForm.type).replace('bg-', '')}`">
                            {{ food.nutrients?.energy?.value || 0 }} kcal
                          </div>
                          <div class="text-xs" :class="`text-${getMealTypeColor(mealForm.type).replace('bg-', '')}/70`">
                            100g başına
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Kalori Özeti -->
              <div v-if="selectedFoods.length > 0" class="p-5 rounded-2xl text-white shadow-lg mb-4" :class="getMealTypeColor(mealForm.type)">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <i class="fas fa-fire text-2xl"></i>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-white/80">TOPLAM KALORİ</span>
                      <div class="text-2xl font-bold">{{ totalCalories }} kcal</div>
                    </div>
                  </div>
                  <div class="text-xs bg-white/20 px-3 py-1 rounded-full">
                    {{ selectedFoods.length }} besin
                  </div>
                </div>
              </div>

              <!-- Öğün Kaydet Butonu -->
              <button
                type="submit"
                class="w-full py-4 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl focus:ring-4 transition-all flex items-center justify-center space-x-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="`${getMealTypeColor(mealForm.type)} hover:${getMealTypeColor(mealForm.type).replace('bg-', 'bg-')}-dark focus:ring-${getMealTypeColor(mealForm.type).replace('bg-', '')}/30`"
                :disabled="isSubmitting || selectedFoods.length === 0 || !mealForm.name || !mealForm.type || !mealForm.date"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  İşleniyor...
                </span>
                <span v-else class="flex items-center">
                  <i class="fas fa-check-circle mr-2"></i>
                  Öğünü Kaydet
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Sağ Panel - Seçilen Besinler ve Öğün Listesi -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Seçilen Besinler -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-green-500 text-white p-5 relative">
              <!-- Dekoratif arka plan deseni -->
              <div class="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11 11C11 8.79086 12.7909 7 15 7H85C87.2091 7 89 8.79086 89 11V89C89 91.2091 87.2091 93 85 93H15C12.7909 93 11 91.2091 11 89V11ZM15 11H85V89H15V11Z" fill="white" fill-opacity="0.2"/>
                  <rect x="20" y="20" width="60" height="4" rx="2" fill="white" fill-opacity="0.2"/>
                  <rect x="20" y="30" width="60" height="4" rx="2" fill="white" fill-opacity="0.2"/>
                  <rect x="20" y="40" width="60" height="4" rx="2" fill="white" fill-opacity="0.2"/>
                  <rect x="20" y="50" width="40" height="4" rx="2" fill="white" fill-opacity="0.2"/>
                </svg>
              </div>
              
              <h2 class="text-xl font-bold flex items-center relative z-10">
                <i class="fas fa-clipboard-list mr-3"></i>
                Seçilen Besinler
              </h2>
            </div>

            <div class="p-6">
              <div v-if="selectedFoods.length > 0" class="space-y-3">
                <transition-group name="food-list" tag="div" class="space-y-3">
                  <div
                    v-for="food in selectedFoods"
                    :key="food._id"
                    class="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md group"
                  >
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <i class="fas fa-apple-alt text-green-600 text-xl"></i>
                      </div>
                      <div>
                        <h3 class="font-medium text-green-600">{{ food.name?.tr || food.name }}</h3>
                        <div class="flex items-center text-sm text-green-500">
                          <i class="fas fa-fire-alt mr-1 text-xs"></i>
                          {{ calculateFoodCalories(food) }} kcal
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-3">
                      <div class="relative w-24">
                        <input
                          v-model="food.quantity"
                          type="number"
                          min="1"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          @input="updateTotalCalories"
                        >
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">g</span>
                      </div>
                      
                      <button
                        type="button"
                        @click="removeFood(food)"
                        class="w-9 h-9 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 flex items-center justify-center transition-all transform hover:scale-110"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </transition-group>
              </div>

              <div v-else class="text-center py-10">
                <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <i class="fas fa-utensils text-green-300 text-4xl"></i>
                </div>
                <h3 class="text-xl font-medium text-green-600 mb-3">Henüz besin seçilmedi</h3>
                <p class="text-green-500 mb-6 max-w-md mx-auto">Öğününüze eklemek için yukarıdaki arama kutusunu kullanın.</p>
              </div>
            </div>
          </div>

          <!-- Öğün Listesi -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-green-500 text-white p-5 relative">
              <!-- Dekoratif arka plan deseni -->
              <div class="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11 11C11 8.79086 12.7909 7 15 7H85C87.2091 7 89 8.79086 89 11V89C89 91.2091 87.2091 93 85 93H15C12.7909 93 11 91.2091 11 89V11ZM15 11H85V89H15V11Z" fill="white" fill-opacity="0.2"/>
                  <rect x="20" y="20" width="60" height="4" rx="2" fill="white" fill-opacity="0.2"/>
                  <rect x="20" y="30" width="60" height="4" rx="2" fill="white" fill-opacity="0.2"/>
                  <rect x="20" y="40" width="60" height="4" rx="2" fill="white" fill-opacity="0.2"/>
                  <rect x="20" y="50" width="40" height="4" rx="2" fill="white" fill-opacity="0.2"/>
                </svg>
              </div>
              
              <h2 class="text-xl font-bold flex items-center relative z-10">
                <i class="fas fa-calendar-day mr-3"></i>
                Öğünlerim
              </h2>
            </div>
            
            <!-- Tarih Filtreleme Bölümü -->
            <div class="bg-green-50 p-4 border-b border-green-100">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-green-600 mb-1">Filtreleme Türü</label>
                      <select 
                        v-model="filterType" 
                        class="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all"
                      >
                        <option value="all">Tüm Öğünler</option>
                        <option value="range">Tarih Aralığı</option>
                      </select>
                    </div>
                     
                    <template v-if="filterType === 'range'">
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-green-600 mb-1">Başlangıç Tarihi</label>
                        <input 
                          type="date" 
                          v-model="filterStartDate" 
                          class="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all"
                        />
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-green-600 mb-1">Bitiş Tarihi</label>
                        <input 
                          type="date" 
                          v-model="filterEndDate" 
                          class="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all"
                        />
                      </div>
                    </template>
                  </div>
                </div>
                
                <div class="flex items-end">
                  <button 
                    @click="applyFilters" 
                    class="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 duration-300 flex items-center justify-center"
                  >
                    <i class="fas fa-filter mr-2"></i>
                    Filtrele
                  </button>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div v-if="filteredMeals.length > 0" class="space-y-6">
                <div 
                  v-for="meal in paginatedMeals" 
                  :key="meal._id" 
                  class="rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md transform hover:scale-101 duration-300"
                  :class="[
                    meal.type === 'breakfast' ? 'bg-yellow-600/5' : '',
                    meal.type === 'lunch' ? 'bg-purple-600/5' : '',
                    meal.type === 'dinner' ? 'bg-red-800/5' : '',
                    meal.type === 'snack' ? 'bg-green-500/5' : ''
                  ]"
                >
                  <!-- Öğün Başlığı -->
                  <div class="flex items-center justify-between p-5 border-b"
                       :class="[
                         meal.type === 'breakfast' ? 'bg-yellow-600/20 border-yellow-600/20' : '',
                         meal.type === 'lunch' ? 'bg-purple-600/20 border-purple-600/20' : '',
                         meal.type === 'dinner' ? 'bg-red-800/20 border-red-800/20' : '',
                         meal.type === 'snack' ? 'bg-green-500/20 border-green-500/20' : ''
                       ]">
                    <div class="flex items-center">
                      <div :class="`w-12 h-12 rounded-full ${getMealTypeColor(meal.type)} flex items-center justify-center mr-4 text-white shadow-md transform transition-all hover:scale-110 duration-300`">
                        <i :class="`fas ${getMealTypeIcon(meal.type)} text-xl`"></i>
                      </div>
                      <div>
                        <h3 class="text-lg font-bold" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">{{ meal.name }}</h3>
                        <div class="flex items-center text-sm" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}/70`">
                          <i class="far fa-calendar-alt mr-1"></i>
                          {{ formatDate(meal.date) }}
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <div class="px-4 py-2 bg-white rounded-xl shadow-sm">
                        <div class="flex items-center font-bold" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                          <i class="fas fa-fire-alt mr-2" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`"></i>
                          {{ calculateMealCalories(meal) }} kcal
                        </div>
                      </div>
                      <button
                        @click="toggleFoodList(meal._id)"
                        class="w-10 h-10 rounded-full flex items-center justify-center transition-all transform hover:scale-110 duration-300"
                        :class="`bg-${getMealTypeColor(meal.type).replace('bg-', '')}/20 text-${getMealTypeColor(meal.type).replace('bg-', '')}`"
                      >
                        <i :class="expandedMeals.includes(meal._id) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                      </button>
                      <button
                        @click="deleteMeal(meal._id)"
                        class="w-10 h-10 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 flex items-center justify-center transition-all transform hover:scale-110 duration-300"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                  <!-- Makro Besin Özeti -->
                  <div class="p-3 border-b"
                       :class="[
                         meal.type === 'breakfast' ? 'bg-yellow-600/15 border-yellow-600/20' : '',
                         meal.type === 'lunch' ? 'bg-purple-600/15 border-purple-600/20' : '',
                         meal.type === 'dinner' ? 'bg-red-800/15 border-red-800/20' : '',
                         meal.type === 'snack' ? 'bg-green-500/15 border-green-500/20' : ''
                       ]">
                    <div class="grid grid-cols-3 gap-2 text-center">
                      <div class="bg-white p-2 rounded-lg shadow-sm transform transition-all hover:scale-105 duration-300">
                        <div class="text-xs font-medium" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}/70`">Protein</div>
                        <div class="font-bold flex items-center justify-center" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                          <i class="fas fa-drumstick-bite mr-1" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`"></i>
                          {{ calculateMealProtein(meal) }}g
                        </div>
                      </div>
                      <div class="bg-white p-2 rounded-lg shadow-sm transform transition-all hover:scale-105 duration-300">
                        <div class="text-xs font-medium" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}/70`">Karbonhidrat</div>
                        <div class="font-bold flex items-center justify-center" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                          <i class="fas fa-bread-slice mr-1" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`"></i>
                          {{ calculateMealCarbs(meal) }}g
                        </div>
                      </div>
                      <div class="bg-white p-2 rounded-lg shadow-sm transform transition-all hover:scale-105 duration-300">
                        <div class="text-xs font-medium" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}/70`">Yağ</div>
                        <div class="font-bold flex items-center justify-center" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                          <i class="fas fa-cheese mr-1" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`"></i>
                          {{ calculateMealFat(meal) }}g
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Öğündeki Besinler - Açılır Kapanır Panel -->
                  <div v-if="expandedMeals.includes(meal._id)" class="p-5 transition-all duration-300 transform origin-top"
                       :class="[
                         meal.type === 'breakfast' ? 'bg-yellow-600/10' : '',
                         meal.type === 'lunch' ? 'bg-purple-600/10' : '',
                         meal.type === 'dinner' ? 'bg-red-800/10' : '',
                         meal.type === 'snack' ? 'bg-green-500/10' : ''
                       ]">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        v-for="food in meal.foods" 
                        :key="food._id"
                        class="bg-white p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md transform hover:scale-102 duration-300 overflow-hidden"
                      >
                        <div class="flex items-center mb-2">
                          <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-3" :class="`bg-${getMealTypeColor(meal.type).replace('bg-', '')}/20 text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                            <i class="fas fa-apple-alt"></i>
                          </div>
                          <div class="flex-1">
                            <h4 class="font-medium" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">{{ food.foodId.name?.tr || food.foodId.name }}</h4>
                            <div class="text-xs" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}/70`">
                              {{ food.quantity.value }}g
                            </div>
                          </div>
                        </div>
                        
                        <!-- Besin Makro Bilgileri -->
                        <div class="grid grid-cols-4 gap-2 mt-2 p-2 rounded-lg" :class="`bg-${getMealTypeColor(meal.type).replace('bg-', '')}/10`">
                          <div class="text-center">
                            <div class="text-xs font-medium flex items-center justify-center" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                              <i class="fas fa-fire-alt mr-1"></i>
                            </div>
                            <div class="text-xs font-bold">{{ calculateFoodCaloriesInMeal(food) }} kcal</div>
                          </div>
                          <div class="text-center">
                            <div class="text-xs font-medium flex items-center justify-center" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                              <i class="fas fa-drumstick-bite mr-1"></i>
                            </div>
                            <div class="text-xs font-bold">{{ calculateFoodProteinInMeal(food) }}g</div>
                          </div>
                          <div class="text-center">
                            <div class="text-xs font-medium flex items-center justify-center" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                              <i class="fas fa-bread-slice mr-1"></i>
                            </div>
                            <div class="text-xs font-bold">{{ calculateFoodCarbsInMeal(food) }}g</div>
                          </div>
                          <div class="text-center">
                            <div class="text-xs font-medium flex items-center justify-center" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                              <i class="fas fa-cheese mr-1"></i>
                            </div>
                            <div class="text-xs font-bold">{{ calculateFoodFatInMeal(food) }}g</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Öğündeki Besinler Özeti (Kapalı Durumda) -->
                  <div v-if="!expandedMeals.includes(meal._id)" class="p-3 flex justify-center items-center cursor-pointer"
                       :class="[
                         meal.type === 'breakfast' ? 'bg-yellow-600/5 hover:bg-yellow-600/10' : '',
                         meal.type === 'lunch' ? 'bg-purple-600/5 hover:bg-purple-600/10' : '',
                         meal.type === 'dinner' ? 'bg-red-800/5 hover:bg-red-800/10' : '',
                         meal.type === 'snack' ? 'bg-green-500/5 hover:bg-green-500/10' : '',
                         'transition-all duration-300'
                       ]"
                       @click="toggleFoodList(meal._id)">
                    <span class="text-sm font-medium flex items-center" :class="`text-${getMealTypeColor(meal.type).replace('bg-', '')}`">
                      <i class="fas fa-utensils mr-2"></i>
                      {{ meal.foods.length }} besin göster
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Boş Durum Mesajı -->
              <div v-else-if="filteredMeals.length === 0" class="text-center py-10 animate-fadeIn">
                <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <i class="fas fa-utensils text-green-300 text-3xl"></i>
                </div>
                <h3 class="text-lg font-medium text-green-600 mb-2">
                  {{ isFiltering ? 'Filtrelenen tarih aralığında öğün bulunamadı' : 'Henüz öğün kaydınız bulunmuyor' }}
                </h3>
                <p class="text-green-500">
                  {{ isFiltering ? 'Farklı bir tarih aralığı seçin veya tüm öğünleri görüntüleyin' : 'İlk öğününüzü oluşturarak başlayın!' }}
                </p>
                <div class="flex justify-center mt-4 space-x-4">
                  <button 
                    v-if="isFiltering"
                    @click="resetFilters" 
                    class="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all transform hover:scale-105 duration-300 shadow-md flex items-center"
                  >
                    <i class="fas fa-undo mr-2"></i>Filtreleri Sıfırla
                  </button>
                  <button 
                    @click="scrollToMealForm" 
                    class="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all transform hover:scale-105 duration-300 shadow-md flex items-center"
                  >
                    <i class="fas fa-plus-circle mr-2"></i>Öğün Ekle
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div v-if="filteredMeals.length > itemsPerPage" class="mt-6 flex justify-center">
              <div class="flex space-x-2">
                <button 
                  @click="prevPage" 
                  :disabled="currentPage === 1"
                  :class="[
                    'px-3 py-1 rounded-lg transition-all duration-300',
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200 transform hover:scale-105'
                  ]"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                
                <button 
                  v-for="page in totalPages" 
                  :key="page" 
                  @click="goToPage(page)"
                  :class="[
                    'px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-105',
                    currentPage === page 
                      ? 'bg-green-500 text-white' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button 
                  @click="nextPage" 
                  :disabled="currentPage === totalPages"
                  :class="[
                    'px-3 py-1 rounded-lg transition-all duration-300',
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200 transform hover:scale-105'
                  ]"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import debounce from 'lodash/debounce';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '~/stores/auth';

import { navigateTo } from '#app';

const toast = useToast();
const authStore = useAuthStore();

// Öğün tipleri tanımı
const mealTypes = [
  { value: 'breakfast', label: 'Kahvaltı', icon: 'fa-coffee' },
  { value: 'lunch', label: 'Öğle', icon: 'fa-hamburger' },
  { value: 'dinner', label: 'Akşam', icon: 'fa-utensils' },
  { value: 'snack', label: 'Ara Öğün', icon: 'fa-apple-alt' }
];

const mealForm = ref({
  name: '',
  type: 'breakfast',
  date: new Date().toISOString().slice(0, 16)
});

const searchQuery = ref('');
const searchResults = ref([]);
const selectedFoods = ref([]);
const meals = ref([]);
const isSubmitting = ref(false);
const totalCalories = ref(0);

// Filtreleme ve sayfalama için değişkenler
const filterType = ref('all');
const filterDate = ref(new Date().toISOString().split('T')[0]);
const filterStartDate = ref(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
const filterEndDate = ref(new Date().toISOString().split('T')[0]);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const isFiltering = ref(false);

// Filtreleme ve sayfalama için computed değerler
const filteredMeals = computed(() => {
  if (filterType.value === 'all') {
    return meals.value;
  }
  
  return meals.value.filter(meal => {
    const mealDate = new Date(meal.date);
    mealDate.setHours(0, 0, 0, 0);
    
    if (filterType.value === 'range') {
      const startDate = new Date(filterStartDate.value);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(filterEndDate.value);
      endDate.setHours(23, 59, 59, 999);
      
      return mealDate >= startDate && mealDate <= endDate;
    }
    
    return true;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredMeals.value.length / itemsPerPage.value);
});

const paginatedMeals = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredMeals.value.slice(startIndex, endIndex);
});

// Debounced search function
const debounceSearch = useDebounceFn(async () => {
  if (!searchQuery.value) {
    searchResults.value = [];
    return;
  }

  try {
    const headers = authStore.getAuthHeader();
    const response = await $fetch('/api/foods/search', {
      method: 'POST',
      body: { query: searchQuery.value },
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    searchResults.value = response.foods || [];
  } catch (error) {
    console.error('Search error:', error);
    searchResults.value = [];
    toast.error('Besin arama sırasında bir hata oluştu');
  }
}, 300);

const selectFood = (food) => {
  if (!selectedFoods.value.find(f => f._id === food._id)) {
    selectedFoods.value.push({
      ...food,
      quantity: 100
    });
    updateTotalCalories();
    
    // Başarılı ekleme bildirimi
    toast.success(`${food.name?.tr || food.name} başarıyla eklendi`, {
      icon: true,
      timeout: 2000
    });

    // Reset search query
    searchQuery.value = '';
    searchResults.value = [];
  } else {
    toast.info(`${food.name?.tr || food.name} zaten eklenmiş`, {
      icon: true,
      timeout: 2000
    });
  }
};

const removeFood = (food) => {
  selectedFoods.value = selectedFoods.value.filter(f => f._id !== food._id);
  updateTotalCalories();
  toast.info(`${food.name?.tr || food.name} çıkarıldı`, {
    icon: true,
    timeout: 2000
  });
};

const calculateFoodCalories = (food) => {
  const baseCalories = food.nutrients?.energy?.value || 0;
  return Math.round((baseCalories * food.quantity) / 100);
};

const calculateMealFoodCalories = (food) => {
  const baseCalories = food.foodId.nutrients?.energy?.value || 0;
  return Math.round((baseCalories * food.quantity.value) / 100);
};

const updateTotalCalories = () => {
  totalCalories.value = selectedFoods.value.reduce((total, food) => {
    return total + calculateFoodCalories(food);
  }, 0);
};

const getMealTypeIcon = (type) => {
  const icons = {
    breakfast: 'fa-coffee',
    lunch: 'fa-hamburger',
    dinner: 'fa-utensils',
    snack: 'fa-apple-alt'
  };
  return icons[type] || 'fa-utensils';
};

const getMealTypeColor = (type) => {
  const colors = {
    breakfast: 'bg-yellow-600',
    lunch: 'bg-purple-600',  // Lila renk
    dinner: 'bg-red-800',    // Bordo renk
    snack: 'bg-green-500'
  };
  return colors[type] || 'bg-green-500';
};

const getMealTypeActiveClass = (type) => {
  const classes = {
    breakfast: 'bg-yellow-600 text-white',
    lunch: 'bg-purple-600 text-white',  // Lila renk
    dinner: 'bg-red-800 text-white',    // Bordo renk
    snack: 'bg-green-500 text-white'
  };
  return classes[type] || 'bg-green-600 text-white';
};

const createMeal = async () => {
  if (selectedFoods.value.length === 0) {
    toast.warning('En az bir besin eklemelisiniz', {
      icon: true,
      timeout: 3000
    });
    return;
  }

  isSubmitting.value = true;
  try {
    const headers = authStore.getAuthHeader();
    const mealData = {
      name: mealForm.value.name || 'Yeni Öğün',
      type: mealForm.value.type,
      date: mealForm.value.date,
      foods: selectedFoods.value.map(food => ({
        foodId: food._id,
        quantity: parseInt(food.quantity || 100)
      }))
    };

    const response = await $fetch('/api/meals', {
      method: 'POST',
      body: mealData,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (response.success) {
      toast.success('Öğün başarıyla oluşturuldu', {
        icon: true,
        timeout: 3000
      });

      // Reset form
      mealForm.value = {
        name: '',
        type: 'breakfast',
        date: new Date().toISOString().slice(0, 16)
      };
      selectedFoods.value = [];
      updateTotalCalories();
      
      // Refresh meals list
      await fetchMeals();
    }
  } catch (error) {
    console.error('Error creating meal:', error);
    toast.error(error.data?.message || 'Öğün oluşturulurken bir hata oluştu', {
      icon: true,
      timeout: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteMeal = async (mealId) => {
  if (!confirm('Bu öğünü silmek istediğinizden emin misiniz?')) {
    return;
  }

  try {
    const headers = authStore.getAuthHeader();
    await $fetch(`/api/meals/${mealId}`, {
      method: 'DELETE',
      headers
    });
    toast.success('Öğün başarıyla silindi', {
      icon: true,
      timeout: 2000
    });
    await fetchMeals();
  } catch (error) {
    console.error('Error deleting meal:', error);
    toast.error('Öğün silinirken bir hata oluştu', {
      icon: true,
      timeout: 3000
    });
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateMealCalories = (meal) => {
  return Math.round(meal.foods.reduce((total, food) => {
    const baseCalories = food.foodId.nutrients?.energy?.value || 0;
    return total + (baseCalories * food.quantity.value) / 100;
  }, 0));
};

const calculateFoodCaloriesInMeal = (food) => {
  const baseCalories = food.foodId.nutrients?.energy?.value || 0;
  return Math.round((baseCalories * food.quantity.value) / 100);
};

const calculateMealProtein = (meal) => {
  return Math.round(meal.foods.reduce((total, food) => {
    const baseProtein = food.foodId.nutrients?.protein?.value || 0;
    return total + (baseProtein * food.quantity.value) / 100;
  }, 0));
};

const calculateMealCarbs = (meal) => {
  return Math.round(meal.foods.reduce((total, food) => {
    const baseCarbs = food.foodId.nutrients?.carbohydrate?.value || 0;
    return total + (baseCarbs * food.quantity.value) / 100;
  }, 0));
};

const calculateMealFat = (meal) => {
  return Math.round(meal.foods.reduce((total, food) => {
    const baseFat = food.foodId.nutrients?.fat?.value || 0;
    return total + (baseFat * food.quantity.value) / 100;
  }, 0));
};

const calculateFoodProteinInMeal = (food) => {
  const baseProtein = food.foodId.nutrients?.protein?.value || 0;
  return Math.round((baseProtein * food.quantity.value) / 100);
};

const calculateFoodCarbsInMeal = (food) => {
  const baseCarbs = food.foodId.nutrients?.carbohydrate?.value || 0;
  return Math.round((baseCarbs * food.quantity.value) / 100);
};

const calculateFoodFatInMeal = (food) => {
  const baseFat = food.foodId.nutrients?.fat?.value || 0;
  return Math.round((baseFat * food.quantity.value) / 100);
};

const applyFilters = () => {
  isFiltering.value = filterType.value !== 'all';
  currentPage.value = 1;
};

const resetFilters = () => {
  filterType.value = 'all';
  filterDate.value = new Date().toISOString().split('T')[0];
  filterStartDate.value = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
  filterEndDate.value = new Date().toISOString().split('T')[0];
  isFiltering.value = false;
  currentPage.value = 1;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// Filtreleme değiştiğinde sayfa numarasını sıfırla
watch([filterType, filterDate, filterStartDate, filterEndDate], () => {
  currentPage.value = 1;
});

const fetchMeals = async () => {
  try {
    const headers = authStore.getAuthHeader();
    const response = await $fetch('/api/meals', {
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    // Tarihe göre sıralama (en yeni tarih en üstte)
    meals.value = (response.meals || []).sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  } catch (error) {
    console.error('Error fetching meals:', error);
    meals.value = [];
    toast.error('Öğünleriniz yüklenirken bir hata oluştu', {
      icon: true,
      timeout: 3000
    });
  }
};

const scrollToMealForm = () => {
  // Sayfa başına scroll
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Öğün adı input'una odaklan
  setTimeout(() => {
    document.getElementById('meal-name')?.focus();
  }, 800);
};

const expandedMeals = ref([]);

const toggleFoodList = (mealId) => {
  if (expandedMeals.value.includes(mealId)) {
    expandedMeals.value = expandedMeals.value.filter(id => id !== mealId);
  } else {
    expandedMeals.value.push(mealId);
  }
};

onMounted(() => {
  fetchMeals();
});
</script>

<style scoped>
/* Animasyonlar */
.animate-pulse {
  animation: pulse 2s infinite;
}

.animate-expandDown {
  animation: expandDown 0.3s ease-out forwards;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes expandDown {
  0% {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
    transform-origin: top;
  }
}

/* Hareket Animasyonları */
.food-list-enter-active,
.food-list-leave-active {
  transition: all 0.4s ease;
}

.food-list-enter-from,
.food-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.food-list-move {
  transition: transform 0.4s;
}

.meal-cards-enter-active,
.meal-cards-leave-active {
  transition: all 0.5s ease;
}

.meal-cards-enter-from,
.meal-cards-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.meal-cards-move {
  transition: transform 0.5s;
}

/* Scrollbar Özelleştirme */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #34C759;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2ecc71;
}

/* Yeni animasyonlar */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-pulse {
  animation: pulse 2s infinite;
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

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.hover\:scale-101:hover {
  transform: scale(1.01);
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

/* Öğün tipi renk varyasyonları */
.bg-yellow-600-dark {
  background-color: #b45309;
}

.bg-purple-600-dark {
  background-color: #7e22ce;
}

.bg-red-800-dark {
  background-color: #991b1b;
}

.bg-green-500-dark {
  background-color: #16a34a;
}
</style>