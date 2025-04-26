<template>
  <header class="bg-white shadow-md relative z-30">
    <!-- Header Background with subtle gradient and patterns -->
    <div class="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 opacity-70"></div>

    <nav class="container mx-auto px-4 py-4 relative">
      <div class="flex justify-between items-center">
        <!-- Logo ve Site Adı -->
        <NuxtLink
          to="/"
          class="flex items-center space-x-2 transition-transform hover:scale-105"
          :class="{ 'router-link-active': $route.path === '/' }"
        >
          <div class="relative">
            <img src="/logo.svg" alt="NutriTrack Logo" class="h-10 w-10 relative z-10" />
            <div
              class="absolute -inset-1 bg-green-100 rounded-full filter blur-sm opacity-70 animate-pulse-slow"
            ></div>
          </div>
          <span class="text-xl font-bold text-gray-900 animate-fade-in">NutriTrack</span>
        </NuxtLink>

        <!-- Ana Menü -->
        <div class="hidden md:flex space-x-8">
          <NuxtLink
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.path"
            class="text-gray-700 hover:text-green-600 transition-colors relative px-2 py-1 overflow-hidden group"
            :class="{ 'text-green-600 font-medium': $route.path === item.path }"
          >
            <span class="relative z-10">{{ item.name }}</span>
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"
            ></span>
            <span
              v-if="$route.path === item.path"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"
            ></span>
          </NuxtLink>
          
          <!-- Hesaplayıcılar Dropdown -->
          <div class="relative group">
            <button 
              @click.stop="toggleCalculatorMenu"
              class="text-gray-700 hover:text-green-600 transition-colors relative px-2 py-1 overflow-hidden flex items-center"
              :class="{ 'text-green-600 font-medium': isCalculatorRoute }"
              data-calculator-button
            >
              <span class="relative z-10">Hesaplayıcılar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1 transition-transform duration-300"
                :class="{ 'rotate-180': isCalculatorMenuOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"
              ></span>
              <span
                v-if="isCalculatorRoute"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"
              ></span>
            </button>
            
            <!-- Hesaplayıcılar Dropdown Menu -->
            <div 
              v-if="isCalculatorMenuOpen" 
              class="absolute left-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
              ref="calculatorMenuRef"
            >
              <NuxtLink
                v-for="(tool, index) in calculatorTools"
                :key="index"
                :to="tool.path"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="closeCalculatorMenu"
              >
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full mr-2" :class="tool.dotColor"></div>
                  {{ tool.name }}
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Sağ taraf - Kullanıcı Menüsü -->
        <div class="flex items-center">
          <ClientOnly>
            <template v-if="isAuthenticated">
              <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                <div class="relative">
                  <button
                    @click="isMenuOpen = !isMenuOpen"
                    class="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <span>{{ authStore.user?.name || 'Profil' }}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 transition-transform duration-300"
                      :class="{ 'rotate-180': isMenuOpen }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <!-- Dropdown menu -->
                  <transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1"
                  >
                    <div
                      v-if="isMenuOpen"
                      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                      role="menu"
                    >
                      <NuxtLink
                        to="/profil"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        @click="isMenuOpen = false"
                      >
                        <div class="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profilim
                        </div>
                      </NuxtLink>
                      <NuxtLink
                        to="/arkadaslar"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        @click="isMenuOpen = false"
                      >
                        <div class="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          Arkadaslar
                        </div>
                      </NuxtLink>
                      <NuxtLink
                        to="/messages"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        @click="isMenuOpen = false"
                      >
                        <div class="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          Mesajlar
                        </div>
                      </NuxtLink>
                      <NuxtLink
                        to="/favoriler"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        @click="isMenuOpen = false"
                      >
                        <div class="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          Favorilerim
                        </div>
                      </NuxtLink>
                      <button
                        @click="handleLogout"
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                      >
                        <div class="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 mr-2 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Çıkış Yap
                        </div>
                      </button>
                    </div>
                  </transition>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Giriş Yap
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="ml-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Kayıt Ol
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>

        <!-- Mobil Menü Butonu -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-600 transition-transform duration-300"
            :class="{ 'rotate-90': isMobileMenuOpen }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobil Menü -->
      <ClientOnly>
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-10"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-10"
        >
          <div v-show="isMobileMenuOpen" class="md:hidden mt-4 space-y-2 pb-3">
            <NuxtLink
              v-for="(item, index) in menuItems"
              :key="index"
              :to="item.path"
              class="block py-2 text-gray-700 hover:text-green-600 transition-colors"
              :class="{ 'text-green-600 font-medium': $route.path === item.path }"
              @click="closeMobileMenu"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </transition>
      </ClientOnly>
    </nav>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'vue-toastification';

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isCalculatorMenuOpen = ref(false);
const calculatorMenuRef = ref(null);

// Kullanıcı durumunu computed property olarak tanımla
// Bu, authStore.authenticated değeri değiştiğinde otomatik olarak güncellenecek
const isAuthenticated = computed(() => {
  return authStore.authenticated;
});

const menuItems = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Besin Kataloğu', path: '/yiyecekler' },
  { name: 'Öğün Planlayıcı', path: '/ogun' },
  { name: 'Beslenme Rehberi', path: '/nutrition-guide' },
  { name: 'Glisemik İndeks', path: '/glisemik-index' },
];

// Hesaplayıcı sayfalarında olup olmadığını kontrol et
const isCalculatorRoute = computed(() => {
  const calculatorRoutes = ['/YagOrani', '/SuIhtiyaci', '/KaloriIhtiyaci', '/BmiHesaplayici'];
  return calculatorRoutes.includes(router.currentRoute.value.path);
});

// Hesaplayıcı araçları
const calculatorTools = [
  { name: 'Vücut Kitle İndeksi (BMI)', path: '/BmiHesaplayici', dotColor: 'bg-blue-500' },
  { name: 'Günlük Kalori İhtiyacı', path: '/KaloriIhtiyaci', dotColor: 'bg-orange-500' },
  { name: 'Günlük Su İhtiyacı', path: '/SuIhtiyaci', dotColor: 'bg-cyan-500' },
  { name: 'Vücut Yağ Oranı', path: '/YagOrani', dotColor: 'bg-purple-500' },
  { name: 'BMR (Bazal Metabolizma Hızı)', path: '/BmrHesaplayici', dotColor: 'bg-green-500' },
  { name: 'Uyku & Kalori Dengesi', path: '/UykuKaloriHesaplayici', dotColor: 'bg-indigo-500' },
  { name: 'Antrenman Kalori Yakma', path: '/AntrenmanKaloriHesaplayici', dotColor: 'bg-red-500' },
];

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function toggleCalculatorMenu() {
  isCalculatorMenuOpen.value = !isCalculatorMenuOpen.value;
}

function closeCalculatorMenu() {
  isCalculatorMenuOpen.value = false;
}

async function handleLogout() {
  try {
    await authStore.logout();
    isMenuOpen.value = false;
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Sayfa değiştiğinde menüyü kapat
watch(
  () => router.currentRoute.value.path,
  () => {
    isMenuOpen.value = false;
    isMobileMenuOpen.value = false;
    isCalculatorMenuOpen.value = false;
  }
);

// Tıklama dışarıda olduğunda menüyü kapat
onMounted(async () => {
  document.addEventListener('click', event => {
    const menu = document.querySelector('.relative');
    if (menu && !menu.contains(event.target)) {
      isMenuOpen.value = false;
    }

    // Only close calculator menu if the click is not on the calculator button
    const calculatorButton = document.querySelector('[data-calculator-button]');
    if (calculatorMenuRef.value && 
        !calculatorMenuRef.value.contains(event.target) && 
        !(calculatorButton && calculatorButton.contains(event.target))) {
      closeCalculatorMenu();
    }
  });

  // Sayfa yenilendiğinde auth durumunu kontrol et
  if (!authStore.isInitialized) {
    await authStore.initialize();
  } else {
    // Sayfa yenilendiğinde localStorage'dan kullanıcı bilgisini kontrol et
    const userJson = localStorage.getItem('user');
    if (userJson && !authStore.authenticated) {
      try {
        const user = JSON.parse(userJson);
        authStore.setUser(user);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('user');
      }
    }
  }
});
</script>