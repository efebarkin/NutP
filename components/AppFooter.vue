<template>
  <footer class="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 relative overflow-hidden">
    <!-- Background decoration elements -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 opacity-70"></div>
    <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-green-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
    <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow" style="animation-delay: 1s;"></div>
    
    <div class="container mx-auto px-4 py-12 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Hakkında -->
        <div class="animate-fade-in">
          <div class="flex items-center space-x-2 mb-4">
            <div class="relative">
              <img src="/logo.svg" alt="NutriTrack Logo" class="h-10 w-10 relative z-10">
              <div class="absolute -inset-1 bg-green-400 rounded-full filter blur-sm opacity-30 animate-pulse-slow"></div>
            </div>
            <span class="text-xl font-bold text-white">NutriTrack</span>
          </div>
          <p class="text-gray-400 mb-4">
            Sağlıklı beslenme alışkanlıkları kazanmanıza yardımcı olan besin takip uygulaması.
          </p>
          <div class="mt-6">
            <div class="inline-flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors hover:scale-110 transform inline-block">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors hover:scale-110 transform inline-block">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors hover:scale-110 transform inline-block">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Hızlı Bağlantılar -->
        <div class="animate-fade-in" style="animation-delay: 100ms;">
          <h3 class="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Hızlı Bağlantılar</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="hover:text-white transition-colors flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform inline-block">Ana Sayfa</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/yiyecekler" class="hover:text-white transition-colors flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform inline-block">Besin Kataloğu</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/ogun" class="hover:text-white transition-colors flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform inline-block">Öğün Planlayıcı</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/glisemik-index" class="hover:text-white transition-colors flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform inline-block">Glisemik İndeks</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/YagOrani" class="hover:text-white transition-colors flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform inline-block">Vücut Ölçümleri</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- İletişim -->
        <div class="animate-fade-in" style="animation-delay: 200ms;">
          <h3 class="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">İletişim</h3>
          <ul class="space-y-3">
            <li>
              <a href="mailto:info@nutritrack.com" class="hover:text-white transition-colors flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform inline-block">info@nutritrack.com</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/yourusername/nutritrack" target="_blank" class="hover:text-white transition-colors flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform inline-block">GitHub</span>
              </a>
            </li>
            <li class="bg-gray-800 rounded-lg p-4 mt-6">
              <h4 class="text-sm font-medium text-white mb-2">Abone Ol</h4>
              <p class="text-xs text-gray-400 mb-3">Sağlıklı beslenme ipuçları, güncel bilgiler ve özel içerikler için bültenimize kaydolun</p>
              <div class="flex">
                <input type="email" placeholder="E-posta adresiniz" class="bg-gray-700 text-gray-200 text-sm px-3 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-500 flex-grow">
                <button class="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-r-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Alt Bilgi -->
      <div class="mt-8 pt-8 border-t border-gray-800 text-center">
        <p class="text-gray-400 animate-fade-in" style="animation-delay: 300ms;">
          {{ new Date().getFullYear() }} NutriTrack. Tüm hakları saklıdır.
        </p>
        <div class="mt-4 flex justify-center space-x-6 text-sm">
          <a href="#" class="text-gray-500 hover:text-gray-300 transition-colors">Gizlilik Politikası</a>
          <a href="#" class="text-gray-500 hover:text-gray-300 transition-colors">Kullanım Koşulları</a>
          <a href="#" class="text-gray-500 hover:text-gray-300 transition-colors">İletişim</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const menuItems = [
  { name: "Ana Sayfa", path: "/" },
  { name: "Hakkımızda", path: "/about" },
  { name: "Hizmetler", path: "/services" },
  { name: "İletişim", path: "/contact" },
];
</script>