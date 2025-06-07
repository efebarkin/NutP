<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full"
  >
    <!-- Modern Gradient Header -->
    <div
      class="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 px-6 py-6 relative overflow-hidden"
    >
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg
          class="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
        >
          <defs>
            <pattern
              id="water-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="10"
                cy="10"
                r="2"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="100"
            height="100"
            fill="url(#water-pattern)"
          />
        </svg>
      </div>

      <div
        class="flex items-center justify-between relative z-10"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
          >
            <span class="text-2xl">💧</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white mb-1">
              Su Tüketim Takvimi
            </h2>
            <p class="text-blue-100 text-sm">
              Günlük hidrasyon takibiniz
            </p>
          </div>
        </div>

        <!-- Quick Stats in Header -->
        <div
          v-if="adjustedSummary"
          class="hidden md:flex items-center space-x-6 text-white/90"
        >
          <div class="text-center">
            <div class="text-lg font-bold">
              {{ adjustedSummary.daysWithEntries }}
            </div>
            <div class="text-xs text-blue-100">
              Aktif Gün
            </div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold">
              {{ adjustedSummary.goalCompletionRate }}%
            </div>
            <div class="text-xs text-blue-100">Başarı</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Width Calendar Body -->
    <div class="p-6 w-full">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex items-center justify-center py-8"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <span class="ml-3 text-gray-600"
          >Veriler yükleniyor...</span
        >
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-500 mb-2">
          <i
            class="fas fa-exclamation-triangle text-2xl"
          ></i>
        </div>
        <p class="text-red-600 text-sm">{{ error }}</p>
        <button
          @click="fetchCalendarData"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>

      <!-- V-Calendar with Custom Template -->
      <div v-else class="relative">
        <!-- Month Loading Spinner Overlay -->
        <div
          v-if="monthLoading"
          class="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl"
        >
          <div class="flex flex-col items-center space-y-4">
            <div class="relative">
              <div
                class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500/20 border-t-blue-500"
              ></div>
              <div
                class="absolute inset-0 flex items-center justify-center"
              >
                <div
                  class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                ></div>
              </div>
            </div>
            <span class="text-gray-700 text-sm font-medium"
              >Ay verileri yükleniyor...</span
            >
          </div>
        </div>

        <v-calendar
          v-model="selectedDate"
          :from-date="fromDate"
          :to-date="toDate"
          is-expanded
          borderless
          transparent
          :trim-weeks="true"
          :attributes="calendarAttributes"
          class="modern-water-calendar w-full"
          style="
            width: 100% !important;
            max-width: 100% !important;
          "
          @update:from-page="handlePageUpdate"
          @did-move="handleCalendarMove"
        >
          <!-- Custom Day Cell Template -->
          <template #day-content="{ day }">
            <div
              class="water-day-container"
              :class="{
                'is-today': day.isToday,
                'is-weekend': day.isWeekend,
                'is-future': isFutureDate(day.date),
                'has-water-data': getDayDataByDate(
                  day.date
                ),
              }"
              @click="selectDay(day)"
            >
              <!-- Today Badge -->
              <div v-if="day.isToday" class="today-badge">
                <div class="today-pulse"></div>
                <span class="today-text">Bugün</span>
              </div>

              <!-- Day Number -->
              <div class="day-number">
                {{ day.day }}
              </div>

              <!-- Water Information - Only show if data exists and water amount > 0 -->
              <div
                v-if="getDayDataByDate(day.date)"
                class="water-info"
              >
                <div
                  class="water-badge"
                  v-if="
                    getDayDataByDate(day.date) &&
                    getDayDataByDate(day.date)
                      .totalWaterInML > 0
                  "
                >
                  💧
                  {{
                    formatWaterAmountShort(
                      getDayDataByDate(day.date)
                        .totalWaterInML
                    )
                  }}
                  Su Tüketildi
                </div>
              </div>

              <!-- No Water Data - Show minimal empty state -->
              <div
                v-else-if="day.isToday"
                class="no-water-info"
              >
                <div class="empty-state">
                  <span class="text-gray-400 text-xs"
                    >Henüz kayıt yok</span
                  >
                </div>
              </div>
            </div>
          </template>
        </v-calendar>
      </div>

      <!-- Enhanced Stats Summary -->
      <div
        v-if="adjustedSummary"
        class="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">📊</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ adjustedSummary.daysWithEntries }}
            </div>
            <div class="stat-label">Kayıt Olan Gün</div>
          </div>
        </div>
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">🎯</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ adjustedSummary.daysGoalReached }}
            </div>
            <div class="stat-label">Hedef Ulaşılan</div>
          </div>
        </div>
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">💧</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{
                adjustedSummary.averageDailyWaterInLiters
              }}L
            </div>
            <div class="stat-label">Günlük Ortalama</div>
          </div>
        </div>
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">📈</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ adjustedSummary.goalCompletionRate }}%
            </div>
            <div class="stat-label">Başarı Oranı</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day Details Modal -->
    <transition name="modal">
      <div
        v-if="selectedDayDetails"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeDayDetails"
      >
        <div
          class="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto"
          @click.stop
        >
          <div
            class="flex items-center justify-between mb-4"
          >
            <h3 class="text-xl font-bold text-gray-800">
              {{ formatSelectedDate() }}
            </h3>
            <button
              @click="closeDayDetails"
              class="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            >
              <i class="fas fa-times text-gray-600"></i>
            </button>
          </div>

          <div v-if="selectedDayDetails" class="space-y-4">
            <!-- Progress Circle -->
            <div class="text-center">
              <div class="relative inline-block">
                <svg
                  class="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    class="stroke-current text-gray-200"
                    stroke-width="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    class="stroke-current"
                    :class="
                      getProgressColor(
                        selectedDayDetails.progressPercentage
                      )
                    "
                    stroke-width="3"
                    stroke-linecap="round"
                    fill="none"
                    :stroke-dasharray="`${selectedDayDetails.progressPercentage}, 100`"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <span class="text-sm font-bold"
                    >{{
                      selectedDayDetails.progressPercentage
                    }}%</span
                  >
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4">
              <div
                class="text-center p-3 bg-blue-50 rounded-lg"
              >
                <div
                  class="text-lg font-bold text-blue-600"
                >
                  {{
                    selectedDayDetails.totalWaterInLiters
                  }}L
                </div>
                <div class="text-xs text-blue-600">
                  Toplam Su
                </div>
              </div>
              <div
                class="text-center p-3 bg-green-50 rounded-lg"
              >
                <div
                  class="text-lg font-bold text-green-600"
                >
                  {{ selectedDayDetails.entryCount }}
                </div>
                <div class="text-xs text-green-600">
                  Kayıt Sayısı
                </div>
              </div>
            </div>

            <!-- Goal Status -->
            <div
              class="p-3 rounded-lg text-center"
              :class="
                selectedDayDetails.isGoalReached
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              "
            >
              <i
                :class="
                  selectedDayDetails.isGoalReached
                    ? 'fas fa-check-circle'
                    : 'fas fa-target'
                "
                class="mr-2"
              ></i>
              {{
                selectedDayDetails.isGoalReached
                  ? 'Günlük hedef başarıyla tamamlandı!'
                  : 'Günlük hedefe ulaşılamadı'
              }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

// Reactive data
const selectedDate = ref(new Date());
const calendarData = ref(null);
const loading = ref(false);
const monthLoading = ref(false); // Separate loading state for month navigation
const error = ref(null);
const selectedDayDetails = ref(null);

// Calendar date range
const fromDate = computed(() => {
  const date = new Date(selectedDate.value);
  date.setMonth(date.getMonth() - 1);
  return date;
});

const toDate = computed(() => {
  const date = new Date(selectedDate.value);
  date.setMonth(date.getMonth() + 1);
  return date;
});

// Computed properties for better calculations
const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const currentMonth = computed(() => {
  return selectedDate.value.getMonth();
});

const currentYear = computed(() => {
  return selectedDate.value.getFullYear();
});

const isCurrentMonth = computed(() => {
  const now = new Date();
  return (
    currentMonth.value === now.getMonth() &&
    currentYear.value === now.getFullYear()
  );
});

// Helper function to check if a date is in the future
const isFutureDate = date => {
  const today = new Date();
  const checkDate = new Date(date);
  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate > today;
};

// Calculate success rate only up to current date
const adjustedSummary = computed(() => {
  if (!calendarData.value?.summary) return null;

  const summary = { ...calendarData.value.summary };

  if (isCurrentMonth.value) {
    // For current month, only count days up to today
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Calculate total days from start of month to today
    const totalDaysUntilToday = currentDay;

    // Filter daily summaries to only include days up to today
    const validDays =
      calendarData.value.dailySummaries.filter(day => {
        const [year, month, dayNum] = day.date
          .split('-')
          .map(Number);
        const dayDate = new Date(year, month - 1, dayNum);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Include today
        return dayDate <= today;
      });

    // Recalculate stats based on valid days only
    const daysWithEntries = validDays.filter(
      day => day.entryCount > 0
    ).length;
    const daysGoalReached = validDays.filter(
      day => day.isGoalReached
    ).length;

    // Success rate should be based on total days until today, not just days with entries
    const goalCompletionRate =
      totalDaysUntilToday > 0
        ? Math.round(
            (daysGoalReached / totalDaysUntilToday) * 100
          )
        : 0;

    // Calculate average water consumption for days with entries
    const totalWater = validDays.reduce(
      (sum, day) => sum + day.totalWaterInML,
      0
    );
    const averageDailyWaterInLiters =
      daysWithEntries > 0
        ? (totalWater / daysWithEntries / 1000).toFixed(1)
        : '0.0';

    summary.daysWithEntries = daysWithEntries;
    summary.daysGoalReached = daysGoalReached;
    summary.goalCompletionRate = goalCompletionRate;
    summary.averageDailyWaterInLiters =
      averageDailyWaterInLiters;
  }

  return summary;
});

// Calendar attributes for v-calendar
const calendarAttributes = computed(() => {
  if (!calendarData.value?.dailySummaries) return [];

  const attributes = calendarData.value.dailySummaries
    .filter(day => day.entryCount > 0)
    .map(day => {
      // Parse date string and create date object
      const [year, month, dayNum] = day.date
        .split('-')
        .map(Number);
      const attributeDate = new Date(
        year,
        month - 1,
        dayNum
      );

      return {
        key: day.date,
        dates: attributeDate,
        highlight: {
          color: day.isGoalReached
            ? 'green'
            : day.progressPercentage >= 50
            ? 'yellow'
            : 'blue',
          fillMode: 'light',
        },
        popover: {
          label: `${day.totalWaterInLiters}L su tüketildi`,
          visibility: 'hover',
        },
      };
    });

  // Add today attribute for current day highlighting
  const todayDate = new Date();
  attributes.push({
    key: 'today',
    dates: todayDate,
    highlight: {
      color: 'purple',
      fillMode: 'outline',
      class: 'today-highlight',
    },
    content: {
      class: 'today-content',
    },
  });

  return attributes;
});

// Methods for calendar day handling
const getDayDataByDate = date => {
  if (!calendarData.value?.dailySummaries) return null;

  // Simple date to string conversion - v-calendar already gives us the correct local date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0'
  );
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const found = calendarData.value.dailySummaries.find(
    summary => summary.date === dateStr
  );

  console.log(
    `Looking for date: ${dateStr}, found:`,
    found ? 'YES' : 'NO'
  );
  return found;
};

const formatWaterAmountShort = amountInML => {
  if (!amountInML || amountInML === 0) return '';

  if (amountInML >= 1000) {
    return `${(amountInML / 1000).toFixed(1)}L`;
  }
  return `${amountInML}ml`;
};

const selectDay = day => {
  const dayData = getDayDataByDate(day.date);
  if (dayData) {
    selectedDayDetails.value = {
      ...dayData,
      day: day.day,
      date: day.date,
    };
  }
};

const fetchCalendarData = async (isMonthChange = false) => {
  console.log(
    '🔍 fetchCalendarData called. Current selectedDate:',
    selectedDate.value?.toISOString()
  );
  console.log(
    '🔍 fetchCalendarData - Year:',
    selectedDate.value?.getFullYear(),
    'Month:',
    selectedDate.value?.getMonth() + 1,
    'IsMonthChange:',
    isMonthChange
  );

  if (loading.value || monthLoading.value) {
    console.log('Fetch already in progress, skipping.');
    return;
  }

  if (!authStore.user) {
    error.value = 'Lütfen giriş yapın';
    console.log('fetchCalendarData: No user, returning.');
    return;
  }

  // Use monthLoading for month changes, loading for initial load
  if (isMonthChange) {
    monthLoading.value = true;
  } else {
    loading.value = true;
  }
  error.value = null;

  try {
    const year = selectedDate.value.getFullYear();
    const month = selectedDate.value.getMonth();

    // Get first and last day of the month - manual formatting to avoid timezone issues
    const startDay = 1;
    const lastDay = new Date(year, month + 1, 0).getDate(); // Get last day of month

    const startDate = `${year}-${String(month + 1).padStart(
      2,
      '0'
    )}-${String(startDay).padStart(2, '0')}`;
    const endDate = `${year}-${String(month + 1).padStart(
      2,
      '0'
    )}-${String(lastDay).padStart(2, '0')}`;

    console.log(
      `🔍 Fetching data for period: ${startDate} to ${endDate}`
    );

    const response = await $fetch('/api/water/range', {
      credentials: 'include',
      query: {
        startDate,
        endDate,
      },
    });

    console.log('🔍 Calendar data response:', response);
    calendarData.value = response;
  } catch (err) {
    console.error('❌ Calendar data fetch error:', err);
    error.value =
      err.statusMessage ||
      'Takvim verileri yüklenirken bir hata oluştu';
    toast.error(error.value);
  } finally {
    loading.value = false;
    monthLoading.value = false;
  }
};

const getProgressColor = percentage => {
  if (percentage >= 80) return 'text-green-500';
  if (percentage >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

const closeDayDetails = () => {
  selectedDayDetails.value = null;
};

const formatSelectedDate = () => {
  if (!selectedDayDetails.value) return '';

  return selectedDayDetails.value.date.toLocaleDateString(
    'tr-TR',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );
};

// Watch for date changes to fetch data for the new month/year
watch(selectedDate, (newDate, oldDate) => {
  // newDate is the new value of selectedDate.value
  // oldDate is the old value of selectedDate.value

  // Guard against initial undefined oldDate: initial fetch is handled by onMounted.
  if (!oldDate && newDate) {
    console.log(
      'Watcher: selectedDate initialized or oldDate was undefined. Initial fetch should be handled by onMounted. New date:',
      newDate?.toISOString()
    );
    return; // onMounted handles the very first fetch.
  }

  if (newDate && oldDate) {
    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth();
    const oldYear = oldDate.getFullYear();
    const oldMonth = oldDate.getMonth();

    if (newYear !== oldYear || newMonth !== oldMonth) {
      console.log(
        `Watcher: Month/Year changed. New: ${
          newMonth + 1
        }/${newYear}, Old: ${
          oldMonth + 1
        }/${oldYear}. Triggering fetch.`
      );
      fetchCalendarData(true);
    } else {
      console.log(
        `Watcher: Date changed within the same month/year. New: ${newDate.toLocaleDateString()}. No fetch needed from watcher.`
      );
    }
  } else if (newDate && !oldDate) {
    // This case should ideally be covered by the first !oldDate check.
    // This is a fallback log if selectedDate is set and oldDate is missing post-initialization.
    console.log(
      'Watcher: newDate is present but oldDate is missing (post-initialization). New date:',
      newDate?.toISOString()
    );
    // Avoid fetching here if onMounted is the source of truth for initial load.
  }
});

// Handler for v-calendar's page update (month/year navigation)
const handlePageUpdate = page => {
  // page is { month: 1-indexed, year: YYYY }
  console.log(
    '🔄 handlePageUpdate called with page:',
    page
  );

  // Handle array case if needed
  let actualPage = page;
  if (Array.isArray(page)) {
    actualPage = page[0];
    console.log(
      '🔄 Page is array, using first element:',
      actualPage
    );
  }

  // Validate page object
  if (
    !actualPage ||
    typeof actualPage.year !== 'number' ||
    typeof actualPage.month !== 'number'
  ) {
    console.error('🔄 Invalid page object:', actualPage);
    return;
  }

  const newMonthFirstDay = new Date(
    actualPage.year,
    actualPage.month - 1,
    1
  ); // JS months are 0-indexed

  // Check if selectedDate already reflects the new page's month/year.
  // This avoids redundant updates if selectedDate was already changed (e.g., by clicking a day in the new month).
  if (
    selectedDate.value.getFullYear() !==
      newMonthFirstDay.getFullYear() ||
    selectedDate.value.getMonth() !==
      newMonthFirstDay.getMonth()
  ) {
    console.log(
      `🔄 handlePageUpdate: Navigated to a new month/year. Updating selectedDate from ${selectedDate.value?.toISOString()} to ${newMonthFirstDay.toISOString()}.`
    );
    selectedDate.value = newMonthFirstDay; // This assignment should trigger the watcher.
  } else {
    console.log(
      `🔄 handlePageUpdate: Navigated to month/year where selectedDate (${selectedDate.value?.toISOString()}) already resides. No change to selectedDate.`
    );
  }
};

// Alternative handler for v-calendar's did-move event
const handleCalendarMove = page => {
  console.log(
    '🚀 handleCalendarMove called with page:',
    page
  );

  // v-calendar sometimes passes an array of pages, get the first one
  let actualPage = page;
  if (Array.isArray(page)) {
    actualPage = page[0];
    console.log(
      '🚀 Page is array, using first element:',
      actualPage
    );
  }

  // Validate that we have the required properties
  if (
    !actualPage ||
    typeof actualPage.year !== 'number' ||
    typeof actualPage.month !== 'number'
  ) {
    console.error('🚀 Invalid page object:', actualPage);
    return;
  }

  // Force update regardless of current selectedDate to ensure data fetching
  const newMonthFirstDay = new Date(
    actualPage.year,
    actualPage.month - 1,
    1
  );
  console.log(
    `🚀 Force updating selectedDate to: ${newMonthFirstDay.toISOString()}`
  );

  selectedDate.value = newMonthFirstDay;

  // Also trigger fetch directly as a backup
  console.log(
    '🚀 Triggering fetchCalendarData directly from handleCalendarMove'
  );
  fetchCalendarData(true);
};

// Initial data fetch
onMounted(() => {
  if (authStore.isInitialized) {
    fetchCalendarData();
  } else {
    const unwatch = watch(
      () => authStore.isInitialized,
      initialized => {
        if (initialized) {
          unwatch();
          fetchCalendarData();
        }
      }
    );
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}

/* Modern V-Calendar Styling */
.modern-water-calendar {
  width: 100% !important;
  max-width: 100% !important;
}

/* Remove default v-calendar styling */
.modern-water-calendar :deep(.vc-container) {
  border: none;
  background: transparent;
  width: 100% !important;
  max-width: 100% !important;
}

.modern-water-calendar :deep(.vc-pane-container) {
  width: 100% !important;
  max-width: 100% !important;
}

.modern-water-calendar :deep(.vc-pane-layout) {
  width: 100% !important;
  max-width: 100% !important;
}

.modern-water-calendar :deep(.vc-header) {
  padding: 1.5rem 0;
  background: transparent;
  margin-bottom: 1.5rem;
}

.modern-water-calendar :deep(.vc-title) {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.modern-water-calendar :deep(.vc-nav-arrow) {
  color: #6b7280;
  border-radius: 12px;
  padding: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modern-water-calendar :deep(.vc-nav-arrow:hover) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-color: #1d4ed8;
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.modern-water-calendar :deep(.vc-weekdays) {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  padding: 1.25rem 0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.modern-water-calendar :deep(.vc-weekday) {
  color: #475569;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.modern-water-calendar :deep(.vc-day) {
  margin: 0;
  min-height: 140px;
  flex: 1;
  width: 100% !important;
  max-width: none !important;
}

.modern-water-calendar :deep(.vc-weeks) {
  padding: 0;
  gap: 4px;
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  width: 100% !important;
  max-width: 100% !important;
}

.modern-water-calendar :deep(.vc-week) {
  display: contents;
}

/* Force all v-calendar elements to full width */
.modern-water-calendar :deep(.vc-pane) {
  width: 100% !important;
  max-width: 100% !important;
}

.modern-water-calendar :deep(.vc-day-layer) {
  width: 100% !important;
}

.modern-water-calendar :deep(.vc-day-content) {
  width: 100% !important;
  height: 100% !important;
}

/* Custom Day Container */
.water-day-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 140px;
  padding: 16px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.water-day-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    #e2e8f0,
    transparent
  );
  transition: all 0.3s ease;
}

.water-day-container:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
  background: linear-gradient(135deg, #ffffff, #dbeafe);
}

.water-day-container:hover::before {
  background: linear-gradient(
    90deg,
    #3b82f6,
    #1d4ed8,
    #3b82f6
  );
}

.water-day-container.is-today {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
  animation: todayPulse 2s infinite;
}

.water-day-container.is-today::before {
  background: linear-gradient(
    90deg,
    #3b82f6,
    #1d4ed8,
    #3b82f6
  );
}

@keyframes todayPulse {
  0%,
  100% {
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
  }
  50% {
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
  }
}

.water-day-container.has-water-data {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.15);
}

.water-day-container.has-water-data::before {
  background: linear-gradient(
    90deg,
    #10b981,
    #059669,
    #10b981
  );
}

.water-day-container.is-weekend {
  background: linear-gradient(135deg, #fafafa, #f3f4f6);
  border-color: #d1d5db;
}

/* Future Date Styling - White background for future days */
.water-day-container.is-future {
  background: #ffffff !important;
  border-color: #e2e8f0 !important;
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.water-day-container.is-future:hover {
  transform: none !important;
  box-shadow: none !important;
  background: #ffffff !important;
  border-color: #e2e8f0 !important;
}

.water-day-container.is-future::before {
  background: linear-gradient(
    90deg,
    transparent,
    #f3f4f6,
    transparent
  ) !important;
}

.water-day-container.is-future .day-number {
  color: #9ca3af !important;
}

.water-day-container.is-future .empty-state {
  opacity: 0.3 !important;
}

/* Day Number Styling */
.day-number {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  text-align: center;
}

/* Water Info Styling */
.water-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.water-badge {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.625rem;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.entry-count {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 0.5rem;
  font-weight: 500;
  text-align: center;
}

.no-water-info {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  opacity: 0.5;
}

/* Stat Cards Styling */
.stat-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.stat-card.group:hover::before {
  height: 6px;
  background: linear-gradient(
    90deg,
    #1d4ed8,
    #3b82f6,
    #1d4ed8
  );
}

.stat-icon-container {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.stat-card.group:hover .stat-icon-container {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  transform: scale(1.1);
}

.stat-icon {
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.stat-card.group:hover .stat-icon {
  transform: scale(1.2);
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Today Highlighting Styles */
.today-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 8px 8px 0 8px;
  padding: 2px 6px;
  z-index: 10;
  animation: todayBadgeFloat 3s ease-in-out infinite;
}

.today-pulse {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: todayPulse 2s ease-in-out infinite;
}

.today-text {
  font-size: 0.6rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* .today-number {
  background: linear-gradient(
    135deg,
    #3b82f6,
    #1d4ed8
  ) !important;
  color: white !important;
  font-weight: 800 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  animation: todayNumberGlow 3s ease-in-out infinite;
  border-radius: 8px;
  padding: 4px 8px;
} */

.is-today .water-day-container {
  background: linear-gradient(
    135deg,
    #dbeafe,
    #bfdbfe
  ) !important;
  border: 2px solid #3b82f6 !important;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3) !important;
  animation: todayContainer 4s ease-in-out infinite;
}

/* Today Animations */
@keyframes todayBadgeFloat {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.05);
  }
}

@keyframes todayPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.3);
  }
}

@keyframes todayNumberGlow {
  0%,
  100% {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
  }
}

@keyframes todayContainer {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
  }
}

/* V-Calendar Today Highlight Override */
.modern-water-calendar
  :deep(.today-highlight .vc-highlight) {
  background: linear-gradient(
    135deg,
    #3b82f6,
    #1d4ed8
  ) !important;
  border: 2px solid #1e40af !important;
  animation: todayHighlight 3s ease-in-out infinite;
}

@keyframes todayHighlight {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* Enhanced responsive breakpoints */
@media (max-width: 640px) {
  .today-badge {
    padding: 1px 4px;
  }

  .today-text {
    font-size: 0.5rem;
  }

  .today-number {
    padding: 3px 6px;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-water-calendar :deep(.vc-title) {
    font-size: 1.25rem;
  }

  .modern-water-calendar :deep(.vc-day) {
    min-height: 120px;
    width: 100%;
  }

  .modern-water-calendar :deep(.vc-weeks) {
    gap: 2px;
  }

  .water-day-container {
    min-height: 120px;
    padding: 12px;
    width: 100%;
  }

  .day-number {
    font-size: 1rem;
  }

  .water-badge {
    font-size: 0.625rem;
    padding: 3px 6px;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .modern-water-calendar :deep(.vc-header) {
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  .modern-water-calendar :deep(.vc-day) {
    min-height: 100px;
    width: 100%;
  }

  .modern-water-calendar :deep(.vc-weeks) {
    gap: 1px;
  }

  .water-day-container {
    min-height: 100px;
    padding: 10px;
    width: 100%;
  }

  .water-badge {
    font-size: 0.5rem;
    padding: 2px 4px;
  }

  .entry-count {
    font-size: 0.5rem;
    padding: 1px 4px;
  }
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
