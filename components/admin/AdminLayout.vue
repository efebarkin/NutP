<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-gray-100 flex flex-col shadow-lg transition-all duration-300">
      <!-- Logo & Brand -->
      <div class="p-5 border-b border-gray-800 flex items-center space-x-3">
        <div class="bg-green-500 h-8 w-8 rounded-md flex items-center justify-center">
          <i class="fas fa-leaf text-white"></i>
        </div>
        <span class="font-bold text-lg">NutriDash</span>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4">
        <div class="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Yönetim
        </div>
        <ul class="mt-2 space-y-1">
          <li>
            <NuxtLink 
              to="/admin"
              class="block px-4 py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800"
              :class="{ 'bg-gray-800 border-l-4 border-green-500': currentRoute === '/admin' }"
            >
              <i class="fas fa-chart-line w-5 h-5 mr-3" :class="currentRoute === '/admin' ? 'text-green-400' : 'text-gray-400'"></i> Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/FoodAdmin"
              class="block px-4 py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800"
              :class="{ 'bg-gray-800 border-l-4 border-green-500': currentRoute === '/admin/FoodAdmin' }"
            >
              <i class="fas fa-apple-alt w-5 h-5 mr-3" :class="currentRoute === '/admin/FoodAdmin' ? 'text-green-400' : 'text-gray-400'"></i> Besin Yönetimi
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/userAdmin"
              class="block px-4 py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800"
              :class="{ 'bg-gray-800 border-l-4 border-blue-500': currentRoute === '/admin/userAdmin' }"
            >
              <i class="fas fa-users w-5 h-5 mr-3" :class="currentRoute === '/admin/userAdmin' ? 'text-blue-400' : 'text-gray-400'"></i> Kullanıcılar
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/categories"
              class="block px-4 py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800"
              :class="{ 'bg-gray-800 border-l-4 border-green-500': currentRoute === '/admin/categories' }"
            >
              <i class="fas fa-folder w-5 h-5 mr-3" :class="currentRoute === '/admin/categories' ? 'text-green-400' : 'text-gray-400'"></i> Kategoriler
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/settings"
              class="block px-4 py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800"
              :class="{ 'bg-gray-800 border-l-4 border-green-500': currentRoute === '/admin/settings' }"
            >
              <i class="fas fa-cog w-5 h-5 mr-3" :class="currentRoute === '/admin/settings' ? 'text-green-400' : 'text-gray-400'"></i> Ayarlar
            </NuxtLink>
          </li>
        </ul>
        
        <div class="mt-8 px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Sistem
        </div>
        <ul class="mt-2 space-y-1">
          <li>
            <NuxtLink 
              to="/"
              class="block px-4 py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800"
            >
              <i class="fas fa-arrow-left w-5 h-5 mr-3 text-gray-400"></i> Siteye Dön
            </NuxtLink>
          </li>
          <li>
            <button 
              class="w-full px-4 py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800 text-left"
              @click="logout"
            >
              <i class="fas fa-sign-out-alt w-5 h-5 mr-3 text-gray-400"></i> Çıkış Yap
            </button>
          </li>
        </ul>
      </nav>
      
      <!-- User Profile Section -->
      <div class="border-t border-gray-800 p-4">
        <div class="flex items-center space-x-3">
          <div class="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center text-gray-300">
            <i class="fas fa-user"></i>
          </div>
          <div>
            <div class="text-sm font-medium">{{ user?.name || 'Admin Kullanıcı' }}</div>
            <div class="text-xs text-gray-400">{{ user?.email || 'admin@nutriapp.com' }}</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Header Bar -->
      <header class="bg-white shadow-sm z-10">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <h1 class="text-xl font-semibold text-gray-800">
              <slot name="header-title">Admin Panel</slot>
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-bell"></i>
            </button>
            <button class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-question-circle"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Kullanıcı bilgisi (gerçek uygulamada bir auth store'dan gelecek)
const user = ref(null);

// Mevcut rota bilgisini al
const route = useRoute();
const router = useRouter();

// Mevcut rotayı hesapla
const currentRoute = computed(() => {
  return route.path;
});

// Kullanıcı bilgilerini yükle
onMounted(async () => {
  try {
    // Burada gerçek uygulamada kullanıcı bilgilerini getiren bir API çağrısı olabilir
    // Örnek: const response = await fetch('/api/user/me');
    // user.value = await response.json();
    
    // Şimdilik örnek veri kullanıyoruz
    user.value = {
      name: 'Admin Kullanıcı',
      email: 'admin@nutriapp.com',
      role: 'admin'
    };
  } catch (error) {
    console.error('Kullanıcı bilgileri yüklenirken hata:', error);
  }
});

// Çıkış yapma fonksiyonu
function logout() {
  // Burada çıkış işlemi yapılabilir
  // Örnek: await fetch('/api/auth/logout', { method: 'POST' });
  
  // Kullanıcıyı giriş sayfasına yönlendir
  router.push('/login');
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
