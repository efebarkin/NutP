<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 relative">
    <!-- Background decoration elements -->
    <div class="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full opacity-5 animate-pulse-slow"></div>
    <div class="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-500 rounded-full opacity-5 animate-pulse-slow" style="animation-delay: 1.5s"></div>
    
    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- Başlık Bölümü -->
      <div class="text-center mb-10 animate-fade-in">
        <h1 class="text-4xl font-bold text-gray-900 mb-3 relative inline-block">
          Vücut Yağ Oranı Hesaplama
          <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded"></div>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Sağlıklı bir yaşam için vücut kompozisyonunuzu takip edin. Ölçümlerinizi girin, 
          size özel analizinizi ve önerilerinizi alın.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <!-- Form Bölümü -->
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 200ms;">
          <form @submit.prevent="calculateMetrics" class="space-y-6">
            <!-- Cinsiyet Seçimi -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Cinsiyet</label>
              <div class="flex gap-4">
                <button 
                  type="button"
                  @click="metrics.gender = 'male'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105',
                    metrics.gender === 'male' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <span class="block text-center">Erkek</span>
                </button>
                <button 
                  type="button"
                  @click="metrics.gender = 'female'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105',
                    metrics.gender === 'female' 
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
                v-model.number="metrics.age"
                type="number"
                min="0"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Yaşınızı girin"
              />
            </div>

            <!-- Boy Input -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Boy (cm)</label>
              <input
                v-model.number="metrics.height"
                type="number"
                min="0"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Boyunuzu girin"
              />
            </div>

            <!-- Kilo Input -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Kilo (kg)</label>
              <input
                v-model.number="metrics.weight"
                type="number"
                min="0"
                step="0.1"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Kilonuzu girin"
              />
            </div>

            <!-- Boyun Çevresi -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Boyun Çevresi (cm)</label>
              <input
                v-model.number="metrics.neck"
                type="number"
                min="0"
                step="0.1"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Boyun çevrenizi girin"
              />
            </div>

            <!-- Bel Çevresi -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Bel Çevresi (cm)</label>
              <input
                v-model.number="metrics.waist"
                type="number"
                min="0"
                step="0.1"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Bel çevrenizi girin"
              />
            </div>

            <!-- Kalça Çevresi (Kadınlar için) -->
            <div v-if="metrics.gender === 'female'" class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Kalça Çevresi (cm)</label>
              <input
                v-model.number="metrics.hip"
                type="number"
                min="0"
                step="0.1"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Kalça çevrenizi girin"
              />
            </div>

            <!-- Hesapla Butonu -->
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-500/50"
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
          <!-- BMI Kartı -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Vücut Kitle İndeksi (BMI)
            </h3>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-bold" :class="getBmiStatusClass(results.bmi)">
                {{ results.bmi.toFixed(1) }}
              </span>
              <span class="text-lg font-medium px-3 py-1 rounded-full" :class="[getBmiStatusClass(results.bmi), 'bg-opacity-10']">
                {{ getBmiStatus(results.bmi) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div class="h-2.5 rounded-full transition-all duration-1000" 
                  :style="{ width: `${Math.min(100, results.bmi * 2.5)}%` }"
                  :class="getBmiStatusClass(results.bmi)"></div>
            </div>
            <p class="text-gray-600">
              Vücut kitle indeksi (BMI), vücut ağırlığınızın, boy uzunluğunuzun karesine bölünmesiyle elde edilir. BMI, vücut kompozisyonunuzun bir göstergesidir.
            </p>
          </div>

          <!-- Vücut Yağ Oranı Kartı -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Vücut Yağ Oranı
            </h3>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-bold" :class="getBodyFatStatusClass(results.bodyFat)">
                %{{ results.bodyFat.toFixed(1) }}
              </span>
              <span class="text-lg font-medium px-3 py-1 rounded-full" :class="[getBodyFatStatusClass(results.bodyFat), 'bg-opacity-10']">
                {{ getBodyFatStatus(results.bodyFat) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div class="h-2.5 rounded-full transition-all duration-1000"
                  :style="{ width: `${Math.min(100, results.bodyFat * 2)}%` }"
                  :class="getBodyFatStatusClass(results.bodyFat)"></div>
            </div>
            <p class="text-gray-600">
              Vücut yağ oranı, vücudunuzdaki yağ kütlesinin toplam vücut ağırlığına göre yüzdesel oranıdır. Bu oran cinsiyete, yaşa ve fiziksel aktivite seviyesine göre değişiklik gösterir.
            </p>
          </div>

          <!-- Öneriler Kartı -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Öneriler
            </h3>
            <div class="space-y-3">
              <div 
                v-for="(rec, index) in results.recommendations" 
                :key="index" 
                class="bg-blue-50 p-4 rounded-lg border border-blue-100 transition-opacity duration-500"
                :style="{ animationDelay: `${index * 200}ms` }"
              >
                <div class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{{ rec }}</span>
                </div>
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
              Vücut Yağ Oranı Nedir?
            </h3>
            <p class="text-blue-700">
              Vücut yağ oranı, toplam vücut ağırlığınızın ne kadarının yağ olduğunu gösteren bir ölçümdür. Sağlıklı bir vücut yağ oranı, metabolizmanızın düzgün çalışması ve optimal sağlık için kritik öneme sahiptir.
            </p>
          </div>
          
          <div class="p-5 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 class="text-xl font-semibold text-indigo-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Neden Önemlidir?
            </h3>
            <p class="text-indigo-700">
              Vücut yağ oranınızı bilmek, genel sağlık durumunuz ve fitness hedefleriniz için kritik önem taşır. Sadece kilonuzu takip etmek yanıltıcı olabilir, çünkü kas ve yağ farklı ağırlıklara sahiptir.
            </p>
          </div>
          
          <div class="text-center mt-6">
            <p class="text-gray-600 italic">
              Form bilgilerini doldurun ve hesaplama yaparak kişiselleştirilmiş sonuçlarınızı görüntüleyin.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const metrics = ref({
  gender: 'male',
  age: null,
  height: null,
  weight: null,
  neck: null,
  waist: null,
  hip: null
})

const results = ref(null)
const recommendations = ref({
  nutrition: '',
  exercise: '',
  lifestyle: ''
})

function calculateMetrics() {
  // BMI Hesaplama
  const heightInMeters = metrics.value.height / 100
  const bmi = metrics.value.weight / (heightInMeters * heightInMeters)

  // Vücut Yağ Oranı Hesaplama (U.S. Navy Method)
  let bodyFat
  if (metrics.value.gender === 'male') {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(metrics.value.waist - metrics.value.neck) + 0.15456 * Math.log10(metrics.value.height)) - 450
  } else {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(metrics.value.waist + metrics.value.hip - metrics.value.neck) + 0.22100 * Math.log10(metrics.value.height)) - 450
  }

  // İdeal Kilo Aralığı (BMI 18.5-24.9 baz alınarak)
  const idealWeightRange = {
    min: 18.5 * heightInMeters * heightInMeters,
    max: 24.9 * heightInMeters * heightInMeters
  }

  results.value = {
    bmi,
    bodyFat,
    idealWeightRange,
    recommendations: [
      'Sağlıklı kilo almak için protein açısından zengin besinler tüketin. Günlük kalori alımınızı artırın ve öğün atlamamaya özen gösterin.',
      'Porsiyon kontrolüne dikkat edin. Sebze ve protein ağırlıklı beslenin. İşlenmiş gıdalardan ve şekerli içeceklerden uzak durun.',
      'Dengeli ve sağlıklı beslenmeye devam edin. Günde 5-6 porsiyon sebze ve meyve tüketmeyi hedefleyin.',
      'Kas kütlenizi artırmak için ağırlık çalışmaları yapın. Haftada en az 3 gün direnç egzersizleri yapmanızı öneririz.',
      'Kardiyovasküler egzersizlere ağırlık verin. Günde en az 30 dakika orta şiddette aktivite yapın. Yürüyüş, yüzme veya bisiklet sürmek ideal olacaktır.',
      'Mevcut fiziksel aktivite düzeyinizi koruyun. Kardiyo ve kuvvet antrenmanlarını dengeli bir şekilde yapın.',
      'Düzenli uyku alışkanlığı edinin. Stresi azaltmak için meditasyon veya yoga yapabilirsiniz. Günde en az 2 litre su içmeyi hedefleyin.'
    ]
  }

  // Önerileri güncelle
  updateRecommendations(bmi, bodyFat)
}

function getBmiStatus(bmi) {
  if (bmi < 18.5) return 'Zayıf'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Fazla Kilolu'
  return 'Obez'
}

function getBmiStatusClass(bmi) {
  if (bmi < 18.5) return 'text-yellow-600'
  if (bmi < 25) return 'text-green-600'
  if (bmi < 30) return 'text-orange-600'
  return 'text-red-600'
}

function getBodyFatStatus(bodyFat) {
  const gender = metrics.value.gender
  if (gender === 'male') {
    if (bodyFat < 6) return 'Çok Düşük'
    if (bodyFat < 14) return 'Atletik'
    if (bodyFat < 18) return 'Fit'
    if (bodyFat < 25) return 'Normal'
    return 'Yüksek'
  } else {
    if (bodyFat < 14) return 'Çok Düşük'
    if (bodyFat < 21) return 'Atletik'
    if (bodyFat < 25) return 'Fit'
    if (bodyFat < 32) return 'Normal'
    return 'Yüksek'
  }
}

function getBodyFatStatusClass(bodyFat) {
  const gender = metrics.value.gender
  if (gender === 'male') {
    if (bodyFat < 6) return 'text-yellow-600'
    if (bodyFat < 14) return 'text-green-600'
    if (bodyFat < 18) return 'text-green-600'
    if (bodyFat < 25) return 'text-blue-600'
    return 'text-red-600'
  } else {
    if (bodyFat < 14) return 'text-yellow-600'
    if (bodyFat < 21) return 'text-green-600'
    if (bodyFat < 25) return 'text-green-600'
    if (bodyFat < 32) return 'text-blue-600'
    return 'text-red-600'
  }
}

function updateRecommendations(bmi, bodyFat) {
  const gender = metrics.value.gender
  const isHighBodyFat = (gender === 'male' && bodyFat >= 25) || (gender === 'female' && bodyFat >= 32)
  
  // Beslenme önerileri
  if (bmi < 18.5) {
    recommendations.value.nutrition = 'Sağlıklı kilo almak için protein açısından zengin besinler tüketin. Günlük kalori alımınızı artırın ve öğün atlamamaya özen gösterin.'
  } else if (bmi >= 25 || isHighBodyFat) {
    recommendations.value.nutrition = 'Porsiyon kontrolüne dikkat edin. Sebze ve protein ağırlıklı beslenin. İşlenmiş gıdalardan ve şekerli içeceklerden uzak durun.'
  } else {
    recommendations.value.nutrition = 'Dengeli ve sağlıklı beslenmeye devam edin. Günde 5-6 porsiyon sebze ve meyve tüketmeyi hedefleyin.'
  }

  // Egzersiz önerileri
  if (bmi < 18.5) {
    recommendations.value.exercise = 'Kas kütlenizi artırmak için ağırlık çalışmaları yapın. Haftada en az 3 gün direnç egzersizleri yapmanızı öneririz.'
  } else if (bmi >= 25 || isHighBodyFat) {
    recommendations.value.exercise = 'Kardiyovasküler egzersizlere ağırlık verin. Günde en az 30 dakika orta şiddette aktivite yapın. Yürüyüş, yüzme veya bisiklet sürmek ideal olacaktır.'
  } else {
    recommendations.value.exercise = 'Mevcut fiziksel aktivite düzeyinizi koruyun. Kardiyo ve kuvvet antrenmanlarını dengeli bir şekilde yapın.'
  }

  // Yaşam tarzı önerileri
  recommendations.value.lifestyle = 'Düzenli uyku alışkanlığı edinin. Stresi azaltmak için meditasyon veya yoga yapabilirsiniz. Günde en az 2 litre su içmeyi hedefleyin.'
}
</script>
