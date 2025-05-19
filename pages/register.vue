<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center mb-6 animate-fade-in-up">
        <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
      </div>
      <h2 class="text-center text-3xl font-bold text-gray-800 animate-fade-in-up animation-delay-100">
        Yeni hesap oluşturun
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 animate-fade-in-up animation-delay-200">
        Zaten hesabınız var mı?
        <NuxtLink to="/login" class="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
          Giriş yapın
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up animation-delay-300">
      <div class="bg-white/95 backdrop-blur-sm py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 card-hover border border-gray-100 transition-all duration-300 hover:shadow-xl relative z-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- İsim alanı -->
          <div class="animate-fade-in-up animation-delay-400">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              İsim
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style="z-index: 1;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="name"
                v-model="name"
                type="text"
                required
                placeholder="Adınız"
                class="appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 sm:text-sm hover:shadow-md hover:border-gray-300"
                :class="errors.name ? 'border-red-300 animate-shake' : 'border-gray-200'"
              />
              <p v-if="errors.name" class="mt-2 text-sm text-red-600 flex items-center absolute bottom-[-24px] left-0 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ errors.name }}
              </p>
            </div>
          </div>

          <!-- Email alanı -->
          <div class="animate-fade-in-up animation-delay-500">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
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

          <!-- Şifre alanı -->
          <div class="animate-fade-in-up animation-delay-600">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Şifre
            </label>
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

          <!-- Şifre onay alanı -->
          <div class="animate-fade-in-up animation-delay-700">
            <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Şifre (Tekrar)
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style="z-index: 1;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="passwordConfirm"
                v-model="passwordConfirm"
                type="password"
                required
                placeholder="••••••••"
                class="appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 sm:text-sm hover:shadow-md hover:border-gray-300"
                :class="errors.passwordConfirm ? 'border-red-300 animate-shake' : 'border-gray-200'"
              />
              <p v-if="errors.passwordConfirm" class="mt-2 text-sm text-red-600 flex items-center absolute bottom-[-24px] left-0 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ errors.passwordConfirm }}
              </p>
            </div>
          </div>

          <!-- Şifre gereksinimleri -->
          <div class="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-fade-in-up animation-delay-800">
            <p class="text-sm font-medium text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Şifre gereksinimleri:
            </p>
            
            <!-- Şifre güç göstergesi -->
            <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full transition-all duration-300 rounded-full" 
                :class="{
                  'bg-red-500': password && Object.values(passwordRequirements).filter(Boolean).length <= 2,
                  'bg-yellow-500': password && Object.values(passwordRequirements).filter(Boolean).length === 3,
                  'bg-green-500': password && Object.values(passwordRequirements).filter(Boolean).length >= 4
                }"
                :style="{ width: password ? `${Object.values(passwordRequirements).filter(Boolean).length * 20}%` : '0%' }"
              ></div>
            </div>
            
            <ul class="text-sm space-y-2 mt-2">
              <li class="flex items-center transition-colors duration-200" :class="passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'">
                <span class="flex-shrink-0 w-5 h-5 mr-2 flex items-center justify-center rounded-full" :class="passwordRequirements.minLength ? 'bg-green-100' : 'bg-gray-100'">
                  <svg v-if="passwordRequirements.minLength" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                </span>
                En az 8 karakter
              </li>
              <li class="flex items-center transition-colors duration-200" :class="passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'">
                <span class="flex-shrink-0 w-5 h-5 mr-2 flex items-center justify-center rounded-full" :class="passwordRequirements.hasUpperCase ? 'bg-green-100' : 'bg-gray-100'">
                  <svg v-if="passwordRequirements.hasUpperCase" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                </span>
                En az bir büyük harf (A-Z)
              </li>
              <li class="flex items-center transition-colors duration-200" :class="passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'">
                <span class="flex-shrink-0 w-5 h-5 mr-2 flex items-center justify-center rounded-full" :class="passwordRequirements.hasLowerCase ? 'bg-green-100' : 'bg-gray-100'">
                  <svg v-if="passwordRequirements.hasLowerCase" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                </span>
                En az bir küçük harf (a-z)
              </li>
              <li class="flex items-center transition-colors duration-200" :class="passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'">
                <span class="flex-shrink-0 w-5 h-5 mr-2 flex items-center justify-center rounded-full" :class="passwordRequirements.hasNumber ? 'bg-green-100' : 'bg-gray-100'">
                  <svg v-if="passwordRequirements.hasNumber" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                </span>
                En az bir rakam (0-9)
              </li>
              <li class="flex items-center transition-colors duration-200" :class="passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'">
                <span class="flex-shrink-0 w-5 h-5 mr-2 flex items-center justify-center rounded-full" :class="passwordRequirements.hasSpecialChar ? 'bg-green-100' : 'bg-gray-100'">
                  <svg v-if="passwordRequirements.hasSpecialChar" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                </span>
                En az bir özel karakter (@$!%*?&)
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


          <!-- Kayıt ol butonu -->
          <div class="animate-fade-in-up animation-delay-900">
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group"
              :disabled="!isFormValid || submitting"
              :class="{ 'opacity-70 cursor-not-allowed': !isFormValid || submitting }"
            >
              <span v-if="submitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </span>
              <span v-else class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
              <span v-if="!submitting" class="relative">Kayıt Ol</span>
            </button>
          </div>

          <!-- Giriş sayfasına yönlendirme -->
          <!-- <div class="text-center mt-6 animate-fade-in-up animation-delay-1000">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">veya</span>
              </div>
            </div>
            <p class="mt-4 text-sm text-gray-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Zaten bir hesabınız var mı?
              <nuxt-link to="/login" class="ml-1 font-medium text-green-600 hover:text-green-500 transition-colors duration-200 flex items-center">
                Giriş Yap
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </nuxt-link>
            </p>
          </div>   -->

        </form>
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
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'vue-toastification';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const toast = useToast();
const authStore = useAuthStore();

// Form validasyon şeması
const validationSchema = yup.object({
  name: yup.string()
    .required('İsim gereklidir')
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'İsim sadece harf ve boşluk içerebilir'),
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
  passwordConfirm: yup.string()
    .required('Şifre tekrarı gereklidir')
    .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor')
});

// VeeValidate form hook'unu kullan
const { handleSubmit: validateAndSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }
});

// Form alanlarını tanımla
const { value: name } = useField('name');
const { value: email } = useField('email');
const { value: password } = useField('password');
const { value: passwordConfirm } = useField('passwordConfirm');

// Şifre gereksinimlerini kontrol et
const passwordRequirements = computed(() => {
  const pass = password.value || '';
  return {
    minLength: pass.length >= 8,
    hasUpperCase: /[A-Z]/.test(pass),
    hasLowerCase: /[a-z]/.test(pass),
    hasNumber: /[0-9]/.test(pass),
    hasSpecialChar: /[@$!%*?&]/.test(pass)
  };
});

// Form geçerli mi kontrol et
const isFormValid = computed(() => {
  const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = passwordRequirements.value;
  return name.value?.length >= 2 &&
         email.value?.includes('@') &&
         minLength &&
         hasUpperCase &&
         hasLowerCase &&
         hasNumber &&
         hasSpecialChar &&
         password.value === passwordConfirm.value;
});

// Email doğrulama modu state'leri
const showVerificationModal = ref(false);
const verificationUserId = ref('');
const verificationEmail = ref('');
const verificationCode = ref('');
const verificationError = ref('');
const verifyingEmail = ref(false);
const resendingCode = ref(false);
const resendCooldown = ref(0);
let resendInterval = null; // For managing the cooldown timer
const submitting = ref(false);

// Cleanup on component unmount
onUnmounted(() => {
  // Clear any timers or resources
  if (resendInterval) {
    clearInterval(resendInterval);
  }
});

// Form gönderme işlemi
const handleSubmit = validateAndSubmit(async (values) => {
  try {
    submitting.value = true;
    // API'ye tüm alanları gönder
    const result = await authStore.register(values);
    if (result && result.success) {
      if (result.requiresVerification) {
        // Show email verification modal
        verificationUserId.value = result.userId;
        verificationEmail.value = result.email;
        verificationCode.value = '';
        verificationError.value = '';
        showVerificationModal.value = true;
        toast.info('Lütfen email adresinize gönderilen doğrulama kodunu girin');
      } else {
        // Doğrulama gerekmiyorsa direkt giriş yap
        toast.success('Hesabınız başarılı bir şekilde oluşturuldu ve otomatik giriş yapıldı');
        
        // Kullanıcı rolüne göre yönlendirme yap
        if (authStore.user && Array.isArray(authStore.user.role)) {
          // Admin kullanıcıları admin paneline yönlendir
          if (authStore.user.role.includes('admin')) {
            navigateTo('/admin/userAdmin');
          } else {
            // Normal kullanıcıları ana sayfaya yönlendir
            navigateTo('/');
          }
        } else {
          // Rol bilgisi yoksa varsayılan olarak ana sayfaya yönlendir
          navigateTo('/');
        }
      }
    }
  } catch (err) {
    // Backend'den dönen validasyon hatalarını inputlara dağıt
    if (err?.data && err.data.data) {
      // Zod'un error.format() çıktısı
      Object.keys(err.data.data).forEach(key => {
        errors[key] = err.data.data[key]?._errors?.[0] || '';
      });
    } else if (err?.data?.message) {
      toast.error(err.data.message);
    } else {
      toast.error('Kayıt sırasında bir hata oluştu');
    }
    console.error('Register error:', err);
  } finally {
    submitting.value = false;
  }
});

// Email doğrulama işlemi
const verifyEmail = async () => {
  if (verificationCode.value.length !== 6) return;
  
  try {
    verifyingEmail.value = true;
    verificationError.value = '';
    
    console.log('Sending verification request with:', {
      userId: verificationUserId.value,
      code: verificationCode.value
    });

    console.log('[VERIFY_EMAIL] STEP 1: About to call $fetch for /api/auth/verify-email');
    
    // Ensure we have a CSRF token
    if (!authStore.csrfToken) {
      await authStore.fetchCsrfToken();
    }
    
    const response = await $fetch('/api/auth/verify-email', {
      method: 'POST',
      body: {
        userId: verificationUserId.value,
        code: verificationCode.value
      },
      credentials: 'include', // Ensure cookies are sent and received
      headers: {
        'X-CSRF-Token': authStore.csrfToken
      }
    });
    console.log('[VERIFY_EMAIL] STEP 2: $fetch call completed. Response received:', response);
    
    if (response && response.success) {
      toast.success('Email adresiniz başarıyla doğrulandı');
      
      // Kullanıcı bilgilerini store'a kaydet
      if (response.user) {
        console.log('Setting user in store:', response.user);
        authStore.setUser(response.user);
        
        // Ensure auth state is refreshed
        await authStore.checkSession();
        
        console.log('Auth state after verification:', authStore.isAuthenticated, authStore.user);
      }
      
      // Kısa bir gecikme ekleyerek auth state'in güncellendiğinden emin olalım
      setTimeout(() => {
        // Kullanıcı rolüne göre yönlendirme yap
        if (authStore.user && Array.isArray(authStore.user.role)) {
          // Admin kullanıcıları admin paneline yönlendir
          if (authStore.user.role.includes('admin')) {
            navigateTo('/admin/userAdmin');
          } else {
            // Normal kullanıcıları ana sayfaya yönlendir
            navigateTo('/');
          }
        } else {
          // Rol bilgisi yoksa varsayılan olarak ana sayfaya yönlendir
          navigateTo('/');
        }
      }, 500);
    }
  } catch (error) {
    console.error('[VERIFY_EMAIL] STEP 3: CAUGHT ERROR IN verifyEmail:', error);
    console.error('Email verification error (original):', error);
    verificationError.value = error.data?.message || 'Doğrulama kodu geçersiz. Lütfen tekrar deneyin.';
  } finally {
    verifyingEmail.value = false;
  }
};

// Yeni doğrulama kodu gönderme
const resendVerificationCode = async () => {
  if (resendCooldown.value > 0 || resendingCode.value) return;
  
  try {
    resendingCode.value = true;
    verificationError.value = '';
    
    // Ensure we have a CSRF token
    if (!authStore.csrfToken) {
      await authStore.fetchCsrfToken();
    }
    
    const response = await $fetch('/api/auth/resend-verification', {
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
    
    if (response && response.success) {
      toast.success('Yeni doğrulama kodu gönderildi');
      verificationCode.value = ''; // Kodu temizle
      
      // Yeniden gönderme için 60 saniyelik cooldown başlat
      resendCooldown.value = 60;
      if (resendInterval) clearInterval(resendInterval);
      resendInterval = setInterval(() => {
        resendCooldown.value--;
        if (resendCooldown.value <= 0) {
          clearInterval(resendInterval);
        }
      }, 1000);
    }
  } catch (error) {
    console.error('Resend verification code error:', error);
    verificationError.value = error.data?.message || 'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.';
  } finally {
    resendingCode.value = false;
  }
};
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