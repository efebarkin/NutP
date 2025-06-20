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
            <span class="text-2xl">📊</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white mb-1">
              Beslenme & Su Takip Takvimi
            </h2>
            <p class="text-blue-100 text-sm">
              Günlük beslenme ve hidrasyon takibiniz
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
              {{ adjustedSummary.waterDaysWithEntries }}
            </div>
            <div class="text-xs text-blue-100">
              Su Aktif Gün
            </div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold">
              {{ adjustedSummary.mealDaysWithEntries }}
            </div>
            <div class="text-xs text-blue-100">
              Öğün Aktif Gün
            </div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold">
              {{ adjustedSummary.waterGoalCompletionRate }}%
            </div>
            <div class="text-xs text-blue-100">
              Su Başarı
            </div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold">
              {{ adjustedSummary.mealGoalCompletionRate }}%
            </div>
            <div class="text-xs text-blue-100">
              Kalori Başarı
            </div>
          </div>

          <!-- Cache Statistics (Development Only) -->
          <div
            v-if="showCacheDebug"
            class="text-center border-l border-blue-400/30 pl-6"
          >
            <div class="text-lg font-bold">
              {{ cacheStats.hitRate || '0.0' }}%
            </div>
            <div class="text-xs text-blue-100">
              Cache Hit
            </div>
          </div>
          <div v-if="showCacheDebug" class="text-center">
            <div class="text-lg font-bold">
              {{ cacheStats.cacheSize || 0 }}
            </div>
            <div class="text-xs text-blue-100">
              Cache Size
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Development Cache Debug Panel -->
    <div
      v-if="showCacheDebug"
      class="bg-gray-50 border-b border-gray-200 px-6 py-3"
    >
      <details class="cursor-pointer">
        <summary
          class="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          🔧 Cache Debug Panel (Development Only)
        </summary>
        <div
          class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs"
        >
          <div class="bg-white p-3 rounded-lg border">
            <div class="font-semibold text-blue-600">
              Hit Rate
            </div>
            <div class="text-2xl font-bold text-gray-900">
              {{ cacheStats.hitRate || '0.0' }}%
            </div>
            <div class="text-gray-500">
              {{ cacheStats.hits || 0 }} hits /
              {{
                (cacheStats.hits || 0) +
                (cacheStats.misses || 0)
              }}
              total
            </div>
          </div>
          <div class="bg-white p-3 rounded-lg border">
            <div class="font-semibold text-green-600">
              Memory Cache
            </div>
            <div class="text-2xl font-bold text-gray-900">
              {{ cacheStats.cacheSize || 0 }}
            </div>
            <div class="text-gray-500">
              entries in memory
            </div>
          </div>
          <div class="bg-white p-3 rounded-lg border">
            <div class="font-semibold text-purple-600">
              Background Refresh
            </div>
            <div class="text-2xl font-bold text-gray-900">
              {{
                isBackgroundRefreshing ? 'Active' : 'Idle'
              }}
            </div>
            <div class="text-gray-500">
              {{
                lastBackgroundRefresh
                  ? 'Last: ' +
                    new Date(
                      lastBackgroundRefresh
                    ).toLocaleTimeString()
                  : 'Never'
              }}
            </div>
          </div>
          <div class="bg-white p-3 rounded-lg border">
            <div class="font-semibold text-orange-600">
              Storage
            </div>
            <div class="text-lg font-bold text-gray-900">
              W:{{
                cacheStats.persistentSizes?.water || 0
              }}
              / M:{{
                cacheStats.persistentSizes?.meal || 0
              }}
            </div>
            <div class="text-gray-500">
              persistent entries
            </div>
          </div>
        </div>
        <div class="mt-3 flex space-x-2">
          <button
            @click="clearAllCache"
            class="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200 transition-colors"
          >
            Clear All Cache
          </button>
          <button
            @click="fetchCalendarData(false, true)"
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200 transition-colors"
          >
            Force Refresh
          </button>
          <button
            @click="logCacheStats"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition-colors"
          >
            Log Stats
          </button>
        </div>
      </details>
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

              <!-- Daily Information - Show both water and meal data -->
              <div
                v-if="getDayDataByDate(day.date).hasData"
                class="daily-info"
              >
                <!-- Water Badge -->
                <div
                  class="water-badge"
                  v-if="
                    getDayDataByDate(day.date).water &&
                    getDayDataByDate(day.date).water
                      .totalWaterInML > 0
                  "
                >
                  💧
                  {{
                    formatWaterAmountShort(
                      getDayDataByDate(day.date).water
                        .totalWaterInML
                    )
                  }}
                </div>

                <!-- Meal Badge -->
                <div
                  class="meal-badge"
                  v-if="
                    getDayDataByDate(day.date).meals &&
                    getDayDataByDate(day.date).meals
                      .totalMeals > 0
                  "
                >
                  🍽️
                  {{
                    formatMealCount(
                      getDayDataByDate(day.date).meals
                        .totalMeals
                    )
                  }}
                </div>
              </div>

              <!-- No Data - Show minimal empty state -->
              <div
                v-else-if="day.isToday"
                class="no-data-info"
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
        <!-- Water Days -->
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">💧</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ adjustedSummary.waterDaysWithEntries }}
            </div>
            <div class="stat-label">Su Aktif Gün</div>
          </div>
        </div>

        <!-- Meal Days -->
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">🍽️</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ adjustedSummary.mealDaysWithEntries }}
            </div>
            <div class="stat-label">Beslenme Aktif Gün</div>
          </div>
        </div>

        <!-- Water Success -->
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">🎯</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ adjustedSummary.waterGoalCompletionRate }}%
            </div>
            <div class="stat-label">Su Başarı Oranı</div>
          </div>
        </div>

        <!-- Calorie Success -->
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">📈</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ adjustedSummary.mealGoalCompletionRate }}%
            </div>
            <div class="stat-label">
              Kalori Başarı Oranı
            </div>
          </div>
        </div>

        <!-- Average Water -->
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">📊</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{
                adjustedSummary.averageDailyWaterInLiters
              }}L
            </div>
            <div class="stat-label">Günlük Ort. Su</div>
          </div>
        </div>

        <!-- Average Calories -->
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">🔥</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ adjustedSummary.averageDailyCalories }}
            </div>
            <div class="stat-label">Günlük Ort. Kalori</div>
          </div>
        </div>

        <!-- Combined Goals -->
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">🌟</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{
                adjustedSummary.waterDaysGoalReached +
                adjustedSummary.mealDaysGoalReached
              }}
            </div>
            <div class="stat-label">Toplam Başarı</div>
          </div>
        </div>

        <!-- Active Days -->
        <div class="stat-card group">
          <div class="stat-icon-container">
            <div class="stat-icon">📅</div>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{
                Math.max(
                  adjustedSummary.waterDaysWithEntries,
                  adjustedSummary.mealDaysWithEntries
                )
              }}
            </div>
            <div class="stat-label">En Aktif Gün</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Premium Day Details Modal -->
    <transition name="modal">
      <div
        v-if="selectedDayDetails"
        class="modal-backdrop fixed inset-0 bg-gradient-to-br from-slate-900/90 via-gray-900/70 to-black/85 backdrop-blur-xl flex items-center justify-center z-50 p-4"
        @click="closeDayDetails"
      >
        <div class="premium-modal-container" @click.stop>
          <!-- Glass Background -->
          <div class="premium-modal-glass">
            <!-- Header with gradient -->
            <div class="premium-modal-header">
              <div class="flex items-center space-x-3">
                <div class="premium-date-icon">
                  <i
                    class="fas fa-calendar-day text-white"
                  ></i>
                </div>
                <div>
                  <h3 class="premium-date-title">
                    {{ formatSelectedDate() }}
                  </h3>
                  <p class="premium-date-subtitle">
                    Günlük Beslenme & Hidrasyon Raporu
                  </p>
                </div>
              </div>
              <button
                @click="closeDayDetails"
                class="premium-close-btn"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="premium-modal-content">
              <!-- Water Section -->
              <div
                v-if="selectedDayDetails.water"
                class="premium-section water-section"
              >
                <!-- Enhanced Section Header -->
                <div
                  class="premium-section-header-enhanced"
                >
                  <div
                    class="section-header-background water-bg"
                  >
                    <div
                      class="section-header-pattern"
                    ></div>
                  </div>
                  <div class="section-header-content">
                    <div
                      class="premium-section-icon-enhanced water-icon-enhanced"
                    >
                      <div
                        class="icon-glow water-icon-glow"
                      ></div>
                      <i class="fas fa-tint"></i>
                    </div>
                    <div class="section-text-content">
                      <h4
                        class="premium-section-title-enhanced"
                      >
                        💧 Su Tüketimi Raporu
                      </h4>
                      <p
                        class="premium-section-subtitle-enhanced"
                      >
                        Günlük hidrasyon hedefi ve tüketim
                        analizi
                      </p>
                      <div
                        class="section-divider water-divider"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Premium Progress Ring -->
                <div class="premium-progress-container">
                  <div
                    class="premium-progress-ring water-ring"
                  >
                    <svg
                      class="progress-svg"
                      viewBox="0 0 100 100"
                    >
                      <!-- Background circle -->
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        stroke-width="8"
                      />
                      <!-- Progress circle -->
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#waterGradient)"
                        stroke-width="8"
                        stroke-linecap="round"
                        :stroke-dasharray="`${
                          (selectedDayDetails.water
                            .progressPercentage *
                            282.7) /
                          100
                        } 282.7`"
                        transform="rotate(-90 50 50)"
                        class="progress-circle"
                      />
                      <!-- Gradient definitions -->
                      <defs>
                        <linearGradient
                          id="waterGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            style="
                              stop-color: #06b6d4;
                              stop-opacity: 1;
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
                    </svg>
                    <div class="premium-progress-label">
                      <span class="progress-percentage"
                        >{{
                          selectedDayDetails.water
                            .progressPercentage
                        }}%</span
                      >
                      <span class="progress-text"
                        >Tamamlandı</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Water Stats Cards -->
                <div class="premium-stats-grid">
                  <div class="premium-stat-card water-stat">
                    <div class="stat-icon">
                      <i class="fas fa-glass-water"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">
                        {{
                          selectedDayDetails.water
                            .totalWaterInLiters
                        }}L
                      </div>
                      <div class="stat-label">
                        Toplam Su
                      </div>
                    </div>
                    <div class="stat-glow water-glow"></div>
                  </div>
                  <div class="premium-stat-card water-stat">
                    <div class="stat-icon">
                      <i class="fas fa-clipboard-list"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">
                        {{
                          selectedDayDetails.water
                            .entryCount
                        }}
                      </div>
                      <div class="stat-label">Su Kaydı</div>
                    </div>
                    <div class="stat-glow water-glow"></div>
                  </div>
                </div>

                <!-- Water Goal Status -->
                <div
                  class="premium-goal-status water-goal"
                  :class="
                    selectedDayDetails.water.isGoalReached
                      ? 'success'
                      : 'pending'
                  "
                >
                  <div class="goal-icon">
                    <i
                      :class="
                        selectedDayDetails.water
                          .isGoalReached
                          ? 'fas fa-check-circle'
                          : 'fas fa-clock'
                      "
                    ></i>
                  </div>
                  <div class="goal-content">
                    <div class="goal-title">
                      {{
                        selectedDayDetails.water
                          .isGoalReached
                          ? 'Hedef Tamamlandı!'
                          : 'Hedef Bekleniyor'
                      }}
                    </div>
                    <div class="goal-subtitle">
                      {{
                        selectedDayDetails.water
                          .isGoalReached
                          ? 'Su hedefine başarıyla ulaştınız'
                          : 'Su hedefine henüz ulaşılamadı'
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Meal Section -->
              <div
                v-if="selectedDayDetails.meals"
                class="premium-section meal-section"
              >
                <!-- Enhanced Section Header -->
                <div
                  class="premium-section-header-enhanced"
                >
                  <div
                    class="section-header-background meal-bg"
                  >
                    <div
                      class="section-header-pattern"
                    ></div>
                  </div>
                  <div class="section-header-content">
                    <div
                      class="premium-section-icon-enhanced meal-icon-enhanced"
                    >
                      <div
                        class="icon-glow meal-icon-glow"
                      ></div>
                      <i class="fas fa-utensils"></i>
                    </div>
                    <div class="section-text-content">
                      <h4
                        class="premium-section-title-enhanced"
                      >
                        🍽️ Beslenme Takibi
                      </h4>
                      <p
                        class="premium-section-subtitle-enhanced"
                      >
                        Günlük kalori hedefi ve öğün analizi
                      </p>
                      <div
                        class="section-divider meal-divider"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Premium Progress Ring -->
                <div class="premium-progress-container">
                  <div
                    class="premium-progress-ring meal-ring"
                  >
                    <svg
                      class="progress-svg"
                      viewBox="0 0 100 100"
                    >
                      <!-- Background circle -->
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        stroke-width="8"
                      />
                      <!-- Progress circle -->
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#mealGradient)"
                        stroke-width="8"
                        stroke-linecap="round"
                        :stroke-dasharray="`${
                          (selectedDayDetails.meals
                            .progressPercentage *
                            282.7) /
                          100
                        } 282.7`"
                        transform="rotate(-90 50 50)"
                        class="progress-circle"
                      />
                      <!-- Gradient definitions -->
                      <defs>
                        <linearGradient
                          id="mealGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            style="
                              stop-color: #10b981;
                              stop-opacity: 1;
                            "
                          />
                          <stop
                            offset="100%"
                            style="
                              stop-color: #059669;
                              stop-opacity: 1;
                            "
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div class="premium-progress-label">
                      <span class="progress-percentage"
                        >{{
                          selectedDayDetails.meals
                            .progressPercentage
                        }}%</span
                      >
                      <span class="progress-text"
                        >Tamamlandı</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Meal Stats Cards -->
                <div class="premium-stats-grid">
                  <div class="premium-stat-card meal-stat">
                    <div class="stat-icon">
                      <i class="fas fa-fire"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">
                        {{
                          Math.round(
                            selectedDayDetails.meals
                              .totalCalories
                          )
                        }}
                      </div>
                      <div class="stat-label">Kalori</div>
                    </div>
                    <div class="stat-glow meal-glow"></div>
                  </div>
                  <div class="premium-stat-card meal-stat">
                    <div class="stat-icon">
                      <i class="fas fa-plate-wheat"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">
                        {{
                          selectedDayDetails.meals
                            .totalMeals
                        }}
                      </div>
                      <div class="stat-label">Öğün</div>
                    </div>
                    <div class="stat-glow meal-glow"></div>
                  </div>
                </div>

                <!-- Meal Goal Status -->
                <div
                  class="premium-goal-status meal-goal"
                  :class="
                    selectedDayDetails.meals.isGoalReached
                      ? 'success'
                      : 'pending'
                  "
                >
                  <div class="goal-icon">
                    <i
                      :class="
                        selectedDayDetails.meals
                          .isGoalReached
                          ? 'fas fa-check-circle'
                          : 'fas fa-clock'
                      "
                    ></i>
                  </div>
                  <div class="goal-content">
                    <div class="goal-title">
                      {{
                        selectedDayDetails.meals
                          .isGoalReached
                          ? 'Hedef Tamamlandı!'
                          : 'Hedef Bekleniyor'
                      }}
                    </div>
                    <div class="goal-subtitle">
                      {{
                        selectedDayDetails.meals
                          .isGoalReached
                          ? 'Kalori hedefine başarıyla ulaştınız'
                          : 'Kalori hedefine henüz ulaşılamadı'
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Data State -->
              <div
                v-if="
                  !selectedDayDetails.water &&
                  !selectedDayDetails.meals
                "
                class="premium-no-data"
              >
                <div class="no-data-icon">
                  <i class="fas fa-calendar-times"></i>
                </div>
                <h4 class="no-data-title">
                  Veri Bulunamadı
                </h4>
                <p class="no-data-text">
                  Bu gün için henüz beslenme veya hidrasyon
                  verisi bulunmuyor.
                </p>
                <div class="no-data-suggestion">
                  <i class="fas fa-lightbulb"></i>
                  <span
                    >Günlük hedeflerinizi takip etmek için
                    veri girişi yapmayı unutmayın!</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  watch,
  onUnmounted,
  shallowRef,
  nextTick,
} from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

// Client-side checks
const isClient = computed(() => import.meta.client);
const showCacheDebug = computed(() => {
  if (!import.meta.client) return false;
  const config = useRuntimeConfig();
  return config.public?.NODE_ENV === 'development';
});

// Cache initialization for SSR compatibility
let cache = null;
let cacheStats = ref({
  hitRate: 0,
  cacheSize: 0,
  hits: 0,
  misses: 0,
  persistentSizes: {},
});

// Initialize cache on client side
onMounted(async () => {
  if (import.meta.client && !cache) {
    try {
      const { useCalendarDataCache } = await import(
        '~/composables/useCalendarCache'
      );
      cache = useCalendarDataCache();

      // Update cache stats
      if (cache) {
        cacheStats.value = {
          hitRate: cache.hitRate || 0,
          cacheSize: cache.cacheSize || 0,
          hits: cache.getStats?.()?.hits || 0,
          misses: cache.getStats?.()?.misses || 0,
          persistentSizes:
            cache.getStats?.()?.persistentSizes || {},
        };
      }
    } catch (error) {
      console.warn(
        '[Calendar] Failed to initialize cache:',
        error
      );
    }
  }
});

// Cache utility methods
const clearAllCache = () => {
  if (cache) {
    cache.clearAll();
    cacheStats.value = {
      hitRate: 0,
      cacheSize: 0,
      hits: 0,
      misses: 0,
      persistentSizes: {},
    };
  }
};

const logCacheStats = () => {
  if (cache) {
    console.log('Cache Stats:', cache.getStats());
  } else {
    console.log('Cache Stats:', cacheStats.value);
  }
};

const updateCacheStats = () => {
  if (cache) {
    cacheStats.value = {
      hitRate: cache.hitRate || 0,
      cacheSize: cache.cacheSize || 0,
      hits: cache.getStats?.()?.hits || 0,
      misses: cache.getStats?.()?.misses || 0,
      persistentSizes:
        cache.getStats?.()?.persistentSizes || {},
    };
  }
};

// Reactive data - using shallowRef for large objects for better performance
const selectedDate = ref(new Date());
const waterCalendarData = shallowRef(null);
const mealCalendarData = shallowRef(null);
const loading = ref(false);
const monthLoading = ref(false);
const error = ref(null);
const selectedDayDetails = ref(null);

// Background refresh flags
const isBackgroundRefreshing = ref(false);
const lastBackgroundRefresh = ref(null);

// Optimized computed properties with memoization
const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});

// Memoized date computations
const currentMonth = computed(() =>
  selectedDate.value.getMonth()
);
const currentYear = computed(() =>
  selectedDate.value.getFullYear()
);

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
  if (
    !waterCalendarData.value?.summary &&
    !mealCalendarData.value?.summary
  )
    return null;

  const waterSummary =
    waterCalendarData.value?.summary || {};
  const mealSummary = mealCalendarData.value?.summary || {};

  const summary = {
    // Water stats
    waterDaysWithEntries: waterSummary.daysWithEntries || 0,
    waterDaysGoalReached: waterSummary.daysGoalReached || 0,
    waterGoalCompletionRate:
      waterSummary.goalCompletionRate || 0,
    averageDailyWaterInLiters:
      waterSummary.averageDailyWaterInLiters || '0.0',

    // Meal stats
    mealDaysWithEntries: mealSummary.daysWithMeals || 0,
    mealDaysGoalReached: mealSummary.daysGoalReached || 0,
    mealGoalCompletionRate:
      mealSummary.goalCompletionRate || 0,
    averageDailyCalories:
      mealSummary.averageDailyCalories || 0,
  };

  if (isCurrentMonth.value) {
    // For current month, only count days up to today
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    // Recalculate water stats for current month
    if (waterCalendarData.value?.dailySummaries) {
      const validWaterDays =
        waterCalendarData.value.dailySummaries.filter(
          day => {
            const [year, month, dayNum] = day.date
              .split('-')
              .map(Number);
            const dayDate = new Date(
              year,
              month - 1,
              dayNum
            );
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return dayDate <= today;
          }
        );

      const waterDaysWithEntries = validWaterDays.filter(
        day => day.entryCount > 0
      ).length;
      const waterDaysGoalReached = validWaterDays.filter(
        day => day.isGoalReached
      ).length;
      const totalDaysUntilToday = currentDay;

      summary.waterDaysWithEntries = waterDaysWithEntries;
      summary.waterDaysGoalReached = waterDaysGoalReached;
      summary.waterGoalCompletionRate =
        totalDaysUntilToday > 0
          ? Math.round(
              (waterDaysGoalReached / totalDaysUntilToday) *
                100
            )
          : 0;

      const totalWater = validWaterDays.reduce(
        (sum, day) => sum + day.totalWaterInML,
        0
      );
      summary.averageDailyWaterInLiters =
        waterDaysWithEntries > 0
          ? (
              totalWater /
              waterDaysWithEntries /
              1000
            ).toFixed(1)
          : '0.0';
    }

    // Recalculate meal stats for current month
    if (mealCalendarData.value?.dailySummaries) {
      const validMealDays =
        mealCalendarData.value.dailySummaries.filter(
          day => {
            const [year, month, dayNum] = day.date
              .split('-')
              .map(Number);
            const dayDate = new Date(
              year,
              month - 1,
              dayNum
            );
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return dayDate <= today;
          }
        );

      const mealDaysWithEntries = validMealDays.filter(
        day => day.totalMeals > 0
      ).length;
      const mealDaysGoalReached = validMealDays.filter(
        day => day.isGoalReached
      ).length;
      const totalDaysUntilToday = currentDay;

      summary.mealDaysWithEntries = mealDaysWithEntries;
      summary.mealDaysGoalReached = mealDaysGoalReached;
      summary.mealGoalCompletionRate =
        totalDaysUntilToday > 0
          ? Math.round(
              (mealDaysGoalReached / totalDaysUntilToday) *
                100
            )
          : 0;

      const totalCalories = validMealDays.reduce(
        (sum, day) => sum + day.totalCalories,
        0
      );
      summary.averageDailyCalories =
        mealDaysWithEntries > 0
          ? Math.round(totalCalories / mealDaysWithEntries)
          : 0;
    }
  }

  return summary;
});

// Calendar attributes for v-calendar
const calendarAttributes = computed(() => {
  const attributes = [];

  // Water attributes
  if (waterCalendarData.value?.dailySummaries) {
    const waterAttributes =
      waterCalendarData.value.dailySummaries
        .filter(day => day.entryCount > 0)
        .map(day => {
          const [year, month, dayNum] = day.date
            .split('-')
            .map(Number);
          const attributeDate = new Date(
            year,
            month - 1,
            dayNum
          );

          return {
            key: `water-${day.date}`,
            dates: attributeDate,
            highlight: {
              color: day.isGoalReached
                ? 'blue'
                : day.progressPercentage >= 50
                ? 'cyan'
                : 'gray',
              fillMode: 'light',
            },
            popover: {
              label: `💧 ${day.totalWaterInLiters}L su tüketildi`,
              visibility: 'hover',
            },
          };
        });
    attributes.push(...waterAttributes);
  }

  // Meal attributes
  if (mealCalendarData.value?.dailySummaries) {
    const mealAttributes =
      mealCalendarData.value.dailySummaries
        .filter(day => day.totalMeals > 0)
        .map(day => {
          const [year, month, dayNum] = day.date
            .split('-')
            .map(Number);
          const attributeDate = new Date(
            year,
            month - 1,
            dayNum
          );

          return {
            key: `meal-${day.date}`,
            dates: attributeDate,
            dot: {
              color: day.isGoalReached
                ? 'green'
                : day.progressPercentage >= 50
                ? 'orange'
                : 'red',
              class: 'meal-dot',
            },
            popover: {
              label: `🍽️ ${
                day.totalMeals
              } öğün, ${Math.round(
                day.totalCalories
              )} kalori`,
              visibility: 'hover',
            },
          };
        });
    attributes.push(...mealAttributes);
  }

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
  const waterData = getWaterDayDataByDate(date);
  const mealData = getMealDayDataByDate(date);

  return {
    water: waterData,
    meals: mealData,
    hasData: !!(waterData || mealData),
  };
};

const getWaterDayDataByDate = date => {
  if (!waterCalendarData.value?.dailySummaries) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0'
  );
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  return waterCalendarData.value.dailySummaries.find(
    summary => summary.date === dateStr
  );
};

const getMealDayDataByDate = date => {
  if (!mealCalendarData.value?.dailySummaries) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0'
  );
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  return mealCalendarData.value.dailySummaries.find(
    summary => summary.date === dateStr
  );
};

const formatWaterAmountShort = amountInML => {
  if (!amountInML || amountInML === 0) return '';

  if (amountInML >= 1000) {
    return `${(amountInML / 1000).toFixed(1)}L`;
  }
  return `${amountInML}ml`;
};

const formatCaloriesShort = calories => {
  if (!calories || calories === 0) return '';
  return `${Math.round(calories)}kcal`;
};

const formatMealCount = count => {
  if (!count || count === 0) return '';
  return `${count} öğün`;
};

const selectDay = async day => {
  const dayData = getDayDataByDate(day.date);
  if (dayData.hasData) {
    // First set the data
    selectedDayDetails.value = {
      water: dayData.water,
      meals: dayData.meals,
      day: day.day,
      date: day.date,
    };

    // Wait for DOM update to ensure smooth transition
    await nextTick();
  }
};

const fetchCalendarData = async (
  isMonthChange = false,
  forceRefresh = false
) => {
  console.log(
    '🔍 fetchCalendarData called. Current selectedDate:',
    selectedDate.value?.toISOString(),
    'forceRefresh:',
    forceRefresh
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
    const month = selectedDate.value.getMonth() + 1; // 1-indexed for cache keys

    console.log(`🔍 Fetching data for: ${year}/${month}`);

    // Check cache first (unless force refresh)
    if (!forceRefresh && import.meta.client) {
      const cacheInstance = cache;
      if (cacheInstance) {
        const cachedWaterData =
          cacheInstance.getWaterCalendar(year, month);
        const cachedMealData =
          cacheInstance.getMealCalendar(year, month);

        if (cachedWaterData && cachedMealData) {
          console.log(
            `📦 Cache hit for ${year}/${month} - using cached data`
          );
          waterCalendarData.value = cachedWaterData;
          mealCalendarData.value = cachedMealData;

          // Start background refresh for fresh data (stale-while-revalidate)
          nextTick(() => {
            backgroundRefreshData(year, month);
          });

          return;
        } else if (cachedWaterData || cachedMealData) {
          console.log(
            `📦 Partial cache hit for ${year}/${month}`
          );
          if (cachedWaterData)
            waterCalendarData.value = cachedWaterData;
          if (cachedMealData)
            mealCalendarData.value = cachedMealData;
        }
      }
    }

    // Calculate date range for API calls
    const startDay = 1;
    const lastDay = new Date(year, month, 0).getDate(); // month is 1-indexed here

    const startDate = `${year}-${String(month).padStart(
      2,
      '0'
    )}-${String(startDay).padStart(2, '0')}`;
    const endDate = `${year}-${String(month).padStart(
      2,
      '0'
    )}-${String(lastDay).padStart(2, '0')}`;

    console.log(
      `🌐 API fetch for period: ${startDate} to ${endDate}`
    );

    // Determine which data to fetch based on cache status
    const promises = [];
    const fetchTypes = [];
    const cacheInstance = import.meta.client ? cache : null;

    if (
      !cacheInstance?.getWaterCalendar(year, month) ||
      forceRefresh
    ) {
      promises.push(
        $fetch('/api/water/range', {
          credentials: 'include',
          query: {
            startDate,
            endDate,
            timezone:
              Intl.DateTimeFormat().resolvedOptions()
                .timeZone,
          },
        })
      );
      fetchTypes.push('water');
    }

    if (
      !cacheInstance?.getMealCalendar(year, month) ||
      forceRefresh
    ) {
      promises.push(
        $fetch('/api/meals/range', {
          credentials: 'include',
          query: {
            startDate,
            endDate,
            timezone:
              Intl.DateTimeFormat().resolvedOptions()
                .timeZone,
          },
        })
      );
      fetchTypes.push('meal');
    }

    // Fetch missing or force-refreshed data
    if (promises.length > 0) {
      const responses = await Promise.all(promises);

      // Process responses and update cache
      responses.forEach((response, index) => {
        const type = fetchTypes[index];

        if (type === 'water') {
          console.log(
            '🔍 Water calendar data response:',
            response
          );
          waterCalendarData.value = response;
          cacheInstance?.setWaterCalendar(
            year,
            month,
            response
          );
        } else if (type === 'meal') {
          console.log(
            '🔍 Meal calendar data response:',
            response
          );
          mealCalendarData.value = response;
          cacheInstance?.setMealCalendar(
            year,
            month,
            response
          );
        }
      });
    }

    // Prefetch adjacent months for better UX
    nextTick(() => {
      prefetchAdjacentMonths(year, month);
    });
  } catch (err) {
    console.error('❌ Calendar data fetch error:', err);
    error.value =
      err.statusMessage ||
      'Takvim verileri yüklenirken bir hata oluştu';
    toast.error(error.value);

    // Try to fall back to cache even if expired
    if (import.meta.client && cacheInstance) {
      const cachedWaterData =
        cacheInstance.getWaterCalendar(
          selectedDate.value.getFullYear(),
          selectedDate.value.getMonth() + 1
        );
      const cachedMealData = cacheInstance.getMealCalendar(
        selectedDate.value.getFullYear(),
        selectedDate.value.getMonth() + 1
      );

      if (cachedWaterData || cachedMealData) {
        console.log(
          '📦 Falling back to cached data due to error'
        );
        if (cachedWaterData)
          waterCalendarData.value = cachedWaterData;
        if (cachedMealData)
          mealCalendarData.value = cachedMealData;
        toast.info(
          'Önbelleğe alınmış veriler gösteriliyor'
        );
      }
    }
  } finally {
    loading.value = false;
    monthLoading.value = false;
  }
};

// Background refresh for stale-while-revalidate strategy
const backgroundRefreshData = async (year, month) => {
  if (isBackgroundRefreshing.value) return;

  // Don't refresh too frequently
  const lastRefresh = lastBackgroundRefresh.value;
  if (lastRefresh && Date.now() - lastRefresh < 60000) {
    // 1 minute minimum
    return;
  }

  isBackgroundRefreshing.value = true;
  lastBackgroundRefresh.value = Date.now();

  try {
    console.log(
      `🔄 Background refresh started for ${year}/${month}`
    );

    const startDay = 1;
    const lastDay = new Date(year, month, 0).getDate();
    const startDate = `${year}-${String(month).padStart(
      2,
      '0'
    )}-${String(startDay).padStart(2, '0')}`;
    const endDate = `${year}-${String(month).padStart(
      2,
      '0'
    )}-${String(lastDay).padStart(2, '0')}`;

    const [waterResponse, mealResponse] = await Promise.all(
      [
        $fetch('/api/water/range', {
          credentials: 'include',
          query: {
            startDate,
            endDate,
            timezone:
              Intl.DateTimeFormat().resolvedOptions()
                .timeZone,
          },
        }),
        $fetch('/api/meals/range', {
          credentials: 'include',
          query: {
            startDate,
            endDate,
            timezone:
              Intl.DateTimeFormat().resolvedOptions()
                .timeZone,
          },
        }),
      ]
    );

    // Update cache with fresh data
    const cacheInstance = import.meta.client ? cache : null;
    if (cacheInstance) {
      cacheInstance.setWaterCalendar(
        year,
        month,
        waterResponse
      );
      cacheInstance.setMealCalendar(
        year,
        month,
        mealResponse
      );
    }

    // Update UI if this is the current month
    const currentYear = selectedDate.value.getFullYear();
    const currentMonth = selectedDate.value.getMonth() + 1;

    if (year === currentYear && month === currentMonth) {
      waterCalendarData.value = waterResponse;
      mealCalendarData.value = mealResponse;
      console.log(
        `✅ Background refresh completed and UI updated for ${year}/${month}`
      );
    } else {
      console.log(
        `✅ Background refresh completed for ${year}/${month} (cached only)`
      );
    }
  } catch (error) {
    console.error(
      `❌ Background refresh failed for ${year}/${month}:`,
      error
    );
  } finally {
    isBackgroundRefreshing.value = false;
  }
};

// Prefetch adjacent months for better navigation experience
const prefetchAdjacentMonths = async (
  currentYear,
  currentMonth
) => {
  if (!import.meta.client) return;

  try {
    const cacheInstance = cache;
    if (!cacheInstance) return;

    // Calculate adjacent months
    const nextMonth =
      currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear =
      currentMonth === 12 ? currentYear + 1 : currentYear;
    const prevMonth =
      currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear =
      currentMonth === 1 ? currentYear - 1 : currentYear;

    const prefetchPromises = [];

    // Prefetch next month if not cached
    if (
      !cacheInstance.getWaterCalendar(
        nextYear,
        nextMonth
      ) ||
      !cacheInstance.getMealCalendar(nextYear, nextMonth)
    ) {
      console.log(
        `🔮 Prefetching next month: ${nextYear}/${nextMonth}`
      );

      const nextStartDate = `${nextYear}-${String(
        nextMonth
      ).padStart(2, '0')}-01`;
      const nextEndDate = `${nextYear}-${String(
        nextMonth
      ).padStart(2, '0')}-${String(
        new Date(nextYear, nextMonth, 0).getDate()
      ).padStart(2, '0')}`;

      if (
        !cacheInstance.getWaterCalendar(nextYear, nextMonth)
      ) {
        prefetchPromises.push(
          $fetch('/api/water/range', {
            credentials: 'include',
            query: {
              startDate: nextStartDate,
              endDate: nextEndDate,
              timezone:
                Intl.DateTimeFormat().resolvedOptions()
                  .timeZone,
            },
          }).then(data => ({
            type: 'water',
            year: nextYear,
            month: nextMonth,
            data,
          }))
        );
      }

      if (
        !cacheInstance.getMealCalendar(nextYear, nextMonth)
      ) {
        prefetchPromises.push(
          $fetch('/api/meals/range', {
            credentials: 'include',
            query: {
              startDate: nextStartDate,
              endDate: nextEndDate,
              timezone:
                Intl.DateTimeFormat().resolvedOptions()
                  .timeZone,
            },
          }).then(data => ({
            type: 'meal',
            year: nextYear,
            month: nextMonth,
            data,
          }))
        );
      }
    }

    // Prefetch previous month if not cached
    if (
      !cacheInstance.getWaterCalendar(
        prevYear,
        prevMonth
      ) ||
      !cacheInstance.getMealCalendar(prevYear, prevMonth)
    ) {
      console.log(
        `🔮 Prefetching previous month: ${prevYear}/${prevMonth}`
      );

      const prevStartDate = `${prevYear}-${String(
        prevMonth
      ).padStart(2, '0')}-01`;
      const prevEndDate = `${prevYear}-${String(
        prevMonth
      ).padStart(2, '0')}-${String(
        new Date(prevYear, prevMonth, 0).getDate()
      ).padStart(2, '0')}`;

      if (
        !cacheInstance.getWaterCalendar(prevYear, prevMonth)
      ) {
        prefetchPromises.push(
          $fetch('/api/water/range', {
            credentials: 'include',
            query: {
              startDate: prevStartDate,
              endDate: prevEndDate,
              timezone:
                Intl.DateTimeFormat().resolvedOptions()
                  .timeZone,
            },
          }).then(data => ({
            type: 'water',
            year: prevYear,
            month: prevMonth,
            data,
          }))
        );
      }

      if (
        !cacheInstance.getMealCalendar(prevYear, prevMonth)
      ) {
        prefetchPromises.push(
          $fetch('/api/meals/range', {
            credentials: 'include',
            query: {
              startDate: prevStartDate,
              endDate: prevEndDate,
              timezone:
                Intl.DateTimeFormat().resolvedOptions()
                  .timeZone,
            },
          }).then(data => ({
            type: 'meal',
            year: prevYear,
            month: prevMonth,
            data,
          }))
        );
      }
    }

    // Execute prefetch requests
    if (prefetchPromises.length > 0) {
      const results = await Promise.allSettled(
        prefetchPromises
      );

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          const { type, year, month, data } = result.value;
          if (type === 'water') {
            cacheInstance.setWaterCalendar(
              year,
              month,
              data
            );
          } else if (type === 'meal') {
            cacheInstance.setMealCalendar(
              year,
              month,
              data
            );
          }
          console.log(
            `✅ Prefetched ${type} data for ${year}/${month}`
          );
        } else {
          console.log(`❌ Prefetch failed:`, result.reason);
        }
      });
    }
  } catch (error) {
    console.error('❌ Prefetch error:', error);
  }
};

// VueUse debounced version for rapid navigation - optimized for Vue 3
const debouncedFetchCalendarData = useDebounceFn(
  fetchCalendarData,
  300
);

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

  const date = new Date(selectedDayDetails.value.date);
  return date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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

  // Also trigger fetch directly as a backup with debouncing for better performance
  console.log(
    '🚀 Triggering debouncedFetchCalendarData from handleCalendarMove'
  );
  debouncedFetchCalendarData(true);
};

// Initial data fetch with cache initialization
onMounted(() => {
  console.log(
    '📊 Calendar component mounted - initializing cache'
  );

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

  // Log cache statistics on mount (client-side only)
  if (import.meta.client) {
    const cacheInstance = cache;
    console.log(
      '📊 Cache statistics on mount:',
      cacheInstance?.getStats()
    );
  }
});

// Cleanup and cache management on unmount
onUnmounted(() => {
  // VueUse useDebounceFn automatically cancels pending calls on unmount
  console.log(
    'Calendar component unmounted - performing cleanup'
  );

  // Log final cache statistics (client-side only)
  if (import.meta.client) {
    const cacheInstance = cache;
    console.log(
      '📊 Final cache statistics:',
      cacheInstance?.getStats()
    );

    // Perform cache cleanup
    cacheInstance?.cleanup();
  }

  console.log('✅ Calendar component cleanup completed');
});
</script>

<style scoped>
/* Premium Modal Transition Styles */
.modal-backdrop {
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.9) 0%,
    rgba(17, 24, 39, 0.7) 50%,
    rgba(0, 0, 0, 0.85) 100%
  );
  backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: backdrop-filter, background, opacity;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-backdrop,
.modal-leave-to .modal-backdrop {
  backdrop-filter: blur(0px);
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0) 0%,
    rgba(17, 24, 39, 0) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-enter-active .premium-modal-container,
.modal-leave-active .premium-modal-container {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .premium-modal-container,
.modal-leave-to .premium-modal-container {
  transform: scale(0.9) translateY(30px);
  opacity: 0;
}

.modal-enter-to .premium-modal-container,
.modal-leave-from .premium-modal-container {
  transform: scale(1) translateY(0);
  opacity: 1;
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
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.water-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.meal-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.meal-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.daily-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;
  flex-grow: 1;
  justify-content: center;
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

.no-data-info {
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

/* Premium Modal Styles */
.premium-modal-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  will-change: transform, opacity;
  /* Animation removed to prevent conflict with Vue transitions */
}

.premium-modal-glass {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4),
    0 16px 32px rgba(0, 0, 0, 0.2),
    0 0 120px rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  position: relative;
}

.premium-modal-glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
}

.premium-modal-header {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.95) 0%,
    rgba(5, 150, 105, 0.9) 50%,
    rgba(6, 120, 86, 0.95) 100%
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.premium-modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 3s infinite;
}

.premium-date-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 20px;
}

.premium-date-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.premium-date-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  margin-top: 2px;
}

.premium-close-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.premium-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.premium-modal-content {
  background: rgba(255, 255, 255, 0.02);
  padding: 24px;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.premium-modal-content::-webkit-scrollbar {
  width: 6px;
}

.premium-modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.premium-modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.premium-section {
  margin-bottom: 32px;
  position: relative;
}

.premium-section:last-child {
  margin-bottom: 0;
}

.premium-section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.premium-section-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.water-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.meal-icon {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.premium-section-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.premium-section-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  margin-top: 2px;
}

.premium-progress-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.premium-progress-ring {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2));
}

.progress-circle {
  transition: stroke-dasharray 1s
    cubic-bezier(0.4, 0, 0.2, 1);
  animation: progressGlow 2s ease-in-out infinite alternate;
}

.premium-progress-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-percentage {
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.progress-text {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
  font-weight: 500;
}

.premium-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.premium-stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.premium-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.premium-stat-card .stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.water-stat .stat-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.meal-stat .stat-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.premium-stat-card .stat-content {
  flex: 1;
}

.premium-stat-card .stat-value {
  font-size: 20px;
  font-weight: 800;
  color: white;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.premium-stat-card .stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
  font-weight: 500;
}

.stat-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.premium-stat-card:hover .stat-glow {
  left: 100%;
}

.premium-goal-status {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.premium-goal-status.success {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
}

.premium-goal-status.pending {
  background: rgba(249, 115, 22, 0.15);
  border-color: rgba(249, 115, 22, 0.3);
}

/* Water Goal Status - Blue themes */
.premium-goal-status.water-goal.success {
  background: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.3);
}

.premium-goal-status.water-goal.pending {
  background: rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.3);
}

/* Meal Goal Status - Emerald themes */
.premium-goal-status.meal-goal.success {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
}

.premium-goal-status.meal-goal.pending {
  background: rgba(5, 150, 105, 0.15);
  border-color: rgba(5, 150, 105, 0.3);
}

.premium-goal-status .goal-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.premium-goal-status.success .goal-icon {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.premium-goal-status.pending .goal-icon {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

/* Water Goal Status Icons - Blue gradients */
.premium-goal-status.water-goal.success .goal-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.premium-goal-status.water-goal.pending .goal-icon {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
}

/* Meal Goal Status Icons - Emerald gradients */
.premium-goal-status.meal-goal.success .goal-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.premium-goal-status.meal-goal.pending .goal-icon {
  background: linear-gradient(135deg, #059669, #047857);
}

.premium-goal-status .goal-content {
  flex: 1;
}

.premium-goal-status .goal-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.premium-goal-status .goal-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  margin-top: 2px;
}

.premium-no-data {
  text-align: center;
  padding: 40px 20px;
}

.no-data-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.no-data-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.no-data-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.no-data-suggestion {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  backdrop-filter: blur(10px);
}

.no-data-suggestion i {
  color: #fbbf24;
  font-size: 16px;
}

/* Animations */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes progressGlow {
  0% {
    filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2));
  }
  100% {
    filter: drop-shadow(0 6px 20px rgba(59, 130, 246, 0.4));
  }
}

/* Premium Modal Responsive Design */
@media (max-width: 640px) {
  .premium-modal-container {
    max-width: 95vw;
    max-height: 95vh;
  }

  .premium-date-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .premium-date-title {
    font-size: 16px;
  }

  .premium-modal-content {
    padding: 20px;
  }

  .premium-section-icon-enhanced {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .premium-progress-ring {
    width: 100px;
    height: 100px;
  }

  .progress-percentage {
    font-size: 20px;
  }

  .premium-stats-grid {
    gap: 12px;
  }

  .premium-stat-card {
    padding: 16px;
  }

  .premium-stat-card .stat-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .premium-stat-card .stat-value {
    font-size: 16px;
  }
}

/* Enhanced Section Headers */
.premium-section-header-enhanced {
  position: relative;
  margin-bottom: 30px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.section-header-background {
  position: absolute;
  inset: 0;
  padding: 25px;
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  opacity: 0.95;
}

.section-header-background.water-bg {
  background: linear-gradient(
    135deg,
    #0ea5e9 0%,
    #3b82f6 50%,
    #1d4ed8 100%
  );
}

.section-header-background.meal-bg {
  background: linear-gradient(
    135deg,
    #10b981 0%,
    #059669 50%,
    #047857 100%
  );
}

.section-header-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
      circle at 20px 20px,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    ),
    radial-gradient(
      circle at 60px 60px,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px
    );
  background-size: 80px 80px, 40px 40px;
  animation: patternMove 20s linear infinite;
}

@keyframes patternMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(80px, 80px);
  }
}

.section-header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 25px;
  gap: 20px;
}

.premium-section-icon-enhanced {
  position: relative;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-section-icon-enhanced:hover {
  transform: scale(1.1) rotateY(10deg);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.icon-glow {
  position: absolute;
  inset: -4px;
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.water-icon-glow {
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.4) 0%,
    transparent 70%
  );
}

.meal-icon-glow {
  background: radial-gradient(
    circle,
    rgba(16, 185, 129, 0.4) 0%,
    transparent 70%
  );
}

.premium-section-icon-enhanced:hover .icon-glow {
  opacity: 1;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.section-text-content {
  flex: 1;
}

.premium-section-title-enhanced {
  font-size: 24px;
  font-weight: 800;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.premium-section-subtitle-enhanced {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 16px 0;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.section-divider {
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.section-divider::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.water-divider::after {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
}

.meal-divider::after {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
}
</style>
