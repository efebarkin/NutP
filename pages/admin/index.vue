<template>
  <div>
    
    <!-- Hoş Geldiniz Kartı -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg mb-6 overflow-hidden">
      <div class="p-6 flex flex-col md:flex-row items-center justify-between">
        <div class="text-white mb-4 md:mb-0">
          <h2 class="text-2xl font-bold">Hoş Geldiniz, {{ user?.name || 'Admin' }}!</h2>
          <p class="mt-1 text-green-100">NutriApp admin paneline hoş geldiniz. Buradan tüm sistem yönetimini gerçekleştirebilirsiniz.</p>
        </div>
        <div class="flex space-x-3">
          <button class="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600 transition-colors shadow-sm">
            <i class="fas fa-book-open mr-2"></i>
            <span>Dokümantasyon</span>
          </button>
          <button class="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600 transition-colors shadow-sm">
            <i class="fas fa-cog mr-2"></i>
            <span>Ayarlar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Özet İstatistikler -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <!-- Kullanıcı Sayısı -->
      <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ stats.users }}</h3>
            <p class="text-xs text-green-600 mt-1 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i> {{ stats.userGrowth }}% bu ay
            </p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <i class="fas fa-users text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Besin Sayısı -->
      <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Toplam Besin</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ stats.foods }}</h3>
            <p class="text-xs text-green-600 mt-1 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i> {{ stats.foodGrowth }}% bu ay
            </p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <i class="fas fa-apple-alt text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Toplam Öğün -->
      <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Toplam Öğün</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ stats.meals }}</h3>
            <p class="text-xs text-green-600 mt-1 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i> {{ stats.mealGrowth }}% bu ay
            </p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-full">
            <i class="fas fa-utensils text-yellow-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Aktif Kullanıcılar -->
      <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Aktif Kullanıcılar</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ stats.activeUsers }}</h3>
            <p class="text-xs text-green-600 mt-1 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i> {{ stats.activeGrowth }}% bu hafta
            </p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <i class="fas fa-user-check text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Grafikler ve Raporlar -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Kullanıcı Aktivitesi Grafiği -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Kullanıcı Aktivitesi</h3>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              Haftalık
            </button>
            <button class="px-3 py-1 text-xs bg-blue-500 text-white rounded-md">
              Aylık
            </button>
            <button class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              Yıllık
            </button>
          </div>
        </div>
        <div class="h-64 flex items-center justify-center">
          <div class="w-full h-full flex items-end space-x-2">
            <div v-for="(day, index) in activityData" :key="index" class="flex-1 flex flex-col items-center">
              <div class="w-full bg-blue-100 rounded-t-sm" :style="`height: ${day.value}%`"></div>
              <span class="text-xs text-gray-500 mt-1">{{ day.label }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Popüler Besinler -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Popüler Besinler</h3>
          <button class="text-sm text-blue-600 hover:text-blue-800">
            Tümünü Gör
          </button>
        </div>
        <div class="space-y-4">
          <div v-for="(food, index) in popularFoods" :key="index" class="flex items-center p-3 rounded-lg hover:bg-gray-50">
            <div class="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center mr-4">
              <i :class="`fas ${food.icon} text-${food.color}-500`"></i>
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-800">{{ food.name }}</h4>
              <p class="text-xs text-gray-500">{{ food.category }}</p>
            </div>
            <div class="text-right">
              <span class="text-sm font-semibold text-gray-800">{{ food.count }}</span>
              <p class="text-xs text-gray-500">kullanım</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Son Aktiviteler ve Hızlı Erişim -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Son Aktiviteler -->
      <div class="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Son Aktiviteler</h3>
          <button class="text-sm text-blue-600 hover:text-blue-800">
            Tümünü Gör
          </button>
        </div>
        <div class="space-y-4">
          <div v-for="(activity, index) in recentActivities" :key="index" class="flex p-3 border-b border-gray-100 last:border-0">
            <div :class="`bg-${activity.color}-100 h-10 w-10 rounded-full flex items-center justify-center mr-4`">
              <i :class="`fas ${activity.icon} text-${activity.color}-600`"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-800" v-html="activity.description"></p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Hızlı Erişim -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Hızlı Erişim</h3>
        <div class="grid grid-cols-2 gap-4">
          <button class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
            <i class="fas fa-user-plus text-blue-600 text-xl mb-2"></i>
            <span class="text-sm text-gray-700">Kullanıcı Ekle</span>
          </button>
          <button class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
            <i class="fas fa-plus-circle text-green-600 text-xl mb-2"></i>
            <span class="text-sm text-gray-700">Besin Ekle</span>
          </button>
          <button class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
            <i class="fas fa-cog text-purple-600 text-xl mb-2"></i>
            <span class="text-sm text-gray-700">Ayarlar</span>
          </button>
          <button class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
            <i class="fas fa-chart-bar text-yellow-600 text-xl mb-2"></i>
            <span class="text-sm text-gray-700">Raporlar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useHead } from '#app';
import role from '~/middleware/role';

// Auth store
const authStore = useAuthStore();
const user = ref(null);

useHead({
  titleTemplate: '%s | Dashboard',
});

// Örnek istatistikler
const stats = ref({
  users: 1254,
  userGrowth: 12.5,
  foods: 876,
  foodGrowth: 8.3,
  meals: 5432,
  mealGrowth: 15.7,
  activeUsers: 432,
  activeGrowth: 5.2
});

// Aktivite grafiği verileri
const activityData = ref([
  { label: 'Pzt', value: 65 },
  { label: 'Sal', value: 45 },
  { label: 'Çar', value: 75 },
  { label: 'Per', value: 55 },
  { label: 'Cum', value: 60 },
  { label: 'Cmt', value: 80 },
  { label: 'Paz', value: 70 }
]);

// Popüler besinler
const popularFoods = ref([
  { name: 'Elma', category: 'Meyveler', count: 1245, icon: 'fa-apple-alt', color: 'red' },
  { name: 'Tavuk Göğsü', category: 'Proteinler', count: 987, icon: 'fa-drumstick-bite', color: 'yellow' },
  { name: 'Brokoli', category: 'Sebzeler', count: 876, icon: 'fa-seedling', color: 'green' },
  { name: 'Yulaf', category: 'Tahıllar', count: 754, icon: 'fa-wheat-awn', color: 'amber' }
]);

// Son aktiviteler
const recentActivities = ref([
  { 
    description: '<strong>Ahmet Yılmaz</strong> yeni bir kullanıcı olarak kaydoldu', 
    time: '10 dakika önce',
    icon: 'fa-user-plus',
    color: 'blue'
  },
  { 
    description: '<strong>Ayşe Demir</strong> profilini güncelledi', 
    time: '1 saat önce',
    icon: 'fa-user-edit',
    color: 'purple'
  },
  { 
    description: '<strong>Mehmet Kaya</strong> yeni bir besin ekledi: <strong>Kinoa</strong>', 
    time: '3 saat önce',
    icon: 'fa-apple-alt',
    color: 'green'
  },
  { 
    description: 'Sistem <strong>günlük yedekleme</strong> işlemini tamamladı', 
    time: '5 saat önce',
    icon: 'fa-database',
    color: 'yellow'
  },
  { 
    description: '<strong>Zeynep Şahin</strong> bir öğün planı oluşturdu', 
    time: '1 gün önce',
    icon: 'fa-utensils',
    color: 'red'
  }
]);

// Kullanıcı bilgilerini yükle
onMounted(async () => {
  if (authStore.user) {
    user.value = authStore.user;
  }
  
  // Burada gerçek verileri API'den çekebilirsiniz
  // Örnek: const statsData = await fetch('/api/admin/stats');
  // stats.value = await statsData.json();
});

// Admin layout kullan
definePageMeta({
  middleware: role(['admin']),
  layout: 'admin',
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

// FontAwesome ikonları için CDN linki
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    }
  ]
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
