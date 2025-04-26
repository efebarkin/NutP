<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Hesabınıza Giriş Yapın
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Veya
        <NuxtLink to="/register" class="font-medium text-green-600 hover:text-green-500">
          yeni hesap oluşturun
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div v-if="error" class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ error }}</span>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                :class="errors.email ? 'border-red-300' : 'border-gray-300'"
              />
              <p v-if="errors.email && errors.email.includes('gereklidir')" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                :class="errors.password ? 'border-red-300' : 'border-gray-300'"
              />
              <p v-if="errors.password && errors.password.includes('gereklidir')" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg
                v-if="authStore.loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ authStore.loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'vue-toastification';
import { navigateTo } from '#app';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const toast = useToast();
const authStore = useAuthStore();

// Yup validasyon şeması
const validationSchema = yup.object({
  email: yup.string()
    .required('Email gereklidir')
    .email('Geçerli bir email adresi giriniz'),
  password: yup.string()
    .required('Şifre gereklidir')
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .matches(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .matches(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .matches(/[0-9]/, 'Şifre en az bir rakam içermelidir')
    .matches(/[@$!%*?&]/, 'Şifre en az bir özel karakter içermelidir'),
});

const { handleSubmit: validateAndSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    password: ''
  }
});

const { value: email } = useField('email');
const { value: password } = useField('password');
const error = ref('');

const handleSubmit = validateAndSubmit(async (values) => {
  error.value = '';
  try {
    const success = await authStore.login(values.email, values.password);
    if (success) {
      toast.success('Başarıyla giriş yapıldı');
      const redirectPath = localStorage.getItem('redirectPath');
      if (redirectPath) {
        localStorage.removeItem('redirectPath');
        navigateTo(redirectPath);
      } else {
        navigateTo('/');
      }
    } else {
      error.value = authStore.error || 'Giriş yapılırken bir hata oluştu';
    }
  } catch (err) {
    // Backend'den dönen hata mesajını göster
    if (err?.data && err.data.data) {
      Object.keys(err.data.data).forEach(key => {
        errors[key] = err.data.data[key]?._errors?.[0] || '';
      });
    } else if (err?.data?.message) {
      error.value = err.data.message;
    } else {
      error.value = err.message || 'Giriş yapılırken bir hata oluştu';
    }
    console.error('Login failed:', err);
  }
});
</script>