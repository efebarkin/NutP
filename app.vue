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
import { watch } from 'vue';
import { navigateTo } from '#app';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

watch(() => authStore.globalLogoutReason, (reason) => {
  if (reason && reason.message) {
    toast.warning(reason.message);
    navigateTo('/login');
    authStore.acknowledgeGlobalLogout();
  }
}, { deep: true });

onMounted(async () => {
  await authStore.initialize();
});
</script>
