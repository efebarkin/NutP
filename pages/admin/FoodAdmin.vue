<template>
  <div>
    
    <!-- Action Bar -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="relative w-full sm:w-64">
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Besin ara..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            @keyup.enter="fetchFoods(searchTerm)"
          >
          <div class="absolute left-3 top-2.5 text-gray-400">
            <i class="fas fa-search"></i>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <button 
            @click="fetchFoods(searchTerm)"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            <span>Yenile</span>
          </button>
          <button 
            @click="showAddModal = true"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <i class="fas fa-plus"></i>
            <span>Yeni Ekle</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Toplam Besin</p>
                <h3 class="text-2xl font-bold text-gray-800">{{ foods.length }}</h3>
              </div>
              <div class="bg-blue-100 p-3 rounded-full">
                <i class="fas fa-apple-alt text-blue-600"></i>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Toplam Kategori</p>
                <h3 class="text-2xl font-bold text-gray-800">{{ getUniqueCategories().length }}</h3>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
                <i class="fas fa-folder text-purple-600"></i>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Son Eklenen</p>
                <h3 class="text-2xl font-bold text-gray-800">
                  {{ foods.length > 0 ? (foods[0].name?.tr || foods[0].name || 'İsimsiz') : 'Yok' }}
                </h3>
              </div>
              <div class="bg-green-100 p-3 rounded-full">
                <i class="fas fa-clock text-green-600"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Food Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50">
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center space-x-1 cursor-pointer" @click="sortBy('name')">
                      <span>Besin Adı</span>
                      <i class="fas fa-sort text-gray-400"></i>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center space-x-1 cursor-pointer" @click="sortBy('category')">
                      <span>Kategori</span>
                      <i class="fas fa-sort text-gray-400"></i>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center space-x-1 cursor-pointer" @click="sortBy('energy')">
                      <span>Enerji (kcal)</span>
                      <i class="fas fa-sort text-gray-400"></i>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center space-x-1">
                      <span>Protein (g)</span>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center space-x-1">
                      <span>Durum</span>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loading">
                  <td colspan="6" class="px-6 py-10 text-center">
                    <div class="flex justify-center">
                      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                    </div>
                    <p class="mt-2 text-sm text-gray-500">Besinler yükleniyor...</p>
                  </td>
                </tr>
                <tr v-else-if="!loading && foods.length === 0">
                  <td colspan="6" class="px-6 py-10 text-center">
                    <div class="flex flex-col items-center justify-center">
                      <div class="bg-gray-100 rounded-full p-3">
                        <i class="fas fa-search text-gray-400 text-xl"></i>
                      </div>
                      <p class="mt-2 text-sm text-gray-500">
                        {{ searchTerm ? 'Eşleşen besin bulunamadı.' : 'Gösterilecek besin yok.' }}
                      </p>
                      <button v-if="searchTerm" @click="searchTerm = ''; fetchFoods()" class="mt-2 text-sm text-green-600 hover:text-green-700">
                        Aramayı Temizle
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-for="food in foods" :key="food._id" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        <!-- Debug için URL'yi konsola yazdır -->
                        <template v-if="food.photoUrl">
                          <img :src="food.photoUrl" class="h-full w-full object-cover" alt="Besin fotoğrafı" @error="handleImageError($event, food)" />
                        </template>
                        <i v-else class="fas fa-utensils text-gray-500"></i>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ food.name?.tr || food.name || 'İsimsiz' }}</div>
                        <div class="text-xs text-gray-500">ID: {{ food._id.substring(0, 8) }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ food.category || 'Kategorisiz' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ food.nutrients?.energy?.value || 0 }} kcal
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ food.nutrients?.protein?.value || 0 }} g
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-3">
                      <button 
                        @click="openEditModal(food._id)" 
                        class="text-gray-500 hover:text-gray-700 transition-colors" 
                        title="Düzenle"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="text-gray-500 hover:text-gray-700 transition-colors" title="Detaylar">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        @click="confirmDeleteFood(food._id)" 
                        class="text-red-500 hover:text-red-700 transition-colors"
                        title="Sil"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1 flex justify-between sm:hidden">
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Geri
                </button>
                <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  İleri
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    <span class="font-medium">{{ foods.length }}</span> sonuçtan <span class="font-medium">1</span>-<span class="font-medium">{{ Math.min(foods.length, 20) }}</span> arası gösteriliyor
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span class="sr-only">Önceki</span>
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-green-600">
                      2
                    </button>
                    <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      8
                    </button>
                    <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span class="sr-only">Sonraki</span>
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            © 2025 NutriDash. Tüm hakları saklıdır.
          </div>
          <div class="text-sm text-gray-500">
            v1.2.0
          </div>
        </div>
      </footer>

  <!-- Edit Food Modal -->
  <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Besin Düzenle</h3>
        <button @click="closeEditModal" class="text-gray-400 hover:text-gray-500">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Modal Body with Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loadingFoodDetails" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
          <p class="ml-3 text-sm text-gray-500">Besin bilgileri yükleniyor...</p>
        </div>
        
        <form v-else @submit.prevent="updateFood" class="space-y-6">
          <!-- Basic Information Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Temel Bilgiler</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Name Fields -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Türkçe İsim</label>
                <input 
                  v-model="editingFood.name.tr" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">İngilizce İsim</label>
                <input 
                  v-model="editingFood.name.en" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
              </div>
              
              <!-- Category & Source -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input 
                  v-model="editingFood.category" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kaynak</label>
                <input 
                  v-model="editingFood.source" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
              </div>
              
              <!-- Photo Upload -->
              <div class="col-span-1 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Fotoğraf</label>
                <div class="flex items-start space-x-4">
                  <!-- Preview Image -->
                  <div v-if="editingFood.photoUrl || previewImage" class="w-24 h-24 border rounded-md overflow-hidden">
                    <img :src="previewImage || editingFood.photoUrl" class="w-full h-full object-cover" alt="Besin fotoğrafı" />
                  </div>
                  <div v-else class="w-24 h-24 border rounded-md flex items-center justify-center bg-gray-100">
                    <i class="fas fa-image text-gray-400 text-2xl"></i>
                  </div>
                  
                  <!-- Upload Controls -->
                  <div class="flex-1">
                    <input 
                      ref="photoInput"
                      type="file" 
                      accept="image/*"
                      class="hidden"
                      @change="handlePhotoChange"
                    >
                    <div class="flex space-x-2">
                      <button 
                        type="button" 
                        @click="triggerPhotoUpload"
                        class="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <i class="fas fa-upload mr-1"></i> Fotoğraf Seç
                      </button>
                      <button 
                        v-if="editingFood.photoUrl || previewImage"
                        type="button" 
                        @click="removePhoto"
                        class="px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <i class="fas fa-trash mr-1"></i> Kaldır
                      </button>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">PNG, JPG veya JPEG. Max 2MB.</p>
                    <p v-if="photoUploadError" class="mt-1 text-xs text-red-500">{{ photoUploadError }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Main Nutrients Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Temel Besin Değerleri</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Energy -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Enerji (kcal)</label>
                <input 
                  v-model.number="editingFood.nutrients.energy.value" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
              </div>
              
              <!-- Protein -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <input 
                  v-model.number="editingFood.nutrients.protein.value" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
              </div>
              
              <!-- Fat -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Yağ (g)</label>
                <input 
                  v-model.number="editingFood.nutrients.fat.value" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
              </div>
              
              <!-- Carbohydrates -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Karbonhidrat (g)</label>
                <input 
                  v-model.number="editingFood.nutrients.carbohydrate.value" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
              </div>
              
              <!-- Fiber -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Lif (g)</label>
                <input 
                  v-model.number="editingFood.nutrients.fiber.value" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
              </div>
              
              <!-- Sugar -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Şeker (g)</label>
                <input 
                  v-model.number="editingFood.nutrients.sugar.value" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
              </div>
            </div>
          </div>
          
          <!-- Additional Nutrients (Collapsible) -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <button 
              type="button" 
              @click="showAdvancedNutrients = !showAdvancedNutrients" 
              class="flex items-center justify-between w-full text-left"
            >
              <h4 class="text-sm font-medium text-gray-700">Detaylı Besin Değerleri</h4>
              <i :class="[showAdvancedNutrients ? 'fa-chevron-up' : 'fa-chevron-down', 'fas text-gray-500']"></i>
            </button>
            
            <div v-if="showAdvancedNutrients" class="mt-3">
              <!-- Fat Details -->
              <div class="mb-4">
                <h5 class="text-sm font-medium text-gray-700 mb-2">Yağ Detayları</h5>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Doymuş Yağ (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.saturatedFat.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tekli Doymamış Yağ (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.monounsaturatedFat.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Çoklu Doymamış Yağ (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.polyunsaturatedFat.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Trans Yağ (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.transFat.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Omega-3 (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.omega3.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Omega-6 (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.omega6.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kolesterol (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.cholesterol.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Minerals Section -->
              <div class="mb-4">
                <button 
                  type="button" 
                  @click="showMinerals = !showMinerals" 
                  class="flex items-center justify-between w-full text-left mb-2"
                >
                  <h5 class="text-sm font-medium text-gray-700">Mineraller</h5>
                  <i :class="[showMinerals ? 'fa-chevron-up' : 'fa-chevron-down', 'fas text-gray-500']"></i>
                </button>
                
                <div v-if="showMinerals" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kalsiyum (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.calcium.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Demir (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.iron.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Magnezyum (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.magnesium.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fosfor (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.phosphorus.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Potasyum (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.potassium.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sodyum (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.sodium.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Çinko (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.zinc.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bakır (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.copper.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Manganez (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.manganese.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Selenyum (μg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.selenium.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Florür (μg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.fluoride.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Krom (μg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.minerals.chromium.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Vitamins Section -->
              <div class="mb-4">
                <button 
                  type="button" 
                  @click="showVitamins = !showVitamins" 
                  class="flex items-center justify-between w-full text-left mb-2"
                >
                  <h5 class="text-sm font-medium text-gray-700">Vitaminler</h5>
                  <i :class="[showVitamins ? 'fa-chevron-up' : 'fa-chevron-down', 'fas text-gray-500']"></i>
                </button>
                
                <div v-if="showVitamins" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin A (μg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.a.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin C (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.c.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin D (IU)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.d.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin E (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.e.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin K (μg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.k.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin B1 (Tiamin) (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.b1.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin B2 (Riboflavin) (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.b2.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin B3 (Niasin) (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.b3.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin B5 (Pantotenik Asit) (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.b5.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin B6 (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.b6.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin B7 (Biotin) (μg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.b7.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin B9 (Folat) (μg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.b9.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vitamin B12 (μg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.vitamins.b12.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Amino Acids Section -->
              <div class="mb-4">
                <button 
                  type="button" 
                  @click="showAminoAcids = !showAminoAcids" 
                  class="flex items-center justify-between w-full text-left mb-2"
                >
                  <h5 class="text-sm font-medium text-gray-700">Amino Asitler</h5>
                  <i :class="[showAminoAcids ? 'fa-chevron-up' : 'fa-chevron-down', 'fas text-gray-500']"></i>
                </button>
                
                <div v-if="showAminoAcids" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Triptofan (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.aminoAcids.tryptophan.value" 
                      type="number" 
                      min="0" 
                      step="0.001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Treonin (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.aminoAcids.threonine.value" 
                      type="number" 
                      min="0" 
                      step="0.001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">İzolösin (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.aminoAcids.isoleucine.value" 
                      type="number" 
                      min="0" 
                      step="0.001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Lösin (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.aminoAcids.leucine.value" 
                      type="number" 
                      min="0" 
                      step="0.001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Lizin (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.aminoAcids.lysine.value" 
                      type="number" 
                      min="0" 
                      step="0.001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Metiyonin (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.aminoAcids.methionine.value" 
                      type="number" 
                      min="0" 
                      step="0.001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fenilalanin (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.aminoAcids.phenylalanine.value" 
                      type="number" 
                      min="0" 
                      step="0.001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Valin (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.aminoAcids.valine.value" 
                      type="number" 
                      min="0" 
                      step="0.001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Histidin (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.aminoAcids.histidine.value" 
                      type="number" 
                      min="0" 
                      step="0.001"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Others Section -->
              <div class="mb-4">
                <button 
                  type="button" 
                  @click="showOthers = !showOthers" 
                  class="flex items-center justify-between w-full text-left mb-2"
                >
                  <h5 class="text-sm font-medium text-gray-700">Diğer Besin Değerleri</h5>
                  <i :class="[showOthers ? 'fa-chevron-up' : 'fa-chevron-down', 'fas text-gray-500']"></i>
                </button>
                
                <div v-if="showOthers" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kafein (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.others.caffeine.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Alkol (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.others.alcohol.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Su (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.others.water.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kül (g)</label>
                    <input 
                      v-model.number="editingFood.nutrients.others.ash.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teobromin (mg)</label>
                    <input 
                      v-model.number="editingFood.nutrients.others.theobromine.value" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Metadata Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Meta Bilgiler</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ekleyen</label>
                <input 
                  v-model="editingFood.metadata.addedBy" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Orijinal Kategori</label>
                <input 
                  v-model="editingFood.metadata.originalCategory" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
              </div>
              <div class="flex items-center">
                <input 
                  id="isVerified" 
                  v-model="editingFood.metadata.isVerified" 
                  type="checkbox" 
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                >
                <label for="isVerified" class="ml-2 block text-sm text-gray-700">Doğrulanmış</label>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
        <button 
          @click="closeEditModal" 
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          İptal
        </button>
        <button 
          @click="updateFood" 
          :disabled="updating"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
        >
          <i v-if="updating" class="fas fa-spinner fa-spin mr-2"></i>
          <span>{{ updating ? 'Güncelleniyor...' : 'Kaydet' }}</span>
        </button>
      </div>
    </div>
  </div>
  <!-- Yeni Besin Ekleme Modalı -->
  <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Arka plan overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeAddModal"></div>

      <!-- Modal içeriği -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Modal Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Yeni Besin Ekle</h3>
          <button @click="closeAddModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <form @submit.prevent="addFood" class="space-y-6">
            <!-- Temel Bilgiler -->
            <div class="bg-white p-4 rounded-lg">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Temel Bilgiler</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Türkçe İsim</label>
                  <input 
                    v-model="editingFood.name.tr" 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ingilizce İsim</label>
                  <input 
                    v-model="editingFood.name.en" 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select 
                    v-model="editingFood.category" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Seçiniz...</option>
                    <option value="fruit">Meyve</option>
                    <option value="vegetable">Sebze</option>
                    <option value="meat">Et</option>
                    <option value="dairy">Süt Ürünü</option>
                    <option value="grain">Tahıl</option>
                    <option value="beverage">İçecek</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kaynak</label>
                  <input 
                    v-model="editingFood.source" 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                </div>
              </div>
              
              <!-- Fotoğraf Yükleme -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Fotoğraf</label>
                <div class="flex items-center">
                  <div v-if="editingFood.photoUrl || previewImage" class="mr-4">
                    <img 
                      :src="previewImage || editingFood.photoUrl" 
                      alt="Besin fotoğrafı" 
                      class="w-24 h-24 object-cover rounded-md border border-gray-300"
                    >
                  </div>
                  <div class="flex flex-col">
                    <div class="flex space-x-2">
                      <button 
                        type="button" 
                        @click="triggerPhotoUpload" 
                        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <i class="fas fa-upload mr-1"></i> Yükle
                      </button>
                      <button 
                        v-if="editingFood.photoUrl || previewImage" 
                        type="button" 
                        @click="removePhoto" 
                        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <i class="fas fa-trash mr-1"></i> Kaldır
                      </button>
                    </div>
                    <input 
                      ref="photoInput" 
                      type="file" 
                      accept="image/jpeg,image/png,image/jpg,image/webp" 
                      class="hidden" 
                      @change="handlePhotoChange"
                    >
                    <p v-if="photoUploadError" class="mt-1 text-sm text-red-600">{{ photoUploadError }}</p>
                    <p v-if="photoUploading" class="mt-1 text-sm text-gray-500">
                      <i class="fas fa-spinner fa-spin mr-1"></i> Fotoğraf yükleniyor...
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Besin Değerleri -->
            <div class="bg-white p-4 rounded-lg">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Temel Besin Değerleri</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Enerji (kcal)</label>
                  <input 
                    v-model.number="editingFood.nutrients.energy.value" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                  <input 
                    v-model.number="editingFood.nutrients.protein.value" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Karbonhidrat (g)</label>
                  <input 
                    v-model.number="editingFood.nutrients.carbohydrate.value" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Yağ (g)</label>
                  <input 
                    v-model.number="editingFood.nutrients.fat.value" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Lif (g)</label>
                  <input 
                    v-model.number="editingFood.nutrients.fiber.value" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Şeker (g)</label>
                  <input 
                    v-model.number="editingFood.nutrients.sugar.value" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button 
            @click="closeAddModal" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            İptal
          </button>
          <button 
            @click="addFood" 
            :disabled="adding"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
          >
            <i v-if="adding" class="fas fa-spinner fa-spin mr-2"></i>
            <span>{{ adding ? 'Ekleniyor...' : 'Kaydet' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useHead } from '#app';
import Swal from 'sweetalert2';
import role from '~/middleware/role';


// Sayfa başlığını ayarla
useHead({ titleTemplate: '%s | Besin Yönetimi' });

// Besin listesi ve yüklenme durumu
const foods = ref([]);
const loading = ref(true);
const categories = ref([]);

// Arama terimi
const searchTerm = ref('');

// Sıralama ayarları
const sortConfig = ref({
  key: null,
  direction: 'asc'
});

// Arama zamanlayıcısı
let searchTimeout = null;

// Düzenleme modalı için state
const showEditModal = ref(false);
const editingFoodId = ref(null);
const loadingFoodDetails = ref(false);
const updating = ref(false);
const showAdvancedNutrients = ref(false);
const showMinerals = ref(false);
const showVitamins = ref(false);
const showAminoAcids = ref(false);

// Ekleme modalı için state
const showAddModal = ref(false);
const adding = ref(false);
const showOthers = ref(false);

// Fotoğraf yükleme ile ilgili durumlar
const photoInput = ref(null);
const previewImage = ref(null);
const photoFile = ref(null);
const photoUploading = ref(false);
const photoUploadError = ref('');

// Düzenlenen besin için boş şablon
const editingFood = reactive({
  name: { tr: '', en: '' },
  category: '',
  source: '',
  photoUrl: '',
  nutrients: {
    energy: { value: 0, unit: 'KCAL' },
    protein: { value: 0, unit: 'G' },
    fat: { value: 0, unit: 'G' },
    carbohydrate: { value: 0, unit: 'G' },
    carbohydrates: { value: 0, unit: 'G' },
    fiber: { value: 0, unit: 'G' },
    sugar: { value: 0, unit: 'G' },
    cholesterol: { value: 0, unit: 'MG' },
    saturatedFat: { value: 0, unit: 'G' },
    monounsaturatedFat: { value: 0, unit: 'G' },
    polyunsaturatedFat: { value: 0, unit: 'G' },
    transFat: { value: 0, unit: 'G' },
    omega3: { value: 0, unit: 'G' },
    omega6: { value: 0, unit: 'G' },
    // Amino Acids
    aminoAcids: {
      tryptophan: { value: 0, unit: 'G' },
      threonine: { value: 0, unit: 'G' },
      isoleucine: { value: 0, unit: 'G' },
      leucine: { value: 0, unit: 'G' },
      lysine: { value: 0, unit: 'G' },
      methionine: { value: 0, unit: 'G' },
      phenylalanine: { value: 0, unit: 'G' },
      valine: { value: 0, unit: 'G' },
      histidine: { value: 0, unit: 'G' }
    },
    // Minerals
    minerals: {
      calcium: { value: 0, unit: 'MG' },
      iron: { value: 0, unit: 'MG' },
      magnesium: { value: 0, unit: 'MG' },
      phosphorus: { value: 0, unit: 'MG' },
      potassium: { value: 0, unit: 'MG' },
      sodium: { value: 0, unit: 'MG' },
      zinc: { value: 0, unit: 'MG' },
      copper: { value: 0, unit: 'MG' },
      selenium: { value: 0, unit: 'UG' },
      manganese: { value: 0, unit: 'MG' },
      fluoride: { value: 0, unit: 'UG' },
      chromium: { value: 0, unit: 'UG' }
    },
    // Vitamins
    vitamins: {
      c: { value: 0, unit: 'MG' },
      b1: { value: 0, unit: 'MG' },
      b2: { value: 0, unit: 'MG' },
      b3: { value: 0, unit: 'MG' },
      b5: { value: 0, unit: 'MG' },
      b6: { value: 0, unit: 'MG' },
      b7: { value: 0, unit: 'UG' },
      b9: { value: 0, unit: 'UG' },
      b12: { value: 0, unit: 'UG' },
      a: { value: 0, unit: 'UG' },
      e: { value: 0, unit: 'MG' },
      d: { value: 0, unit: 'IU' },
      k: { value: 0, unit: 'UG' }
    },
    // Others
    others: {
      caffeine: { value: 0, unit: 'MG' },
      alcohol: { value: 0, unit: 'G' },
      water: { value: 0, unit: 'G' },
      ash: { value: 0, unit: 'G' },
      theobromine: { value: 0, unit: 'MG' }
    }
  },
  portions: [],
  metadata: {
    fdcId: '',
    addedBy: '',
    originalCategory: '',
    isVerified: false
  }
});

// Bileşen yüklendiğinde besinleri çek
onMounted(async () => {
  await fetchFoods();
});

// Resim yükleme hatasını işleyen fonksiyon
function handleImageError(event, food) {
  console.error(`Fotoğraf yükleme hatası (${food._id}):`, food.photoUrl);
  // Hatalı resim için varsayılan ikon göster
  event.target.style.display = 'none';
}

// Besinleri API'den çeken fonksiyon
async function fetchFoods(searchQuery = '') {
  loading.value = true;
  try {
    // API endpoint'ine query parametreleri ekle
    const params = new URLSearchParams({
      search: searchQuery || '',
      page: '1',
      limit: '50' // Admin panelinde daha fazla besin gösterelim
    });
    
    // Endpoint'i oluştur ve API'yi çağır
    const response = await fetch(`/api/foods?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API'den gelen yanıtı işle
    if (data && data.foods) {
      console.log('Besinler yüklendi:', data.foods.length);
      
      // Besinleri işle ve fotoğraf URL'lerini kontrol et
      foods.value = data.foods.map(food => {
        // Her besinin fotoğraf URL'sini konsola yazdır (debug için)
        if (food.photoUrl) {
          console.log(`Besin ${food._id} fotoğraf URL:`, food.photoUrl);
        }
        return food;
      });
      
      // Kategorileri güncelle
      categories.value = getUniqueCategories();
    } else {
      console.warn('API beklenmeyen format döndürdü:', data);
      foods.value = [];
    }
  } catch (err) {
    console.error('Besinleri getirirken hata:', err);
    showToast('error', 'Besinleri getirirken bir hata oluştu.');
    foods.value = [];
  } finally {
    loading.value = false;
  }
}

// Benzersiz kategorileri al
function getUniqueCategories() {
  const categories = [];
  foods.value.forEach(food => {
    if (food.category && !categories.includes(food.category)) {
      categories.push(food.category);
    }
  });
  return categories;
}

// Sıralama fonksiyonu
function sortBy(key) {
  if (sortConfig.value.key === key) {
    // Aynı sütuna tekrar tıklandığında sıralamayı tersine çevir
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    // Farklı bir sütuna tıklandığında varsayılan olarak artan sıralama yap
    sortConfig.value.key = key;
    sortConfig.value.direction = 'asc';
  }
  
  // Sıralama uygula
  foods.value.sort((a, b) => {
    let valueA, valueB;
    
    if (key === 'name') {
      valueA = a.name?.tr || a.name || '';
      valueB = b.name?.tr || b.name || '';
    } else if (key === 'category') {
      valueA = a.category || '';
      valueB = b.category || '';
    } else if (key === 'energy') {
      valueA = a.nutrients?.energy?.value || 0;
      valueB = b.nutrients?.energy?.value || 0;
      // Sayısal değerleri karşılaştır
      return sortConfig.value.direction === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    // Metin değerlerini karşılaştır
    if (sortConfig.value.direction === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });
}

// Arama terimini izle ve gecikmeli API çağrısı yap
watch(searchTerm, (newSearchTerm) => {
  // Önceki zamanlayıcıyı temizle
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Yeni zamanlayıcı oluştur (300ms gecikme)
  searchTimeout = setTimeout(() => {
    fetchFoods(newSearchTerm);
  }, 300);
});

// SweetAlert2 ile bildirim gösterme fonksiyonu
function showToast(type, message) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  Toast.fire({
    icon: type, // 'success', 'error', 'warning', 'info', 'question'
    title: message
  });
}

// Silme işlemini onaylayan fonksiyon (SweetAlert2 ile)
function confirmDeleteFood(id) {
  Swal.fire({
    title: 'Emin misiniz?',
    text: 'Bu besini silmek istediğinizden emin misiniz?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Evet, sil!',
    cancelButtonText: 'İptal'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteFood(id);
    }
  });
}

// Düzenleme modalını açma fonksiyonu
async function openEditModal(id) {
  editingFoodId.value = id;
  loadingFoodDetails.value = true;
  showEditModal.value = true;
  showAdvancedNutrients.value = false;
  
  try {
    const response = await fetch(`/api/foods/${id}`);
    
    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data) {
      // Tüm alanları doldur, eksik alanlar için varsayılan değerler kullan
      const food = data; // API doğrudan besin nesnesini döndürüyor
      console.log('Besin detayları yüklendi:', food);
      
      // Temel alanlar
      editingFood.name.tr = food.name?.tr || '';
      editingFood.name.en = food.name?.en || '';
      editingFood.category = food.category || '';
      editingFood.source = food.source || '';
      editingFood.photoUrl = food.photoUrl || '';
      
      // Fotoğraf yükleme durumlarını sıfırla
      previewImage.value = null;
      photoFile.value = null;
      photoUploadError.value = '';
      
      // Besin değerleri
      const nutrients = food.nutrients || {};
      
      // Karbonhidrat alanı için özel kontrol
      // Veritabanında carbohydrates olarak saklanıyor olabilir
      if (nutrients.carbohydrates && !nutrients.carbohydrate) {
        nutrients.carbohydrate = { ...nutrients.carbohydrates };
      }
      
      // Ana besin değerleri için kontrol et ve değeri ata
      Object.keys(editingFood.nutrients).forEach(key => {
        if (key === 'aminoAcids' || key === 'minerals' || key === 'vitamins' || key === 'others') {
          // Nested kategoriler için özel işlem
          return;
        }
        
        if (nutrients[key]) {
          editingFood.nutrients[key].value = nutrients[key].value || 0;
          editingFood.nutrients[key].unit = nutrients[key].unit || editingFood.nutrients[key].unit;
        } else {
          editingFood.nutrients[key].value = 0;
        }
      });
      
      // Amino asitler için - hem food.aminoAcids hem de food.nutrients.aminoAcids'i kontrol et
      const aminoAcids = food.aminoAcids || {};
      Object.keys(editingFood.nutrients.aminoAcids).forEach(key => {
        if (aminoAcids[key]) {
          editingFood.nutrients.aminoAcids[key].value = aminoAcids[key].value || 0;
          editingFood.nutrients.aminoAcids[key].unit = aminoAcids[key].unit || editingFood.nutrients.aminoAcids[key].unit;
        }
      });
      
      // Mineraller için - hem food.minerals hem de food.nutrients.minerals'i kontrol et
      const minerals = food.minerals || {};
      Object.keys(editingFood.nutrients.minerals).forEach(key => {
        if (minerals[key]) {
          editingFood.nutrients.minerals[key].value = minerals[key].value || 0;
          editingFood.nutrients.minerals[key].unit = minerals[key].unit || editingFood.nutrients.minerals[key].unit;
        } else if (nutrients[key]) {
          // Eğer ana nutrients içinde varsa, minerals'a da kopyala
          editingFood.nutrients.minerals[key].value = nutrients[key].value || 0;
          editingFood.nutrients.minerals[key].unit = nutrients[key].unit || editingFood.nutrients.minerals[key].unit;
        }
      });
      
      // Vitaminler için - hem food.vitamins hem de food.nutrients.vitamins'i kontrol et
      const vitamins = food.vitamins || {};
      Object.keys(editingFood.nutrients.vitamins).forEach(key => {
        if (vitamins[key]) {
          editingFood.nutrients.vitamins[key].value = vitamins[key].value || 0;
          editingFood.nutrients.vitamins[key].unit = vitamins[key].unit || editingFood.nutrients.vitamins[key].unit;
        } else {
          // Vitamin adları eşleştirmesi
          const vitaminMap = {
            'a': 'vitaminA',
            'c': 'vitaminC',
            'd': 'vitaminD',
            'e': 'vitaminE',
            'b1': 'thiamin',
            'b2': 'riboflavin',
            'b3': 'niacin',
            'b6': 'vitaminB6',
            'b9': 'folate',
            'b12': 'vitaminB12'
          };
          
          const mappedKey = vitaminMap[key];
          if (mappedKey && nutrients[mappedKey]) {
            editingFood.nutrients.vitamins[key].value = nutrients[mappedKey].value || 0;
            editingFood.nutrients.vitamins[key].unit = nutrients[mappedKey].unit || editingFood.nutrients.vitamins[key].unit;
          }
        }
      });
      
      // Diğer besin değerleri için - hem food.others hem de food.nutrients'daki ilgili değerleri kontrol et
      const others = food.others || {};
      Object.keys(editingFood.nutrients.others).forEach(key => {
        if (others[key]) {
          editingFood.nutrients.others[key].value = others[key].value || 0;
          editingFood.nutrients.others[key].unit = others[key].unit || editingFood.nutrients.others[key].unit;
        } else if (nutrients[key]) {
          // Eğer ana nutrients içinde varsa, others'a da kopyala
          editingFood.nutrients.others[key].value = nutrients[key].value || 0;
          editingFood.nutrients.others[key].unit = nutrients[key].unit || editingFood.nutrients.others[key].unit;
        }
      });
      
      // Porsiyonlar
      editingFood.portions = Array.isArray(food.portions) ? [...food.portions] : [];
      
      // Metadata
      const metadata = food.metadata || {};
      editingFood.metadata.fdcId = metadata.fdcId || '';
      editingFood.metadata.addedBy = metadata.addedBy || '';
      editingFood.metadata.originalCategory = metadata.originalCategory || '';
      editingFood.metadata.isVerified = metadata.isVerified || false;
      
    } else {
      showToast('error', 'Besin bilgileri alınamadı');
      closeEditModal();
    }
  } catch (err) {
    console.error('Besin detaylarını getirirken hata:', err);
    showToast('error', 'Besin detaylarını getirirken bir hata oluştu: ' + err.message);
    closeEditModal();
  } finally {
    loadingFoodDetails.value = false;
  }
}

// Düzenleme modalını kapatma fonksiyonu
function closeEditModal() {
  showEditModal.value = false;
  editingFoodId.value = null;
}

// Besin güncelleme fonksiyonu
async function updateFood() {
  if (!editingFoodId.value) return;
  
  updating.value = true;
  
  try {
    // Veri uyumluluğu için nutrients objesini hazırla
    const nutrients = { ...editingFood.nutrients };
    
    // Karbonhidrat alanının uyumluluğunu sağla
    if (nutrients.carbohydrate) {
      nutrients.carbohydrates = { ...nutrients.carbohydrate };
    }
    
    // Nested kategorileri doğru şekilde kaydetmek için ayrı objeler oluştur
    const aminoAcids = { ...nutrients.aminoAcids };
    const minerals = { ...nutrients.minerals };
    const vitamins = { ...nutrients.vitamins };
    const others = { ...nutrients.others };
    
    // Vitamin adlarını ana nutrients objesine de ekle
    const vitaminMap = {
      'a': 'vitaminA',
      'c': 'vitaminC',
      'd': 'vitaminD',
      'e': 'vitaminE',
      'b1': 'thiamin',
      'b2': 'riboflavin',
      'b3': 'niacin',
      'b6': 'vitaminB6',
      'b9': 'folate',
      'b12': 'vitaminB12'
    };
    
    // Vitamin değerlerini ana nutrients objesine de kopyala
    Object.keys(vitamins).forEach(key => {
      const mappedKey = vitaminMap[key];
      if (mappedKey) {
        nutrients[mappedKey] = { ...vitamins[key] };
      }
    });
    
    // Nested kategorileri nutrients objesinden çıkar (API'ye ayrı gönderilecek)
    delete nutrients.aminoAcids;
    delete nutrients.minerals;
    delete nutrients.vitamins;
    delete nutrients.others;
    
    // Auth store'u kullan
    const authStore = useAuthStore();
    
    const response = await fetch(`/api/foods/${editingFoodId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': authStore.csrfToken
      },
      body: JSON.stringify({
        name: editingFood.name,
        category: editingFood.category,
        source: editingFood.source,
        photoUrl: editingFood.photoUrl,
        nutrients: nutrients,
        aminoAcids: aminoAcids,
        minerals: minerals,
        vitamins: vitamins,
        others: others,
        portions: editingFood.portions,
        metadata: editingFood.metadata
      })
    });
    
    if (!response.ok) {
      throw new Error(`Güncelleme işlemi başarısız: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      showToast('success', 'Besin başarıyla güncellendi');
      await fetchFoods(searchTerm.value); // Listeyi yenile
      closeEditModal();
    } else {
      showToast('error', result.message || 'Güncelleme işlemi başarısız oldu');
    }
  } catch (err) {
    console.error('Güncelleme hatası:', err);
    showToast('error', 'Güncelleme sırasında bir hata oluştu: ' + (err.message || ''));
  } finally {
    updating.value = false;
  }
}

// editingFood nesnesini sıfırlama fonksiyonu
function resetEditingFood() {
  // editingFood'u varsayılan değerlerine sıfırla
  Object.assign(editingFood, {
    name: { tr: '', en: '' },
    category: '',
    source: '',
    photoUrl: '',
    nutrients: {
      energy: { value: 0, unit: 'KCAL' },
      protein: { value: 0, unit: 'G' },
      fat: { value: 0, unit: 'G' },
      carbohydrate: { value: 0, unit: 'G' },
      fiber: { value: 0, unit: 'G' },
      sugar: { value: 0, unit: 'G' },
      cholesterol: { value: 0, unit: 'MG' },
      saturatedFat: { value: 0, unit: 'G' },
      monounsaturatedFat: { value: 0, unit: 'G' },
      polyunsaturatedFat: { value: 0, unit: 'G' },
      transFat: { value: 0, unit: 'G' },
      omega3: { value: 0, unit: 'G' },
      omega6: { value: 0, unit: 'G' },
      aminoAcids: {
        tryptophan: { value: 0, unit: 'G' },
        threonine: { value: 0, unit: 'G' },
        isoleucine: { value: 0, unit: 'G' },
        leucine: { value: 0, unit: 'G' },
        lysine: { value: 0, unit: 'G' },
        methionine: { value: 0, unit: 'G' },
        phenylalanine: { value: 0, unit: 'G' },
        valine: { value: 0, unit: 'G' },
        histidine: { value: 0, unit: 'G' }
      },
      minerals: {
        calcium: { value: 0, unit: 'MG' },
        iron: { value: 0, unit: 'MG' },
        magnesium: { value: 0, unit: 'MG' },
        phosphorus: { value: 0, unit: 'MG' },
        potassium: { value: 0, unit: 'MG' },
        sodium: { value: 0, unit: 'MG' },
        zinc: { value: 0, unit: 'MG' },
        copper: { value: 0, unit: 'MG' },
        selenium: { value: 0, unit: 'UG' },
        manganese: { value: 0, unit: 'MG' },
        fluoride: { value: 0, unit: 'UG' },
        chromium: { value: 0, unit: 'UG' }
      },
      vitamins: {
        c: { value: 0, unit: 'MG' },
        b1: { value: 0, unit: 'MG' },
        b2: { value: 0, unit: 'MG' },
        b3: { value: 0, unit: 'MG' },
        b5: { value: 0, unit: 'MG' },
        b6: { value: 0, unit: 'MG' },
        b7: { value: 0, unit: 'UG' },
        b9: { value: 0, unit: 'UG' },
        b12: { value: 0, unit: 'UG' },
        a: { value: 0, unit: 'UG' },
        e: { value: 0, unit: 'MG' },
        d: { value: 0, unit: 'IU' },
        k: { value: 0, unit: 'UG' }
      },
      others: {
        caffeine: { value: 0, unit: 'MG' },
        alcohol: { value: 0, unit: 'G' },
        water: { value: 0, unit: 'G' },
        ash: { value: 0, unit: 'G' },
        theobromine: { value: 0, unit: 'MG' }
      }
    },
    portions: [],
    metadata: {
      fdcId: '',
      addedBy: '',
      originalCategory: '',
      isVerified: false
    }
  });
  
  // Fotoğraf ile ilgili durumları sıfırla
  previewImage.value = null;
  photoFile.value = null;
  photoUploadError.value = '';
}

// Besin ekleme modalını kapatma fonksiyonu
function closeAddModal() {
  showAddModal.value = false;
  // Formu sıfırla
  resetEditingFood();
}

// Yeni besin ekleme fonksiyonu
async function addFood() {
  adding.value = true;
  
  try {
    // Veri uyumluluğu için nutrients objesini hazırla
    const nutrients = { ...editingFood.nutrients };
    
    // Karbonhidrat alanının uyumluluğunu sağla
    if (nutrients.carbohydrate) {
      nutrients.carbohydrates = { ...nutrients.carbohydrate };
    }
    
    // Nested kategorileri doğru şekilde kaydetmek için ayrı objeler oluştur
    const aminoAcids = { ...nutrients.aminoAcids };
    const minerals = { ...nutrients.minerals };
    const vitamins = { ...nutrients.vitamins };
    const others = { ...nutrients.others };
    
    // Vitamin adlarını ana nutrients objesine de ekle
    const vitaminMap = {
      'a': 'vitaminA',
      'c': 'vitaminC',
      'd': 'vitaminD',
      'e': 'vitaminE',
      'b1': 'thiamin',
      'b2': 'riboflavin',
      'b3': 'niacin',
      'b6': 'vitaminB6',
      'b9': 'folate',
      'b12': 'vitaminB12'
    };
    
    // Vitamin değerlerini ana nutrients objesine de kopyala
    Object.keys(vitamins).forEach(key => {
      const mappedKey = vitaminMap[key];
      if (mappedKey) {
        nutrients[mappedKey] = { ...vitamins[key] };
      }
    });
    
    // Nested kategorileri nutrients objesinden çıkar (API'ye ayrı gönderilecek)
    delete nutrients.aminoAcids;
    delete nutrients.minerals;
    delete nutrients.vitamins;
    delete nutrients.others;
    
    // Metadata bilgilerini ekle
    const metadata = {
      addedBy: 'admin', // Varsayılan olarak admin
      isVerified: true,  // Varsayılan olarak doğrulanmış
      originalCategory: editingFood.category
    };
    
    // Auth store'u kullan
    const authStore = useAuthStore();
    
    const response = await fetch('/api/foods/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': authStore.csrfToken
      },
      body: JSON.stringify({
        name: editingFood.name,
        category: editingFood.category,
        source: editingFood.source,
        photoUrl: editingFood.photoUrl,
        nutrients: nutrients,
        aminoAcids: aminoAcids,
        minerals: minerals,
        vitamins: vitamins,
        others: others,
        portions: [{
          name: '100 gram',
          weight: 100,
          isDefault: true
        }],
        metadata: metadata
      })
    });
    
    if (!response.ok) {
      throw new Error(`Ekleme işlemi başarısız: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      showToast('success', 'Besin başarıyla eklendi');
      await fetchFoods(searchTerm.value); // Listeyi yenile
      closeAddModal();
    } else {
      showToast('error', result.message || 'Ekleme işlemi başarısız oldu');
    }
  } catch (err) {
    console.error('Ekleme hatası:', err);
    showToast('error', 'Besin eklenirken bir hata oluştu: ' + (err.message || ''));
  } finally {
    adding.value = false;
  }
}

// Fotoğraf yükleme işlemleri
// Dosya seçme dialogunu tetikle
function triggerPhotoUpload() {
  photoInput.value.click();
}

// Fotoğraf değiştiğinde çalışacak fonksiyon
async function handlePhotoChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Dosya boyutu kontrolü (2MB)
  if (file.size > 2 * 1024 * 1024) {
    photoUploadError.value = 'Dosya boyutu 2MB\'dan küçük olmalıdır';
    return;
  }
  
  // Dosya türü kontrolü
  if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
    photoUploadError.value = 'Sadece JPG, JPEG, PNG ve WEBP formatları desteklenmektedir';
    return;
  }
  
  photoFile.value = file;
  photoUploadError.value = '';
  
  // Otomatik yükleme başlat - önizleme için blob URL kullanmayıp doğrudan S3'ten gelen URL'yi kullanacağız
  await uploadPhoto();
}

// Fotoğrafı AWS S3'e yükle
async function uploadPhoto() {
  if (!photoFile.value) return;
  
  photoUploading.value = true;
  photoUploadError.value = '';
  
  try {
    // FormData oluştur
    const formData = new FormData();
    formData.append('photo', photoFile.value);
    
    // API'ye gönder
    // Auth store'u kullan
    const authStore = useAuthStore();
    
    const response = await fetch('/api/foods/uploadPhoto', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': authStore.csrfToken
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Fotoğraf yükleme hatası');
    }
    
    // Response body'yi bir kez okuyabiliriz, ikinci kez okumaya çalışınca hata verir
    const data = await response.json();
    
    // Dönen URL'yi kaydet
    if (data && data.url) {
      editingFood.photoUrl = data.url;
      console.log('Yüklenen fotoğraf URL:', data.url);
      
      // Resmi önizlemek için URL'yi güncelle
      previewImage.value = data.url;
    } else {
      console.error('API yanıtında URL bulunamadı:', data);
      throw new Error('Fotoğraf URL\'si alınamadı');
    }
    
    showToast('success', 'Fotoğraf başarıyla yüklendi');
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    photoUploadError.value = error.message || 'Fotoğraf yüklenirken bir hata oluştu';
    showToast('error', photoUploadError.value);
  } finally {
    photoUploading.value = false;
  }
}

// Fotoğrafı kaldır
function removePhoto() {
  editingFood.photoUrl = '';
  previewImage.value = null;
  photoFile.value = null;
  if (photoInput.value) {
    photoInput.value.value = '';
  }
}

// Besin silme fonksiyonu
async function deleteFood(id) {
  try {
    const response = await fetch(`/api/foods/${id}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Önce response.ok kontrolü yap
    if (!response.ok) {
      throw new Error(`Silme işlemi başarısız: ${response.status}`);
    }
    
    // Yanıtı JSON olarak çöz
    const result = await response.json();
    
    if (result.success) {
      // Başarıyla silindi, listeyi yeniden çek
      await fetchFoods(searchTerm.value); 
      showToast('success', 'Besin başarıyla silindi.');
    } else {
      showToast('error', result.message || 'Silme işlemi başarısız oldu.');
    }
  } catch (err) {
    console.error('Silme hatası:', err);
    showToast('error', 'Silme sırasında bir hata oluştu: ' + (err.message || ''));
  }
}

// FontAwesome ikonları için CDN linki
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    }
  ]
});

// Middleware ile admin yetkilendirmesi eklemek iyi olur
definePageMeta({
  middleware: role(['admin']),
  layout: 'admin', // Admin layout kullan
  pageTransition: {
    name: 'page',
    mode: 'out-in',
    onBeforeEnter: () => {
      // Sayfa geçişi başlamadan önce içeriğin yüklenmesini bekle
      return new Promise(resolve => {
        nextTick(() => {
          // İçerik yüklendiğinde resolve et
          resolve();
        });
      });
    }
  }
});
</script>

<style scoped>
/* Modern scrollbar için stiller */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>