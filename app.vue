<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- CSRF token yönetimi için görünmez bileşen -->
    <CsrfTokenHandler />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import CsrfTokenHandler from '~/components/CsrfTokenHandler.vue';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.initialize();
});
</script>
