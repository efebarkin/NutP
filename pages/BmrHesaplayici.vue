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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        <h1
          class="text-6xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-6 leading-tight"
        >
          BMR Hesaplayıcı
        </h1>

        <div class="max-w-3xl mx-auto">
          <p
            class="text-xl text-gray-600 leading-relaxed mb-8"
          >
            Bazal Metabolizma Hızınızı (BMR) hesaplayın ve
            uyku sürenizin metabolizma hızınıza etkisini
            analiz edin. Kişisel özelliklerinize göre kalori
            ihtiyacınızı ve uyku-kalori dengenizi öğrenin.
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
                2M+
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
        <!-- Enhanced Form Section -->
        <div class="group">
          <div
            class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl animate-slide-in-left"
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-bold text-emerald-700 mb-2"
              >
                BMR Hesaplayın
              </h2>
              <p class="text-gray-600">
                Verilerinizi girin ve metabolizma
                analizinizi görün
              </p>
            </div>

            <form
              @submit.prevent="calculateResults"
              class="space-y-6"
            >
              <!-- Hesaplama Modu Seçimi -->
              <div class="space-y-2">
                <label
                  class="text-lg font-medium text-gray-700"
                  >Hesaplama Modu</label
                >
                <div class="flex gap-4">
                  <button
                    type="button"
                    @click="calculationMode = 'bmr'"
                    :class="[
                      'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200',
                      calculationMode === 'bmr'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span class="block text-center"
                      >Metabolizma Hızı</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="calculationMode = 'sleep'"
                    :class="[
                      'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200',
                      calculationMode === 'sleep'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span class="block text-center"
                      >Uyku & Kalori Dengesi</span
                    >
                  </button>
                </div>
              </div>

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

              <!-- Stres Seviyesi (BMR modu için) -->
              <div
                v-if="calculationMode === 'bmr'"
                class="space-y-2"
              >
                <label
                  class="text-lg font-medium text-gray-700"
                  >Stres Seviyesi</label
                >
                <div class="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    @click="formData.stressLevel = 'low'"
                    :class="[
                      'py-2 px-3 rounded-lg border-2 transition-all duration-200',
                      formData.stressLevel === 'low'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span class="block text-center text-sm"
                      >Düşük</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="
                      formData.stressLevel = 'moderate'
                    "
                    :class="[
                      'py-2 px-3 rounded-lg border-2 transition-all duration-200',
                      formData.stressLevel === 'moderate'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span class="block text-center text-sm"
                      >Orta</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="formData.stressLevel = 'high'"
                    :class="[
                      'py-2 px-3 rounded-lg border-2 transition-all duration-200',
                      formData.stressLevel === 'high'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span class="block text-center text-sm"
                      >Yüksek</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="
                      formData.stressLevel = 'very_high'
                    "
                    :class="[
                      'py-2 px-3 rounded-lg border-2 transition-all duration-200',
                      formData.stressLevel === 'very_high'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <span class="block text-center text-sm"
                      >Çok Yüksek</span
                    >
                  </button>
                </div>
              </div>

              <!-- Aktivite Seviyesi (Uyku & Kalori modu için) -->
              <div
                v-if="calculationMode === 'sleep'"
                class="space-y-2"
              >
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

              <!-- Beslenme Alışkanlıkları (BMR modu için) -->
              <div
                v-if="calculationMode === 'bmr'"
                class="space-y-2"
              >
                <label
                  class="text-lg font-medium text-gray-700"
                  >Beslenme Alışkanlıkları</label
                >
                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="regular_meals"
                      v-model="
                        formData.nutrition.regularMeals
                      "
                      class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <label
                      for="regular_meals"
                      class="ml-2 text-gray-700"
                      >Düzenli öğün tüketimi</label
                    >
                  </div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="protein_rich"
                      v-model="
                        formData.nutrition.proteinRich
                      "
                      class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <label
                      for="protein_rich"
                      class="ml-2 text-gray-700"
                      >Protein ağırlıklı beslenme</label
                    >
                  </div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="processed_food"
                      v-model="
                        formData.nutrition.processedFood
                      "
                      class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <label
                      for="processed_food"
                      class="ml-2 text-gray-700"
                      >İşlenmiş gıda tüketimi</label
                    >
                  </div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="late_night_eating"
                      v-model="
                        formData.nutrition.lateNightEating
                      "
                      class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <label
                      for="late_night_eating"
                      class="ml-2 text-gray-700"
                      >Geç saatte yemek yeme</label
                    >
                  </div>
                </div>
              </div>

              <!-- Hesaplama Butonu -->
              <button
                type="submit"
                class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {{
                    calculationMode === 'bmr'
                      ? 'Metabolizma Hızımı Hesapla'
                      : 'Uyku & Kalori Dengemi Hesapla'
                  }}
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Sağ Taraf - Bilgilendirme ve Sonuçlar -->
        <div class="space-y-6">
          <!-- Sonuçlar Bölümü -->
          <div
            v-if="results"
            class="space-y-6 animate-fade-in"
          >
            <!-- BMR Modu Sonuçları -->
            <div v-if="calculationMode === 'bmr'">
              <h2
                class="text-2xl font-bold text-gray-800 mb-6 relative inline-block"
              >
                Metabolizma Analizi Sonuçları
                <div
                  class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded"
                ></div>
              </h2>

              <!-- Ana BMR Sonucu -->
              <div
                class="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl mb-6 border border-green-100"
              >
                <div
                  class="flex flex-col md:flex-row items-center justify-between"
                >
                  <div class="mb-4 md:mb-0">
                    <p class="text-gray-600 mb-1">
                      Bazal Metabolizma Hızınız (BMR)
                    </p>
                    <div class="flex items-end">
                      <span
                        class="text-4xl font-bold text-gray-900"
                        >{{
                          Math.round(results.adjustedBmr)
                        }}</span
                      >
                      <span
                        class="text-lg text-gray-600 ml-2 mb-1"
                        >kalori/gün</span
                      >
                    </div>
                  </div>

                  <div class="flex items-center">
                    <div
                      class="w-16 h-16 rounded-full flex items-center justify-center border-4 mb-2"
                      :class="
                        getMetabolismRateColor(
                          results.totalImpact
                        )
                      "
                    >
                      <span class="text-lg font-bold"
                        >{{
                          results.totalImpact > 0
                            ? '+'
                            : ''
                        }}{{ results.totalImpact }}%</span
                      >
                    </div>
                    <div class="ml-4">
                      <p class="text-sm text-gray-500">
                        Metabolizma Hızınız
                      </p>
                      <p
                        class="font-medium"
                        :class="
                          getMetabolismRateTextColor(
                            results.totalImpact
                          )
                        "
                      >
                        {{ results.metabolismRate }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Faktörler -->
              <h3
                class="text-xl font-semibold text-gray-800 mb-4"
              >
                Metabolizma Faktörleri
              </h3>
              <div class="space-y-4">
                <div
                  v-for="(factor, index) in results.factors"
                  :key="index"
                  class="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div
                    class="flex items-center justify-between mb-2"
                  >
                    <span
                      class="font-medium text-gray-800"
                      >{{ factor.name }}</span
                    >
                    <span
                      class="font-semibold"
                      :class="
                        factor.impact > 0
                          ? 'text-green-600'
                          : factor.impact < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      "
                    >
                      {{ factor.impact > 0 ? '+' : ''
                      }}{{ factor.impact }}%
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">
                    {{ factor.description }}
                  </p>
                </div>
              </div>

              <!-- Tavsiyeler -->
              <div
                class="mt-8 bg-emerald-50 p-5 rounded-xl border border-emerald-100"
              >
                <h3
                  class="text-xl font-semibold text-emerald-800 mb-3"
                >
                  Kişisel Tavsiyeler
                </h3>
                <ul class="space-y-2 text-emerald-700">
                  <li class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2 mt-0.5 text-emerald-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      >Günde 7-9 saat uyku, metabolizma
                      hızınızı optimize etmek için
                      idealdir.</span
                    >
                  </li>
                  <li class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2 mt-0.5 text-emerald-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      >Düzenli öğünler ve protein açısından
                      zengin beslenme, metabolizmanızı
                      hızlandırabilir.</span
                    >
                  </li>
                  <li class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2 mt-0.5 text-emerald-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      >Stres yönetimi için düzenli egzersiz
                      ve meditasyon gibi aktiviteler
                      deneyin.</span
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- Uyku & Kalori Dengesi Modu Sonuçları -->
            <div v-if="calculationMode === 'sleep'">
              <h2
                class="text-2xl font-bold text-gray-800 mb-6 relative inline-block"
              >
                Uyku & Kalori Dengesi Analizi
                <div
                  class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded"
                ></div>
              </h2>

              <!-- Uyku Etkisi -->
              <div
                class="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl mb-6 border border-indigo-100"
              >
                <div
                  class="flex flex-col md:flex-row items-center justify-between"
                >
                  <div class="mb-4 md:mb-0">
                    <p class="text-gray-600 mb-1">
                      Uyku Sürenizin Metabolizma Etkisi
                    </p>
                    <div class="flex items-end">
                      <span
                        class="text-4xl font-bold"
                        :class="
                          results.sleepImpact > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        "
                      >
                        {{
                          results.sleepImpact > 0
                            ? '+'
                            : ''
                        }}{{ results.sleepImpact }}%
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">
                      {{
                        getSleepImpactDescription(
                          formData.sleepHours
                        )
                      }}
                    </p>
                  </div>

                  <div class="flex flex-col items-center">
                    <div
                      class="w-24 h-24 rounded-full flex items-center justify-center border-4 mb-2"
                      :class="
                        getSleepQualityColor(
                          formData.sleepHours
                        )
                      "
                    >
                      <span class="text-lg font-bold"
                        >{{
                          formData.sleepHours
                        }}
                        saat</span
                      >
                    </div>
                    <p class="font-medium">
                      {{
                        getSleepQualityText(
                          formData.sleepHours
                        )
                      }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Kalori Dengesi -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
              >
                <div
                  class="bg-white p-5 rounded-xl border border-gray-200"
                >
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-3"
                  >
                    Uyku Sırasında Yakılan Kalori
                  </h3>
                  <div class="flex items-end">
                    <span
                      class="text-3xl font-bold text-indigo-600"
                      >{{
                        Math.round(results.sleepCalories)
                      }}</span
                    >
                    <span
                      class="text-lg text-gray-600 ml-2 mb-1"
                      >kalori</span
                    >
                  </div>
                  <p class="text-sm text-gray-600 mt-2">
                    {{ formData.sleepHours }} saat uyku
                    süresince vücudunuzun harcadığı yaklaşık
                    kalori miktarı
                  </p>
                </div>

                <div
                  class="bg-white p-5 rounded-xl border border-gray-200"
                >
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-3"
                  >
                    Günlük Bazal Metabolizma
                  </h3>
                  <div class="flex items-end">
                    <span
                      class="text-3xl font-bold text-emerald-600"
                      >{{
                        Math.round(results.adjustedBmr)
                      }}</span
                    >
                    <span
                      class="text-lg text-gray-600 ml-2 mb-1"
                      >kalori/gün</span
                    >
                  </div>
                  <p class="text-sm text-gray-600 mt-2">
                    Uyku faktörü dahil edilmiş günlük bazal
                    metabolizma hızınız
                  </p>
                </div>
              </div>

              <!-- Aktivite Bazlı Kalori İhtiyacı -->
              <div
                class="bg-white p-5 rounded-xl border border-gray-200 mb-6"
              >
                <h3
                  class="text-lg font-semibold text-gray-800 mb-3"
                >
                  Aktivite Bazlı Günlük Kalori İhtiyacınız
                </h3>
                <div class="flex items-end">
                  <span
                    class="text-3xl font-bold text-emerald-600"
                    >{{
                      Math.round(
                        getActivityCalories(
                          results.adjustedBmr,
                          formData.activityLevel
                        )
                      )
                    }}</span
                  >
                  <span
                    class="text-lg text-gray-600 ml-2 mb-1"
                    >kalori/gün</span
                  >
                </div>
                <p class="text-sm text-gray-600 mt-2">
                  {{
                    getActivityLevelDescription(
                      formData.activityLevel
                    )
                  }}
                  aktivite seviyenize göre günlük kalori
                  ihtiyacınız
                </p>
              </div>

              <!-- Tavsiyeler -->
              <div
                class="mt-8 bg-emerald-50 p-5 rounded-xl border border-emerald-100"
              >
                <h3
                  class="text-xl font-semibold text-emerald-800 mb-3"
                >
                  Uyku & Kalori Tavsiyeleri
                </h3>
                <ul class="space-y-2 text-emerald-700">
                  <li class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2 mt-0.5 text-emerald-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      >Düzenli uyku saatleri belirleyin ve
                      her gün aynı saatte uyumaya
                      çalışın.</span
                    >
                  </li>
                  <li class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2 mt-0.5 text-emerald-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      >Yatmadan en az 2-3 saat önce yemek
                      yemeyi bırakın ve kafein tüketimini
                      sınırlayın.</span
                    >
                  </li>
                  <li class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2 mt-0.5 text-emerald-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      >Günlük aktivite seviyenize uygun
                      kalori alımını dengeleyin.</span
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Bilgilendirici Bölüm (Sonuçlar yoksa) -->
          <div
            v-else
            class="space-y-6 animate-slide-in-right"
          >
            <div
              class="bg-emerald-500/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-emerald-200/30"
            >
              <h3
                class="text-xl font-semibold text-emerald-800 mb-3 flex items-center"
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Bazal Metabolizma Hızı (BMR) Nedir?
              </h3>
              <p class="text-emerald-700 mb-4">
                Bazal Metabolizma Hızı (BMR), vücudunuzun
                tamamen dinlenme halindeyken, hayati
                fonksiyonlarını sürdürmek için harcadığı
                enerji miktarıdır. Bu, nefes alma, kan
                dolaşımı, hücre yenilenmesi ve beyin
                fonksiyonları gibi temel yaşamsal süreçleri
                kapsar.
              </p>
            </div>

            <div
              class="bg-teal-500/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-teal-200/30"
            >
              <h3
                class="text-xl font-semibold text-teal-800 mb-3 flex items-center"
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Neden Önemlidir?
              </h3>
              <p class="text-teal-700 mb-4">
                BMR, toplam günlük enerji ihtiyacınızın
                yaklaşık %60-75'ini oluşturur ve kilo
                yönetimi için önemli bir referans
                noktasıdır. Doğru BMR bilgisi ile sağlıklı
                beslenme planı oluşturabilirsiniz.
              </p>
            </div>

            <div
              class="bg-green-500/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-green-200/30"
            >
              <h3
                class="text-xl font-semibold text-green-800 mb-3 flex items-center"
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
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Nasıl Hesaplanır?
              </h3>
              <p class="text-green-700 mb-4">
                Mifflin-St Jeor denklemi kullanarak yaş,
                cinsiyet, kilo ve boy bilgilerinizle
                BMR'inizi hesaplıyoruz. Ayrıca uyku, stres
                ve beslenme alışkanlıklarınızın metabolizma
                üzerindeki etkilerini de analiz ediyoruz.
              </p>
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
  stressLevel: 'moderate',
  activityLevel: 'sedentary',
  nutrition: {
    regularMeals: false,
    proteinRich: false,
    processedFood: false,
    lateNightEating: false,
  },
});

// Hesaplama modu
const calculationMode = ref('bmr');

// Sonuçlar
const results = ref(null);

// BMR hesaplama
const calculateResults = () => {
  if (calculationMode.value === 'bmr') {
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

    // Metabolizma faktörlerini hesapla
    const factors = [];
    let totalImpactPercentage = 0;

    // Uyku faktörü
    const sleepImpact = calculateSleepImpact(
      formData.value.sleepHours
    );
    factors.push({
      name: 'Uyku Süresi',
      impact: sleepImpact,
      description: getSleepImpactDescription(
        formData.value.sleepHours
      ),
    });
    totalImpactPercentage += sleepImpact;

    // Stres faktörü
    const stressImpact = calculateStressImpact(
      formData.value.stressLevel
    );
    factors.push({
      name: 'Stres Seviyesi',
      impact: stressImpact,
      description: getStressImpactDescription(
        formData.value.stressLevel
      ),
    });
    totalImpactPercentage += stressImpact;

    // Beslenme faktörleri
    if (formData.value.nutrition.regularMeals) {
      factors.push({
        name: 'Düzenli Öğün Tüketimi',
        impact: 3,
        description:
          'Düzenli öğünler metabolizmanızı aktif tutar ve açlık moduna geçmesini engeller.',
      });
      totalImpactPercentage += 3;
    }

    if (formData.value.nutrition.proteinRich) {
      factors.push({
        name: 'Protein Ağırlıklı Beslenme',
        impact: 5,
        description:
          'Protein sindirimi daha fazla enerji gerektirir ve termik etkisi yüksektir.',
      });
      totalImpactPercentage += 5;
    }

    if (formData.value.nutrition.processedFood) {
      factors.push({
        name: 'İşlenmiş Gıda Tüketimi',
        impact: -4,
        description:
          'İşlenmiş gıdalar sindirim sistemini olumsuz etkiler ve metabolizmayı yavaşlatır.',
      });
      totalImpactPercentage -= 4;
    }

    if (formData.value.nutrition.lateNightEating) {
      factors.push({
        name: 'Geç Saatte Yemek Yeme',
        impact: -3,
        description:
          'Geç saatte yemek yemek sirkadiyen ritmi bozar ve metabolizmayı yavaşlatır.',
      });
      totalImpactPercentage -= 3;
    }

    // Düzeltilmiş BMR hesaplama
    const adjustedBmr =
      baseBmr * (1 + totalImpactPercentage / 100);

    // Sonuçları ayarla
    results.value = {
      baseBmr,
      factors,
      totalImpact: Math.round(totalImpactPercentage),
      adjustedBmr,
      metabolismRate: getMetabolismRate(
        totalImpactPercentage
      ),
    };
  } else if (calculationMode.value === 'sleep') {
    // Uyku & Kalori Dengesi hesaplama
    const sleepImpact = calculateSleepImpact(
      formData.value.sleepHours
    );
    const adjustedBmr = calculateAdjustedBmr(
      formData.value
    );
    const sleepCalories = calculateSleepCalories(
      formData.value.sleepHours,
      adjustedBmr
    );

    // Sonuçları ayarla
    results.value = {
      sleepImpact,
      adjustedBmr,
      sleepCalories,
    };
  }

  setTimeout(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Mobilde results form'un altında yer alıyor, aşağıya scroll et
      const resultsSection = document.querySelector(
        '[v-if="results"]'
      );
      if (resultsSection) {
        resultsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else {
      // Desktop'ta biraz yukarıya scroll et
      window.scrollTo({
        top: 150,
        behavior: 'smooth',
      });
    }
  }, 100);
};

// Uyku etkisini hesapla
const calculateSleepImpact = hours => {
  if (hours < 5) return -8;
  if (hours < 6) return -4;
  if (hours < 7) return -2;
  if (hours >= 7 && hours <= 9) return 2;
  return -1; // 9 saatten fazla uyku
};

// Stres etkisini hesapla
const calculateStressImpact = level => {
  switch (level) {
    case 'low':
      return 1;
    case 'moderate':
      return -2;
    case 'high':
      return -5;
    case 'very_high':
      return -8;
    default:
      return 0;
  }
};

// Uyku etkisi açıklaması
const getSleepImpactDescription = hours => {
  if (hours < 5)
    return 'Çok az uyku hormonal dengeyi bozar ve metabolizmayı yavaşlatır.';
  if (hours < 6)
    return 'Yetersiz uyku stres hormonlarını artırır ve metabolizmayı olumsuz etkiler.';
  if (hours < 7)
    return 'Hafif uyku eksikliği metabolizma hızını düşürebilir.';
  if (hours >= 7 && hours <= 9)
    return 'Optimal uyku süresi metabolizmanızı destekler.';
  return 'Fazla uyku enerji harcamasını azaltabilir.';
};

// Stres etkisi açıklaması
const getStressImpactDescription = level => {
  switch (level) {
    case 'low':
      return 'Düşük stres seviyesi metabolizmanızı olumlu etkiler.';
    case 'moderate':
      return 'Orta düzey stres kortizol seviyelerini artırabilir.';
    case 'high':
      return 'Yüksek stres kortizol seviyelerini artırır ve metabolizmayı yavaşlatır.';
    case 'very_high':
      return 'Çok yüksek stres hormonal dengeyi ciddi şekilde bozar ve metabolizmayı yavaşlatır.';
    default:
      return '';
  }
};

// Metabolizma hızı durumu
const getMetabolismRate = impact => {
  if (impact < -5) return 'slow';
  if (impact > 5) return 'fast';
  return 'normal';
};

// Metabolizma hızı metni
const getMetabolismRateText = () => {
  if (!results.value) return '';

  switch (results.value.metabolismRate) {
    case 'slow':
      return 'normalden daha yavaş';
    case 'fast':
      return 'normalden daha hızlı';
    default:
      return 'normal seviyede';
  }
};

// Metabolizma gösterge pozisyonu
const getMetabolismMarkerPosition = () => {
  if (!results.value) return 50;

  const impact = results.value.totalImpact;
  // -15 ile +15 arasındaki değeri 0-100 aralığına dönüştür
  return Math.min(
    Math.max(((impact + 15) / 30) * 100, 0),
    100
  );
};

// Düzeltilmiş BMR hesaplama
const calculateAdjustedBmr = formData => {
  // BMR hesaplama - Mifflin-St Jeor Denklemi
  let baseBmr;
  if (formData.gender === 'male') {
    baseBmr =
      10 * formData.weight +
      6.25 * formData.height -
      5 * formData.age +
      5;
  } else {
    baseBmr =
      10 * formData.weight +
      6.25 * formData.height -
      5 * formData.age -
      161;
  }

  // Metabolizma faktörlerini hesapla
  const factors = [];
  let totalImpactPercentage = 0;

  // Uyku faktörü
  const sleepImpact = calculateSleepImpact(
    formData.sleepHours
  );
  factors.push({
    name: 'Uyku Süresi',
    impact: sleepImpact,
    description: getSleepImpactDescription(
      formData.sleepHours
    ),
  });
  totalImpactPercentage += sleepImpact;

  // Stres faktörü
  const stressImpact = calculateStressImpact(
    formData.stressLevel
  );
  factors.push({
    name: 'Stres Seviyesi',
    impact: stressImpact,
    description: getStressImpactDescription(
      formData.stressLevel
    ),
  });
  totalImpactPercentage += stressImpact;

  // Beslenme faktörleri
  if (formData.nutrition.regularMeals) {
    factors.push({
      name: 'Düzenli Öğün Tüketimi',
      impact: 3,
      description:
        'Düzenli öğünler metabolizmanızı aktif tutar ve açlık moduna geçmesini engeller.',
    });
    totalImpactPercentage += 3;
  }

  if (formData.nutrition.proteinRich) {
    factors.push({
      name: 'Protein Ağırlıklı Beslenme',
      impact: 5,
      description:
        'Protein sindirimi daha fazla enerji gerektirir ve termik etkisi yüksektir.',
    });
    totalImpactPercentage += 5;
  }

  if (formData.nutrition.processedFood) {
    factors.push({
      name: 'İşlenmiş Gıda Tüketimi',
      impact: -4,
      description:
        'İşlenmiş gıdalar sindirim sistemini olumsuz etkiler ve metabolizmayı yavaşlatır.',
    });
    totalImpactPercentage -= 4;
  }

  if (formData.nutrition.lateNightEating) {
    factors.push({
      name: 'Geç Saatte Yemek Yeme',
      impact: -3,
      description:
        'Geç saatte yemek yemek sirkadiyen ritmi bozar ve metabolizmayı yavaşlatır.',
    });
    totalImpactPercentage -= 3;
  }

  // Düzeltilmiş BMR hesaplama
  return baseBmr * (1 + totalImpactPercentage / 100);
};

// Uyku kalorisi hesaplama
const calculateSleepCalories = (
  sleepHours,
  adjustedBmr
) => {
  // Uyku kalorisi hesaplama
  const sleepCalories = adjustedBmr * (sleepHours / 24);
  return sleepCalories;
};

// Aktivite seviyesine göre kalori ihtiyacı hesaplama
const getActivityCalories = (
  adjustedBmr,
  activityLevel
) => {
  switch (activityLevel) {
    case 'sedentary':
      return adjustedBmr * 1.2;
    case 'light':
      return adjustedBmr * 1.375;
    case 'moderate':
      return adjustedBmr * 1.55;
    case 'very':
      return adjustedBmr * 1.725;
    default:
      return adjustedBmr;
  }
};

// Aktivite seviyesi açıklaması
const getActivityLevelDescription = activityLevel => {
  switch (activityLevel) {
    case 'sedentary':
      return 'Hareketsiz';
    case 'light':
      return 'Hafif Aktif';
    case 'moderate':
      return 'Orta Aktif';
    case 'very':
      return 'Çok Aktif';
    default:
      return '';
  }
};

// Uyku kalitesi rengi
const getSleepQualityColor = hours => {
  if (hours < 5) return 'border-red-400';
  if (hours < 6) return 'border-orange-400';
  if (hours < 7) return 'border-yellow-400';
  if (hours >= 7 && hours <= 9) return 'border-green-400';
  return 'border-blue-400';
};

// Uyku kalitesi metni
const getSleepQualityText = hours => {
  if (hours < 5) return 'Yetersiz Uyku';
  if (hours < 6) return 'Az Uyku';
  if (hours < 7) return 'Hafif Uyku Eksikliği';
  if (hours >= 7 && hours <= 9) return 'Optimal Uyku';
  return 'Fazla Uyku';
};

// Metabolizma hızı rengi
const getMetabolismRateColor = impact => {
  if (impact < -5) return 'border-red-400';
  if (impact > 5) return 'border-green-400';
  return 'border-yellow-400';
};

// Metabolizma hızı metin rengi
const getMetabolismRateTextColor = impact => {
  if (impact < -5) return 'text-red-600';
  if (impact > 5) return 'text-green-600';
  return 'text-yellow-600';
};
</script>

<style scoped>
/* BMR hesaplayıcı için özel animasyon sınıfları */
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>