<template>
    <div class="min-h-screen bg-gray-100">
      <!-- Overlay for mobile sidebar -->
      <div 
        v-if="isMobile && isSidebarOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
        @click="closeSidebar"
      ></div>
  
      <!-- Sidebar -->
      <div 
        class="fixed inset-y-0 left-0 bg-gray-900 text-white transition-all duration-300 z-30"
        :class="{
          'w-64': !isSidebarCollapsed && isSidebarOpen,
          'w-16': isSidebarCollapsed && isSidebarOpen,
          '-translate-x-full': !isSidebarOpen && isMobile,
          'translate-x-0': isSidebarOpen || !isMobile
        }"
      >
        <!-- Logo -->
        <div class="flex items-center h-16 border-b border-gray-800" :class="isSidebarCollapsed ? 'justify-center' : 'px-4'">
          <div v-if="!isSidebarCollapsed" class="flex items-center">
            <img src="~/public/logo.svg" alt="Logo" class="w-8 h-8">
            <h1 class="text-xl font-bold">NutriDash</h1>
          </div>
          <div v-else>
            <img src="~/public/logo.svg" alt="Logo" class="w-8 h-8">
          </div>
  
          <!-- Toggle button for desktop -->
          <button 
            @click="toggleSidebar"
            class="ml-auto text-gray-400 hover:text-white lg:block hidden"
          >
            <i :class="isSidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
          </button>
        </div>
        
        <!-- Menu -->
        <div class="p-4 overflow-y-auto" :class="isSidebarCollapsed ? 'px-2' : ''">
          <div v-if="!isSidebarCollapsed" class="mb-4 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Ana Menü
          </div>
          <div v-else class="mb-4 py-2 flex justify-center">
            <div class="w-8 border-b border-gray-700"></div>
          </div>
          
          <ul class="mt-2 space-y-1">
            <li v-if="authStore.user?.role.includes('admin')" v-for="menuItem in mainMenuItems" :key="menuItem.path">
              <NuxtLink 
                :to="menuItem.path"
                class="block py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800"
                :class="[{ 'bg-gray-800': currentRoute === menuItem.path }, 
                        isSidebarCollapsed ? 'px-2 justify-center' : 'px-4', 
                        currentRoute === menuItem.path ? 'border-l-4 border-green-500' : '']"
              >
                <i :class="[menuItem.icon, 'w-5 h-5', currentRoute === menuItem.path ? menuItem.activeColor : 'text-gray-400', isSidebarCollapsed ? '' : 'mr-3']"></i> 
                <span v-if="!isSidebarCollapsed">{{ menuItem.title }}</span>
              </NuxtLink>
            </li>
          </ul>
          
          <div v-if="!isSidebarCollapsed" class="mt-8 px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Diğer
          </div>
          <div v-else class="mt-8 py-2 flex justify-center">
            <div class="w-8 border-b border-gray-700"></div>
          </div>
  
          <ul class="mt-2 space-y-1">
            <li v-for="menuItem in otherMenuItems" :key="menuItem.path || menuItem.action">
              <!-- Link için -->
              <NuxtLink 
                v-if="menuItem.path"
                :to="menuItem.path"
                class="block py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800"
                :class="isSidebarCollapsed ? 'px-2 justify-center' : 'px-4'"
              >
                <i :class="[menuItem.icon, 'w-5 h-5 text-gray-400', isSidebarCollapsed ? '' : 'mr-3']"></i> 
                <span v-if="!isSidebarCollapsed">{{ menuItem.title }}</span>
              </NuxtLink>
              
              <!-- Buton için -->
              <button 
                v-else-if="menuItem.action"
                @click="menuItem.action"
                class="w-full text-left block py-2.5 text-sm flex items-center rounded-md transition-colors duration-200 hover:bg-gray-800 hover:text-red-400"
                :class="isSidebarCollapsed ? 'px-2 justify-center' : 'px-4'"
              >
                <i :class="[menuItem.icon, 'w-5 h-5 text-gray-400', isSidebarCollapsed ? '' : 'mr-3']"></i> 
                <span v-if="!isSidebarCollapsed">{{ menuItem.title }}</span>
              </button>
            </li>
          </ul>
        </div>
        
        <!-- User Profile -->
        <div class="absolute bottom-0 w-full border-t border-gray-800 p-4" :class="isSidebarCollapsed ? 'px-2' : ''">
          <div class="flex items-center" :class="isSidebarCollapsed ? 'justify-center' : 'space-x-3'">
            <div class="bg-gray-800 rounded-full p-2 text-green-400">
              <i class="fas fa-user"></i>
            </div>
            <div v-if="!isSidebarCollapsed">
              <div class="text-sm font-medium">{{ authStore.user?.name }}</div>
              <div class="text-xs text-gray-400">{{ authStore.user?.email }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div :class="{
        'lg:ml-64': !isSidebarCollapsed && isSidebarOpen,
        'lg:ml-16': isSidebarCollapsed && isSidebarOpen,
        'ml-0': !isSidebarOpen || isMobile,
        'transition-all duration-300': true
      }">
        <!-- Header -->
        <header class="bg-white shadow-sm">
          <div class="px-6 py-4 flex items-center justify-between">
            <div class="flex items-center">
              <!-- Hamburger menu for mobile -->
              <button 
                @click="toggleMobileSidebar"
                class="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <i class="fas fa-bars"></i>
              </button>
              <h1 class="text-xl font-semibold text-gray-800">
                {{ getPageTitle }}
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <button 
                v-for="headerAction in headerActions" 
                :key="headerAction.icon"
                class="text-gray-500 hover:text-gray-700"
                @click="headerAction.action"
              >
                <i :class="headerAction.icon"></i>
              </button>
            </div>
          </div>
        </header>
  
        <!-- Content Area -->
        <main class="flex-1 overflow-y-auto p-6">
          <transition name="admin-page" mode="out-in">
            <div :key="$route.fullPath" class="admin-content">
              <slot />
            </div>
          </transition>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '~/stores/auth';
  import Swal from 'sweetalert2';
  
  // Özel layout transition tanımla
  definePageMeta({
    middleware: ['admin'],
    layoutTransition: {
      name: 'admin-page',
      mode: 'out-in'
    }
  });
  // Mevcut rota bilgisini al
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  
  // Sidebar durumu
  const isSidebarCollapsed = ref(false);
  const isSidebarOpen = ref(true);
  const isMobile = ref(false);
  
  // Ekran boyutunu izle
  function checkScreenSize() {
    isMobile.value = window.innerWidth < 1024; // lg breakpoint
    if (isMobile.value) {
      isSidebarOpen.value = false;
    } else {
      isSidebarOpen.value = true;
    }
  }
  
  // Sidebar'ı aç/kapat (mobil için)
  function toggleMobileSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
  
  // Sidebar'ı kapat (mobil overlay tıklandığında)
  function closeSidebar() {
    isSidebarOpen.value = false;
  }
  
  // Sidebar'ı daralt/genişlet (masaüstü için)
  function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  }
  
  // Sayfa yüklendiğinde ekran boyutunu kontrol et
  onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  });
  
  // Component kaldırıldığında event listener'ı temizle
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
  });
  
  // Çıkış yapma fonksiyonu
  function logout() {
    authStore.logout();
    // Kullanıcıyı giriş sayfasına yönlendir
    router.push('/login');
  }
  
  function help() {
    Swal.fire({
      title: 'Yardım',
      text: 'Yardım sayfası yakında hazır olacak...',
      icon: 'info',
      confirmButtonText: 'Tamam'
    });
  }
  
  function notification() {
    Swal.fire({
      title: 'Bildirimler',
      text: 'Bildirimler sayfası yakında hazır olacak...',
      icon: 'info',
      confirmButtonText: 'Tamam'
    });
  }
  
  // Ana menü öğeleri
  const mainMenuItems = [
    { 
      path: '/admin', 
      title: 'Dashboard', 
      icon: 'fas fa-tachometer-alt',
      activeColor: 'text-blue-400'
    },
    { 
      path: '/admin/FoodAdmin', 
      title: 'Besin Yönetimi', 
      icon: 'fas fa-apple-alt',
      activeColor: 'text-green-400'
    },
    { 
      path: '/admin/userAdmin', 
      title: 'Kullanıcı Yönetimi', 
      icon: 'fas fa-users',
      activeColor: 'text-purple-400'
    }
  ];
  
  // Diğer menü öğeleri
  const otherMenuItems = [
    { 
      path: '/', 
      title: 'Siteye Dön', 
      icon: 'fas fa-arrow-left'
    },
    { 
      action: logout, 
      title: 'Çıkış Yap', 
      icon: 'fas fa-sign-out-alt'
    }
  ];
  
  // Header aksiyonları
  const headerActions = [
    { 
      icon: 'fas fa-bell', 
      action: notification
    },
    { 
      icon: 'fas fa-question-circle', 
      action: help
    }
  ];
  
  // Mevcut rotayı hesapla
  const currentRoute = computed(() => {
    return route.path;
  });
  
  // Sayfa başlığını hesapla
  const getPageTitle = computed(() => {
    const path = route.path;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/userAdmin') return 'Kullanıcı Yönetimi';
    if (path === '/admin/FoodAdmin') return 'Besin Yönetimi';
    if (path === '/admin/settings') return 'Ayarlar';
    return 'Admin Panel';
  });
  </script>
  
  <style scoped>
  /* Modern scrollbar için stiller */
  .admin-page-enter-active,
  .admin-page-leave-active {
    transition: all 0.3s ease;
  }
  
  .admin-page-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .admin-page-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  
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
  