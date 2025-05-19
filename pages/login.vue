<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center mb-6 animate-fade-in-up">
        <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3" />
          </svg>
        </div>
      </div>
      <h2 class="text-center text-3xl font-bold text-gray-800 animate-fade-in-up animation-delay-100">
        Hesabınıza Giriş Yapın
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 animate-fade-in-up animation-delay-200">
        Hesabınız yok mu?
        <NuxtLink to="/register" class="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
          Kayıt olun
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up animation-delay-300">
      <div class="bg-white/95 backdrop-blur-sm py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 card-hover border border-gray-100 transition-all duration-300 hover:shadow-xl relative z-10">
        <!-- Error message -->
        <div v-if="error" class="mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-center animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ error }}</span>
        </div>
        
        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email Field -->
            <div class="animate-fade-in-up animation-delay-400">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Adresiniz
              </label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style="z-index: 1;">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="ornek@email.com"
                  class="appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 sm:text-sm hover:shadow-md hover:border-gray-300"
                  :class="errors.email ? 'border-red-300 animate-shake' : 'border-gray-200'"
                />
                <p v-if="errors.email" class="mt-2 text-sm text-red-600 flex items-center absolute bottom-[-24px] left-0 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {{ errors.email }}
                </p>
              </div>
            </div>
            
            <!-- Password Field -->
            <div class="animate-fade-in-up animation-delay-500">
              <div class="flex justify-between items-center mb-1">
                <label for="password" class="block text-sm font-medium text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Şifreniz
                </label>
                <a href="#" class="text-xs font-medium text-green-600 hover:text-green-500 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Şifremi unuttum
                </a>
              </div>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style="z-index: 1;">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 sm:text-sm hover:shadow-md hover:border-gray-300"
                  :class="errors.password ? 'border-red-300 animate-shake' : 'border-gray-200'"
                />
                <p v-if="errors.password" class="mt-2 text-sm text-red-600 flex items-center absolute bottom-[-24px] left-0 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {{ errors.password }}
                </p>
              </div>
            </div>
            
            <!-- Remember Me and Register Link -->
            <div class="animate-fade-in-up animation-delay-700">
              <div class="relative mt-6 mb-2">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-4 bg-white text-gray-500">veya</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-all duration-200"
                  />
                  <label for="remember-me" class="ml-2 block text-sm text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Beni hatırla
                  </label>
                </div>

                <div class="text-sm">
                  <router-link
                    to="/register"
                    class="font-medium text-green-600 hover:text-green-500 transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Hesap oluştur
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Submit Button -->
            <div class="mt-2 animate-fade-in-up animation-delay-600">
              <button
                type="submit"
                :disabled="authStore.loading"
                class="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                <svg 
                  v-else 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {{ authStore.loading ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}
              </button>
            </div>
            
            <!-- Social Login Options -->
            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">veya şununla devam edin</span>
                </div>
              </div>
              
              <div class="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                
                <button
                  type="button"
                  class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Email Verification Modal -->
    <div v-if="showVerificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 animate-scale-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Email Doğrulama</h3>
          <button @click="showVerificationModal = false" class="text-gray-400 hover:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-4">Email adresinize gönderilen 6 haneli doğrulama kodunu giriniz.</p>
          
          <div class="flex flex-col space-y-2">
            <label for="verification-code" class="text-sm font-medium text-gray-700">Doğrulama Kodu</label>
            <input 
              id="verification-code" 
              v-model="verificationCode" 
              type="text" 
              maxlength="6" 
              placeholder="6 haneli kod" 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div v-if="verificationError" class="mt-2 text-sm text-red-600">
            {{ verificationError }}
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <button 
            @click="resendVerificationCode" 
            class="text-sm text-green-600 hover:text-green-500 focus:outline-none"
            :disabled="resendCooldown > 0"
          >
            {{ resendCooldown > 0 ? `Yeniden gönder (${resendCooldown}s)` : 'Kodu yeniden gönder' }}
          </button>
          
          <button 
            @click="verifyEmail" 
            class="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :disabled="verifyingEmail || verificationCode.length !== 6"
          >
            <svg v-if="verifyingEmail" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Doğrula
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
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

// Email verification related refs
const showVerificationModal = ref(false);
const verificationUserId = ref('');
const verificationEmail = ref('');
const verificationCode = ref('');
const verificationError = ref('');
const verifyingEmail = ref(false);
const resendCooldown = ref(0);
let resendInterval = null;

const handleSubmit = validateAndSubmit(async (values) => {
  error.value = '';
  try {
    const success = await authStore.login(values.email, values.password);
    if (success) {
      toast.success('Başarıyla giriş yapıldı');
      
      // URL'den redirect parametresini al
      const route = useRoute();
      const redirectParam = route.query.redirect;
      
      // localStorage'dan redirect path'i al
      const redirectPath = localStorage.getItem('redirectPath');
      
      // Kullanıcı rollerini kontrol et
      const userRoles = authStore.user?.role || [];
      const isAdmin = userRoles.includes('admin');
      
      // Yönlendirme öncelik sırası:
      // 1. URL'deki redirect parametresi
      // 2. localStorage'daki redirectPath
      // 3. Admin kullanıcılar için admin paneli, diğerleri için ana sayfa
      if (redirectParam) {
        // Admin olmayan kullanıcılar admin sayfalarına erişemez
        if (redirectParam.startsWith('/admin') && !isAdmin) {
          navigateTo('/');
        } else {
          navigateTo(redirectParam);
        }
      } else if (redirectPath) {
        localStorage.removeItem('redirectPath');
        // Admin olmayan kullanıcılar admin sayfalarına erişemez
        if (redirectPath.startsWith('/admin') && !isAdmin) {
          navigateTo('/');
        } else {
          navigateTo(redirectPath);
        }
      } else {
        // Admin kullanıcılar için admin paneline yönlendirme seçeneği göster
        if (isAdmin) {
          // Admin kullanıcılar için yönlendirme seçeneği göster
          // Bu kısım opsiyonel, direkt admin paneline yönlendirmek yerine bir modal gösterilebilir
          navigateTo('/');
        } else {
          navigateTo('/');
        }
      }
    } else {
      error.value = authStore.error || 'Giriş yapılırken bir hata oluştu';
    }
  } catch (err) {
    console.error('Login failed:', err);
    
    // err.data is now the direct payload from the backend, e.g., { statusCode, message, requiresVerification, userId, email }
    // This structure is set by the authStore's login catch block: throw { data: errorPayloadFromFetch };
    // err.data is the payload from the authStore, which should be:
    // { statusCode, message, data: { requiresVerification, userId, email } }
    const errorPayload = err.data; // This is error.data from $fetch, passed through by the store.
    console.log('[Login.vue] handleSubmit caught error. Full error object (err):', JSON.parse(JSON.stringify(err)));
    console.log('[Login.vue] Extracted errorPayload (err.data - should contain a nested .data object):', errorPayload ? JSON.parse(JSON.stringify(errorPayload)) : 'undefined');

    // Check if this is an unverified email error, looking at the nested 'data' property
    if (errorPayload?.statusCode === 403 && errorPayload?.data?.requiresVerification === true) {
      console.log('[Login.vue] Verification condition MET. Displaying verification modal. errorPayload.data:', JSON.parse(JSON.stringify(errorPayload.data)));
      // Show verification modal
      verificationUserId.value = errorPayload.data.userId;
      verificationEmail.value = errorPayload.data.email;
      verificationCode.value = '';
      verificationError.value = '';
      showVerificationModal.value = true;
      
      // Set a friendly message
      error.value = 'Email adresiniz henüz doğrulanmamış. Doğrulama kodunu girmeniz gerekiyor.';
    } else {
      console.log('[Login.vue] Verification condition NOT MET. Handling as other error. errorPayload:', errorPayload ? JSON.parse(JSON.stringify(errorPayload)) : 'undefined');
      // Handle other errors (e.g., actual 401, validation errors from backend)
      // For VeeValidate field errors, they might be nested if backend sends structured validation errors
      // This part might need adjustment based on how *other* types of errors are structured by your backend.
      // For now, assuming general error messages are top-level in errorPayload or directly on err.
      if (errorPayload?.data) { // If there's a nested 'data' object, it might contain specific field errors (e.g. Zod)
        Object.keys(errorPayload.data).forEach(key => {
          if (errors.hasOwnProperty(key)) { // Ensure 'errors' from useForm has this key
            // This assumes Zod-like error structure: { field: { _errors: ['message'] } }
            errors[key] = errorPayload.data[key]?._errors?.[0] || '';
          }
        });
      }
      // Set general error message for the main form error display
      error.value = errorPayload?.message || (err && err.message) /* fallback for unexpected structures */ || 'Giriş yapılırken bir hata oluştu.';
      console.log('[Login.vue] General error.value set to:', error.value);
    }
  }
});

// Email verification functions
const verifyEmail = async () => {
  if (verificationCode.value.length !== 6) return;
  
  try {
    verifyingEmail.value = true;
    verificationError.value = '';
    
    // Ensure we have a CSRF token
    const authStore = useAuthStore();
    if (!authStore.csrfToken) {
      await authStore.fetchCsrfToken();
    }
    
    // Call the API to verify email
    const response = await $fetch('/api/auth/verify-email', {
      method: 'POST',
      body: {
        userId: verificationUserId.value,
        code: verificationCode.value
      },
      credentials: 'include',
      headers: {
        'X-CSRF-Token': authStore.csrfToken
      }
    });
    
    // If successful
    toast.success('Email adresiniz başarıyla doğrulandı!');
    showVerificationModal.value = false;
    
    // Try to login again automatically
    await authStore.login(email.value, password.value);
    navigateTo('/');
    
  } catch (error) {
    console.error('Email verification error:', error);
    verificationError.value = error.data?.message || 'Doğrulama kodu geçersiz. Lütfen tekrar deneyin.';
  } finally {
    verifyingEmail.value = false;
  }
};

const resendVerificationCode = async () => {
  if (resendCooldown.value > 0) return;
  
  try {
    // Ensure we have a CSRF token
    const authStore = useAuthStore();
    if (!authStore.csrfToken) {
      await authStore.fetchCsrfToken();
    }
    
    // Call the API to resend verification code
    await $fetch('/api/auth/resend-verification', {
      method: 'POST',
      body: {
        userId: verificationUserId.value,
        email: verificationEmail.value
      },
      credentials: 'include',
      headers: {
        'X-CSRF-Token': authStore.csrfToken
      }
    });
    
    // Start cooldown
    resendCooldown.value = 60;
    resendInterval = setInterval(() => {
      if (resendCooldown.value > 0) {
        resendCooldown.value--;
      } else {
        clearInterval(resendInterval);
      }
    }, 1000);
    
    toast.info('Yeni doğrulama kodu email adresinize gönderildi.');
  } catch (error) {
    console.error('Resend verification error:', error);
    toast.error(error.data?.message || 'Doğrulama kodu gönderilirken bir hata oluştu.');
  }
};

// Clear interval when component is unmounted
onUnmounted(() => {
  if (resendInterval) {
    clearInterval(resendInterval);
  }
});
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

/* Card hover effect */
.card-hover {
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: rgba(52, 211, 153, 0.2);
}

/* Animation delays for staggered animations */
.animation-delay-100 { animation-delay: 0.1s; }
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-300 { animation-delay: 0.3s; }
.animation-delay-400 { animation-delay: 0.4s; }
.animation-delay-500 { animation-delay: 0.5s; }
.animation-delay-600 { animation-delay: 0.6s; }
.animation-delay-700 { animation-delay: 0.7s; }
.animation-delay-800 { animation-delay: 0.8s; }
.animation-delay-900 { animation-delay: 0.9s; }
.animation-delay-1000 { animation-delay: 1s; }

/* Fade in up animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>