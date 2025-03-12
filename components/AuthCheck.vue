<template>
  <div v-if="checking" class="flex justify-center items-center py-8">
    <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
  </div>

  <div v-else-if="!authenticated" class="bg-white rounded-xl shadow-lg p-8 text-center">
    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <i class="fas fa-lock text-3xl text-red-500"></i>
    </div>
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Erişim Engellendi</h2>
    <p class="text-gray-600 mb-6">
      Bu sayfayı görüntüleyebilmek için giriş yapmanız gerekmektedir.
    </p>
    <NuxtLink
      to="/auth/login"
      class="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
    >
      Giriş Yap
    </NuxtLink>
  </div>

  <slot v-else></slot>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const checking = ref(true);
const authenticated = ref(false);

onMounted(() => {
  // Check if token exists in localStorage but not in store
  if (!authStore.token && localStorage.getItem('token')) {
    authStore.token = localStorage.getItem('token');
    authStore.authenticated = true;
  }

  authenticated.value = authStore.authenticated;
  checking.value = false;
});
</script> 