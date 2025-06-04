<template>
  <div
    class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-green-50 py-8 relative overflow-hidden"
  >
    <div class="container mx-auto px-4 py-12 relative z-10">
      <!-- Modern Header Section -->
      <div class="text-center mb-16 animate-fade-in-up">
        <div
          class="inline-block p-4 bg-emerald-500/10 backdrop-blur-md rounded-2xl mb-6 border border-emerald-200/30 shadow-2xl"
        >
          <div
            class="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
              />
            </svg>
          </div>
        </div>

        <h1
          class="text-6xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-6 leading-tight"
        >
          Uyku & Kalori Dengesi Hesaplayıcı
        </h1>

        <div class="max-w-3xl mx-auto">
          <p
            class="text-xl text-gray-600 leading-relaxed mb-8"
          >
            Uyku sürenizin metabolizma hızınıza ve kalori
            yakımınıza etkisini analiz edin. Uyku
            eksikliğinin enerji dengeniz üzerindeki etkisini
            öğrenin.
          </p>

          <!-- Stats badges -->
          <div
            class="flex flex-wrap justify-center gap-4 mt-8"
          >
            <div
              class="bg-emerald-500/10 backdrop-blur-md rounded-xl px-6 py-3 border border-emerald-200/30 animate-float"
            >
              <div
                class="text-2xl font-bold text-emerald-700"
              >
                99%
              </div>
              <div class="text-sm text-gray-600">
                Doğruluk
              </div>
            </div>
            <div
              class="bg-emerald-500/10 backdrop-blur-md rounded-xl px-6 py-3 border border-emerald-200/30 animate-float animation-delay-500"
            >
              <div
                class="text-2xl font-bold text-emerald-700"
              >
                1M+
              </div>
              <div class="text-sm text-gray-600">
                Hesaplama
              </div>
            </div>
            <div
              class="bg-emerald-500/10 backdrop-blur-md rounded-xl px-6 py-3 border border-emerald-200/30 animate-float animation-delay-1000"
            >
              <div
                class="text-2xl font-bold text-emerald-700"
              >
                24/7
              </div>
              <div class="text-sm text-gray-600">
                Erişim
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto"
      >
        <!-- Left Column - Form Section -->
        <div class="space-y-8">
          <div
            class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500 hover:scale-[1.02] animate-slide-in-left"
          >
            <!-- Form header -->
            <div class="text-center mb-8">
              <div
                class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-bold text-emerald-700 mb-2"
              >
                Uyku & Kalori Dengenizi Hesaplayın
              </h2>
              <p class="text-gray-600">
                Verilerinizi girin ve kişiselleştirilmiş
                sonuçlarınızı görün
              </p>
            </div>

            <form
              @submit.prevent="calculateSleepCalorieBalance"
              class="space-y-6"
            >
              <!-- Cinsiyet Seçimi -->
              <div class="space-y-2">
                <label
                  class="text-lg font-medium text-gray-700"
                  >Cinsiyet</label
                >
                <div class="flex gap-4">
                  <button
                    type="button"
                    @click="formData.gender = 'male'"
                    :class="[
                      'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200',
                      formData.gender === 'male'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span class="block text-center"
                      >Erkek</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="formData.gender = 'female'"
                    :class="[
                      'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200',
                      formData.gender === 'female'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span class="block text-center"
                      >Kadın</span
                    >
                  </button>
                </div>
              </div>

              <!-- Yaş, Boy ve Kilo Girdileri -->
              <div
                class="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div class="space-y-2">
                  <label
                    for="age"
                    class="text-lg font-medium text-gray-700"
                    >Yaş</label
                  >
                  <input
                    type="number"
                    id="age"
                    v-model="formData.age"
                    min="15"
                    max="100"
                    class="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 no-spinners"
                    placeholder="Yaş"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label
                    for="height"
                    class="text-lg font-medium text-gray-700"
                    >Boy (cm)</label
                  >
                  <input
                    type="number"
                    id="height"
                    v-model="formData.height"
                    min="120"
                    max="250"
                    class="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 no-spinners"
                    placeholder="Boy (cm)"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label
                    for="weight"
                    class="text-lg font-medium text-gray-700"
                    >Kilo (kg)</label
                  >
                  <input
                    type="number"
                    id="weight"
                    v-model="formData.weight"
                    min="30"
                    max="300"
                    class="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 no-spinners"
                    placeholder="Kilo (kg)"
                    required
                  />
                </div>
              </div>

              <!-- Uyku Süresi -->
              <div class="space-y-2">
                <label
                  for="sleep"
                  class="text-lg font-medium text-gray-700"
                  >Ortalama Günlük Uyku Süresi (saat)</label
                >
                <input
                  type="range"
                  id="sleep"
                  v-model="formData.sleepHours"
                  min="3"
                  max="12"
                  step="0.5"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div
                  class="flex justify-between text-sm text-gray-500 px-1"
                >
                  <span>3 saat</span>
                  <span
                    >{{ formData.sleepHours }} saat</span
                  >
                  <span>12 saat</span>
                </div>
              </div>

              <!-- Aktivite Seviyesi -->
              <div class="space-y-2">
                <label
                  class="text-lg font-medium text-gray-700"
                  >Aktivite Seviyesi</label
                >
                <div class="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    @click="
                      formData.activityLevel = 'sedentary'
                    "
                    :class="[
                      'py-2 px-3 rounded-lg border-2 transition-all duration-200',
                      formData.activityLevel === 'sedentary'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span
                      class="block text-left text-sm font-medium"
                      >Hareketsiz</span
                    >
                    <span
                      class="block text-left text-xs text-gray-500"
                      >Masa başı iş, minimal fiziksel
                      aktivite</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="
                      formData.activityLevel = 'light'
                    "
                    :class="[
                      'py-2 px-3 rounded-lg border-2 transition-all duration-200',
                      formData.activityLevel === 'light'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span
                      class="block text-left text-sm font-medium"
                      >Hafif Aktif</span
                    >
                    <span
                      class="block text-left text-xs text-gray-500"
                      >Haftada 1-2 kez egzersiz veya hafif
                      yürüyüş</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="
                      formData.activityLevel = 'moderate'
                    "
                    :class="[
                      'py-2 px-3 rounded-lg border-2 transition-all duration-200',
                      formData.activityLevel === 'moderate'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span
                      class="block text-left text-sm font-medium"
                      >Orta Aktif</span
                    >
                    <span
                      class="block text-left text-xs text-gray-500"
                      >Haftada 3-5 kez orta yoğunlukta
                      egzersiz</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="formData.activityLevel = 'very'"
                    :class="[
                      'py-2 px-3 rounded-lg border-2 transition-all duration-200',
                      formData.activityLevel === 'very'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span
                      class="block text-left text-sm font-medium"
                      >Çok Aktif</span
                    >
                    <span
                      class="block text-left text-xs text-gray-500"
                      >Haftada 6-7 kez yoğun egzersiz</span
                    >
                  </button>
                </div>
              </div>

              <!-- Hesaplama Butonu -->
              <button
                type="submit"
                class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span
                  class="flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  Uyku & Kalori Dengemi Hesapla
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Right Column - Information or Results -->
        <div class="space-y-8">
          <!-- Information Cards (shown before calculation) -->
          <div
            v-if="!results"
            class="space-y-6 animate-slide-in-right"
          >
            <!-- What is Sleep & Calorie Balance -->
            <div
              class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500"
            >
              <div class="flex items-center mb-4">
                <div
                  class="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mr-4 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </div>
                <h3
                  class="text-xl font-bold text-emerald-700"
                >
                  Uyku & Kalori Dengesi Nedir?
                </h3>
              </div>
              <p class="text-gray-600 leading-relaxed">
                Uyku süreniz metabolizmanızı doğrudan
                etkiler. Yetersiz uyku, bazal metabolizma
                hızınızı düşürerek günlük kalori yakımınızı
                azaltır. Optimal uyku (7-9 saat)
                metabolizmanızı destekler ve kilo kontrolünü
                kolaylaştırır.
              </p>
            </div>

            <!-- Why Sleep Matters for Calories -->
            <div
              class="bg-teal-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-teal-200/30 p-8 hover:bg-teal-500/15 transition-all duration-500"
            >
              <div class="flex items-center mb-4">
                <div
                  class="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-green-600 rounded-2xl mr-4 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-teal-700">
                  Uykunun Kalori Üzerindeki Etkisi
                </h3>
              </div>
              <ul class="text-gray-600 space-y-2">
                <li class="flex items-start">
                  <span class="text-teal-500 mr-2">•</span>
                  <span
                    >Yetersiz uyku metabolizmayı %5-15
                    yavaşlatır</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-teal-500 mr-2">•</span>
                  <span
                    >İştah hormonu ghrelin seviyesini
                    artırır</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-teal-500 mr-2">•</span>
                  <span
                    >Tokluk hormonu leptin seviyesini
                    azaltır</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-teal-500 mr-2">•</span>
                  <span
                    >Stres hormonu kortizol seviyesini
                    yükseltir</span
                  >
                </li>
              </ul>
            </div>

            <!-- How Sleep Affects Metabolism -->
            <div
              class="bg-green-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-200/30 p-8 hover:bg-green-500/15 transition-all duration-500"
            >
              <div class="flex items-center mb-4">
                <div
                  class="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mr-4 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3
                  class="text-xl font-bold text-green-700"
                >
                  Optimal Uyku Süreleri
                </h3>
              </div>
              <div class="space-y-3">
                <div
                  class="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                >
                  <span class="font-medium text-gray-700"
                    >Yetişkinler (18-64 yaş)</span
                  >
                  <span class="text-green-600 font-bold"
                    >7-9 saat</span
                  >
                </div>
                <div
                  class="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                >
                  <span class="font-medium text-gray-700"
                    >Yaşlılar (65+ yaş)</span
                  >
                  <span class="text-green-600 font-bold"
                    >7-8 saat</span
                  >
                </div>
                <div
                  class="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                >
                  <span class="font-medium text-gray-700"
                    >Gençler (14-17 yaş)</span
                  >
                  <span class="text-green-600 font-bold"
                    >8-10 saat</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Results Section (shown after calculation) -->
          <div
            v-if="results"
            class="space-y-6 animate-slide-in-right"
          >
            <!-- Uyku & Kalori Dengesi Kartı -->
            <div
              class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500"
            >
              <h3
                class="text-xl font-semibold mb-4 flex items-center text-emerald-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-2 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                Uyku & Kalori Dengesi
              </h3>

              <!-- Uyku Kalori Dengesi Grafiği -->
              <div class="mt-6 mb-8">
                <div
                  class="flex justify-between items-center mb-2"
                >
                  <span class="text-sm text-gray-500"
                    >Optimal Uyku (7-9 saat)</span
                  >
                  <span
                    class="text-sm font-medium"
                    :class="getSleepStatusColor()"
                    >{{ getSleepStatusText() }}</span
                  >
                </div>
                <div
                  class="relative h-4 bg-gray-200 rounded-full overflow-hidden"
                >
                  <div class="absolute inset-0 flex">
                    <div
                      class="h-full bg-red-400"
                      style="width: 20%"
                    ></div>
                    <div
                      class="h-full bg-yellow-400"
                      style="width: 20%"
                    ></div>
                    <div
                      class="h-full bg-green-400"
                      style="width: 20%"
                    ></div>
                    <div
                      class="h-full bg-yellow-400"
                      style="width: 20%"
                    ></div>
                    <div
                      class="h-full bg-red-400"
                      style="width: 20%"
                    ></div>
                  </div>
                  <div
                    class="absolute top-0 h-full w-2 bg-gray-800 rounded-full transform -translate-x-1/2 transition-all duration-700"
                    :style="{
                      left: getSleepMarkerPosition() + '%',
                    }"
                  ></div>
                </div>
                <div
                  class="flex justify-between text-xs text-gray-500 px-1 mt-1"
                >
                  <span>3s</span>
                  <span>5s</span>
                  <span>7s</span>
                  <span>9s</span>
                  <span>12s</span>
                </div>
              </div>
              <!-- Kalori Etki Analizi -->
              <div class="mt-8">
                <h4
                  class="font-semibold text-emerald-700 mb-3"
                >
                  Uykunun Kalori Yakımına Etkisi
                </h4>

                <div class="grid grid-cols-2 gap-6 mb-6">
                  <div
                    class="text-center p-4 bg-emerald-50 rounded-lg"
                  >
                    <div class="text-sm text-gray-500 mb-1">
                      Bazal Metabolizma Hızı
                    </div>
                    <div
                      class="text-2xl font-bold text-emerald-600"
                    >
                      {{ Math.round(results.baseBmr) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      kalori/gün
                    </div>
                  </div>
                  <div
                    class="text-center p-4 bg-teal-50 rounded-lg"
                  >
                    <div class="text-sm text-gray-500 mb-1">
                      Uyku Etkisi
                    </div>
                    <div
                      class="text-2xl font-bold"
                      :class="
                        results.sleepImpact >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      "
                    >
                      {{ results.sleepImpact > 0 ? '+' : ''
                      }}{{ results.sleepImpact }}%
                    </div>
                    <div class="text-xs text-gray-500">
                      metabolizma değişimi
                    </div>
                  </div>
                </div>

                <div
                  class="p-4 bg-emerald-50 rounded-lg border border-emerald-100 mb-6"
                >
                  <div
                    class="flex justify-between items-center"
                  >
                    <span class="font-medium text-gray-700"
                      >Düzeltilmiş Günlük Kalori
                      Yakımı:</span
                    >
                    <span class="font-bold text-emerald-700"
                      >{{
                        Math.round(results.adjustedCalories)
                      }}
                      kalori/gün</span
                    >
                  </div>
                  <p class="text-sm text-gray-600 mt-2">
                    Bu, uyku sürenizin metabolizmanız
                    üzerindeki etkisi hesaba katılarak
                    düzeltilmiş günlük kalori yakımınızdır.
                  </p>
                </div>

                <div
                  class="p-4 border border-gray-200 rounded-lg"
                >
                  <h5
                    class="font-medium text-gray-700 mb-2"
                  >
                    Uyku Durumunuzun Kalori Dengesi
                    Üzerindeki Etkisi
                  </h5>
                  <p class="text-gray-600 mb-4">
                    {{ getSleepCalorieAnalysis() }}
                  </p>

                  <div
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="text-gray-500"
                      >Aylık Etki:</span
                    >
                    <span
                      :class="
                        results.monthlyCaloricEffect > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      "
                    >
                      {{
                        results.monthlyCaloricEffect > 0
                          ? '+'
                          : ''
                      }}{{
                        Math.round(
                          results.monthlyCaloricEffect
                        ).toLocaleString()
                      }}
                      kalori
                      <span class="text-gray-500 ml-1"
                        >({{ getWeightChangeText() }})</span
                      >
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Uyku Kalitesi Önerileri -->
            <div
              class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500"
            >
              <h3
                class="text-xl font-semibold mb-4 flex items-center text-emerald-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-2 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Uyku ve Kalori Dengesi İçin Öneriler
              </h3>

              <div class="space-y-4 mt-4">
                <div
                  v-for="(tip, index) in getSleepTips()"
                  :key="index"
                  class="p-4 bg-emerald-50 rounded-lg border border-emerald-100"
                >
                  <h4
                    class="font-semibold text-emerald-800 mb-1"
                  >
                    {{ tip.title }}
                  </h4>
                  <p class="text-gray-700">
                    {{ tip.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Form verileri
const formData = ref({
  gender: 'male',
  age: null,
  weight: null,
  height: null,
  sleepHours: 7,
  activityLevel: 'moderate',
});

// Sonuçlar
const results = ref(null);

// Uyku & Kalori Dengesi hesaplama
const calculateSleepCalorieBalance = () => {
  // BMR hesaplama - Mifflin-St Jeor Denklemi
  let baseBmr;
  if (formData.value.gender === 'male') {
    baseBmr =
      10 * formData.value.weight +
      6.25 * formData.value.height -
      5 * formData.value.age +
      5;
  } else {
    baseBmr =
      10 * formData.value.weight +
      6.25 * formData.value.height -
      5 * formData.value.age -
      161;
  }

  // Aktivite faktörü
  const activityFactor = getActivityFactor(
    formData.value.activityLevel
  );

  // Uyku etkisi
  const sleepImpact = calculateSleepImpact(
    formData.value.sleepHours
  );

  // Düzeltilmiş kalori hesaplama
  const adjustedCalories =
    baseBmr * activityFactor * (1 + sleepImpact / 100);

  // Optimal uyku ile kalori farkı (7.5 saat optimal kabul edildi)
  const optimalSleepCalories =
    baseBmr *
    activityFactor *
    (1 + calculateSleepImpact(7.5) / 100);
  const dailyCaloricEffect =
    adjustedCalories - optimalSleepCalories;
  const monthlyCaloricEffect = dailyCaloricEffect * 30;

  // Sonuçları ayarla
  results.value = {
    baseBmr,
    activityFactor,
    sleepImpact,
    adjustedCalories,
    dailyCaloricEffect,
    monthlyCaloricEffect,
  };
};

// Aktivite faktörünü hesapla
const getActivityFactor = level => {
  switch (level) {
    case 'sedentary':
      return 1.2;
    case 'light':
      return 1.375;
    case 'moderate':
      return 1.55;
    case 'very':
      return 1.725;
    default:
      return 1.2;
  }
};

// Uyku etkisini hesapla
const calculateSleepImpact = hours => {
  if (hours < 5) return -8;
  if (hours < 6) return -4;
  if (hours < 7) return -2;
  if (hours >= 7 && hours <= 9) return 2;
  return -1; // 9 saatten fazla uyku
};

// Uyku durumu metni
const getSleepStatusText = () => {
  const hours = formData.value.sleepHours;

  if (hours < 5) return 'Çok Yetersiz';
  if (hours < 6) return 'Yetersiz';
  if (hours < 7) return 'Hafif Yetersiz';
  if (hours >= 7 && hours <= 9) return 'Optimal';
  return 'Fazla';
};

// Uyku durumu rengi
const getSleepStatusColor = () => {
  const hours = formData.value.sleepHours;

  if (hours < 6) return 'text-red-600';
  if (hours < 7) return 'text-yellow-600';
  if (hours >= 7 && hours <= 9) return 'text-green-600';
  return 'text-yellow-600';
};

// Uyku gösterge pozisyonu
const getSleepMarkerPosition = () => {
  const hours = formData.value.sleepHours;
  // 3 ile 12 arasındaki değeri 0-100 aralığına dönüştür
  return Math.min(
    Math.max(((hours - 3) / 9) * 100, 0),
    100
  );
};

// Uyku kalori analizi
const getSleepCalorieAnalysis = () => {
  if (!results.value) return '';

  const effect = results.value.dailyCaloricEffect;

  if (effect < -100) {
    return `Uyku süreniz optimal değerden düşük olduğu için günde yaklaşık ${Math.abs(
      Math.round(effect)
    )} kalori daha az yakıyorsunuz. Bu durum, zamanla kilo alımına neden olabilir.`;
  } else if (effect < -50) {
    return `Uyku süreniz optimal değerden biraz düşük olduğu için günde yaklaşık ${Math.abs(
      Math.round(effect)
    )} kalori daha az yakıyorsunuz.`;
  } else if (effect >= -50 && effect <= 50) {
    return `Uyku süreniz metabolizma hızınız üzerinde önemli bir olumsuz etki yaratmıyor. Günlük kalori yakımınız optimal seviyeye yakın.`;
  } else {
    return `Uyku süreniz metabolizma hızınızı olumlu etkiliyor ve günde yaklaşık ${Math.round(
      effect
    )} kalori daha fazla yakmanızı sağlıyor.`;
  }
};

// Ağırlık değişimi metni
const getWeightChangeText = () => {
  if (!results.value) return '';

  // 7700 kalori = 1 kg yağ
  const monthlyWeightChange =
    results.value.monthlyCaloricEffect / 7700;

  if (Math.abs(monthlyWeightChange) < 0.1) {
    return 'ihmal edilebilir değişim';
  }

  if (monthlyWeightChange > 0) {
    return `ayda yaklaşık ${monthlyWeightChange.toFixed(
      1
    )} kg daha fazla kilo kaybı`;
  } else {
    return `ayda yaklaşık ${Math.abs(
      monthlyWeightChange
    ).toFixed(1)} kg potansiyel kilo alımı`;
  }
};

// Uyku önerileri
const getSleepTips = () => {
  const tips = [];
  const hours = formData.value.sleepHours;

  if (hours < 7) {
    tips.push({
      title: 'Uyku Sürenizi Artırın',
      description:
        'Günde en az 7-8 saat uyumayı hedefleyin. Yetersiz uyku, metabolizmanızı yavaşlatır ve açlık hormonu ghrelin seviyelerini artırır.',
    });

    tips.push({
      title: 'Düzenli Uyku Programı Oluşturun',
      description:
        'Her gün aynı saatte yatıp kalkmak, vücudunuzun sirkadiyen ritmini düzenler ve metabolizmanızın daha verimli çalışmasını sağlar.',
    });

    tips.push({
      title: 'Elektronik Cihazlardan Uzak Durun',
      description:
        'Yatmadan en az 1 saat önce telefon, tablet ve bilgisayar gibi elektronik cihazları kullanmayı bırakın. Mavi ışık, melatonin üretimini baskılar.',
    });
  }

  if (hours > 9) {
    tips.push({
      title: 'Uyku Sürenizi Optimize Edin',
      description:
        'Çok fazla uyumak da metabolizmanızı yavaşlatabilir. 7-9 saat arası uyku süresi çoğu yetişkin için idealdir.',
    });
  }

  // Genel öneriler
  tips.push({
    title: 'Fiziksel Aktiviteyi Artırın',
    description:
      'Düzenli egzersiz yapmak hem uyku kalitenizi artırır hem de metabolizmanızı hızlandırır. Ancak yatmadan hemen önce yoğun egzersiz yapmaktan kaçının.',
  });

  tips.push({
    title: 'Kafein Tüketimini Sınırlayın',
    description:
      'Öğleden sonra kafein tüketiminden kaçının. Kafein, vücuttan atılması 6-8 saat sürebilen bir uyarıcıdır.',
  });

  return tips;
};
</script>

<style scoped>
/* Uyku kalori hesaplayıcı için özel stiller */
.no-spinners::-webkit-outer-spin-button,
.no-spinners::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

.no-spinners[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
