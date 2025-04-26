<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 relative">
    <!-- Background decoration elements -->
    <div class="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full opacity-5 animate-pulse-slow"></div>
    <div class="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-500 rounded-full opacity-5 animate-pulse-slow" style="animation-delay: 1.5s"></div>
    
    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- Başlık Bölümü -->
      <div class="text-center mb-10 animate-fade-in">
        <h1 class="text-4xl font-bold text-gray-900 mb-3 relative inline-block">
          BMI Hesaplayıcı
          <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded"></div>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Vücut Kitle İndeksi (BMI), boy ve kilonuza göre vücut ağırlığınızın sağlıklı bir aralıkta olup olmadığını değerlendiren bir ölçüdür.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <!-- Form Bölümü -->
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 200ms;">
          <form @submit.prevent="calculateBMI" class="space-y-6">
            <!-- Boy Input -->
            <div class="space-y-2">
              <label class="text-lg font-medium text-gray-700">Boy (cm)</label>
              <input
                v-model.number="formData.height"
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
                v-model.number="formData.weight"
                type="number"
                min="0"
                step="0.1"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                required
                placeholder="Kilonuzu girin"
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
          <!-- BMI Sonuç Kartı -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              BMI Sonucunuz
            </h3>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-bold" :class="getBmiTextColor()">
                {{ results.bmi.toFixed(1) }}
              </span>
              <span class="text-lg font-medium px-3 py-1 rounded-full" :class="getBmiCategoryClass()">
                {{ getBmiCategory() }}
              </span>
            </div>
            
            <!-- BMI Ölçeği -->
            <div class="mt-6 mb-6">
              <div class="relative h-8 w-full rounded-full overflow-hidden flex">
                <div class="h-full bg-blue-400 flex-1" title="Zayıf"></div>
                <div class="h-full bg-green-400 flex-1" title="Normal"></div>
                <div class="h-full bg-yellow-400 flex-1" title="Fazla Kilolu"></div>
                <div class="h-full bg-orange-400 flex-1" title="Obez"></div>
                <div class="h-full bg-red-400 flex-1" title="Aşırı Obez"></div>
                
                <!-- BMI İşaretçisi -->
                <div 
                  class="absolute top-0 h-full w-2 bg-gray-800 transform translate-x-[-50%] transition-all duration-500"
                  :style="{ left: getBmiMarkerPosition() + '%' }"
                ></div>
              </div>
              
              <div class="flex justify-between text-xs mt-1 text-gray-600">
                <span>16</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
                <span>40</span>
              </div>
            </div>
            
            <p class="text-gray-600 mb-4">
              {{ getBmiDescription() }}
            </p>
          </div>

          <!-- Sağlık Önerileri -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Sağlık Önerileri
            </h3>
            
            <div class="space-y-4 mt-4">
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-100 transition-all duration-300 hover:shadow-md">
                <h4 class="font-semibold text-blue-800 mb-2">{{ getRecommendationTitle() }}</h4>
                <ul class="space-y-2 text-gray-700">
                  <li v-for="(tip, index) in getHealthTips()" :key="index" class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ tip }}</span>
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
              BMI Nedir?
            </h3>
            <p class="text-gray-700 mb-3">
              Vücut Kitle İndeksi (BMI), vücut ağırlığınızın boyunuza göre normal olup olmadığını değerlendirmek için kullanılan bir ölçüdür. BMI, kilonuzu (kg) boyunuzun karesine (m²) bölerek hesaplanır.
            </p>
            <div class="bg-white p-3 rounded-lg border border-blue-100 mb-3">
              <h4 class="font-semibold text-blue-800 mb-2">BMI Kategorileri:</h4>
              <ul class="space-y-1 text-gray-700">
                <li class="flex items-center">
                  <div class="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                  <span><strong>18.5'in altı:</strong> Zayıf</span>
                </li>
                <li class="flex items-center">
                  <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span><strong>18.5 - 24.9:</strong> Normal</span>
                </li>
                <li class="flex items-center">
                  <div class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <span><strong>25 - 29.9:</strong> Fazla Kilolu</span>
                </li>
                <li class="flex items-center">
                  <div class="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                  <span><strong>30 - 34.9:</strong> Obez (Sınıf 1)</span>
                </li>
                <li class="flex items-center">
                  <div class="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span><strong>35 ve üzeri:</strong> Aşırı Obez (Sınıf 2-3)</span>
                </li>
              </ul>
            </div>
            <p class="text-gray-700 text-sm italic">
              Not: BMI, vücut yağ oranını doğrudan ölçmez ve kas kütlesi, kemik yoğunluğu, genel vücut kompozisyonu ve cinsiyet farklılıklarını dikkate almaz. Sadece genel bir değerlendirme aracıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Form verileri
const formData = ref({
  height: null,
  weight: null
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

// BMI hesaplama
const calculateBMI = () => {
  // Prevent calculation during initial render
  if (isInitialRender.value) return;
  const heightInMeters = formData.value.height / 100;
  const bmi = formData.value.weight / (heightInMeters * heightInMeters);
  
  // İdeal kilo hesaplama (BMI 22 için)
  const idealWeight = 22 * (heightInMeters * heightInMeters);
  
  // Kilo farkı hesaplama
  const weightDifference = formData.value.weight - idealWeight;
  
  results.value = {
    bmi: bmi,
    height: formData.value.height,
    weight: formData.value.weight,
    idealWeight: idealWeight,
    weightDifference: weightDifference
  };
  
  // Sayfayı sonuçlara doğru kaydır
  setTimeout(() => {
    window.scrollTo({
      top: 300,
      behavior: 'smooth'
    });
  }, 100);
};

// BMI kategorisi
const getBmiCategory = () => {
  const bmi = results.value.bmi;
  
  if (bmi < 18.5) return 'Zayıf';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Fazla Kilolu';
  if (bmi < 35) return 'Obez';
  return 'Aşırı Obez';
};

// BMI kategori sınıfı (renk)
const getBmiCategoryClass = () => {
  const bmi = results.value.bmi;
  
  if (bmi < 18.5) return 'bg-blue-100 text-blue-800';
  if (bmi < 25) return 'bg-green-100 text-green-800';
  if (bmi < 30) return 'bg-yellow-100 text-yellow-800';
  if (bmi < 35) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

// BMI metin rengi
const getBmiTextColor = () => {
  const bmi = results.value.bmi;
  
  if (bmi < 18.5) return 'text-blue-600';
  if (bmi < 25) return 'text-green-600';
  if (bmi < 30) return 'text-yellow-600';
  if (bmi < 35) return 'text-orange-600';
  return 'text-red-600';
};

// BMI işaretçi pozisyonu
const getBmiMarkerPosition = () => {
  const bmi = results.value.bmi;
  // BMI değerini 16-40 aralığında bir yüzdeye dönüştür
  const minBmi = 16;
  const maxBmi = 40;
  const clampedBmi = Math.min(Math.max(bmi, minBmi), maxBmi);
  return ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 100;
};

// BMI açıklaması
const getBmiDescription = () => {
  const bmi = results.value.bmi;
  const weightDiff = Math.abs(results.value.weightDifference).toFixed(1);
  
  if (bmi < 18.5) {
    return `BMI değeriniz ${bmi.toFixed(1)}, sağlıklı ağırlık aralığının altında olduğunu gösteriyor. İdeal kilonuza ulaşmak için yaklaşık ${weightDiff} kg almanız önerilir. Dengeli beslenme ve sağlıklı kilo alma stratejileri için bir sağlık uzmanına danışmanız faydalı olabilir.`;
  }
  if (bmi < 25) {
    return `Tebrikler! BMI değeriniz ${bmi.toFixed(1)}, sağlıklı ağırlık aralığında. Bu değer, boyunuz ${results.value.height} cm için ideal bir kiloda olduğunuzu gösteriyor. Dengeli beslenme ve düzenli fiziksel aktivite ile bu durumu korumaya devam edin.`;
  }
  if (bmi < 30) {
    return `BMI değeriniz ${bmi.toFixed(1)}, fazla kilolu kategorisinde olduğunuzu gösteriyor. İdeal kilonuza ulaşmak için yaklaşık ${weightDiff} kg vermeniz önerilir. Sağlıklı beslenme alışkanlıkları ve düzenli egzersiz ile ideal kilonuza ulaşabilirsiniz.`;
  }
  if (bmi < 35) {
    return `BMI değeriniz ${bmi.toFixed(1)}, obezite sınıflandırmasında olduğunuzu gösteriyor. İdeal kilonuza ulaşmak için yaklaşık ${weightDiff} kg vermeniz önerilir. Sağlık riskinizi azaltmak için bir sağlık uzmanı ile görüşmeniz ve kilo yönetimi programı oluşturmanız önerilir.`;
  }
  return `BMI değeriniz ${bmi.toFixed(1)}, ciddi obezite sınıflandırmasında olduğunuzu gösteriyor. İdeal kilonuza ulaşmak için yaklaşık ${weightDiff} kg vermeniz önerilir. Sağlık riskinizi değerlendirmek ve uygun bir kilo yönetimi programı oluşturmak için mutlaka bir sağlık uzmanına başvurun.`;
};

// Öneri başlığı
const getRecommendationTitle = () => {
  const bmi = results.value.bmi;
  
  if (bmi < 18.5) return `Sağlıklı Kilo Almak İçin Kişisel Öneriler (${results.value.height} cm boy için)`;
  if (bmi < 25) return `Sağlıklı Kilonuzu Korumak İçin Kişisel Öneriler`;
  return `Sağlıklı Kilo Vermek İçin Kişisel Öneriler (${Math.abs(results.value.weightDifference).toFixed(1)} kg)`;
};

// Sağlık önerileri
const getHealthTips = () => {
  const bmi = results.value.bmi;
  const weight = results.value.weight;
  
  if (bmi < 18.5) {
    // Zayıf kişiler için öneriler
    const calorieNeeded = Math.round(weight * 35); // Kilo almak için günlük kalori ihtiyacı tahmini
    const proteinNeeded = Math.round(weight * 1.6); // Günlük protein ihtiyacı tahmini
    
    return [
      `Günlük kalori alımınızı artırın (yaklaşık ${calorieNeeded} kalori hedefleyin)`,
      `Günde en az ${proteinNeeded}g protein tüketin (et, balık, yumurta, süt ürünleri, baklagiller)`,
      `Sağlıklı yağlar içeren besinleri diyetinize ekleyin (avokado, zeytinyağı, kuruyemişler)`,
      `Günde 5-6 küçük öğün yemeyi deneyin`,
      `Kas kütlesi kazanmak için haftada 2-3 kez direnç egzersizleri yapın`,
      `Yemeklerden hemen önce su içmekten kaçının, öğünler arasında için`,
      `Aşırı kafein tüketiminden kaçının, metabolizmanızı hızlandırabilir`,
      `Yeterli uyku alın (günde 7-9 saat) ve stresi yönetin`
    ];
  }
  
  if (bmi < 25) {
    // Normal kilolu kişiler için öneriler
    const waterNeeded = Math.round(weight * 0.033 * 10) / 10; // Günlük su ihtiyacı tahmini (L)
    const calorieNeeded = Math.round(weight * 30); // Kilo korumak için günlük kalori ihtiyacı tahmini
    
    return [
      `Günlük yaklaşık ${calorieNeeded} kalori alımı ile dengeli beslenmeye devam edin`,
      `Günde en az ${waterNeeded} litre su için`,
      `Haftada en az 150 dakika orta yoğunlukta fiziksel aktivite yapın`,
      `Kas kütlenizi korumak için haftada 2 kez direnç egzersizleri yapın`,
      `Sebze ve meyve tüketimini günde 5 porsiyona çıkarın`,
      `İşlenmiş gıdalar ve şeker tüketimini sınırlayın`,
      `Düzenli sağlık kontrolleri yaptırın`,
      `Stresi yönetmek için meditasyon veya yoga gibi aktiviteler deneyin`
    ];
  }
  
  // Fazla kilolu veya obez kişiler için öneriler
  const weightToLose = Math.abs(results.value.weightDifference).toFixed(1);
  const waterNeeded = Math.round(weight * 0.04 * 10) / 10; // Kilo vermek için daha fazla su (L)
  const calorieNeeded = Math.round(weight * 22); // Kilo vermek için günlük kalori ihtiyacı tahmini
  const proteinNeeded = Math.round(weight * 2); // Kas kaybını önlemek için protein
  
  if (bmi < 30) {
    // Fazla kilolu kişiler için öneriler
    return [
      `Hedef: ${weightToLose} kg vermek için günlük kalori alımınızı ${calorieNeeded} kaloriye düşürün`,
      `Günde en az ${waterNeeded} litre su için (açlık hissini azaltmaya yardımcı olur)`,
      `Porsiyon kontrolüne dikkat edin (tabağınızın yarısı sebze, çeyreği protein, çeyreği tam tahıl olsun)`,
      `Kas kütlenizi korumak için günde ${proteinNeeded}g protein tüketin`,
      `Haftada 3-5 gün, 30-60 dakika kardiyovasküler egzersiz yapın`,
      `Haftada 2-3 kez direnç egzersizleri yapın`,
      `İşlenmiş gıdalar, şeker ve doymuş yağ tüketimini azaltın`,
      `Öğün atlamamaya özen gösterin, düzenli beslenin`
    ];
  }
  
  if (bmi < 35) {
    // Obez kişiler için öneriler
    return [
      `Hedef: ${weightToLose} kg vermek için bir beslenme uzmanı ile çalışarak günlük ${calorieNeeded} kalori civarında bir diyet planlayın`,
      `Günde ${waterNeeded} litre su için (tokluğu artırır ve metabolizmayı destekler)`,
      `Günde ${proteinNeeded}g protein tüketerek kas kaybını önleyin`,
      `Şeker, işlenmiş gıdalar ve rafine karbonhidratları diyetinizden çıkarın`,
      `Haftada 5 gün, 30-60 dakika düşük etkili kardiyovasküler egzersiz yapın (yürüyüş, yüzme)`,
      `Bir sağlık uzmanı gözetiminde direnç egzersizleri yapın`,
      `Stres yönetimi ve uyku düzenine özen gösterin`,
      `Düzenli sağlık kontrolleri yaptırın ve kan değerlerinizi takip edin`
    ];
  }
  
  // Aşırı obez kişiler için öneriler
  return [
    `Hedef: ${weightToLose} kg vermek için mutlaka bir doktor ve beslenme uzmanı gözetiminde program oluşturun`,
    `Günlük kalori alımınızı ${calorieNeeded} kalori civarında tutun (uzman gözetiminde)`,
    `Günde ${waterNeeded} litre su için`,
    `Günde ${proteinNeeded}g protein tüketerek kas kaybını önleyin`,
    `Doktor onayı ile düşük etkili egzersizlere başlayın (su içi egzersizler, kısa yürüyüşler)`,
    `Eklem sağlığınızı korumak için düşük etkili aktiviteleri tercih edin`,
    `Yeme alışkanlıklarınızı değiştirmek için davranışsal terapi düşünün`,
    `Düzenli sağlık kontrolleri ile ilerlemenizi ve sağlık parametrelerinizi takip edin`,
    `Obezite ile ilişkili hastalıklar için tarama testleri yaptırın`
  ];
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
