<template>
  <div class="water-goal-form">
    <!-- Current Goal Display -->
    <div class="current-goal-display mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <span class="text-blue-600 text-lg">💧</span>
          </div>
          <div>
            <p class="text-sm text-blue-600 font-medium">
              Günlük Su Hedefi
            </p>
            <p class="text-2xl font-bold text-blue-800">
              {{ currentWaterGoal }} ml
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs text-blue-600">
            Önerilen Aralık
          </p>
          <p class="text-sm text-blue-700 font-medium">
            1500-4000 ml
          </p>
        </div>
      </div>
    </div>

    <!-- Goal Input Form -->
    <form
      @submit.prevent="handleUpdateGoal"
      class="space-y-4"
    >
      <div>
        <label
          for="waterGoal"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Yeni Günlük Su Hedefi (ml)
        </label>
        <div class="relative">
          <input
            id="waterGoal"
            v-model.number="currentGoal"
            type="number"
            min="500"
            max="15000"
            step="100"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Örn: 2500"
            :disabled="isLoading"
            required
          />
          <div
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
          >
            ml
          </div>
        </div>

        <!-- Help Text -->
        <p
          v-if="
            currentGoal !==
              authStore.user?.dailyWaterGoalML &&
            authStore.user?.dailyWaterGoalML
          "
          class="text-xs text-gray-500 mt-1"
        >
          Mevcut kayıtlı hedef:
          {{ authStore.user?.dailyWaterGoalML }} ml
        </p>
        <p
          v-else-if="!authStore.user?.dailyWaterGoalML"
          class="text-xs text-gray-500 mt-1"
        >
          Henüz bir hedef belirlemediniz. Varsayılan: 2500
          ml.
        </p>
      </div>

      <!-- Quick Presets -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="preset in waterPresets"
          :key="preset.value"
          type="button"
          @click="setPresetWater(preset.value)"
          class="px-3 py-2 text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-colors"
          :disabled="isLoading"
        >
          {{ preset.label }}
        </button>
      </div>

      <!-- Update Button -->
      <div class="flex items-center justify-between">
        <button
          type="submit"
          :disabled="
            isLoading ||
            currentGoal === authStore.user?.dailyWaterGoalML
          "
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// Reactive data
const currentGoal = ref(2500); // Default or initial value
const isLoading = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' or 'error'

// Current water goal
const currentWaterGoal = computed(() => {
  return authStore.user?.dailyWaterGoalML || 2500;
});

// Quick presets
const waterPresets = [
  { label: '1.5L', value: 1500 },
  { label: '2L', value: 2000 },
  { label: '2.5L', value: 2500 },
  { label: '3L', value: 3000 },
];

// Initialize currentGoal from store or default
onMounted(() => {
  if (
    authStore.user &&
    typeof authStore.user.dailyWaterGoalML === 'number'
  ) {
    currentGoal.value = authStore.user.dailyWaterGoalML;
  } else {
    currentGoal.value = 2500; // Default if not set
  }
});

// Watch for changes in store user's water goal (e.g., after login/initial load)
watch(
  () => authStore.user?.dailyWaterGoalML,
  newGoal => {
    if (typeof newGoal === 'number') {
      currentGoal.value = newGoal;
    } else if (!newGoal && authStore.user) {
      // If goal becomes undefined/null but user exists
      currentGoal.value = 2500; // Reset to default
    }
  }
);

// Set preset water
const setPresetWater = value => {
  currentGoal.value = value;
};

// Update water goal
const handleUpdateGoal = async () => {
  if (
    currentGoal.value === null ||
    currentGoal.value === undefined ||
    currentGoal.value < 500 ||
    currentGoal.value > 15000
  ) {
    message.value =
      'Lütfen 500 ile 15000 ml arasında geçerli bir değer girin.';
    messageType.value = 'error';
    return;
  }

  isLoading.value = true;
  message.value = '';
  messageType.value = '';

  try {
    await authStore.updateWaterGoal(currentGoal.value);
    message.value = 'Su hedefiniz başarıyla güncellendi!';
    messageType.value = 'success';
  } catch (error) {
    message.value =
      error.data?.message ||
      error.message ||
      'Su hedefi güncellenirken bir hata oluştu.';
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
.water-goal-form {
  max-width: 28rem;
}

.current-goal-display {
  background: linear-gradient(
    145deg,
    #eff6ff 0%,
    #dbeafe 100%
  );
  border: 1px solid #bfdbfe;
  border-radius: 0.75rem;
  padding: 1rem;
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
.water-goal-form button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.water-goal-form button:active:not(:disabled) {
  transform: translateY(0);
}
</style>
