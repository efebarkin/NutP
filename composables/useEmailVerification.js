import { ref, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'vue-toastification';
import { navigateTo } from '#app';

export function useEmailVerification(context = 'default') {
  const authStore = useAuthStore();
  const toast = useToast();

  // Email verification related refs
  const showVerificationModal = ref(false);
  const verificationUserId = ref('');
  const verificationEmail = ref('');
  const verificationCode = ref('');
  const verificationError = ref('');
  const verifyingEmail = ref(false);
  const resendCooldown = ref(0);
  let resendInterval = null;

  // Custom success handler
  let customSuccessHandler = null;

  // Email verification handler
  const verifyEmail = async () => {
    if (!verificationCode.value || verificationCode.value.length !== 6) {
      verificationError.value = 'Lütfen 6 haneli doğrulama kodunu giriniz.';
      return;
    }

    try {
      verifyingEmail.value = true;
      verificationError.value = '';

      // Ensure CSRF token is included for security
      if (!authStore.csrfToken) {
        await authStore.fetchCsrfToken();
        if (!authStore.csrfToken) {
          verificationError.value =
            'CSRF token alınamadı. Lütfen tekrar deneyin.';
          return;
        }
      }

      const response = await $fetch('/api/auth/verify-email', {
        method: 'POST',
        body: {
          userId: verificationUserId.value,
          code: verificationCode.value,
        },
        credentials: 'include',
        headers: {
          'X-CSRF-Token': authStore.csrfToken, // CSRF token for security
        },
      });

      if (response.success) {
        toast.success('Email adresiniz başarıyla doğrulandı!');
        showVerificationModal.value = false;
        verificationCode.value = '';
        verificationError.value = '';

        // Handle different contexts
        if (customSuccessHandler) {
          // Use custom success handler if provided
          await customSuccessHandler(response);
        } else if (context === 'register') {
          // Register context: Set user and navigate to home
          if (response.user) {
            // Store access token in memory only
            authStore.accessToken = response.user.accessToken;
            // Store user data without sensitive tokens
            const { accessToken, refreshToken, ...userData } = response.user;
            authStore.setUser(userData);
            authStore.startTokenRefreshTimer();
          }
          await navigateTo('/');
        } else if (context === 'login') {
          // Login context: Check auth and let login flow handle the rest
          await authStore.checkAuth();
          // Don't navigate here - let the login handler decide
        } else {
          // Default: just check auth and navigate
          await authStore.checkAuth();
          await navigateTo('/');
        }
      } else {
        verificationError.value =
          response.message || 'Doğrulama kodu geçersiz.';
      }
    } catch (error) {
      console.error('Email verification error:', error);
      verificationError.value =
        error.data?.message || 'Doğrulama sırasında bir hata oluştu.';
    } finally {
      verifyingEmail.value = false;
    }
  };

  // Resend verification code
  const resendVerificationCode = async () => {
    if (resendCooldown.value > 0) return;

    try {
      // Ensure CSRF token
      if (!authStore.csrfToken) {
        await authStore.fetchCsrfToken();
      }

      const response = await $fetch('/api/auth/resend-verification', {
        method: 'POST',
        body: {
          userId: verificationUserId.value,
          email: verificationEmail.value,
        },
        credentials: 'include',
        headers: {
          'X-CSRF-Token': authStore.csrfToken,
        },
      });

      if (response.success) {
        toast.success('Doğrulama kodu yeniden gönderildi!');

        // Start cooldown
        resendCooldown.value = 60;
        resendInterval = setInterval(() => {
          resendCooldown.value--;
          if (resendCooldown.value <= 0) {
            clearInterval(resendInterval);
            resendInterval = null;
          }
        }, 1000);
      } else {
        toast.error(response.message || 'Kod gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error(error.data?.message || 'Kod gönderilirken bir hata oluştu.');
    }
  };

  // Open verification modal with data
  const openVerificationModal = (userId, email) => {
    verificationUserId.value = userId;
    verificationEmail.value = email;
    verificationCode.value = '';
    verificationError.value = '';
    showVerificationModal.value = true;
  };

  // Set custom success handler
  const setCustomSuccessHandler = (handler) => {
    customSuccessHandler = handler;
  };

  // Cleanup function
  const cleanup = () => {
    if (resendInterval) {
      clearInterval(resendInterval);
      resendInterval = null;
    }
  };

  // Auto cleanup on unmount
  onUnmounted(cleanup);

  return {
    // Reactive refs
    showVerificationModal,
    verificationUserId,
    verificationEmail,
    verificationCode,
    verificationError,
    verifyingEmail,
    resendCooldown,

    // Methods
    verifyEmail,
    resendVerificationCode,
    openVerificationModal,
    setCustomSuccessHandler,
    cleanup,
  };
}
