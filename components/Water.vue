<template>
  <div
    class="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden relative"
  >
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute top-4 left-4 w-20 h-20 bg-blue-300 rounded-full animate-pulse"
      ></div>
      <div
        class="absolute bottom-6 right-6 w-16 h-16 bg-cyan-300 rounded-full animate-pulse delay-1000"
      ></div>
      <div
        class="absolute top-1/2 right-8 w-12 h-12 bg-blue-200 rounded-full animate-pulse delay-500"
      ></div>
    </div>

    <!-- Header -->
    <div
      class="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 p-6 text-white relative overflow-hidden"
    >
      <!-- Header Wave Pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg
          class="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z"
            fill="currentColor"
            class="animate-pulse"
          />
        </svg>
      </div>

      <div
        class="flex items-center justify-between relative z-10"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
          >
            <i class="fas fa-tint text-xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold">Su Takibi</h2>
            <p class="text-blue-100 text-sm">
              Günlük hedefin: {{ dailyGoalML }}ml
            </p>
          </div>
        </div>
        <button
          @click="fetchTodayWater"
          class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <i
            class="fas fa-sync-alt text-lg"
            :class="{ 'animate-spin': loading }"
          ></i>
        </button>
      </div>
      <p
        class="mt-3 opacity-90 text-blue-100 relative z-10"
      >
        {{ formatDate(selectedDate) }}
      </p>
    </div>

    <div class="p-6">
      <!-- Water Drop Progress Indicator -->
      <div class="flex justify-center mb-8">
        <div class="relative">
          <!-- Main Drop Container -->
          <div class="relative w-32 h-40">
            <!-- Drop Shape -->
            <div class="absolute inset-0 drop-shadow-2xl">
              <svg
                width="128"
                height="160"
                viewBox="0 0 128 160"
                class="w-full h-full"
              >
                <!-- Drop Outline -->
                <path
                  d="M64 10 C64 10, 20 50, 20 100 C20 135, 40 150, 64 150 C88 150, 108 135, 108 100 C108 50, 64 10, 64 10 Z"
                  fill="none"
                  stroke="#e5e7eb"
                  stroke-width="3"
                  class="transition-all duration-1000"
                />

                <!-- Water Fill -->
                <defs>
                  <clipPath id="dropClip">
                    <path
                      d="M64 10 C64 10, 20 50, 20 100 C20 135, 40 150, 64 150 C88 150, 108 135, 108 100 C108 50, 64 10, 64 10 Z"
                    />
                  </clipPath>
                  <linearGradient
                    id="waterGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style="
                        stop-color: #3b82f6;
                        stop-opacity: 0.8;
                      "
                    />
                    <stop
                      offset="50%"
                      style="
                        stop-color: #06b6d4;
                        stop-opacity: 0.9;
                      "
                    />
                    <stop
                      offset="100%"
                      style="
                        stop-color: #0891b2;
                        stop-opacity: 1;
                      "
                    />
                  </linearGradient>
                </defs>

                <!-- Animated Water Fill -->
                <rect
                  x="20"
                  :y="150 - waterFillHeight * 1.4"
                  width="88"
                  :height="waterFillHeight * 1.4"
                  fill="url(#waterGradient)"
                  clip-path="url(#dropClip)"
                  class="transition-all duration-1000 ease-out"
                />

                <!-- Water Surface Animation -->
                <path
                  :d="`M20 ${
                    150 - waterFillHeight * 1.4
                  } Q44 ${
                    150 - waterFillHeight * 1.4 - 2
                  } 64 ${
                    150 - waterFillHeight * 1.4
                  } T108 ${150 - waterFillHeight * 1.4}`"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2"
                  opacity="0.6"
                  clip-path="url(#dropClip)"
                  class="animate-pulse"
                />
              </svg>
            </div>

            <!-- Progress Text -->
            <div
              class="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div
                class="text-2xl font-bold text-white drop-shadow-lg mt-4"
              >
                {{ progressPercentage }}%
              </div>
              <div
                class="text-sm text-white/90 drop-shadow"
              >
                {{ totalWaterInML }}ml
              </div>
            </div>

            <!-- Sparkle Effects -->
            <div
              v-if="progressPercentage > 75"
              class="absolute inset-0 pointer-events-none"
            >
              <div
                class="absolute top-6 left-8 w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-300"
              ></div>
              <div
                class="absolute top-12 right-6 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-ping delay-700"
              ></div>
              <div
                class="absolute bottom-16 left-6 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-1000"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Goal Status -->
      <div class="text-center mb-6">
        <div
          class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          :class="
            isGoalReached
              ? 'bg-green-100 text-green-700 border border-green-300 shadow-lg transform scale-105'
              : 'bg-blue-100 text-blue-700 border border-blue-300'
          "
        >
          <i
            class="mr-2 text-lg"
            :class="
              isGoalReached
                ? 'fas fa-check-circle'
                : 'fas fa-tint'
            "
          ></i>
          {{ goalStatusText }}
        </div>
      </div>

      <!-- Quick Add Buttons -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <button
          v-for="option in quickAddOptions"
          :key="option.value"
          @click="addWater(option.value, option.unit)"
          :disabled="loading"
          class="group relative bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 hover:border-blue-300 rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform"
        >
          <div class="flex flex-col items-center space-y-2">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300"
            >
              <i :class="option.icon" class="text-lg"></i>
            </div>
            <span
              class="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors duration-300"
            >
              {{ option.value }}{{ option.unit }}
            </span>
          </div>

          <!-- Hover Effect -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </button>
      </div>

      <!-- Custom Amount Input -->
      <div
        class="mb-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200"
      >
        <label
          class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
        >
          <i
            class="fas fa-plus-circle text-blue-500 mr-2"
          ></i>
          Özel Miktar Ekle
        </label>
        <div class="flex space-x-3">
          <input
            v-model="customAmount"
            type="number"
            min="1"
            max="10000"
            placeholder="250"
            class="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm font-medium"
          />
          <select
            v-model="customUnit"
            class="p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm font-medium"
          >
            <option value="ml">ml</option>
            <option value="L">L</option>
            <option value="bardak">bardak</option>
          </select>
          <button
            @click="addCustomWater()"
            :disabled="
              !customAmount || customAmount <= 0 || loading
            "
            class="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <i
              v-if="loading"
              class="fas fa-spinner fa-spin"
            ></i>
            <i v-else class="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <!-- Today's Entries -->
      <div class="space-y-4">
        <h4
          class="text-lg font-bold text-gray-800 flex items-center"
        >
          <i class="fas fa-history text-blue-500 mr-3"></i>
          Bugünkü Kayıtlar
          <span
            class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
          >
            {{ waterEntries.length }}
          </span>
        </h4>

        <div v-if="loading" class="text-center py-8">
          <div
            class="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
          ></div>
          <p class="text-gray-500 mt-2">Yükleniyor...</p>
        </div>

        <div
          v-else-if="!waterEntries.length"
          class="text-center py-8"
        >
          <div
            class="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i
              class="fas fa-tint text-3xl text-blue-400"
            ></i>
          </div>
          <p class="text-gray-500 font-medium">
            Henüz su kaydı yok
          </p>
          <p class="text-gray-400 text-sm mt-1">
            İlk su kaydınızı ekleyin!
          </p>
        </div>

        <div
          v-else
          class="max-h-64 overflow-y-auto space-y-3 custom-scrollbar"
        >
          <div
            v-for="(entry, index) in waterEntries"
            :key="entry._id"
            class="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all duration-300 hover:shadow-md border border-gray-200 hover:border-blue-300 animate-fade-in-up"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300"
              >
                <i class="fas fa-tint text-sm"></i>
              </div>
              <div>
                <p
                  class="font-semibold text-gray-800 text-sm"
                >
                  {{ entry.amount?.value || 0
                  }}{{ entry.amount?.unit || 'ml' }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatTime(entry.consumedAt) }}
                </p>
              </div>
            </div>
            <button
              @click="deleteEntry(entry._id)"
              class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg transition-all duration-300 flex items-center justify-center opacity-60 group-hover:opacity-100 hover:scale-110"
              title="Su kaydını sil"
            >
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Summary Stats -->
      <div
        v-if="waterEntries.length"
        class="mt-6 pt-6 border-t border-gray-200"
      >
        <div class="grid grid-cols-3 gap-4">
          <div
            class="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
          >
            <div class="text-xl font-bold text-blue-600">
              {{ totalWaterInLiters }}L
            </div>
            <div class="text-xs text-blue-500 font-medium">
              Toplam
            </div>
          </div>
          <div
            class="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl"
          >
            <div class="text-xl font-bold text-green-600">
              {{ Math.round(totalWaterInML / 200) }}
            </div>
            <div class="text-xs text-green-500 font-medium">
              Bardak
            </div>
          </div>
          <div
            class="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl"
          >
            <div class="text-xl font-bold text-purple-600">
              {{ waterEntries.length }}
            </div>
            <div
              class="text-xs text-purple-500 font-medium"
            >
              Kayıt
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import {
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
} from 'vue';
import { useAuthStore } from '~/stores/auth'; // Single import
import { useToast } from 'vue-toastification';

// Store and composables
const authStore = useAuthStore(); // Instantiated once
const toast = useToast();

// Reactive Data
const loading = ref(false);
const goalReachedNotifShown = ref(false);
const waterEntries = ref([]);
const selectedDate = ref(
  new Date().toISOString().split('T')[0]
); // Initialize with today

// DEĞİŞİKLİK 1: customAmount başlangıç değeri null yapıldı.
const customAmount = ref(null);
const customUnit = ref('ml');

// Constants
const circumference = 2 * Math.PI * 40; // For circular progress, if used

// ADD COMPUTED PROPERTY FOR DAILY GOAL
const dailyGoalML = computed(() => {
  // Provide a default if user or specific goal is not set
  const goal = authStore.user?.dailyWaterGoalML || 2500;
  console.log('[Water.vue] dailyGoalML computed:', goal);
  return goal;
});

// Quick add options
const quickAddOptions = [
  { value: 200, unit: 'ml', icon: 'fas fa-glass-water' },
  { value: 250, unit: 'ml', icon: 'fas fa-glass-water' },
  { value: 500, unit: 'ml', icon: 'fas fa-bottle-water' },
];

// Computed Properties
const totalWaterInML = computed(() => {
  return waterEntries.value.reduce((total, entry) => {
    // API'den gelen veri yapısına göre hesaplama
    let amountInML = 0;

    if (entry.amountInML) {
      // Eğer amountInML direkt varsa
      amountInML = entry.amountInML;
    } else if (entry.amount) {
      // amount object'i varsa
      const { value, unit } = entry.amount;
      switch (unit?.toLowerCase()) {
        case 'l':
          amountInML = value * 1000;
          break;
        case 'bardak':
          amountInML = value * 200; // 1 bardak = 200ml
          break;
        case 'ml':
        default:
          amountInML = value;
          break;
      }
    }

    return total + amountInML;
  }, 0);
});

const totalWaterInLiters = computed(() => {
  return (
    Math.round((totalWaterInML.value / 1000) * 100) / 100
  );
});

// Computed property for displaying the progress percentage as text
const progressPercentage = computed(() => {
  if (!dailyGoalML.value || dailyGoalML.value === 0) {
    // console.log('[Water.vue] progressPercentage computed: dailyGoalML is zero or undefined, returning 0');
    return 0;
  }
  const progress = Math.min(
    Math.round(
      (totalWaterInML.value / dailyGoalML.value) * 100
    ),
    100
  );
  // console.log('[Water.vue] progressPercentage (for text) computed:', progress);
  return progress;
});

const strokeDashoffset = computed(() => {
  const progress = progressPercentage.value / 100;
  return circumference * (1 - progress);
});

const isGoalReached = computed(() => {
  if (!dailyGoalML.value || dailyGoalML.value === 0) {
    // console.log('[Water.vue] isGoalReached: dailyGoalML is 0 or undefined, returning false');
    return false;
  }
  // console.log('[Water.vue] isGoalReached: total', totalWaterInML.value, 'goal', dailyGoalML.value, 'result:', totalWaterInML.value >= dailyGoalML.value);
  return totalWaterInML.value >= dailyGoalML.value;
});

const goalStatusText = computed(() => {
  // Case 1: Goal is reached
  if (isGoalReached.value) {
    return '🎉 Hedef Tamamlandı!';
  }

  // Case 2: Goal is not reached.
  const goal = dailyGoalML.value;
  const current = totalWaterInML.value;

  // Subcase 2a: Goal is not valid (e.g. 0, undefined, NaN) or not yet loaded.
  // dailyGoalML defaults to 2500, so this primarily covers explicit invalid states or initial loading if default isn't immediate.
  if (
    typeof goal !== 'number' ||
    isNaN(goal) ||
    goal <= 0
  ) {
    return 'Günlük hedef belirlenmemiş veya geçersiz.';
  }

  // Subcase 2b: Goal is valid, but not met (current < goal).
  // Ensure 'current' is a valid number.
  if (typeof current !== 'number' || isNaN(current)) {
    return 'Su miktarı hesaplanıyor...';
  }

  const remainingML = goal - current;
  const remainingL = Math.round(remainingML / 100) / 10;

  if (isNaN(remainingL) || remainingL <= 0) {
    // remainingL should be > 0 if goal is not met
    return `Hedefe ... L kaldı`; // Fallback for unexpected calculation issues
  }

  return `Hedefe ${remainingL}L kaldı`;
});

// Water drop fill height for animation
const waterFillHeight = computed(() => {
  const maxHeight = 140; // Max height of the water drop
  const fill = (progressPercentage.value / 100) * maxHeight;
  console.log(
    '[Water.vue] Original waterFillHeight (using maxHeight) computed:',
    fill,
    'progressPercentage:',
    progressPercentage.value
  );
  return fill;
});

// Methods
const fetchTodayWater = async (options = {}) => {
  try {
    loading.value = true;
    if (!options.preserveGoalNotifStatus) {
      goalReachedNotifShown.value = false; // Reset for the new day/fetch unless preserving
    }

    const response = await $fetch('/api/water/daily', {
      method: 'GET',
      query: { date: selectedDate.value },
      credentials: 'include',
      headers: {
        'X-CSRF-Token': authStore.csrfToken,
      },
    });

    // API'den gelen veriyi kontrol et ve ata
    waterEntries.value = Array.isArray(response.entries)
      ? response.entries
      : [];

    console.log(
      'Fetched water entries:',
      waterEntries.value
    ); // Debug için
  } catch (error) {
    console.error('Error fetching water entries:', error);

    // Hata durumunda boş array ata
    waterEntries.value = [];

    // Kullanıcıya hata göster
    if (error.statusCode !== 401) {
      // Auth hatası değilse göster
      toast.error('Su kayıtları getirilirken hata oluştu');
    }
  } finally {
    loading.value = false;
  }
};

const addCustomWater = async () => {
  const currentCustomAmount = customAmount.value;
  const currentCustomUnit = customUnit.value;

  if (
    currentCustomAmount === null ||
    currentCustomAmount === undefined ||
    isNaN(parseFloat(currentCustomAmount))
  ) {
    toast.error('Lütfen geçerli bir miktar girin.');
    return;
  }

  const numericAmount = Number(currentCustomAmount);

  if (numericAmount <= 0) {
    toast.error("Miktar 0'dan büyük olmalıdır.");
    return;
  }

  // 10 Litre = 10000 ml. 1 bardak = 200ml (varsayım)
  const maxML = 10000;
  const bardakInML = 200;

  if (currentCustomUnit === 'L') {
    if (numericAmount > 10) {
      toast.error('Maksimum 10 litre ekleyebilirsiniz.');
      return;
    }
  } else if (currentCustomUnit === 'ml') {
    if (numericAmount > maxML) {
      toast.error(
        `Maksimum ${maxML} ml (10 litre) ekleyebilirsiniz.`
      );
      return;
    }
  } else if (currentCustomUnit === 'bardak') {
    if (numericAmount * bardakInML > maxML) {
      const maxBardak = maxML / bardakInML;
      toast.error(
        `Maksimum ${maxBardak} bardak (${
          (maxBardak * bardakInML) / 1000
        } litre) ekleyebilirsiniz.`
      );
      return;
    }
  }

  // addWater'a istek gönder
  await addWater(numericAmount, currentCustomUnit);

  // DEĞİŞİKLİK 3: Form sıfırlama mantığı buraya taşındı.
  // İşlem başarılı olursa (hata yakalanmazsa) formu temizle
  customAmount.value = null;
  customUnit.value = 'ml';
};

const addWater = async (amount, unit) => {
  if (!amount || amount <= 0) {
    toast.warning('Lütfen geçerli bir miktar girin');
    return;
  }

  try {
    loading.value = true;

    console.log(
      '[Water.vue] addWater - Attempting to add. CSRF Token:',
      authStore.csrfToken
    );
    if (!authStore.csrfToken) {
      toast.error(
        'CSRF token bulunamadı. Lütfen sayfayı yenileyin veya tekrar giriş yapın.'
      );
      loading.value = false;
      return;
    }

    const response = await $fetch('/api/water', {
      method: 'POST',
      body: {
        amount: {
          value: Number(amount),
          unit: unit,
        },
        consumedAt: new Date().toISOString(),
      },
      credentials: 'include',
      headers: {
        'X-CSRF-Token': authStore.csrfToken,
      },
    });

    // DEĞİŞİKLİK 2: Buradaki karmaşık sıfırlama mantığı kaldırıldı.

    // Emoji'li başarı mesajı
    const unitDisplay =
      unit === 'bardak' ? ' bardak' : unit;
    toast.success(`${amount}${unitDisplay} su eklendi! 💧`);

    // Verileri yenile ve otomatik hesaplama çalışsın
    await fetchTodayWater({
      preserveGoalNotifStatus: true,
    });

    // Hedef tamamlandıysa özel mesaj
    if (
      totalWaterInML.value >= dailyGoalML.value &&
      !goalReachedNotifShown.value
    ) {
      goalReachedNotifShown.value = true;
      setTimeout(() => {
        toast.success(
          '🎉 Tebrikler! Günlük su hedefinizi tamamladınız!',
          {
            timeout: 5000,
          }
        );
      }, 1000);
    }
  } catch (error) {
    console.error('Error adding water:', error);
    toast.error('Su eklenirken hata oluştu');
  } finally {
    loading.value = false;
  }
};

const deleteEntry = async entryId => {
  if (!entryId) return;

  // // Silme işlemi için onay iste
  // const confirmed = confirm(
  //   'Bu su kaydını silmek istediğinizden emin misiniz?'
  // );
  // if (!confirmed) return;

  try {
    loading.value = true;

    console.log(
      '[Water.vue] deleteEntry - Attempting to delete. CSRF Token:',
      authStore.csrfToken
    );
    if (!authStore.csrfToken) {
      toast.error(
        'CSRF token bulunamadı. Lütfen sayfayı yenileyin veya tekrar giriş yapın.'
      );
      loading.value = false;
      return;
    }

    await $fetch(`/api/water/${entryId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': authStore.csrfToken,
      },
    });

    toast.success('Su kaydı başarıyla silindi! 💧');

    // Verileri yenile
    await fetchTodayWater();
  } catch (error) {
    console.error('Error deleting water entry:', error);
    toast.error('Su kaydı silinirken hata oluştu');
  } finally {
    loading.value = false;
  }
};

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = dateString => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Lifecycle
onMounted(async () => {
  if (!authStore.isInitialized) {
    // Wait for the store to be initialized
    await new Promise(resolve => {
      const unwatch = watch(
        () => authStore.isInitialized,
        initialized => {
          if (initialized) {
            unwatch();
            resolve();
          }
        }
      );
    });
  }
  fetchTodayWater();
});

// Watch for date changes
watch(selectedDate, () => {
  fetchTodayWater(); // This call should reset the flag (default options)
});

// Watch for water entries changes to trigger animations
watch(
  waterEntries,
  (newEntries, oldEntries) => {
    // Yeni kayıt eklendiğinde animasyonu tetikle
    if (newEntries.length > oldEntries.length) {
      // Damla animasyonu için kısa bir gecikme
      nextTick(() => {
        // Progress değişikliğini tetikle
        console.log(
          `Progress updated: ${progressPercentage.value}%`
        );
      });
    }
  },
  { deep: true }
);
</script>
  
  <style scoped>
/* Hover effects */
.transform {
  transition: transform 0.3s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Custom scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation for new entries */
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
  