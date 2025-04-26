<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 relative">
    <!-- Background decoration elements -->
    <div class="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full opacity-5 animate-pulse-slow"></div>
    <div class="absolute top-1/3 -left-20 w-80 h-80 bg-cyan-500 rounded-full opacity-5 animate-pulse-slow" style="animation-delay: 1.5s"></div>
    
    <!-- Water droplet background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Waterfall background image -->
      <div class="absolute inset-0 opacity-10 bg-no-repeat bg-cover" style="background-image: url('https://img.freepik.com/free-photo/beautiful-waterfall-landscape_23-2150705058.jpg?w=1800&t=st=1710608937~exp=1710609537~hmac=b2f5f7d3b0c9f9b8b9b8b9b8b9b8b9b8b9b8b9b8b9b8b9b8b9b8b9b8b9b8b9')"></div>
      
      <!-- Water droplets -->
      <div class="absolute top-10 left-1/4 w-8 h-8 text-blue-500 animate-bounce-slow" style="animation-delay: 0.5s">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      </div>
      <div class="absolute top-20 right-1/4 w-6 h-6 text-blue-400 animate-bounce-slow" style="animation-delay: 1s">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      </div>
      <div class="absolute top-40 left-1/3 w-10 h-10 text-cyan-500 animate-bounce-slow" style="animation-delay: 1.5s">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      </div>
      <div class="absolute bottom-20 right-1/3 w-7 h-7 text-blue-300 animate-bounce-slow" style="animation-delay: 2s">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      </div>
      <div class="absolute bottom-40 left-1/5 w-5 h-5 text-cyan-400 animate-bounce-slow" style="animation-delay: 2.5s">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- Başlık Bölümü -->
      <div class="text-center mb-10 animate-fade-in">
        <h1 class="text-4xl font-bold text-gray-900 mb-3 relative inline-block">
          Günlük Su İhtiyacı Hesaplama
          <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded"></div>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Sağlıklı bir yaşam için günlük su ihtiyacınızı hesaplayın. Kişisel özelliklerinize ve aktivite seviyenize göre
          ne kadar su içmeniz gerektiğini öğrenin.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <!-- Form Bölümü -->
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 200ms;">
          <form @submit.prevent="calculateWaterNeeds" class="space-y-6">
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
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm' 
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
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Yaşınızı girin"
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
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Kilonuzu girin"
              />
            </div>

            <!-- Aktivite Seviyesi -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Aktivite Seviyesi</label>
              <select
                v-model="formData.activityLevel"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
              >
                <option value="sedentary">Hareketsiz (Masa başı iş)</option>
                <option value="light">Hafif Aktivite (Haftada 1-3 gün egzersiz)</option>
                <option value="moderate">Orta Aktivite (Haftada 3-5 gün egzersiz)</option>
                <option value="active">Aktif (Haftada 6-7 gün egzersiz)</option>
                <option value="very_active">Çok Aktif (Günde 2 kez egzersiz/fiziksel iş)</option>
              </select>
            </div>

            <!-- İklim Koşulları -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">İklim Koşulları</label>
              <select
                v-model="formData.climate"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
              >
                <option value="normal">Normal</option>
                <option value="hot">Sıcak ve Nemli</option>
                <option value="cold">Soğuk</option>
              </select>
            </div>

            <!-- Hesapla Butonu -->
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-500/50"
            >
              <span class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Hesapla
              </span>
            </button>
          </form>
        </div>

        <!-- Sonuçlar Bölümü -->
        <div v-if="results" class="space-y-6 animate-fade-in" style="animation-delay: 300ms;">
          <!-- Su İhtiyacı Kartı -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
              Günlük Su İhtiyacınız
            </h3>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-bold text-blue-600">
                {{ results.waterInLiters.toFixed(1) }} Litre
              </span>
              <span class="text-lg font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {{ results.waterInGlasses }} Bardak
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div class="h-2.5 bg-blue-600 rounded-full transition-all duration-1000" 
                  :style="{ width: `${Math.min(100, (results.waterInLiters / 4) * 100)}%` }"></div>
            </div>
            <p class="text-gray-600 mb-4">
              Bu miktar, vücut ağırlığınız, yaşınız, cinsiyetiniz, aktivite seviyeniz ve iklim koşullarınıza göre hesaplanmıştır.
            </p>
            
            <!-- Su Tüketim Önerileri -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 class="font-semibold text-blue-800 mb-2">Su Tüketim Önerileri</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Güne bir bardak su ile başlayın - metabolizmanızı harekete geçirir.</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Her öğün sırasında ve sonrasında su için.</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Egzersiz öncesi, sırası ve sonrasında su tüketiminizi artırın.</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Yanınızda her zaman su şişesi bulundurun.</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Su Tüketiminin Faydaları -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Yeterli Su Tüketiminin Faydaları
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-100 transition-all duration-300 hover:shadow-md">
                <h4 class="font-semibold text-blue-800 mb-2">Fiziksel Sağlık</h4>
                <ul class="space-y-1 text-gray-700">
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Toksinlerin atılmasını sağlar</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Eklem ağrılarını azaltır</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Vücut ısısını düzenler</span>
                  </li>
                </ul>
              </div>
              <div class="p-4 bg-cyan-50 rounded-lg border border-cyan-100 transition-all duration-300 hover:shadow-md">
                <h4 class="font-semibold text-cyan-800 mb-2">Zihinsel Performans</h4>
                <ul class="space-y-1 text-gray-700">
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                    <span>Konsantrasyonu artırır</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                    <span>Hafızayı güçlendirir</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                    <span>Ruh halini iyileştirir</span>
                  </li>
                </ul>
              </div>
              <div class="p-4 bg-teal-50 rounded-lg border border-teal-100 transition-all duration-300 hover:shadow-md">
                <h4 class="font-semibold text-teal-800 mb-2">Cilt Sağlığı</h4>
                <ul class="space-y-1 text-gray-700">
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                    <span>Cildi nemlendirir</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                    <span>Akne oluşumunu azaltır</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                    <span>Erken yaşlanmayı önler</span>
                  </li>
                </ul>
              </div>
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-100 transition-all duration-300 hover:shadow-md">
                <h4 class="font-semibold text-blue-800 mb-2">Sindirim Sistemi</h4>
                <ul class="space-y-1 text-gray-700">
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Kabızlığı önler</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Sindirime yardımcı olur</span>
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Metabolizmayı hızlandırır</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Bilgilendirici Bölüm (Sonuçlar yoksa) -->
        <div v-else class="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-4 animate-fade-in" style="animation-delay: 300ms;">
          <div class="p-5 bg-blue-50 rounded-lg border border-blue-100">
            <h3 class="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Su İhtiyacı Neden Önemli?
            </h3>
            <p class="text-gray-700 mb-3">
              Vücudumuzun yaklaşık %60'ı sudan oluşur. Su, vücudumuzun düzgün çalışması için hayati öneme sahiptir. Yeterli su tüketimi:
            </p>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Vücut sıcaklığını düzenler</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Beyin fonksiyonlarını destekler</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Toksinlerin atılmasına yardımcı olur</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Eklemleri yağlar ve korur</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Cildi nemlendirir ve sağlıklı tutar</span>
              </li>
            </ul>
          </div>
          <p class="text-gray-600 italic">
            Kişisel bilgilerinizi girin ve günlük su ihtiyacınızı hesaplayın. Sağlıklı bir yaşam için yeterli su tüketimi çok önemlidir.
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
  activityLevel: 'moderate',
  climate: 'normal'
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

// Su ihtiyacını hesapla
const calculateWaterNeeds = () => {
  // Prevent calculation during initial render
  if (isInitialRender.value) return;
  // Temel hesaplama: Vücut ağırlığı (kg) * 0.033 = Su ihtiyacı (L)
  let waterNeeds = formData.value.weight * 0.033;
  
  // Yaş faktörü
  if (formData.value.age < 30) {
    waterNeeds *= 1.1; // Genç yetişkinler için %10 artış
  } else if (formData.value.age > 55) {
    waterNeeds *= 0.95; // Yaşlı yetişkinler için %5 azalma
  }
  
  // Cinsiyet faktörü
  if (formData.value.gender === 'female') {
    waterNeeds *= 0.95; // Kadınlar için %5 azalma
  }
  
  // Aktivite seviyesi faktörü
  switch (formData.value.activityLevel) {
    case 'sedentary':
      waterNeeds *= 0.9;
      break;
    case 'light':
      waterNeeds *= 1.0;
      break;
    case 'moderate':
      waterNeeds *= 1.1;
      break;
    case 'active':
      waterNeeds *= 1.2;
      break;
    case 'very_active':
      waterNeeds *= 1.3;
      break;
  }
  
  // İklim faktörü
  switch (formData.value.climate) {
    case 'hot':
      waterNeeds *= 1.2; // Sıcak iklimde %20 artış
      break;
    case 'cold':
      waterNeeds *= 0.95; // Soğuk iklimde %5 azalma
      break;
  }
  
  // Bardak sayısı (1 bardak = 250 ml)
  const glassesOfWater = Math.round(waterNeeds * 4);
  
  // Sonuçları güncelle
  results.value = {
    waterInLiters: waterNeeds,
    waterInGlasses: glassesOfWater
  };
  
  // Sayfayı sonuçlara doğru kaydır
  setTimeout(() => {
    window.scrollTo({
      top: 300,
      behavior: 'smooth'
    });
  }, 100);
};
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce-slow {
  animation: bounce 3s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-10%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
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

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
