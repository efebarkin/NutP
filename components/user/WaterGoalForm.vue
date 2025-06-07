<template>
  <div>
    <h4 class="text-md font-semibold mb-3">Günlük Su Hedefi</h4>
    <form @submit.prevent="handleUpdateGoal">
      <div class="mb-4">
        <label for="waterGoal" class="block text-sm font-medium text-gray-700 mb-1">
          Günlük Su Hedefiniz (ml)
        </label>
        <input
          type="number"
          id="waterGoal"
          v-model.number="currentGoal"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          min="500"
          max="15000"
          step="100"
          required
        />
        <p v-if="currentGoal !== authStore.user?.dailyWaterGoalML && authStore.user?.dailyWaterGoalML" class="text-xs text-gray-500 mt-1">
          Mevcut kayıtlı hedef: {{ authStore.user?.dailyWaterGoalML }} ml
        </p>
         <p v-else-if="!authStore.user?.dailyWaterGoalML" class="text-xs text-gray-500 mt-1">
          Henüz bir hedef belirlemediniz. Varsayılan: 2500 ml.
        </p>
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          :disabled="isLoading || currentGoal === authStore.user?.dailyWaterGoalML"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <span v-if="isLoading">Kaydediliyor...</span>
          <span v-else>Hedefi Güncelle</span>
        </button>
        <p v-if="message" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'" class="text-sm">
          {{ message }}
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const currentGoal = ref(2500); // Default or initial value
const isLoading = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' or 'error'

// Initialize currentGoal from store or default
onMounted(() => {
  if (authStore.user && typeof authStore.user.dailyWaterGoalML === 'number') {
    currentGoal.value = authStore.user.dailyWaterGoalML;
  } else {
    currentGoal.value = 2500; // Default if not set
  }
});

// Watch for changes in store user's water goal (e.g., after login/initial load)
watch(() => authStore.user?.dailyWaterGoalML, (newGoal) => {
  if (typeof newGoal === 'number') {
    currentGoal.value = newGoal;
  } else if (!newGoal && authStore.user) { // If goal becomes undefined/null but user exists
    currentGoal.value = 2500; // Reset to default
  }
});

const handleUpdateGoal = async () => {
  if (currentGoal.value === null || currentGoal.value === undefined || currentGoal.value < 500 || currentGoal.value > 15000) {
    message.value = 'Lütfen 500 ile 15000 ml arasında geçerli bir değer girin.';
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
    message.value = error.data?.message || error.message || 'Su hedefi güncellenirken bir hata oluştu.';
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
    setTimeout(() => { message.value = ''; }, 5000); // Clear message after 5 seconds
  }
};
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
