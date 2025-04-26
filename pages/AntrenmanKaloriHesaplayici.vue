<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 relative">
      <!-- Arkaplan dekorasyon elementleri -->
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full opacity-5 animate-pulse-slow"></div>
      <div class="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-500 rounded-full opacity-5 animate-pulse-slow" style="animation-delay: 1.5s"></div>
      
      <div class="container mx-auto px-4 py-8 relative z-10">
        <!-- Başlık Bölümü -->
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-gray-900 mb-3 relative inline-block">
            Antreman Kalori Yakma Hesaplayıcı
            <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded"></div>
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Farklı egzersiz türleri ve süreleri için yakacağınız kalori miktarını hesaplayın ve 
            kişiselleştirilmiş antreman önerileri alın.
          </p>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- Form Bölümü -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <form @submit.prevent="calculateCalories" class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-800 mb-4 relative inline-block">
                Egzersiz Bilgileri
                <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded"></div>
              </h2>
              
              <!-- Kişisel Bilgiler -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label for="weight" class="text-lg font-medium text-gray-700">Kilo (kg)</label>
                  <input 
                    type="number" 
                    id="weight" 
                    v-model="formData.weight" 
                    min="30" 
                    max="200"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Kilo (kg)"
                    required
                  >
                </div>
                <div class="space-y-2">
                  <label for="age" class="text-lg font-medium text-gray-700">Yaş</label>
                  <input 
                    type="number" 
                    id="age" 
                    v-model="formData.age" 
                    min="15" 
                    max="100"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Yaş"
                    required
                  >
                </div>
                <div class="space-y-2">
                  <label class="text-lg font-medium text-gray-700">Cinsiyet</label>
                  <div class="flex gap-4">
                    <button 
                      type="button"
                      @click="formData.gender = 'male'"
                      :class="[
                        'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200',
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
                        'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200',
                        formData.gender === 'female' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300'
                      ]"
                    >
                      <span class="block text-center">Kadın</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Egzersiz Türü Seçimi -->
              <div class="space-y-2">
                <label class="text-lg font-medium text-gray-700">Egzersiz Türü</label>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <button 
                    v-for="exercise in exerciseTypes" 
                    :key="exercise.id"
                    type="button"
                    @click="formData.exerciseType = exercise.id"
                    :class="[
                      'py-3 px-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center',
                      formData.exerciseType === exercise.id 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <span class="text-2xl mb-1">
                      <i :class="'icon-' + exercise.icon"></i>
                    </span>
                    <span class="block text-center text-sm">{{ exercise.name }}</span>
                  </button>
                </div>
              </div>
              
              <!-- Egzersiz Süresi -->
              <div class="space-y-2">
                <label for="duration" class="text-lg font-medium text-gray-700">Egzersiz Süresi (dakika)</label>
                <input 
                  type="range" 
                  id="duration" 
                  v-model="formData.duration" 
                  min="5" 
                  max="180"
                  step="5"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                >
                <div class="flex justify-between text-sm text-gray-500 px-1">
                  <span>5 dk</span>
                  <span>{{ formData.duration }} dakika</span>
                  <span>180 dk</span>
                </div>
              </div>
              
              <!-- Egzersiz Yoğunluğu -->
              <div class="space-y-2">
                <label class="text-lg font-medium text-gray-700">Egzersiz Yoğunluğu</label>
                <div class="grid grid-cols-1 gap-2">
                  <button 
                    v-for="intensity in intensityLevels" 
                    :key="intensity.id"
                    type="button"
                    @click="formData.intensity = intensity.id"
                    :class="[
                      'py-2 px-3 rounded-lg border-2 transition-all duration-200',
                      formData.intensity === intensity.id 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <span class="block text-left text-sm font-medium">{{ intensity.name }}</span>
                    <span class="block text-left text-xs text-gray-500">{{ intensity.description }}</span>
                  </button>
                </div>
              </div>
              
              <!-- Hesaplama Butonu -->
              <button
                type="submit"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Kalori Yakımını Hesapla
                </span>
              </button>
            </form>
          </div>
          
          <!-- Sonuçlar Bölümü -->
          <div v-if="results" class="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-500 animate-fade-in">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 relative inline-block">
              Egzersiz Sonuçları
              <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded"></div>
            </h2>
            
            <!-- Kalori Sonuçları -->
            <div class="mb-6">
              <div class="flex items-center justify-center">
                <div class="relative w-56 h-56 flex items-center justify-center">
                  <!-- Dış çember animasyonu -->
                  <div class="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                  <div class="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500 animate-spin-slow"></div>
                  
                  <!-- İç çember -->
                  <div class="w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center shadow-inner">
                    <span class="text-4xl font-bold text-blue-600">{{ results.caloriesBurned }}</span>
                    <span class="text-gray-500 text-lg">kalori</span>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 grid grid-cols-2 gap-4">
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p class="text-sm text-gray-500">Egzersiz Türü</p>
                  <p class="font-medium text-gray-800">{{ getExerciseName(results.exerciseType) }}</p>
                </div>
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p class="text-sm text-gray-500">Süre</p>
                  <p class="font-medium text-gray-800">{{ results.duration }} dakika</p>
                </div>
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p class="text-sm text-gray-500">Yoğunluk</p>
                  <p class="font-medium text-gray-800">{{ getIntensityName(results.intensity) }}</p>
                </div>
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p class="text-sm text-gray-500">Kalori Eşdeğeri</p>
                  <p class="font-medium text-gray-800">{{ getCalorieEquivalent(results.caloriesBurned) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Öneriler -->
            <div class="mt-8 space-y-6">
              <h3 class="text-xl font-semibold text-gray-800">
                Kişiselleştirilmiş Öneriler
              </h3>
              
              <!-- Egzersiz Türüne Özel Öneriler -->
              <div class="border-l-4 border-blue-500 pl-4 py-1">
                <h4 class="text-lg font-medium text-gray-700 mb-2">{{ getExerciseName(results.exerciseType) }} İçin Öneriler</h4>
                <ul class="space-y-2">
                  <li v-for="(tip, index) in results.recommendations.exerciseSpecific" :key="index" class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700">{{ tip }}</span>
                  </li>
                </ul>
              </div>
              
              <!-- Kalori Bazlı Öneriler -->
              <div class="border-l-4 border-green-500 pl-4 py-1">
                <h4 class="text-lg font-medium text-gray-700 mb-2">Kalori Yakımı İçin Öneriler</h4>
                <ul class="space-y-2">
                  <li v-for="(tip, index) in results.recommendations.calorieBased" :key="index" class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700">{{ tip }}</span>
                  </li>
                </ul>
              </div>
              
              <!-- Genel Öneriler -->
              <div class="border-l-4 border-indigo-500 pl-4 py-1">
                <h4 class="text-lg font-medium text-gray-700 mb-2">Genel Egzersiz Önerileri</h4>
                <ul class="space-y-2">
                  <li v-for="(tip, index) in results.recommendations.general" :key="index" class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-700">{{ tip }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Haftalık Plan Önerisi -->
            <div class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <h3 class="text-xl font-semibold text-gray-800 mb-3">
                Haftalık Egzersiz Planı Önerisi
              </h3>
              <p class="text-gray-700 mb-4">
                Haftada 3-5 gün {{ getExerciseName(results.exerciseType) }} egzersizi yaparak düzenli kalori yakımı sağlayabilirsiniz. 
                Aşağıdaki plan, optimal sonuçlar için önerilmektedir:
              </p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="p-3 bg-white rounded-lg border border-blue-100">
                  <h4 class="font-medium text-blue-700">Başlangıç Seviyesi</h4>
                  <p class="text-sm text-gray-600">Haftada 3 gün, 20-30 dk, düşük yoğunluk</p>
                </div>
                <div class="p-3 bg-white rounded-lg border border-blue-100">
                  <h4 class="font-medium text-blue-700">Orta Seviye</h4>
                  <p class="text-sm text-gray-600">Haftada 4 gün, 30-45 dk, orta yoğunluk</p>
                </div>
                <div class="p-3 bg-white rounded-lg border border-blue-100">
                  <h4 class="font-medium text-blue-700">İleri Seviye</h4>
                  <p class="text-sm text-gray-600">Haftada 5 gün, 45-60 dk, yüksek yoğunluk</p>
                </div>
              </div>
            </div>
            
            <!-- Yeniden Hesaplama Butonu -->
            <button
              @click="results = null"
              class="mt-8 w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-lg text-base font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
            >
              <span class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Yeniden Hesapla
              </span>
            </button>
          </div>
          
          <!-- Sonuçlar Yoksa Bilgi Kartı -->
          <div v-else class="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-center justify-center text-center">
            <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Egzersiz Bilgilerinizi Girin</h3>
            <p class="text-gray-600 max-w-md">
              Kişisel bilgilerinizi ve egzersiz detaylarınızı girerek, harcayacağınız kalori miktarını hesaplayabilirsiniz.
              Ayrıca size özel egzersiz önerileri de alacaksınız.
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // Form verileri
  const formData = ref({
    weight: 70,
    age: 30,
    gender: 'male',
    exerciseType: 'running',
    duration: 30,
    intensity: 'moderate'
  });
  
  // Egzersiz türleri
  const exerciseTypes = [
    { id: 'running', name: 'Koşu', icon: 'run' },
    { id: 'walking', name: 'Yürüyüş', icon: 'walk' },
    { id: 'cycling', name: 'Bisiklet', icon: 'bike' },
    { id: 'swimming', name: 'Yüzme', icon: 'swim' },
    { id: 'weight_training', name: 'Ağırlık Çalışması', icon: 'weight' },
    { id: 'hiit', name: 'HIIT', icon: 'hiit' },
    { id: 'yoga', name: 'Yoga', icon: 'yoga' },
    { id: 'pilates', name: 'Pilates', icon: 'pilates' },
    { id: 'basketball', name: 'Basketbol', icon: 'basketball' },
    { id: 'football', name: 'Futbol', icon: 'football' }
  ];
  
  // Egzersiz yoğunlukları
  const intensityLevels = [
    { id: 'low', name: 'Düşük', description: 'Hafif terleme, normal nefes alma' },
    { id: 'moderate', name: 'Orta', description: 'Orta seviyede terleme, biraz zorlanmış nefes alma' },
    { id: 'high', name: 'Yüksek', description: 'Yoğun terleme, zorlanmış nefes alma' }
  ];
  
  // Sonuçlar
  const results = ref(null);
  
  // Kalori hesaplama fonksiyonu
  const calculateCalories = () => {
    // MET değerleri (Metabolik Eşdeğer Değerleri)
    const metValues = {
      running: { low: 7, moderate: 10, high: 12.5 },
      walking: { low: 3, moderate: 4.5, high: 6 },
      cycling: { low: 4, moderate: 8, high: 12 },
      swimming: { low: 5, moderate: 7, high: 10 },
      weight_training: { low: 3, moderate: 5, high: 7 },
      hiit: { low: 6, moderate: 9, high: 12 },
      yoga: { low: 2.5, moderate: 4, high: 5.5 },
      pilates: { low: 3, moderate: 4.5, high: 6 },
      basketball: { low: 4.5, moderate: 6, high: 8 },
      football: { low: 5, moderate: 7, high: 10 }
    };
  
    // Seçilen egzersiz ve yoğunluk için MET değeri
    const met = metValues[formData.value.exerciseType][formData.value.intensity];
    
    // Kalori hesaplama formülü: MET * ağırlık (kg) * süre (saat)
    const durationInHours = formData.value.duration / 60;
    const caloriesBurned = met * formData.value.weight * durationInHours;
    
    // Cinsiyet faktörü (kadınlar erkeklere göre yaklaşık %10 daha az kalori yakar)
    const genderFactor = formData.value.gender === 'female' ? 0.9 : 1;
    
    // Yaş faktörü (yaş arttıkça metabolizma yavaşlar)
    let ageFactor = 1;
    if (formData.value.age > 40) ageFactor = 0.95;
    if (formData.value.age > 50) ageFactor = 0.9;
    if (formData.value.age > 60) ageFactor = 0.85;
    
    // Toplam yakılan kalori
    const totalCalories = caloriesBurned * genderFactor * ageFactor;
    
    // Sonuçları ayarla
    results.value = {
      caloriesBurned: Math.round(totalCalories),
      exerciseType: formData.value.exerciseType,
      duration: formData.value.duration,
      intensity: formData.value.intensity,
      recommendations: getRecommendations(formData.value.exerciseType, totalCalories)
    };
  };
  
  // Egzersiz önerileri
  const getRecommendations = (exerciseType, calories) => {
    // Egzersiz türüne göre öneriler
    const typeRecommendations = {
      running: ['Koşu öncesi ısınma hareketleri yapın', 'Doğru koşu ayakkabıları kullanın', 'Koşu tekniğinize dikkat edin'],
      walking: ['Hızlı yürüyüş için kollarınızı da hareket ettirin', 'Yokuş yukarı yürüyüşler ekleyin', 'Doğru postürle yürüyün'],
      cycling: ['Doğru sele yüksekliği ayarlayın', 'Aralıklı yüksek tempo sürüşler ekleyin', 'Yokuş tırmanışları dahil edin'],
      swimming: ['Farklı yüzme stillerini deneyin', 'Interval antremanlar yapın', 'Teknik geliştirmeye odaklanın'],
      weight_training: ['Büyük kas gruplarına odaklanın', 'Doğru form kullanın', 'Dinlenme sürelerine dikkat edin'],
      hiit: ['20-30 saniyelik yüksek yoğunluklu setler yapın', 'Setler arası dinlenmeyi kısa tutun', 'Haftada 2-3 kez uygulayın'],
      yoga: ['Nefes tekniklerine odaklanın', 'Duruşları doğru şekilde uygulayın', 'Düzenli pratik yapın'],
      pilates: ['Merkez kaslarınıza odaklanın', 'Kontrollü ve yavaş hareketler yapın', 'Nefes tekniğinize dikkat edin'],
      basketball: ['Farklı şut teknikleri çalışın', 'Sprint ve çeviklik antremanları ekleyin', 'Takım koordinasyonunu geliştirin'],
      football: ['Top kontrolü üzerine çalışın', 'Sprint ve dayanıklılık antremanları yapın', 'Taktik anlayışınızı geliştirin']
    };
    
    // Genel öneriler
    const generalRecommendations = [
      'Haftada en az 150 dakika orta yoğunlukta egzersiz yapın',
      'Antreman öncesi ve sonrası yeterli su tüketin',
      'Egzersiz sonrası protein açısından zengin beslenin'
    ];
    
    // Kalori bazlı öneriler
    let calorieTips = [];
    if (calories < 200) {
      calorieTips = ['Antreman süresini veya yoğunluğunu artırmayı düşünün', 'Farklı egzersiz türlerini kombine edin'];
    } else if (calories < 400) {
      calorieTips = ['İyi bir kalori yakımı sağladınız', 'Düzenli olarak bu antremanı sürdürün'];
    } else {
      calorieTips = ['Yüksek kalori yakımı sağladınız', 'Yeterli dinlenme ve beslenmeye dikkat edin'];
    }
    
    return {
      exerciseSpecific: typeRecommendations[exerciseType],
      general: generalRecommendations,
      calorieBased: calorieTips
    };
  };
  
  // Egzersiz adı alma fonksiyonu
  const getExerciseName = (exerciseType) => {
    const exercise = exerciseTypes.find((exercise) => exercise.id === exerciseType);
    return exercise ? exercise.name : '';
  };
  
  // Yoğunluk adı alma fonksiyonu
  const getIntensityName = (intensity) => {
    const intensityLevel = intensityLevels.find((level) => level.id === intensity);
    return intensityLevel ? intensityLevel.name : '';
  };
  
  // Kalori eşdeğeri alma fonksiyonu
  const getCalorieEquivalent = (calories) => {
    if (calories < 200) return 'Düşük';
    else if (calories < 400) return 'Orta';
    else return 'Yüksek';
  };
  </script>
  
  <style scoped>
  .animate-pulse-slow {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-spin-slow {
    animation: spin 8s linear infinite;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.05;
    }
    50% {
      opacity: 0.1;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
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

  /* Egzersiz ikon stilleri */
  .icon-run:before {
    content: "🏃";
  }
  .icon-walk:before {
    content: "🚶";
  }
  .icon-bike:before {
    content: "🚴";
  }
  .icon-swim:before {
    content: "🏊";
  }
  .icon-weight:before {
    content: "🏋️";
  }
  .icon-hiit:before {
    content: "⚡";
  }
  .icon-yoga:before {
    content: "🧘";
  }
  .icon-pilates:before {
    content: "🤸";
  }
  .icon-basketball:before {
    content: "🏀";
  }
  .icon-football:before {
    content: "⚽";
  }
  </style>