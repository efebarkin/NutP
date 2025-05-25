<template>
  <div class="profile-page container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Profil Sayfası</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Sol Sidebar - Kullanıcı Bilgileri -->
      <div class="md:col-span-1">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <span class="text-2xl font-bold text-indigo-600">{{ userInitials }}</span>
            </div>
            <h2 class="text-xl font-semibold">{{ user?.name || 'Kullanıcı' }}</h2>
            <p class="text-gray-600">{{ user?.email || 'kullanici@ornek.com' }}</p>
            <p class="text-sm text-gray-500 mt-1">
              Üyelik: {{ formatDate(user?.createdAt) }}
            </p>
            <div class="mt-4 w-full">
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-gray-600">Rol</span>
                <span class="font-medium">{{ userRole }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-gray-600">Son Güncelleme</span>
                <span class="font-medium">{{ formatDate(user?.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sağ Taraf - Ayarlar ve Formlar -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-lg shadow mb-6">
          <div class="border-b px-6 py-4">
            <h3 class="text-lg font-semibold">Hesap Ayarları</h3>
          </div>
          <div class="p-6">
            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import PasswordChangeForm from '~/components/user/PasswordChangeForm.vue';
import role from '~/middleware/role';

// Auth store
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Kullanıcı baş harfleri (avatar için)
const userInitials = computed(() => {
  if (!user.value?.name) return '?';
  return user.value.name
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
});

// Kullanıcı rolü
const userRole = computed(() => {
  if (!user.value?.role) return 'Kullanıcı';
  if (Array.isArray(user.value.role)) {
    return user.value.role.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ');
  }
  return user.value.role.charAt(0).toUpperCase() + user.value.role.slice(1);
});

// Tarih formatı
const formatDate = (dateString) => {
  if (!dateString) return 'Bilinmiyor';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

definePageMeta({
  middleware: role(['admin', 'user']),
  layout: 'settings'
});

// Sayfa yüklenirken oturum durumunu kontrol et
onMounted(async () => {
  try {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!authStore.authenticated) {
      await navigateTo('/login');
    }
  } catch (error) {
    console.error('Profil sayfası yüklenirken hata:', error);
    await navigateTo('/login');
  }
});
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 64px);
}
</style>
