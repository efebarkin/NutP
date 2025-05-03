<template>
  <div class="password-change-form">
    <h2 class="text-xl font-semibold mb-4">Şifre Değiştir</h2>
    
    <form @submit.prevent="changePassword" class="space-y-4">
      <!-- Mevcut Şifre -->
      <div class="form-group">
        <label for="currentPassword" class="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
        <input 
          type="password" 
          id="currentPassword" 
          v-model="formData.currentPassword"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      
      <!-- Yeni Şifre -->
      <div class="form-group">
        <label for="newPassword" class="block text-sm font-medium text-gray-700">Yeni Şifre</label>
        <input 
          type="password" 
          id="newPassword" 
          v-model="formData.newPassword"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
          minlength="8"
        />
        <p class="text-xs text-gray-500 mt-1">Şifreniz en az 8 karakter uzunluğunda olmalıdır.</p>
      </div>
      
      <!-- Şifre Onay -->
      <div class="form-group">
        <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">Şifre Onay</label>
        <input 
          type="password" 
          id="passwordConfirm" 
          v-model="formData.passwordConfirm"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      
      <!-- Hata Mesajı -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>
      
      <!-- Başarı Mesajı -->
      <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ success }}</span>
      </div>
      
      <!-- Gönder Butonu -->
      <div class="flex justify-end">
        <button 
          type="submit" 
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          <span v-if="loading">İşleniyor...</span>
          <span v-else>Şifreyi Değiştir</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const loading = ref(false);
const error = ref(null);
const success = ref(null);

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  passwordConfirm: ''
});

const changePassword = async () => {
  // Hata ve başarı mesajlarını sıfırla
  error.value = null;
  success.value = null;
  
  // Kullanıcı kimliği kontrolü
  if (!authStore.user || (!authStore.user._id && !authStore.user.id)) {
    error.value = 'Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.';
    return;
  }

  // Kullanıcı ID'sini al
  const userId = authStore.user._id || authStore.user.id;
  
  // Form validasyonu
  if (formData.newPassword !== formData.passwordConfirm) {
    error.value = 'Yeni şifre ve onay şifresi eşleşmiyor';
    return;
  }

  if (formData.newPassword.length < 8) {
    error.value = 'Şifre en az 8 karakter uzunluğunda olmalıdır';
    return;
  }
  
  try {
    loading.value = true;
    
    // CSRF token'ı al (eğer yoksa)
    if (!authStore.csrfToken) {
      await authStore.fetchCsrfToken();
    }
    
    // Şifre değiştirme isteği gönder
    const response = await $fetch(`/api/user/updatePassword`, {
      method: 'POST',
      body: {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        passwordConfirm: formData.passwordConfirm
      },
      headers: {
        'X-CSRF-Token': authStore.csrfToken
      }
    });
    
    if (response.success) {
      success.value = response.message || 'Şifreniz başarıyla değiştirildi';
      // Formu temizle
      formData.currentPassword = '';
      formData.newPassword = '';
      formData.passwordConfirm = '';
    }
  } catch (err) {
    console.error('Şifre değiştirme hatası:', err);
    error.value = err.data?.message || 'Şifre değiştirilirken bir hata oluştu';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.password-change-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
