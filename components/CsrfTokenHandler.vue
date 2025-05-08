<template>
  <!-- Bu bileşen görünmez, sadece CSRF token'ı yönetir -->
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
let refreshInterval = null;

// CSRF token'ı al ve periyodik olarak yenile
onMounted(async () => {
  // İlk token'ı al
  if (!authStore.csrfToken) {
    await authStore.fetchCsrfToken();
  }
  
  // 12 saatte bir token'ı yenile (24 saatlik geçerlilik süresinin yarısı)
  refreshInterval = setInterval(async () => {
    console.log('CSRF token yenileniyor...');
    await authStore.fetchCsrfToken();
  }, 12 * 60 * 60 * 1000); // 12 saat
});

// Component kaldırıldığında interval'i temizle
onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
