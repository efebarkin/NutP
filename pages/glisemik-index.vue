<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 mb-12 relative overflow-hidden">
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-50 animate-pulse-slow"></div>
      <div class="absolute bottom-0 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 animate-pulse-slow" style="animation-delay: 1s"></div>
      
      <div class="text-center relative z-10">
        <h1 class="text-3xl md:text-5xl font-bold mb-4 text-gray-800 animate-fade-in">Glisemik İndeks Rehberi</h1>
        <p class="max-w-2xl mx-auto text-gray-600 text-lg animate-slide-in">
          Glisemik indeks (GI), karbonhidratlı besinlerin kan şekerini yükseltme hızını gösteren bir ölçüdür.
          Düşük GI'li besinler daha yavaş sindirilir ve kan şekerinizi dengede tutar.
        </p>
        
        <div class="mt-8 inline-block animate-fade-in" style="animation-delay: 300ms">
          <a href="#gi-tables" class="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors flex items-center hover-lift">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            GI Tablolarını Görüntüle
          </a>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center hover-lift shadow-sm">
        <div class="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-800">Düşük GI</h3>
        <p class="text-gray-600">0-55 arası değerler</p>
        <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-green-500 rounded-full" style="width: 55%"></div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center hover-lift shadow-sm">
        <div class="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-800">Orta GI</h3>
        <p class="text-gray-600">56-69 arası değerler</p>
        <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-yellow-500 rounded-full" style="width: 70%"></div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center hover-lift shadow-sm">
        <div class="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-800">Yüksek GI</h3>
        <p class="text-gray-600">70 ve üzeri değerler</p>
        <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-red-500 rounded-full" style="width: 100%"></div>
        </div>
      </div>
    </div>

    <!-- Blog Section -->
    <div class="max-w-4xl mx-auto mb-12 bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600">
        <i class="fas fa-lightbulb mr-2"></i>
        Sağlıklı Beslenme Rehberi
      </h2>

      <div class="space-y-8">
        <!-- Neden Düşük GI? -->
        <div class="blog-section transform hover:scale-102 transition-all">
          <h3 class="text-xl font-semibold mb-3 text-gray-800">
            <i class="fas fa-question-circle mr-2 text-green-500"></i>
            Neden Düşük GI'li Besinler Tüketmeliyiz?
          </h3>
          <div class="pl-8 text-gray-700 space-y-2">
            <p>• Kan şekeri seviyesini dengede tutar</p>
            <p>• Uzun süreli tokluk hissi sağlar</p>
            <p>• İnsülin direncini önlemeye yardımcı olur</p>
            <p>• Metabolizmayı dengeler</p>
            <p>• Kilo kontrolüne yardımcı olur</p>
          </div>
        </div>

        <!-- Ne Zaman Tüketilmeli? -->
        <div class="blog-section transform hover:scale-102 transition-all">
          <h3 class="text-xl font-semibold mb-3 text-gray-800">
            <i class="fas fa-clock mr-2 text-blue-500"></i>
            Günün Hangi Saatlerinde Tüketilmeli?
          </h3>
          <div class="pl-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="font-medium">🌅 Kahvaltı</p>
              <p class="text-sm mt-2">Yulaf, tam tahıllı ekmek ve meyveler ile güne düşük GI ile başlayın.</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="font-medium">🏃‍♂️ Egzersiz Öncesi</p>
              <p class="text-sm mt-2">Egzersizden 1-2 saat önce orta GI'li besinler tercih edin.</p>
            </div>
            <div class="bg-indigo-50 p-4 rounded-lg">
              <p class="font-medium">🌙 Akşam</p>
              <p class="text-sm mt-2">Düşük GI'li sebzeler ve protein kaynakları ile kombinleyin.</p>
            </div>
          </div>
        </div>

        <!-- Besin Kombinasyonları -->
        <div class="blog-section transform hover:scale-102 transition-all">
          <h3 class="text-xl font-semibold mb-3 text-gray-800">
            <i class="fas fa-utensils mr-2 text-purple-500"></i>
            Besin Kombinasyonları
          </h3>
          <div class="pl-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium mb-2">🥗 İdeal Kombinasyonlar:</p>
              <ul class="list-disc pl-4 space-y-1 text-sm">
                <li>Yulaf + Yağsız Süt + Tarçın</li>
                <li>Kinoa + Izgara Sebzeler</li>
                <li>Mercimek + Bulgur</li>
                <li>Tam Buğday Ekmeği + Avokado</li>
              </ul>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium mb-2">💡 Pratik İpuçları:</p>
              <ul class="list-disc pl-4 space-y-1 text-sm">
                <li>Protein ekleyin - GI'yi düşürür</li>
                <li>Lifli besinlerle birleştirin</li>
                <li>Sağlıklı yağlar ekleyin</li>
                <li>Sebzelerle zenginleştirin</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- SSS -->
        <div class="blog-section transform hover:scale-102 transition-all">
          <h3 class="text-xl font-semibold mb-3 text-gray-800">
            <i class="fas fa-comments mr-2 text-yellow-500"></i>
            Sıkça Sorulan Sorular
          </h3>
          <div class="pl-8 space-y-4">
            <div v-for="(qa, index) in faqs" :key="index" 
                 class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <p class="font-medium text-blue-600 mb-2">{{ qa.q }}</p>
              <p class="text-gray-700 text-sm">{{ qa.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Besin Listeleri -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="gi-tables">
      <!-- Düşük GI Besinler -->
      <div class="bg-white rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-all duration-300" 
           :class="{ 'animate-fade-in': isVisible }" 
           style="animation-delay: 100ms">
        <h2 class="text-xl font-semibold mb-6 text-green-600 flex items-center border-b border-gray-100 pb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Düşük GI Besinler
        </h2>
        <div class="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          <div 
            v-for="(food, index) in lowGIFoods" 
            :key="food.name"
            class="flex justify-between items-center p-3 rounded-lg hover:bg-green-50 transition-colors food-item"
            :style="{ 'animation-delay': `${index * 50}ms` }"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 font-semibold flex items-center justify-center mr-3">
                {{ food.gi }}
              </div>
              <span class="font-medium">{{ food.name }}</span>
            </div>
            <span class="text-xs px-2 py-1 bg-gray-100 rounded-md">{{ food.category }}</span>
          </div>
        </div>
      </div>

      <!-- Yüksek GI Besinler -->
      <div class="bg-white rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-all duration-300" 
           :class="{ 'animate-fade-in': isVisible }" 
           style="animation-delay: 300ms">
        <h2 class="text-xl font-semibold mb-6 text-red-600 flex items-center border-b border-gray-100 pb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Yüksek GI Besinler
        </h2>
        <div class="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          <div 
            v-for="(food, index) in highGIFoods" 
            :key="food.name"
            class="flex justify-between items-center p-3 rounded-lg hover:bg-red-50 transition-colors food-item"
            :style="{ 'animation-delay': `${index * 50}ms` }"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-red-100 text-red-600 font-semibold flex items-center justify-center mr-3">
                {{ food.gi }}
              </div>
              <span class="font-medium">{{ food.name }}</span>
            </div>
            <span class="text-xs px-2 py-1 bg-gray-100 rounded-md">{{ food.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

const faqs = ref([
  {
    q: "Düşük GI'li besinler kilo vermeme yardımcı olur mu?",
    a: "Evet, düşük GI'li besinler uzun süre tok tutarak ve kan şekerini dengeleyerek kilo kontrolüne yardımcı olur. Ancak porsiyon kontrolü de önemlidir."
  },
  {
    q: "Spor öncesi yüksek GI'li besinler tüketmeli miyim?",
    a: "Yoğun egzersizden 30-60 dakika önce orta GI'li besinler tercih edilebilir. Ancak uzun süreli performans için düşük GI'li besinler daha uygundur."
  },
  {
    q: "Yüksek GI'li besinleri tamamen hayatımdan çıkarmalı mıyım?",
    a: "Hayır, önemli olan denge. Yüksek GI'li besinleri protein ve lifle birleştirerek veya egzersiz sonrası tüketerek etkisini dengeleyebilirsiniz."
  },
  {
    q: "Meyvelerin GI değeri yüksek ise neden sağlıklı kabul ediliyorlar?",
    a: "Meyveler doğal şeker içerir ve lifli yapıları sayesinde kan şekerini işlenmiş şekerler kadar hızlı yükseltmezler. Ayrıca vitamin, mineral ve antioksidan içerirler."
  },
  {
    q: "Düşük GI'li bir besini yüksek GI'li besinle birlikte tüketmek zararlı mıdır?",
    a: "Hayır, aksine düşük GI'li besinler ve protein kaynakları, yüksek GI'li besinlerin kan şekerine etkisini yavaşlatabilir. Bu nedenle besin kombinasyonları önemlidir."
  }
])

const lowGIFoods = ref([
  { name: 'Yulaf', gi: 55, category: 'Tahıl' },
  { name: 'Mercimek', gi: 32, category: 'Baklagil' },
  { name: 'Kinoa', gi: 53, category: 'Tahıl' },
  { name: 'Nohut', gi: 28, category: 'Baklagil' },
  { name: 'Elma', gi: 36, category: 'Meyve' },
  { name: 'Yoğurt (Yağsız)', gi: 27, category: 'Süt Ürünü' },
  { name: 'Badem', gi: 15, category: 'Kuruyemiş' },
  { name: 'Çilek', gi: 40, category: 'Meyve' },
  { name: 'Ispanak', gi: 15, category: 'Sebze' },
  { name: 'Brokoli', gi: 10, category: 'Sebze' },
  { name: 'Yeşil Mercimek', gi: 30, category: 'Baklagil' },
  { name: 'Tam Buğday Ekmeği', gi: 54, category: 'Ekmek' },
  { name: 'Yaban Mersini', gi: 53, category: 'Meyve' },
  { name: 'Ceviz', gi: 15, category: 'Kuruyemiş' },
  { name: 'Avokado', gi: 15, category: 'Meyve' },
  { name: 'Chia Tohumu', gi: 1, category: 'Tohum' },
  { name: 'Keten Tohumu', gi: 1, category: 'Tohum' },
  { name: 'Bulgur', gi: 48, category: 'Tahıl' },
  { name: 'Yulaf Ezmesi', gi: 55, category: 'Tahıl' },
  { name: 'Süzme Peynir', gi: 0, category: 'Süt Ürünü' }
])

const highGIFoods = ref([
  { name: 'Beyaz Ekmek', gi: 75, category: 'Ekmek' },
  { name: 'Patates Püresi', gi: 80, category: 'Sebze' },
  { name: 'Pirinç (Beyaz)', gi: 73, category: 'Tahıl' },
  { name: 'Karpuz', gi: 72, category: 'Meyve' },
  { name: 'Mısır Gevreği', gi: 81, category: 'Tahıl' },
  { name: 'Bal', gi: 61, category: 'Tatlandırıcı' },
  { name: 'Beyaz Şeker', gi: 65, category: 'Tatlandırıcı' },
  { name: 'Patates Cipsi', gi: 75, category: 'Atıştırmalık' },
  { name: 'Muz (Olgun)', gi: 62, category: 'Meyve' },
  { name: 'Üzüm', gi: 59, category: 'Meyve' },
  { name: 'Ananas', gi: 59, category: 'Meyve' },
  { name: 'Kavun', gi: 65, category: 'Meyve' },
  { name: 'Mısır', gi: 75, category: 'Tahıl' },
  { name: 'Patates (Haşlanmış)', gi: 78, category: 'Sebze' },
  { name: 'Beyaz Makarna', gi: 71, category: 'Tahıl' },
  { name: 'Kraker', gi: 80, category: 'Atıştırmalık' },
  { name: 'Pirinç Keki', gi: 85, category: 'Atıştırmalık' },
  { name: 'Glukoz', gi: 100, category: 'Tatlandırıcı' },
  { name: 'Maltoz', gi: 105, category: 'Tatlandırıcı' },
  { name: 'Spor İçeceği', gi: 78, category: 'İçecek' }
])

onMounted(() => {
  isVisible.value = true
})
</script>

<style scoped>
.food-item {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
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

.hover\:scale-102:hover {
  transform: scale(1.02);
}

.blog-section {
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: white;
  margin-bottom: 1rem;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
  transform: translateX(-20px);
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-pulse-slow {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>