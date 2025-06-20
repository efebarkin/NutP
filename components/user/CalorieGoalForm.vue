<template>
  <div class="calorie-goal-form">
    <form
      @submit.prevent="handleUpdateGoal"
      class="space-y-4"
    >
      <!-- Mevcut Kalori Hedefi Göstergesi -->
      <div
        class="bg-emerald-50 border border-emerald-200 rounded-lg p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"
            >
              <span class="text-emerald-600 text-lg"
                >🎯</span
              >
            </div>
            <div>
              <p
                class="text-sm text-emerald-600 font-medium"
              >
                Günlük Kalori Hedefi
              </p>
              <p
                class="text-2xl font-bold text-emerald-800"
              >
                {{ currentCalorieGoal }} kcal
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-emerald-600">
              Önerilen Aralık
            </p>
            <p class="text-sm text-emerald-700 font-medium">
              800-5000 kcal
            </p>
          </div>
        </div>
      </div>

      <!-- Kalori Hedefi Giriş Formu -->
      <div class="space-y-4">
        <div>
          <label
            for="calorieGoal"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Yeni Günlük Kalori Hedefi (kcal)
          </label>
          <div class="relative">
            <input
              id="calorieGoal"
              v-model.number="currentGoal"
              type="number"
              min="800"
              max="5000"
              step="50"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Örn: 2000"
              :disabled="isLoading"
              required
            />
            <div
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
            >
              kcal
            </div>
          </div>

          <!-- Yardım Metni -->
          <p
            v-if="
              currentGoal !==
                authStore.user?.dailyCalorieGoal &&
              authStore.user?.dailyCalorieGoal
            "
            class="text-xs text-gray-500 mt-1"
          >
            Mevcut kayıtlı hedef:
            {{ authStore.user?.dailyCalorieGoal }} kcal
          </p>
          <p
            v-else-if="!authStore.user?.dailyCalorieGoal"
            class="text-xs text-gray-500 mt-1"
          >
            Henüz bir hedef belirlemediniz. Varsayılan: 2000
            kcal.
          </p>
        </div>

        <!-- Hızlı Seçenekler -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            v-for="preset in caloriePresets"
            :key="preset.value"
            type="button"
            @click="setPresetCalorie(preset.value)"
            class="px-3 py-2 text-sm bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-lg transition-colors"
            :disabled="isLoading"
          >
            {{ preset.label }}
          </button>
        </div>

        <!-- Güncelleme Butonu -->
        <div class="flex items-center justify-between">
          <button
            type="submit"
            :disabled="
              isLoading ||
              currentGoal ===
                authStore.user?.dailyCalorieGoal
            "
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            <svg
              v-if="isLoading"
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
            {{
              isLoading
                ? 'Kaydediliyor...'
                : 'Hedefi Güncelle'
            }}
          </button>
          <p
            v-if="message"
            :class="
              messageType === 'success'
                ? 'text-green-600'
                : 'text-red-600'
            "
            class="text-sm"
          >
            {{ message }}
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// Reaktif veriler
const currentGoal = ref(2000); // Default or initial value
const isLoading = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' or 'error'

// Mevcut kalori hedefi
const currentCalorieGoal = computed(() => {
  return authStore.user?.dailyCalorieGoal || 2000;
});

// Hızlı seçenekler
const caloriePresets = [
  { label: '1200 kcal', value: 1200 },
  { label: '1500 kcal', value: 1500 },
  { label: '2000 kcal', value: 2000 },
  { label: '2500 kcal', value: 2500 },
];

// Initialize currentGoal from store or default
onMounted(() => {
  if (
    authStore.user &&
    typeof authStore.user.dailyCalorieGoal === 'number'
  ) {
    currentGoal.value = authStore.user.dailyCalorieGoal;
  } else {
    currentGoal.value = 2000; // Default if not set
  }
});

// Watch for changes in store user's calorie goal (e.g., after login/initial load)
watch(
  () => authStore.user?.dailyCalorieGoal,
  newGoal => {
    if (typeof newGoal === 'number') {
      currentGoal.value = newGoal;
    } else if (!newGoal && authStore.user) {
      // If goal becomes undefined/null but user exists
      currentGoal.value = 2000; // Reset to default
    }
  }
);

// Hızlı seçenek ayarlama
const setPresetCalorie = value => {
  currentGoal.value = value;
};

// Kalori hedefini güncelle
const handleUpdateGoal = async () => {
  if (
    currentGoal.value === null ||
    currentGoal.value === undefined ||
    currentGoal.value < 800 ||
    currentGoal.value > 5000
  ) {
    message.value =
      'Lütfen 800 ile 5000 kcal arasında geçerli bir değer girin.';
    messageType.value = 'error';
    return;
  }

  isLoading.value = true;
  message.value = '';
  messageType.value = '';

  try {
    await authStore.updateCalorieGoal(currentGoal.value);
    message.value =
      'Kalori hedefiniz başarıyla güncellendi!';
    messageType.value = 'success';
  } catch (error) {
    message.value =
      error.data?.message ||
      error.message ||
      'Kalori hedefi güncellenirken bir hata oluştu.';
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
    setTimeout(() => {
      message.value = '';
    }, 5000); // Clear message after 5 seconds
  }
};
</script>

<style scoped>
.calorie-goal-form {
  max-width: 28rem;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects */
.calorie-goal-form button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.calorie-goal-form button:active:not(:disabled) {
  transform: translateY(0);
}
</style>
