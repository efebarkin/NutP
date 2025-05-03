// CSRF token için global plugin
import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();
  
  // Sayfa yüklendiğinde CSRF token'ı al
  if (process.client) {
    // Eğer token yoksa al
    if (!authStore.csrfToken) {
      try {
        await authStore.fetchCsrfToken();
      } catch (error) {
        console.error('CSRF token alınamadı:', error);
      }
    }
    
    // Fetch API'yi override et
    const originalFetch = window.fetch;
    window.fetch = async function(url, options = {}) {
      // POST, PUT, DELETE istekleri için CSRF token ekle
      if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
        // CSRF token'ı kontrol et
        if (!authStore.csrfToken) {
          try {
            await authStore.fetchCsrfToken();
          } catch (error) {
            console.error('CSRF token alınamadı:', error);
          }
        }
        
        // Headers oluştur veya mevcut olanı kullan
        options.headers = options.headers || {};
        
        // CSRF token'ı ekle
        if (authStore.csrfToken) {
          options.headers['X-CSRF-Token'] = authStore.csrfToken;
        }
      }
      
      // Orijinal fetch'i çağır
      return originalFetch.call(window, url, options);
    };
    
    // $fetch için interceptor ekle
    const { $fetch } = nuxtApp;
    nuxtApp.$fetch = async (url, options = {}) => {
      // POST, PUT, DELETE istekleri için CSRF token ekle
      if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
        // CSRF token'ı kontrol et
        if (!authStore.csrfToken) {
          try {
            await authStore.fetchCsrfToken();
          } catch (error) {
            console.error('CSRF token alınamadı:', error);
          }
        }
        
        // Headers oluştur veya mevcut olanı kullan
        options.headers = options.headers || {};
        
        // CSRF token'ı ekle
        if (authStore.csrfToken) {
          options.headers['X-CSRF-Token'] = authStore.csrfToken;
        }
      }
      
      // Orijinal $fetch'i çağır
      return $fetch(url, options);
    };
    
    console.log('CSRF token interceptor eklendi');
  }
  
  // Template'lerde kullanılabilecek yardımcı fonksiyonlar
  nuxtApp.provide('csrf', {
    getToken: () => authStore.csrfToken,
    refreshToken: () => authStore.refreshCsrfToken()
  });
});
