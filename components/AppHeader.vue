<template>
  <header class="bg-white shadow-md relative z-30">
    <!-- Header Background with subtle gradient and patterns -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 opacity-70"
    ></div>

    <nav class="container mx-auto px-4 py-4 relative">
      <div class="flex justify-between items-center">
        <!-- Logo ve Site Adı -->
        <NuxtLink
          to="/"
          class="flex items-center space-x-2 transition-transform hover:scale-105"
          :class="{
            'router-link-active': currentPath === '/',
          }"
        >
          <div class="relative">
            <img
              src="/logo.svg"
              alt="NutriTrack Logo"
              class="h-10 w-10 relative z-10"
            />
            <div
              class="absolute -inset-1 bg-green-100 rounded-full filter blur-sm opacity-70 animate-pulse-slow"
            ></div>
          </div>
          <span
            class="text-xl font-bold text-gray-900 animate-fade-in"
            >NutriTrack</span
          >
        </NuxtLink>

        <!-- Ana Menü -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.path"
            class="text-gray-700 hover:text-green-600 transition-colors relative px-2 py-2 overflow-hidden group flex items-center min-h-[44px]"
            :class="{
              'text-green-600 font-medium':
                currentPath === item.path,
            }"
          >
            <span class="relative z-10">{{
              item.name
            }}</span>
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"
            ></span>
            <span
              v-if="currentPath === item.path"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"
            ></span>
          </NuxtLink>

          <!-- Hesaplayıcılar Dropdown -->
          <div class="relative">
            <button
              ref="calculatorButtonRef"
              @click.stop="calculatorDropdown.toggle"
              @keydown="
                e =>
                  calculatorDropdown.handleKeyNavigation(
                    e,
                    calculatorTools
                  )
              "
              :aria-expanded="
                calculatorDropdown.isOpen.value
              "
              aria-haspopup="true"
              :aria-controls="`calculator-menu-${menuId}`"
              aria-label="Hesaplayıcılar menüsünü aç/kapat"
              class="text-gray-700 hover:text-green-600 transition-colors relative px-3 py-2 min-h-[44px] overflow-hidden flex items-center group touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg"
              :class="{
                'text-green-600 font-medium':
                  isCalculatorRoute,
              }"
            >
              <span class="relative z-10"
                >Hesaplayıcılar</span
              >
              <ChevronDownIcon
                class="h-4 w-4 ml-1 transition-transform duration-300"
                :class="{
                  'rotate-180':
                    calculatorDropdown.isOpen.value,
                }"
                aria-hidden="true"
              />
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"
              ></span>
              <span
                v-if="isCalculatorRoute"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"
              ></span>
            </button>

            <!-- Hesaplayıcılar Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <ul
                v-if="calculatorDropdown.isOpen.value"
                :id="`calculator-menu-${menuId}`"
                ref="calculatorMenuRef"
                role="menu"
                aria-labelledby="calculator-menu-button"
                class="absolute left-0 mt-2 w-64 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-100"
              >
                <li
                  v-for="(tool, index) in calculatorTools"
                  :key="tool.path"
                  role="none"
                >
                  <NuxtLink
                    :to="tool.path"
                    role="menuitem"
                    :tabindex="
                      calculatorDropdown.isOpen.value
                        ? 0
                        : -1
                    "
                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                    :class="{
                      'bg-gray-50':
                        calculatorDropdown.activeIndex
                          .value === index,
                    }"
                    @click="handleCalculatorMenuClick"
                    @keydown.enter="
                      handleCalculatorMenuClick
                    "
                    @keydown.space.prevent="
                      handleCalculatorMenuClick
                    "
                  >
                    <div
                      class="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                      :class="tool.dotColor"
                      aria-hidden="true"
                    ></div>
                    <span class="mr-2">{{
                      tool.icon
                    }}</span>
                    <span>{{ tool.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </Transition>
          </div>
        </div>

        <!-- Sağ taraf - Kullanıcı Menüsü -->
        <div class="flex items-center space-x-4">
          <ClientOnly>
            <template v-if="isAuthenticated">
              <div
                class="hidden sm:flex sm:items-center space-x-3"
              >
                <!-- Admin Butonu - Lazy loaded -->
                <Suspense>
                  <template #default>
                    <AdminButton v-if="authStore.isAdmin" />
                  </template>
                  <template #fallback>
                    <div
                      v-if="authStore.isAdmin"
                      class="w-8 h-8 animate-pulse bg-gray-200 rounded-lg"
                    ></div>
                  </template>
                </Suspense>

                <div class="relative">
                  <button
                    ref="userMenuButtonRef"
                    @click.stop="userDropdown.toggle"
                    @keydown="
                      e =>
                        userDropdown.handleKeyNavigation(
                          e,
                          userMenuItems
                        )
                    "
                    :aria-expanded="
                      userDropdown.isOpen.value
                    "
                    aria-haspopup="true"
                    :aria-controls="`user-menu-${menuId}`"
                    aria-label="Kullanıcı menüsünü aç/kapat"
                    class="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-2 min-h-[44px] rounded-lg hover:bg-gray-50 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <!-- Kullanıcı avatar'ı -->
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center"
                    >
                      <span
                        class="text-sm font-medium text-green-700"
                      >
                        {{
                          getUserInitials(
                            authStore.user?.name
                          )
                        }}
                      </span>
                    </div>
                    <span class="hidden sm:inline">{{
                      authStore.user?.name || 'Profil'
                    }}</span>
                    <ChevronDownIcon
                      class="h-4 w-4 transition-transform duration-300"
                      :class="{
                        'rotate-180':
                          userDropdown.isOpen.value,
                      }"
                      aria-hidden="true"
                    />
                  </button>

                  <!-- User Dropdown menu -->
                  <Transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1"
                  >
                    <ul
                      v-if="userDropdown.isOpen.value"
                      :id="`user-menu-${menuId}`"
                      ref="userMenuRef"
                      role="menu"
                      aria-labelledby="user-menu-button"
                      class="absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-100"
                    >
                      <li
                        v-for="(
                          item, index
                        ) in userMenuItems"
                        :key="item.path || 'logout'"
                        role="none"
                      >
                        <NuxtLink
                          v-if="item.path"
                          :to="item.path"
                          role="menuitem"
                          :tabindex="
                            userDropdown.isOpen.value
                              ? 0
                              : -1
                          "
                          class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                          :class="{
                            'bg-gray-50':
                              userDropdown.activeIndex
                                .value === index,
                          }"
                          @click.stop="handleUserMenuClick"
                        >
                          <component
                            :is="item.icon"
                            class="h-5 w-5 mr-3 text-gray-500"
                            aria-hidden="true"
                          />
                          {{ item.name }}
                        </NuxtLink>
                        <button
                          v-else
                          role="menuitem"
                          :tabindex="
                            userDropdown.isOpen.value
                              ? 0
                              : -1
                          "
                          :disabled="isLoggingOut"
                          class="flex items-center w-full px-4 py-3 text-sm transition-colors"
                          :class="[
                            isLoggingOut
                              ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                              : 'text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none',
                            {
                              'bg-red-50':
                                userDropdown.activeIndex
                                  .value === index &&
                                !isLoggingOut,
                            },
                          ]"
                          @click.stop="handleLogout"
                        >
                          <component
                            v-if="!isLoggingOut"
                            :is="item.icon"
                            class="h-5 w-5 mr-3 text-red-500"
                            aria-hidden="true"
                          />
                          <div
                            v-else
                            class="h-5 w-5 mr-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"
                          ></div>
                          {{
                            isLoggingOut
                              ? 'Çıkış yapılıyor...'
                              : item.name
                          }}
                        </button>
                      </li>
                    </ul>
                  </Transition>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center space-x-3">
                <NuxtLink
                  to="/login"
                  class="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 min-h-[44px] rounded-lg hover:bg-gray-50 transition-colors flex items-center"
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
                  class="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 min-h-[44px] rounded-lg transition-colors flex items-center"
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
              </div>
            </template>
          </ClientOnly>

          <!-- Mobil Menü Butonu -->
          <button
            @click.stop="toggleMobileMenu($event)"
            :aria-expanded="mobileDropdown.isOpen.value"
            aria-haspopup="true"
            aria-controls="mobile-menu"
            aria-label="Mobil menüyü aç/kapat"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-600 transition-transform duration-300"
              :class="{
                'rotate-90': mobileDropdown.isOpen.value,
              }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                v-if="!mobileDropdown.isOpen.value"
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
      </div>

      <!-- Mobil Menü -->
      <ClientOnly>
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-10"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-10"
        >
          <div
            v-if="mobileDropdown.isOpen.value"
            id="mobile-menu"
            ref="mobileMenuRef"
            role="menu"
            aria-labelledby="mobile-menu-button"
            class="md:hidden mt-4 space-y-2 pb-3 bg-white rounded-lg shadow-lg border border-gray-100 p-4"
            @click.stop
            @touchstart.passive="
              touchHandlers.handleTouchStart
            "
            @touchmove.passive="
              touchHandlers.handleTouchMove
            "
            @touchend.passive="touchHandlers.handleTouchEnd"
          >
            <!-- Main Menu Items -->
            <div class="space-y-1">
              <NuxtLink
                v-for="(item, index) in menuItems"
                :key="index"
                :to="item.path"
                role="menuitem"
                :tabindex="
                  mobileDropdown.isOpen.value ? 0 : -1
                "
                class="block py-3 px-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                :class="{
                  'text-green-600 font-medium bg-green-50':
                    currentPath === item.path,
                }"
                @click="handleMobileNavigation(item.path)"
              >
                {{ item.name }}
              </NuxtLink>
            </div>

            <!-- Calculator Tools Section -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <h3
                class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2"
              >
                Hesaplayıcılar
              </h3>
              <div class="space-y-1">
                <NuxtLink
                  v-for="tool in calculatorTools"
                  :key="tool.path"
                  :to="tool.path"
                  role="menuitem"
                  :tabindex="
                    mobileDropdown.isOpen.value ? 0 : -1
                  "
                  class="flex items-center py-2 px-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  :class="{
                    'text-green-600 font-medium bg-green-50':
                      currentPath === tool.path,
                  }"
                  @click="handleMobileNavigation(tool.path)"
                >
                  <div
                    class="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                    :class="tool.dotColor"
                    aria-hidden="true"
                  ></div>
                  <span class="mr-2">{{ tool.icon }}</span>
                  <span>{{ tool.name }}</span>
                </NuxtLink>
              </div>
            </div>

            <!-- User Section (if authenticated) -->
            <div
              v-if="isAuthenticated"
              class="border-t border-gray-200 pt-4 mt-4"
            >
              <div class="flex items-center mb-3 p-2">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center mr-3"
                >
                  <span
                    class="text-sm font-medium text-green-700"
                  >
                    {{ getUserInitials(userName) }}
                  </span>
                </div>
                <span
                  class="text-sm font-medium text-gray-700"
                  >{{ userName }}</span
                >
              </div>

              <div class="space-y-1">
                <NuxtLink
                  v-for="item in userMenuItems.filter(
                    i => i.path
                  )"
                  :key="item.id"
                  :to="item.path"
                  role="menuitem"
                  :tabindex="
                    mobileDropdown.isOpen.value ? 0 : -1
                  "
                  class="flex items-center py-2 px-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  @click.stop="
                    handleMobileNavigation(item.path)
                  "
                >
                  <component
                    :is="item.icon"
                    class="h-4 w-4 mr-3 text-gray-500"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </NuxtLink>

                <button
                  role="menuitem"
                  :tabindex="
                    mobileDropdown.isOpen.value ? 0 : -1
                  "
                  :disabled="isLoggingOut"
                  class="flex items-center w-full py-2 px-2 text-sm rounded-lg transition-colors"
                  :class="[
                    isLoggingOut
                      ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                      : 'text-red-600 hover:bg-red-50',
                  ]"
                  @click.stop="handleLogout"
                >
                  <component
                    v-if="!isLoggingOut"
                    :is="ArrowRightOnRectangleIcon"
                    class="h-4 w-4 mr-3 text-red-500"
                    aria-hidden="true"
                  />
                  <div
                    v-else
                    class="h-4 w-4 mr-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"
                  ></div>
                  {{
                    isLoggingOut
                      ? 'Çıkış yapılıyor...'
                      : 'Çıkış Yap'
                  }}
                </button>
              </div>
            </div>

            <!-- Auth buttons (if not authenticated) -->
            <div
              v-else
              class="border-t border-gray-200 pt-4 mt-4 space-y-2"
            >
              <NuxtLink
                to="/login"
                role="menuitem"
                :tabindex="
                  mobileDropdown.isOpen.value ? 0 : -1
                "
                class="flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                @click="closeMobileMenu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
                role="menuitem"
                :tabindex="
                  mobileDropdown.isOpen.value ? 0 : -1
                "
                class="flex items-center justify-center py-2 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                @click="closeMobileMenu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
            </div>
          </div>
        </Transition>
      </ClientOnly>
    </nav>
  </header>
</template>

<script setup>
import {
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
  nextTick,
} from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useDropdown } from '~/composables/useDropdown';
import { useClickOutside } from '~/composables/useClickOutside';
import { usePerformanceOptimization } from '~/composables/usePerformanceOptimization';
import {
  ChevronDownIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline';
import Swal from 'sweetalert2';

// Nuxt composables
const router = useRouter();
const route = useRoute();

// Store
const authStore = useAuthStore();

// Performance optimizations
const { throttle, debounce, shallowReactive } =
  usePerformanceOptimization();

// Unique menu ID for accessibility
const menuId = Math.random().toString(36).substr(2, 9);

// Dropdown configurations
const calculatorDropdown = useDropdown({
  autoClose: true,
  closeOnRouteChange: true,
  trapFocus: true,
});

const userDropdown = useDropdown({
  autoClose: true,
  closeOnRouteChange: true,
  trapFocus: true,
});

const mobileDropdown = useDropdown({
  autoClose: false,
  closeOnRouteChange: true,
  trapFocus: false,
});

// Refs for click outside and components
const calculatorMenuRef = ref(null);
const userMenuRef = ref(null);
const mobileMenuRef = ref(null);
const calculatorButtonRef = ref(null);
const userMenuButtonRef = ref(null);

// Click outside handlers
useClickOutside(calculatorMenuRef, () =>
  calculatorDropdown.close()
);
useClickOutside(userMenuRef, () => userDropdown.close());

// Mobile dropdown için özel click outside handler - mobil menü butonunu hariç tut
const handleMobileClickOutside = event => {
  // Mobil menü açık değilse hiçbir şey yapma
  if (!mobileDropdown.isOpen.value) return;

  // Mobil menü butonu veya menünün kendisine tıklanmışsa kapatma
  const mobileButton = document.querySelector(
    'button[aria-controls="mobile-menu"]'
  );
  if (
    mobileMenuRef.value?.contains(event.target) ||
    mobileButton?.contains(event.target)
  ) {
    return;
  }

  // Diğer durumlarda kapat
  mobileDropdown.close();
};

// Lazy component loading
const AdminButton = defineAsyncComponent({
  loader: () =>
    import('~/components/admin/AdminButton.vue'),
  delay: 200,
  timeout: 3000,
  suspensible: false,
});

// Menu items
const menuItems = shallowReactive([
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Besin Kataloğu', path: '/yiyecekler' },
  { name: 'Öğün Planlayıcı', path: '/ogun' },
  { name: 'Beslenme Rehberi', path: '/nutrition-guide' },
  { name: 'Glisemik İndeks', path: '/glisemik-index' },
]);

// Calculator menu items with performance optimization
const calculatorTools = shallowReactive([
  {
    id: 'bmi',
    name: 'Vücut Kitle İndeksi (BMI)',
    path: '/BmiHesaplayici',
    dotColor: 'bg-blue-500',
    icon: '⚖️',
    description: 'Vücut kitle indeksinizi hesaplayın',
  },
  {
    id: 'kalori',
    name: 'Günlük Kalori İhtiyacı',
    path: '/KaloriIhtiyaci',
    dotColor: 'bg-orange-500',
    icon: '🔥',
    description: 'Günlük kalori ihtiyacınızı öğrenin',
  },
  {
    id: 'su',
    name: 'Günlük Su İhtiyacı',
    path: '/SuIhtiyaci',
    dotColor: 'bg-cyan-500',
    icon: '💧',
    description: 'Günlük su ihtiyacınızı hesaplayın',
  },
  {
    id: 'yag',
    name: 'Vücut Yağ Oranı',
    path: '/YagOrani',
    dotColor: 'bg-purple-500',
    icon: '📊',
    description: 'Vücut yağ oranınızı ölçün',
  },
  {
    id: 'bmr',
    name: 'BMR (Bazal Metabolizma Hızı)',
    path: '/BmrHesaplayici',
    dotColor: 'bg-green-500',
    icon: '⚡',
    description: 'Bazal metabolizma hızınızı hesaplayın',
  },
  {
    id: 'uyku',
    name: 'Uyku & Kalori Dengesi',
    path: '/UykuKaloriHesaplayici',
    dotColor: 'bg-indigo-500',
    icon: '😴',
    description: 'Uyku ve kalori dengenizi analiz edin',
  },
  {
    id: 'antrenman',
    name: 'Antrenman Kalori Yakma',
    path: '/AntrenmanKaloriHesaplayici',
    dotColor: 'bg-red-500',
    icon: '💪',
    description: 'Antrenman kalori yakımınızı hesaplayın',
  },
]);

// Computed properties - önce currentPath tanımlanmalı
const currentPath = computed(() => route.path);

// User menu items
const userMenuItems = computed(() =>
  [
    {
      id: 'profile',
      name: 'Profil',
      path: '/profil',
      icon: UserIcon,
      show: true,
    },
    {
      id: 'settings',
      name: 'Ayarlar',
      path: '/settings',
      icon: CogIcon,
      show: true,
    },
    {
      id: 'friends',
      name: 'Arkadaşlar',
      path: '/arkadaslar',
      icon: UserIcon,
      show: true,
    },
    {
      id: 'favorites',
      name: 'Favoriler',
      path: '/favoriler',
      icon: HeartIcon,
      show: true,
    },
    {
      id: 'messages',
      name: 'Mesajlar',
      path: '/messages',
      icon: ChatBubbleLeftRightIcon,
      show: true,
    },
    {
      id: 'admin',
      name: 'Admin Panel',
      path: '/admin',
      icon: ShieldCheckIcon,
      show: authStore.isAdmin,
    },
    {
      id: 'logout',
      name: 'Çıkış Yap',
      action: 'logout',
      icon: ArrowRightOnRectangleIcon,
      show: true,
    },
  ].filter(item => item.show)
);

// Computed properties with performance optimization
const userName = computed(
  () => authStore.user?.name || 'Kullanıcı'
);
const userAvatar = computed(
  () => authStore.user?.avatar || '/default-avatar.png'
);
const isAuthenticated = computed(
  () => authStore.authenticated
);

// Check if current route is a calculator route
const isCalculatorRoute = computed(() => {
  const calculatorRoutes = calculatorTools.map(
    tool => tool.path
  );
  return calculatorRoutes.includes(currentPath.value);
});

// Helper functions
const navigateToCalculator = throttle(path => {
  calculatorDropdown.close();
  router.push(path);
}, 300);

const handleCalculatorMenuClick = throttle(() => {
  calculatorDropdown.close();
}, 300);

const handleUserMenuClick = throttle(() => {
  userDropdown.close();
}, 300);

const handleUserMenuAction = throttle(async item => {
  if (item.action === 'logout') {
    await handleLogout();
  } else if (item.path) {
    userDropdown.close();
    router.push(item.path);
  }
}, 300);

const handleMobileNavigation = throttle(path => {
  mobileDropdown.close();
  router.push(path);
}, 300);

// Get user initials for avatar
const getUserInitials = name => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Enhanced mobile menu functions with proper event handling
const toggleMobileMenu = event => {
  // Event'i durdur ki click outside handler tetiklenmesin
  event?.stopPropagation();

  if (mobileDropdown.isOpen.value) {
    mobileDropdown.close();
  } else {
    // Diğer dropdown'ları kapat
    userDropdown.close();
    calculatorDropdown.close();
    // Küçük bir gecikme ile aç
    nextTick(() => {
      mobileDropdown.open();
    });
  }
};

const closeMobileMenu = () => {
  mobileDropdown.close();
};

// Simplified logout handler - only SweetAlert notification
const isLoggingOut = ref(false);

const handleLogout = async () => {
  try {
    const result = await Swal.fire({
      title: 'Çıkış Yap',
      text: 'Çıkış yapmak istediğinize emin misiniz?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Evet, Çıkış Yap',
      cancelButtonText: 'İptal',
      reverseButtons: true,
      focusConfirm: false,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      isLoggingOut.value = true;
      userDropdown.close();
      mobileDropdown.close();

      try {
        // Perform logout
        await authStore.logout();

        // Show simple success notification
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Çıkış işlemi tamamlandı.',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Navigate to login page
        await router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);

        await Swal.fire({
          title: 'Hata!',
          text: 'Çıkış işlemi sırasında bir hata oluştu.',
          icon: 'error',
          confirmButtonText: 'Tamam',
        });
      } finally {
        isLoggingOut.value = false;
      }
    }
  } catch (error) {
    console.error('Logout confirmation error:', error);
    isLoggingOut.value = false;

    await Swal.fire({
      title: 'Hata!',
      text: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      icon: 'error',
      confirmButtonText: 'Tamam',
    });
  }
};

// Touch handlers for mobile with improved reliability
const touchHandlers = {
  startX: 0,
  startY: 0,
  isScrolling: false,

  handleTouchStart: e => {
    touchHandlers.startX = e.touches[0].clientX;
    touchHandlers.startY = e.touches[0].clientY;
    touchHandlers.isScrolling = false;
  },

  handleTouchMove: e => {
    const deltaX = Math.abs(
      e.touches[0].clientX - touchHandlers.startX
    );
    const deltaY = Math.abs(
      e.touches[0].clientY - touchHandlers.startY
    );

    // If user is scrolling vertically more than horizontally, mark as scrolling
    if (deltaY > deltaX && deltaY > 10) {
      touchHandlers.isScrolling = true;
    }
  },

  handleTouchEnd: e => {
    if (
      !touchHandlers.startX ||
      !touchHandlers.startY ||
      touchHandlers.isScrolling
    ) {
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = touchHandlers.startX - endX;
    const deltaY = touchHandlers.startY - endY;

    // Only process horizontal swipes
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 50
    ) {
      // Left swipe (deltaX > 0) - close mobile menu
      if (deltaX > 0 && mobileDropdown.isOpen.value) {
        mobileDropdown.close();
      }
    }

    // Reset values
    touchHandlers.startX = 0;
    touchHandlers.startY = 0;
    touchHandlers.isScrolling = false;
  },
};

// Keyboard navigation
const handleKeydown = event => {
  if (event.key === 'Escape') {
    calculatorDropdown.close();
    userDropdown.close();
    mobileDropdown.close();
  }
};

// Route change handler
watch(currentPath, () => {
  calculatorDropdown.close();
  userDropdown.close();
  mobileDropdown.close();
});

// Auth initialization
const initializeAuth = async () => {
  try {
    if (!authStore.isInitialized) {
      await authStore.initialize();
    } else if (import.meta.client) {
      // Client-side user restoration from localStorage
      const userJson = localStorage.getItem('user');
      if (userJson && !authStore.authenticated) {
        try {
          const user = JSON.parse(userJson);
          authStore.setUser(user);
        } catch (e) {
          console.error(
            'Error parsing user from localStorage:',
            e
          );
          localStorage.removeItem('user');
        }
      }
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
  }
};

// Lifecycle hooks
onMounted(() => {
  // Global keyboard handler
  document.addEventListener('keydown', handleKeydown);

  // Mobile click outside handler
  document.addEventListener(
    'click',
    handleMobileClickOutside
  );

  // Initialize authentication
  initializeAuth();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener(
    'click',
    handleMobileClickOutside
  );
});

// SEO and meta tags
useHead({
  title: computed(() => {
    const titles = {
      '/': 'Ana Sayfa - NutriTrack',
      '/profile': 'Profil - NutriTrack',
      '/settings': 'Ayarlar - NutriTrack',
      '/BmiHesaplayici': 'BMI Hesaplayıcı - NutriTrack',
      '/KaloriIhtiyaci': 'Kalori İhtiyacı - NutriTrack',
      '/SuIhtiyaci': 'Su İhtiyacı - NutriTrack',
    };
    return titles[currentPath.value] || 'NutriTrack';
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        const descriptions = {
          '/': 'Sağlıklı yaşam için beslenme takibi ve sağlık hesaplayıcıları',
          '/BmiHesaplayici':
            'BMI hesaplayıcı ile vücut kitle indeksinizi hesaplayın',
          '/KaloriIhtiyaci':
            'Günlük kalori ihtiyacınızı hesaplayın',
        };
        return (
          descriptions[currentPath.value] ||
          'NutriTrack - Sağlıklı yaşam platformu'
        );
      }),
    },
  ],
});

// Error handling for development
if (process.dev) {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('AppHeader')) {
      console.warn('AppHeader Error:', ...args);
    } else {
      originalError.apply(console, args);
    }
  };
}
</script>

<style scoped>
/* Touch-friendly interactions */
.touch-manipulation {
  touch-action: manipulation;
}

/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}

/* Focus indicators for better accessibility */
.focus-visible:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Custom scrollbar for dropdown menus */
.dropdown-menu::-webkit-scrollbar {
  width: 4px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Mobile menu slide animation */
@media (max-width: 768px) {
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .mobile-menu-enter-from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }

  .mobile-menu-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-gradient-to-r {
    background: #ffffff;
  }

  .text-gray-700 {
    color: #000000;
  }

  .border-gray-100 {
    border-color: #333333;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode preparation */
@media (prefers-color-scheme: dark) {
  /* Dark mode styles can be added here in the future */
}
</style>