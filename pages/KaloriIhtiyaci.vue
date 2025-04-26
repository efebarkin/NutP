<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 relative">
    <!-- Background decoration elements -->
    <div class="absolute -top-20 -right-20 w-64 h-64 bg-orange-400 rounded-full opacity-5 animate-pulse-slow"></div>
    <div class="absolute top-1/3 -left-20 w-80 h-80 bg-amber-500 rounded-full opacity-5 animate-pulse-slow" style="animation-delay: 1.5s"></div>
    
    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- Başlık Bölümü -->
      <div class="text-center mb-10 animate-fade-in">
        <h1 class="text-4xl font-bold text-gray-900 mb-3 relative inline-block">
          Günlük Kalori İhtiyacı Hesaplama
          <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded"></div>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Sağlıklı bir yaşam için günlük kalori ihtiyacınızı hesaplayın. Kişisel özelliklerinize ve aktivite seviyenize göre
          ne kadar kalori almanız gerektiğini öğrenin.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <!-- Form Bölümü -->
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 200ms;">
          <form @submit.prevent="calculateCalories" class="space-y-6">
            <!-- Cinsiyet Seçimi -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Cinsiyet</label>
              <div class="flex gap-4">
                <button 
                  type="button"
                  @click="formData.gender = 'male'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105',
                    formData.gender === 'male' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <span class="block text-center">Erkek</span>
                </button>
                <button 
                  type="button"
                  @click="formData.gender = 'female'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105',
                    formData.gender === 'female' 
                      ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <span class="block text-center">Kadın</span>
                </button>
              </div>
            </div>

            <!-- Yaş Input -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Yaş</label>
              <input
                v-model.number="formData.age"
                type="number"
                min="0"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Yaşınızı girin"
              />
            </div>

            <!-- Boy Input -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Boy (cm)</label>
              <input
                v-model.number="formData.height"
                type="number"
                min="0"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Boyunuzu girin"
              />
            </div>

            <!-- Kilo Input -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Kilo (kg)</label>
              <input
                v-model.number="formData.weight"
                type="number"
                min="0"
                step="0.1"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Kilonuzu girin"
              />
            </div>

            <!-- Aktivite Seviyesi -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Aktivite Seviyesi</label>
              <select
                v-model="formData.activityLevel"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50"
                required
              >
                <option value="sedentary">Hareketsiz (Masa başı iş)</option>
                <option value="light">Hafif Aktivite (Haftada 1-3 gün egzersiz)</option>
                <option value="moderate">Orta Aktivite (Haftada 3-5 gün egzersiz)</option>
                <option value="active">Aktif (Haftada 6-7 gün egzersiz)</option>
                <option value="very_active">Çok Aktif (Günde 2 kez egzersiz/fiziksel iş)</option>
              </select>
            </div>

            <!-- Hedef -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Hedefiniz</label>
              <select
                v-model="formData.goal"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50"
                required
              >
                <option value="maintain">Kilo Koruma</option>
                <option value="lose">Kilo Verme</option>
                <option value="gain">Kilo Alma</option>
              </select>
            </div>

            <!-- Hesapla Butonu -->
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-orange-500/50"
            >
              <span class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Hesapla
              </span>
            </button>
          </form>
        </div>

        <!-- Sonuçlar Bölümü -->
        <div v-if="results" class="space-y-6 animate-fade-in" style="animation-delay: 300ms;">
          <!-- Kalori İhtiyacı Kartı -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Günlük Kalori İhtiyacınız
            </h3>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-bold text-orange-600">
                {{ Math.round(results.calories) }} kcal
              </span>
              <span class="text-lg font-medium px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                {{ getGoalText(formData.goal) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div class="h-2.5 bg-orange-600 rounded-full transition-all duration-1000" 
                  :style="{ width: `${Math.min(100, (results.calories / 3000) * 100)}%` }"></div>
            </div>
            <p class="text-gray-600 mb-4">
              Bu miktar, {{ results.personalRecommendations.gender === 'male' ? 'erkek' : 'kadın' }} olarak {{ results.personalRecommendations.age }} yaşında, {{ results.personalRecommendations.weight }} kg ağırlığında ve {{ getActivityLevelText(results.personalRecommendations.activityLevel) }} aktivite seviyesinde olmanıza göre hesaplanmıştır.
            </p>
            
            <!-- Kişiselleştirilmiş Öneriler -->
            <div class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h4 class="font-semibold text-orange-800 mb-2">Kişiselleştirilmiş Öneriler</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Günde en az {{ results.personalRecommendations.waterNeeded }} litre su içmelisiniz.</span>
                </li>
                <li v-if="results.personalRecommendations.goal !== 'maintain'" class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Bu kalori alımı ile haftada yaklaşık {{ Math.abs(results.personalRecommendations.weeklyWeightChange).toFixed(1) }} kg 
                    {{ results.personalRecommendations.goal === 'lose' ? 'verebilirsiniz' : 'alabilirsiniz' }}.
                  </span>
                </li>
                <li v-if="results.personalRecommendations.targetTimeWeeks > 0" class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    5 kg {{ results.personalRecommendations.goal === 'lose' ? 'vermek' : 'almak' }} için yaklaşık 
                    {{ results.personalRecommendations.targetTimeWeeks }} haftalık bir süre hedefleyebilirsiniz.
                  </span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {{ getPersonalizedActivityRecommendation() }}
                  </span>
                </li>
              </ul>
            </div>
            
            <!-- Makro Besin Dağılımı -->
            <div class="mt-6">
              <h4 class="font-semibold text-gray-800 mb-3">Önerilen Makro Besin Dağılımı</h4>
              <div class="grid grid-cols-3 gap-4">
                <div class="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                  <div class="text-xl font-bold text-blue-700">{{ Math.round(results.macros.protein) }}g</div>
                  <div class="text-sm text-gray-600">Protein</div>
                  <div class="text-xs text-gray-500">{{ Math.round(results.macros.proteinPercent) }}%</div>
                </div>
                <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
                  <div class="text-xl font-bold text-yellow-700">{{ Math.round(results.macros.carbs) }}g</div>
                  <div class="text-sm text-gray-600">Karbonhidrat</div>
                  <div class="text-xs text-gray-500">{{ Math.round(results.macros.carbsPercent) }}%</div>
                </div>
                <div class="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
                  <div class="text-xl font-bold text-green-700">{{ Math.round(results.macros.fat) }}g</div>
                  <div class="text-sm text-gray-600">Yağ</div>
                  <div class="text-xs text-gray-500">{{ Math.round(results.macros.fatPercent) }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Beslenme Önerileri -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Beslenme Önerileri
            </h3>
            
            <div class="space-y-4 mt-4">
              <div class="p-4 bg-orange-50 rounded-lg border border-orange-100 transition-all duration-300 hover:shadow-md">
                <h4 class="font-semibold text-orange-800 mb-2">{{ getGoalBasedNutritionTitle() }}</h4>
                <ul class="space-y-2 text-gray-700">
                  <li v-for="(tip, index) in getGoalBasedNutritionTips()" :key="index" class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ tip }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="p-4 bg-amber-50 rounded-lg border border-amber-100 transition-all duration-300 hover:shadow-md">
                <h4 class="font-semibold text-amber-800 mb-2">Sağlıklı Karbonhidratlar</h4>
                <ul class="grid grid-cols-2 gap-2 text-gray-700">
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    <span>Tam tahıllı ekmek</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    <span>Yulaf</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    <span>Kahverengi pirinç</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    <span>Tatlı patates</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    <span>Meyve</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    <span>Baklagiller</span>
                  </li>
                </ul>
              </div>
              
              <div class="p-4 bg-green-50 rounded-lg border border-green-100 transition-all duration-300 hover:shadow-md">
                <h4 class="font-semibold text-green-800 mb-2">Sağlıklı Yağlar</h4>
                <ul class="grid grid-cols-2 gap-2 text-gray-700">
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Zeytinyağı</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Avokado</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Kuruyemişler</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Tohumlar</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Somon</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Keten tohumu</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Bilgilendirici Bölüm (Sonuçlar yoksa) -->
        <div v-else class="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-4 animate-fade-in" style="animation-delay: 300ms;">
          <div class="p-5 bg-orange-50 rounded-lg border border-orange-100">
            <h3 class="text-xl font-semibold text-orange-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Kalori İhtiyacı Neden Önemli?
            </h3>
            <p class="text-gray-700 mb-3">
              Günlük kalori ihtiyacınızı bilmek, sağlıklı bir vücut ağırlığı korumak veya hedeflerinize ulaşmak için çok önemlidir. Kalori ihtiyacınız:
            </p>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Vücut fonksiyonlarınızı sürdürmek için gereken enerjiyi sağlar</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Kilo kontrolü için temel oluşturur</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Fiziksel aktiviteleriniz için gereken enerjiyi belirler</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Kas kütlesi korumanıza veya artırmanıza yardımcı olur</span>
              </li>
            </ul>
          </div>
          <p class="text-gray-600 italic">
            Kişisel bilgilerinizi girin ve günlük kalori ihtiyacınızı hesaplayın. Sağlıklı bir yaşam için doğru beslenme çok önemlidir.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Form verileri
const formData = ref({
  gender: 'male',
  age: null,
  weight: null,
  height: null,
  activityLevel: 'moderate',
  goal: 'maintain'
});

// Sonuçlar
const results = ref(null);
const isInitialRender = ref(true);

// Component mounted hook to prevent double rendering
onMounted(() => {
  // Set a small timeout to ensure the component is fully mounted
  setTimeout(() => {
    isInitialRender.value = false;
  }, 100);
});

// Kalori ihtiyacını hesapla
const calculateCalories = () => {
  // Prevent calculation during initial render
  if (isInitialRender.value) return;
  // BMR (Bazal Metabolizma Hızı) hesaplama - Mifflin-St Jeor Denklemi
  let bmr;
  if (formData.value.gender === 'male') {
    bmr = 10 * formData.value.weight + 6.25 * formData.value.height - 5 * formData.value.age + 5;
  } else {
    bmr = 10 * formData.value.weight + 6.25 * formData.value.height - 5 * formData.value.age - 161;
  }
  
  // Aktivite faktörü
  let activityFactor;
  switch (formData.value.activityLevel) {
    case 'sedentary':
      activityFactor = 1.2;
      break;
    case 'light':
      activityFactor = 1.375;
      break;
    case 'moderate':
      activityFactor = 1.55;
      break;
    case 'active':
      activityFactor = 1.725;
      break;
    case 'very_active':
      activityFactor = 1.9;
      break;
    default:
      activityFactor = 1.55;
  }
  
  // TDEE (Toplam Günlük Enerji Harcaması)
  let tdee = bmr * activityFactor;
  
  // Hedef bazlı kalori ayarlaması
  let targetCalories;
  let calorieAdjustment = 0;
  
  switch (formData.value.goal) {
    case 'lose':
      calorieAdjustment = -500; // Kilo vermek için günlük 500 kalori açık
      targetCalories = tdee + calorieAdjustment;
      break;
    case 'gain':
      calorieAdjustment = 500; // Kilo almak için günlük 500 kalori fazla
      targetCalories = tdee + calorieAdjustment;
      break;
    default:
      targetCalories = tdee; // Kilo korumak için
  }
  
  // Makro besin hesaplamaları
  // Protein: Vücut ağırlığı başına 1.6-2.2g (ortalama 1.8g)
  // Yağ: Toplam kalorinin %25-35'i (ortalama %30)
  // Karbonhidrat: Kalan kaloriler
  
  const proteinGrams = formData.value.weight * 1.8;
  const proteinCalories = proteinGrams * 4; // 1g protein = 4 kalori
  
  const fatCalories = targetCalories * 0.3;
  const fatGrams = fatCalories / 9; // 1g yağ = 9 kalori
  
  const carbsCalories = targetCalories - proteinCalories - fatCalories;
  const carbsGrams = carbsCalories / 4; // 1g karbonhidrat = 4 kalori
  
  // Kişiselleştirilmiş öneriler için ek hesaplamalar
  const waterNeeded = Math.round(formData.value.weight * 0.033 * 10) / 10; // Günlük su ihtiyacı (L)
  
  // Haftalık kilo değişimi tahmini
  const weeklyWeightChange = calorieAdjustment !== 0 ? (calorieAdjustment * 7) / 7700 : 0; // 7700 kalori = 1 kg yağ
  
  // Hedef süre (hafta) - Eğer kilo verme/alma hedefi varsa
  let targetTimeWeeks = 0;
  if (formData.value.goal !== 'maintain') {
    // Sağlıklı kilo değişimi haftada 0.5-1 kg arası olmalı
    // Hedef olarak 5 kg değişim için süre hesaplama
    targetTimeWeeks = Math.round(5 / Math.abs(weeklyWeightChange));
  }
  
  // Sonuçları güncelle
  results.value = {
    calories: targetCalories,
    bmr: bmr,
    tdee: tdee,
    macros: {
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbsGrams,
      proteinPercent: (proteinCalories / targetCalories) * 100,
      fatPercent: (fatCalories / targetCalories) * 100,
      carbsPercent: (carbsCalories / targetCalories) * 100
    },
    personalRecommendations: {
      waterNeeded: waterNeeded,
      weeklyWeightChange: weeklyWeightChange,
      targetTimeWeeks: targetTimeWeeks,
      activityLevel: formData.value.activityLevel,
      gender: formData.value.gender,
      age: formData.value.age,
      weight: formData.value.weight,
      goal: formData.value.goal
    }
  };
  
  // Sayfayı sonuçlara doğru kaydır
  setTimeout(() => {
    window.scrollTo({
      top: 300,
      behavior: 'smooth'
    });
  }, 100);
};

// Hedef metni
const getGoalText = (goal) => {
  switch (goal) {
    case 'lose':
      return 'Kilo Verme';
    case 'gain':
      return 'Kilo Alma';
    default:
      return 'Kilo Koruma';
  }
};

// Aktivite seviyesi metni
const getActivityLevelText = (level) => {
  switch (level) {
    case 'sedentary':
      return 'hareketsiz';
    case 'light':
      return 'hafif aktif';
    case 'moderate':
      return 'orta aktif';
    case 'active':
      return 'aktif';
    case 'very_active':
      return 'çok aktif';
    default:
      return 'orta aktif';
  }
};

// Kişiselleştirilmiş aktivite önerisi
const getPersonalizedActivityRecommendation = () => {
  const goal = results.value.personalRecommendations.goal;
  const activityLevel = results.value.personalRecommendations.activityLevel;
  
  if (goal === 'lose') {
    if (activityLevel === 'sedentary' || activityLevel === 'light') {
      return 'Haftada en az 3-4 gün, 30-45 dakika kardiyovasküler egzersiz yapmanız önerilir.';
    } else if (activityLevel === 'moderate') {
      return 'Mevcut aktivite seviyenizi koruyun ve haftada 2-3 kez direnç egzersizleri ekleyin.';
    } else {
      return 'Yüksek aktivite seviyenizi koruyun, ancak aşırı egzersizden kaçının ve yeterli dinlenme sağlayın.';
    }
  } else if (goal === 'gain') {
    return 'Kas kütlesi kazanmak için haftada 3-4 kez direnç egzersizleri yapmanız ve protein alımınıza dikkat etmeniz önerilir.';
  } else {
    if (activityLevel === 'sedentary') {
      return 'Sağlığınızı korumak için günlük aktivitenizi artırın, haftada en az 150 dakika orta yoğunlukta egzersiz yapın.';
    } else {
      return 'Mevcut aktivite seviyenizi koruyun ve düzenli olarak farklı egzersiz türleri deneyin.';
    }
  }
};

// Hedef bazlı beslenme başlığı
const getGoalBasedNutritionTitle = () => {
  const goal = results.value.personalRecommendations.goal;
  
  if (goal === 'lose') {
    return 'Sağlıklı Kilo Vermek İçin Beslenme Önerileri';
  } else if (goal === 'gain') {
    return 'Sağlıklı Kilo Almak İçin Beslenme Önerileri';
  } else {
    return 'Sağlıklı Kilonuzu Korumak İçin Beslenme Önerileri';
  }
};

// Hedef bazlı beslenme önerileri
const getGoalBasedNutritionTips = () => {
  const goal = results.value.personalRecommendations.goal;
  const gender = results.value.personalRecommendations.gender;
  const calories = Math.round(results.value.calories);
  
  if (goal === 'lose') {
    return [
      `Günlük ${calories} kalori hedefini aşmamaya dikkat edin`,
      'Öğünlerinizde protein miktarını artırın (tokluk hissi sağlar)',
      'Sebze ve meyve tüketimini artırın (düşük kalorili, yüksek lifli)',
      'Şeker ve işlenmiş gıdaları diyetinizden çıkarın',
      'Öğün atlamamaya özen gösterin, açlık hissini önleyin',
      'Yemeklerinizi daha küçük tabaklarda servis edin',
      gender === 'female' ? 'Kadınlar için günlük 1200 kalorinin altına düşmeyin' : 'Erkekler için günlük 1500 kalorinin altına düşmeyin'
    ];
  } else if (goal === 'gain') {
    return [
      `Günlük ${calories} kalori hedefine ulaşmak için öğün sayınızı artırın`,
      'Protein alımınızı artırın (kas yapımı için gerekli)',
      'Sağlıklı yağlar tüketin (zeytinyağı, avokado, kuruyemişler)',
      'Kompleks karbonhidratları tercih edin (yulaf, kahverengi pirinç, tam tahıllar)',
      'Egzersiz sonrası protein ve karbonhidrat içeren bir öğün tüketin',
      'Gece yatmadan önce protein içeren bir atıştırmalık tüketin',
      'Kalori yoğun ancak sağlıklı besinleri tercih edin (kuruyemişler, avokado, hindistan cevizi)'
    ];
  } else {
    return [
      `Günlük ${calories} kalori hedefini dengeli bir şekilde dağıtın`,
      'Öğünlerinizde protein, karbonhidrat ve sağlıklı yağları dengeli tüketin',
      'Günde en az 5 porsiyon sebze ve meyve tüketin',
      'İşlenmiş gıdalar yerine tam gıdaları tercih edin',
      'Düzenli öğün saatleri belirleyin',
      'Porsiyon kontrolüne dikkat edin',
      'Su tüketimini ihmal etmeyin'
    ];
  }
};
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

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

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.1;
  }
}
</style>
