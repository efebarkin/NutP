<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 animate-fade-in">
        Yeni hesap oluşturun
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 animate-fade-in">
        Zaten hesabınız var mı?
        <NuxtLink to="/login" class="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
          Giriş yapın
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-scale-in">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 card-hover">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- İsim alanı -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              İsim
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="name"
                type="text"
                required
                placeholder="Adınız"
                :class="[
                  'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200',
                  getError('name') ? 'border-red-300' : 'border-gray-300'
                ]"
              />
              <p v-if="getError('name')" class="mt-2 text-sm text-red-600">
                {{ getError('name') }}
              </p>
            </div>
          </div>

          <!-- Email alanı -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="ornek@email.com"
                :class="[
                  'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200',
                  getError('email') ? 'border-red-300' : 'border-gray-300'
                ]"
              />
              <p v-if="getError('email')" class="mt-2 text-sm text-red-600">
                {{ getError('email') }}
              </p>
            </div>
          </div>

          <!-- Şifre alanı -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="••••••"
                :class="[
                  'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200',
                  getError('password') ? 'border-red-300' : 'border-gray-300'
                ]"
                @input="validatePasswordRequirements"
              />
              <p v-if="getError('password')" class="mt-2 text-sm text-red-600">
                {{ getError('password') }}
              </p>
            </div>
          </div>

          <!-- Şifre onay alanı -->
          <div>
            <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">
              Şifre (Tekrar)
            </label>
            <div class="mt-1">
              <input
                id="passwordConfirm"
                v-model="passwordConfirm"
                type="password"
                required
                placeholder="••••••"
                :class="[
                  'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200',
                  getError('passwordConfirm') ? 'border-red-300' : 'border-gray-300'
                ]"
              />
              <p v-if="getError('passwordConfirm')" class="mt-2 text-sm text-red-600">
                {{ getError('passwordConfirm') }}
              </p>
            </div>
          </div>

          <!-- Şifre gereksinimleri -->
          <div class="space-y-2">
            <p class="text-sm text-gray-600">Şifre gereksinimleri:</p>
            <ul class="text-sm space-y-1">
              <li :class="passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'">
                <span class="inline-block w-4">{{ passwordRequirements.minLength ? '✓' : '•' }}</span>
                En az 6 karakter
              </li>
              <li :class="passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'">
                <span class="inline-block w-4">{{ passwordRequirements.hasUpperCase ? '✓' : '•' }}</span>
                En az bir büyük harf
              </li>
              <li :class="passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'">
                <span class="inline-block w-4">{{ passwordRequirements.hasLowerCase ? '✓' : '•' }}</span>
                En az bir küçük harf
              </li>
              <li :class="passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'">
                <span class="inline-block w-4">{{ passwordRequirements.hasNumber ? '✓' : '•' }}</span>
                En az bir rakam
              </li>
            </ul>
          </div>

          <!-- API Hata mesajı -->
          <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ authStore.error }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Submit butonu -->
          <div>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 btn-hover"
            >
              <svg
                v-if="authStore.loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ authStore.loading ? 'Kaydediliyor...' : 'Kayıt Ol' }}
            </button>
          </div>

          <!-- Login linki -->
          <div class="text-sm text-center">
            <router-link
              to="/login"
              class="font-medium text-green-600 hover:text-green-500"
            >
              Zaten hesabınız var mı? Giriş yapın
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
import { registerSchema } from '@/server/validations/userSchema';
import { useValidation } from '~/composables/useValidation';
import { useToast } from 'vue-toastification';

const toast = useToast();
const authStore = useAuthStore();
const { validate, getError, clearErrors } = useValidation(registerSchema);

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

// Şifre gereksinimlerini kontrol et
const passwordRequirements = ref({
  minLength: false,
  hasUpperCase: false,
  hasLowerCase: false,
  hasNumber: false
});

// Şifre gereksinimlerini kontrol et
function validatePasswordRequirements() {
  const pass = password.value;
  passwordRequirements.value = {
    minLength: pass.length >= 6,
    hasUpperCase: /[A-Z]/.test(pass),
    hasLowerCase: /[a-z]/.test(pass),
    hasNumber: /[0-9]/.test(pass)
  };
}

// Form geçerli mi kontrol et
const isFormValid = computed(() => {
  const { minLength, hasUpperCase, hasLowerCase, hasNumber } = passwordRequirements.value;
  return name.value.length >= 2 &&
         email.value.includes('@') &&
         minLength &&
         hasUpperCase &&
         hasLowerCase &&
         hasNumber &&
         password.value === passwordConfirm.value;
});

async function handleSubmit() {
  clearErrors();
  
  const formData = {
    name: name.value,
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value
  };

  if (!validate(formData)) {
    return;
  }

  try {
    const result = await authStore.register(formData);
    
    if (result && result.success) {
      toast.success('Hesabınız başarıyla oluşturuldu');
      navigateTo('/login');
    } else {
      if (result && result.errors) {
        // API'den gelen hata mesajlarını form alanlarına atayalım
        Object.entries(result.errors).forEach(([field, message]) => {
          errors.value[field] = message;
        });
      } else {
        // Genel hata mesajı
        errors.value.general = (result && result.message) || authStore.error || 'Kayıt işlemi sırasında bir hata oluştu';
      }
    }
  } catch (err) {
    console.error('Register error:', err);
    errors.value.general = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
  }
}
</script>

<style>
@import '@/assets/css/animations.css';

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Password strength indicator */
.password-strength {
  height: 4px;
  transition: width 0.3s ease;
  margin-top: 0.5rem;
}

.strength-weak {
  background-color: #ef4444;
  width: 33.333%;
}

.strength-medium {
  background-color: #f59e0b;
  width: 66.666%;
}

.strength-strong {
  background-color: #10b981;
  width: 100%;
}
</style>