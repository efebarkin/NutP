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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>

        <h1
          class="text-6xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-6 leading-tight"
        >
          BMI Hesaplayıcı
        </h1>

        <div class="max-w-3xl mx-auto">
          <p
            class="text-xl text-gray-600 leading-relaxed mb-8"
          >
            Sağlıklı yaşamın ilk adımı, vücut kitle
            indeksinizi bilmekten geçer. Gelişmiş
            algoritmamız ile kişiselleştirilmiş sağlık
            önerilerinizi keşfedin.
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
                5M+
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
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-bold text-emerald-700 mb-2"
              >
                BMI Hesaplayın
              </h2>
              <p class="text-gray-600">
                Verilerinizi girin ve sonuçlarınızı görün
              </p>
            </div>

            <form
              @submit.prevent="handleFormSubmit"
              class="space-y-8"
            >
              <!-- Height Input with enhanced design -->
              <div class="space-y-3 group/input">
                <label
                  class="flex items-center text-lg font-semibold text-emerald-700 group-hover/input:text-emerald-600 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  Boy (cm)
                </label>
                <div class="relative">
                  <input
                    v-model.number="formData.height"
                    type="number"
                    min="100"
                    max="250"
                    class="w-full px-6 py-4 bg-white/80 backdrop-blur-md border border-emerald-200/50 rounded-2xl text-gray-700 placeholder-gray-500 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300 text-lg font-medium hover:bg-white/90 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    required
                    placeholder="Örn: 175"
                  />
                  <div
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium"
                  >
                    cm
                  </div>
                </div>
              </div>

              <!-- Weight Input with enhanced design -->
              <div class="space-y-3 group/input">
                <label
                  class="flex items-center text-lg font-semibold text-emerald-700 group-hover/input:text-teal-600 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-3m-3 3l-3-3"
                    />
                  </svg>
                  Kilo (kg)
                </label>
                <div class="relative">
                  <input
                    v-model.number="formData.weight"
                    type="number"
                    min="30"
                    max="300"
                    step="0.1"
                    class="w-full px-6 py-4 bg-white/80 backdrop-blur-md border border-emerald-200/50 rounded-2xl text-gray-700 placeholder-gray-500 focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 text-lg font-medium hover:bg-white/90 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    required
                    placeholder="Örn: 70.5"
                  />
                  <div
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium"
                  >
                    kg
                  </div>
                </div>
              </div>

              <!-- Enhanced Calculate Button -->
              <button
                type="submit"
                :disabled="
                  !formData.height || !formData.weight
                "
                class="group/btn w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white py-5 px-8 rounded-2xl text-xl font-bold hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600 transition-all duration-500 transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl hover:shadow-2xl bg-size-200 hover:bg-pos-100"
              >
                <span
                  class="flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-3 group-hover/btn:rotate-12 transition-transform duration-300"
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
                  BMI Hesapla
                  <div
                    class="ml-3 w-2 h-2 bg-white rounded-full group-hover/btn:animate-ping"
                  ></div>
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Enhanced Results Section -->
        <div
          v-if="results"
          class="space-y-6 animate-slide-in-right"
        >
          <!-- Modernized BMI Result Card -->
          <div
            class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl group/result"
          >
            <!-- Result Header -->
            <div class="text-center mb-8">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl mb-4 shadow-xl group-hover/result:scale-110 transition-transform duration-300"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3
                class="text-3xl font-bold text-emerald-700 mb-2"
              >
                BMI Sonucunuz
              </h3>
              <div
                class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto"
              ></div>
            </div>

            <!-- BMI Value Display -->
            <div class="text-center mb-8">
              <div class="relative inline-block">
                <div
                  class="text-7xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-pulse-glow"
                >
                  {{ results.bmi.toFixed(1) }}
                </div>
                <div class="absolute -top-2 -right-16">
                  <div
                    class="px-4 py-2 rounded-xl text-sm font-bold shadow-lg animate-bounce"
                    :class="getBmiModernCategoryClass()"
                  >
                    {{ getBmiCategory() }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced BMI Scale -->
            <div class="mb-8">
              <div class="relative">
                <!-- Scale Background -->
                <div
                  class="h-6 w-full rounded-full overflow-hidden flex shadow-inner bg-emerald-100/40 backdrop-blur-sm border border-emerald-200/50"
                >
                  <div
                    class="h-full bg-gradient-to-r from-blue-400 to-blue-500 flex-1 transition-all duration-1000"
                    title="Zayıf"
                  ></div>
                  <div
                    class="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex-1 transition-all duration-1000"
                    title="Normal"
                  ></div>
                  <div
                    class="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex-1 transition-all duration-1000"
                    title="Fazla Kilolu"
                  ></div>
                  <div
                    class="h-full bg-gradient-to-r from-orange-400 to-orange-500 flex-1 transition-all duration-1000"
                    title="Obez"
                  ></div>
                  <div
                    class="h-full bg-gradient-to-r from-red-400 to-red-500 flex-1 transition-all duration-1000"
                    title="Aşırı Obez"
                  ></div>
                </div>

                <!-- Enhanced BMI Marker -->
                <div
                  class="absolute -top-2 h-10 w-1 bg-emerald-600 rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-700 animate-pulse-marker"
                  :style="{
                    left: getBmiMarkerPosition() + '%',
                  }"
                >
                  <div
                    class="absolute -top-1 -left-2 w-5 h-5 bg-emerald-600 rounded-full shadow-xl border-2 border-white"
                  ></div>
                </div>
              </div>

              <!-- Scale Labels -->
              <div
                class="flex justify-between text-sm mt-3 text-gray-600 font-medium"
              >
                <span
                  class="bg-emerald-100/60 px-2 py-1 rounded-lg backdrop-blur-sm border border-emerald-200/30"
                  >16</span
                >
                <span
                  class="bg-emerald-100/60 px-2 py-1 rounded-lg backdrop-blur-sm border border-emerald-200/30"
                  >18.5</span
                >
                <span
                  class="bg-emerald-100/60 px-2 py-1 rounded-lg backdrop-blur-sm border border-emerald-200/30"
                  >25</span
                >
                <span
                  class="bg-emerald-100/60 px-2 py-1 rounded-lg backdrop-blur-sm border border-emerald-200/30"
                  >30</span
                >
                <span
                  class="bg-emerald-100/60 px-2 py-1 rounded-lg backdrop-blur-sm border border-emerald-200/30"
                  >35</span
                >
                <span
                  class="bg-emerald-100/60 px-2 py-1 rounded-lg backdrop-blur-sm border border-emerald-200/30"
                  >40</span
                >
              </div>
            </div>

            <!-- BMI Description -->
            <div
              class="bg-emerald-50/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/30"
            >
              <p
                class="text-gray-700 leading-relaxed text-lg"
              >
                {{ getBmiDescription() }}
              </p>
            </div>
          </div>

          <!-- Enhanced Health Recommendations -->
          <div
            class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl group/health"
          >
            <!-- Recommendations Header -->
            <div class="text-center mb-8">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl mb-4 shadow-xl group-hover/health:scale-110 transition-transform duration-300"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3
                class="text-3xl font-bold text-emerald-700 mb-2"
              >
                Sağlık Önerileri
              </h3>
              <div
                class="w-16 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full mx-auto"
              ></div>
            </div>

            <!-- Recommendations Content -->
            <div
              class="bg-emerald-50/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/30"
            >
              <h4
                class="text-2xl font-bold text-emerald-700 mb-6 text-center"
              >
                {{ getRecommendationTitle() }}
              </h4>

              <!-- Health Tips Grid -->
              <div class="grid gap-4">
                <div
                  v-for="(tip, index) in getHealthTips()"
                  :key="index"
                  class="group/tip bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30 hover:bg-white/80 transition-all duration-300 hover:scale-[1.02] animate-slide-in-up"
                  :style="{
                    animationDelay: index * 100 + 'ms',
                  }"
                >
                  <div class="flex items-start space-x-4">
                    <!-- Tip Icon -->
                    <div class="flex-shrink-0 mt-1">
                      <div
                        class="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg group-hover/tip:scale-110 transition-transform duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>

                    <!-- Tip Content -->
                    <div class="flex-1">
                      <p
                        class="text-gray-700 leading-relaxed group-hover/tip:text-gray-800 transition-colors duration-300"
                      >
                        {{ tip }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Call to Action -->
              <div class="mt-8 text-center">
                <div
                  class="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/30"
                >
                  <p class="text-gray-700 text-sm mb-4">
                    💡
                    <strong>Profesyonel Destek:</strong> Bu
                    öneriler genel bilgi amaçlıdır.
                    Kişiselleştirilmiş sağlık planı için bir
                    sağlık uzmanına danışmanız önerilir.
                  </p>
                  <div
                    class="flex justify-center space-x-4"
                  >
                    <div
                      class="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-emerald-200/30 text-sm text-gray-700"
                    >
                      🏥 Doktor Konsültasyonu
                    </div>
                    <div
                      class="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-emerald-200/30 text-sm text-gray-700"
                    >
                      🥗 Beslenme Uzmanı
                    </div>
                    <div
                      class="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-emerald-200/30 text-sm text-gray-700"
                    >
                      💪 Fitness Antrenörü
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Info Section (when no results) -->
        <div
          v-else
          class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl animate-slide-in-right group/info"
        >
          <!-- Info Header -->
          <div class="text-center mb-8">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl mb-4 shadow-xl group-hover/info:scale-110 transition-transform duration-300"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              class="text-3xl font-bold text-emerald-700 mb-2"
            >
              BMI Nedir?
            </h3>
            <div
              class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto"
            ></div>
          </div>

          <!-- Info Content -->
          <div class="space-y-6">
            <!-- BMI Explanation -->
            <div
              class="bg-emerald-50/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/30"
            >
              <p
                class="text-gray-700 leading-relaxed text-lg mb-4"
              >
                Vücut Kitle İndeksi (BMI), vücut
                ağırlığınızın boyunuza göre normal olup
                olmadığını değerlendirmek için kullanılan
                bir ölçüdür. BMI, kilonuzu (kg) boyunuzun
                karesine (m²) bölerek hesaplanır.
              </p>

              <!-- BMI Formula -->
              <div
                class="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30 text-center"
              >
                <div
                  class="text-2xl font-bold text-emerald-700 mb-2"
                >
                  BMI Formülü
                </div>
                <div
                  class="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                >
                  BMI = Kilo (kg) / Boy² (m²)
                </div>
              </div>
            </div>

            <!-- BMI Categories -->
            <div
              class="bg-emerald-50/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/30"
            >
              <h4
                class="text-2xl font-bold text-emerald-700 mb-6 text-center"
              >
                BMI Kategorileri
              </h4>

              <div class="grid gap-4">
                <div
                  class="flex items-center justify-between p-4 bg-emerald-50/40 backdrop-blur-sm rounded-xl border border-emerald-200/30 hover:bg-emerald-50/60 transition-all duration-300 group/cat"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full shadow-lg group-hover/cat:scale-110 transition-transform duration-300"
                    ></div>
                    <div>
                      <div
                        class="text-emerald-800 font-semibold"
                      >
                        Zayıf
                      </div>
                      <div class="text-emerald-600 text-sm">
                        Düşük vücut ağırlığı
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-teal-600 font-bold text-lg"
                  >
                    &lt; 18.5
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-4 bg-emerald-50/40 backdrop-blur-sm rounded-xl border border-emerald-200/30 hover:bg-emerald-50/60 transition-all duration-300 group/cat"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-lg group-hover/cat:scale-110 transition-transform duration-300"
                    ></div>
                    <div>
                      <div
                        class="text-emerald-800 font-semibold"
                      >
                        Normal
                      </div>
                      <div class="text-emerald-600 text-sm">
                        Sağlıklı vücut ağırlığı
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-emerald-600 font-bold text-lg"
                  >
                    18.5 - 24.9
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-4 bg-emerald-50/40 backdrop-blur-sm rounded-xl border border-emerald-200/30 hover:bg-emerald-50/60 transition-all duration-300 group/cat"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg group-hover/cat:scale-110 transition-transform duration-300"
                    ></div>
                    <div>
                      <div
                        class="text-emerald-800 font-semibold"
                      >
                        Fazla Kilolu
                      </div>
                      <div class="text-emerald-600 text-sm">
                        Normalden yüksek
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-yellow-600 font-bold text-lg"
                  >
                    25 - 29.9
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-4 bg-emerald-50/40 backdrop-blur-sm rounded-xl border border-emerald-200/30 hover:bg-emerald-50/60 transition-all duration-300 group/cat"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-lg group-hover/cat:scale-110 transition-transform duration-300"
                    ></div>
                    <div>
                      <div
                        class="text-emerald-800 font-semibold"
                      >
                        Obez (Sınıf 1)
                      </div>
                      <div class="text-emerald-600 text-sm">
                        Orta düzey obezite
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-orange-600 font-bold text-lg"
                  >
                    30 - 34.9
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-4 bg-emerald-50/40 backdrop-blur-sm rounded-xl border border-emerald-200/30 hover:bg-emerald-50/60 transition-all duration-300 group/cat"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-lg group-hover/cat:scale-110 transition-transform duration-300"
                    ></div>
                    <div>
                      <div
                        class="text-emerald-800 font-semibold"
                      >
                        Aşırı Obez (Sınıf 2-3)
                      </div>
                      <div class="text-emerald-600 text-sm">
                        Yüksek düzey obezite
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-red-600 font-bold text-lg"
                  >
                    ≥ 35
                  </div>
                </div>
              </div>
            </div>

            <!-- Important Note -->
            <div
              class="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-300/20"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h5
                    class="text-emerald-700 font-bold text-lg mb-2"
                  >
                    Önemli Not
                  </h5>
                  <p
                    class="text-emerald-600 leading-relaxed"
                  >
                    BMI, vücut yağ oranını doğrudan ölçmez
                    ve kas kütlesi, kemik yoğunluğu, genel
                    vücut kompozisyonu ve cinsiyet
                    farklılıklarını dikkate almaz. Sadece
                    genel bir değerlendirme aracıdır.
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
import { ref, computed, onMounted } from 'vue';
import {
  useDebounceFn,
  useThrottleFn,
  useMemoize,
} from '@vueuse/core';

// Form verileri
const formData = ref({
  height: null,
  weight: null,
});

// Sonuçlar
const results = ref(null);

// Performance optimizations with VueUse
const isFormValid = computed(
  () =>
    formData.value.height &&
    formData.value.weight &&
    formData.value.height >= 100 &&
    formData.value.height <= 250 &&
    formData.value.weight >= 30 &&
    formData.value.weight <= 300
);

// Memoized expensive calculations
const memoizedBMICalculation = useMemoize(
  (height, weight) => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const idealWeight =
      22 * (heightInMeters * heightInMeters);
    const weightDifference = weight - idealWeight;

    return {
      bmi,
      height,
      weight,
      idealWeight,
      weightDifference,
    };
  }
);

// Component mounted hook
onMounted(() => {
  // Component is ready
});

// Optimized form submit handler
const handleFormSubmit = useThrottleFn(() => {
  if (isFormValid.value) {
    calculateBMI();
  }
}, 1000); // Prevent rapid form submissions

// BMI hesaplama - Optimized with debouncing and memoization
const calculateBMI = useDebounceFn(() => {
  if (!isFormValid.value) {
    console.warn(
      'Form validation failed, BMI calculation skipped'
    );
    return;
  }

  // Use memoized calculation for performance
  const calculationResult = memoizedBMICalculation(
    formData.value.height,
    formData.value.weight
  );

  results.value = calculationResult;

  // Throttled scroll to results
  throttledScrollToResults();
}, 300); // Reduced debounce time for better responsiveness

// Throttled scroll function for better performance
const throttledScrollToResults = useThrottleFn(() => {
  // Only scroll if results exist and user is not already in view
  if (results.value && window.scrollY < 200) {
    window.scrollTo({
      top: 300,
      behavior: 'smooth',
    });
  }
}, 500); // Reduced throttle time

// Memoized BMI category calculation
const getBmiCategory = useMemoize(() => {
  if (!results.value) return '';
  const bmi = results.value.bmi;

  if (bmi < 18.5) return 'Zayıf';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Fazla Kilolu';
  if (bmi < 35) return 'Obez';
  return 'Aşırı Obez';
});

// Memoized BMI category class
const getBmiCategoryClass = useMemoize(() => {
  if (!results.value) return '';
  const bmi = results.value.bmi;

  if (bmi < 18.5) return 'bg-blue-100 text-blue-800';
  if (bmi < 25) return 'bg-green-100 text-green-800';
  if (bmi < 30) return 'bg-yellow-100 text-yellow-800';
  if (bmi < 35) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
});

// Memoized modern BMI category class
const getBmiModernCategoryClass = useMemoize(() => {
  if (!results.value) return '';
  const bmi = results.value.bmi;

  if (bmi < 18.5)
    return 'bg-gradient-to-r from-teal-400/80 to-cyan-500/80 text-white backdrop-blur-sm border border-teal-300/50';
  if (bmi < 25)
    return 'bg-gradient-to-r from-emerald-400/80 to-emerald-500/80 text-white backdrop-blur-sm border border-emerald-300/50';
  if (bmi < 30)
    return 'bg-gradient-to-r from-yellow-400/80 to-yellow-500/80 text-white backdrop-blur-sm border border-yellow-300/50';
  if (bmi < 35)
    return 'bg-gradient-to-r from-orange-400/80 to-orange-500/80 text-white backdrop-blur-sm border border-orange-300/50';
  return 'bg-gradient-to-r from-red-400/80 to-red-500/80 text-white backdrop-blur-sm border border-red-300/50';
});

// Memoized BMI text color
const getBmiTextColor = useMemoize(() => {
  if (!results.value) return '';
  const bmi = results.value.bmi;

  if (bmi < 18.5) return 'text-teal-600';
  if (bmi < 25) return 'text-green-600';
  if (bmi < 30) return 'text-yellow-600';
  if (bmi < 35) return 'text-orange-600';
  return 'text-red-600';
});

// Memoized BMI marker position calculation
const getBmiMarkerPosition = useMemoize(() => {
  if (!results.value) return 0;
  const bmi = results.value.bmi;
  // BMI değerini 16-40 aralığında bir yüzdeye dönüştür
  const minBmi = 16;
  const maxBmi = 40;
  const clampedBmi = Math.min(
    Math.max(bmi, minBmi),
    maxBmi
  );
  return ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 100;
});

// BMI açıklaması
const getBmiDescription = () => {
  const bmi = results.value.bmi;
  const weightDiff = Math.abs(
    results.value.weightDifference
  ).toFixed(1);

  if (bmi < 18.5) {
    return `BMI değeriniz ${bmi.toFixed(
      1
    )}, sağlıklı ağırlık aralığının altında olduğunu gösteriyor. İdeal kilonuza ulaşmak için yaklaşık ${weightDiff} kg almanız önerilir. Dengeli beslenme ve sağlıklı kilo alma stratejileri için bir sağlık uzmanına danışmanız faydalı olabilir.`;
  }
  if (bmi < 25) {
    return `Tebrikler! BMI değeriniz ${bmi.toFixed(
      1
    )}, sağlıklı ağırlık aralığında. Bu değer, boyunuz ${
      results.value.height
    } cm için ideal bir kiloda olduğunuzu gösteriyor. Dengeli beslenme ve düzenli fiziksel aktivite ile bu durumu korumaya devam edin.`;
  }
  if (bmi < 30) {
    return `BMI değeriniz ${bmi.toFixed(
      1
    )}, fazla kilolu kategorisinde olduğunuzu gösteriyor. İdeal kilonuza ulaşmak için yaklaşık ${weightDiff} kg vermeniz önerilir. Sağlıklı beslenme alışkanlıkları ve düzenli egzersiz ile ideal kilonuza ulaşabilirsiniz.`;
  }
  if (bmi < 35) {
    return `BMI değeriniz ${bmi.toFixed(
      1
    )}, obezite sınıflandırmasında olduğunuzu gösteriyor. İdeal kilonuza ulaşmak için yaklaşık ${weightDiff} kg vermeniz önerilir. Sağlık riskinizi azaltmak için bir sağlık uzmanı ile görüşmeniz ve kilo yönetimi programı oluşturmanız önerilir.`;
  }
  return `BMI değeriniz ${bmi.toFixed(
    1
  )}, ciddi obezite sınıflandırmasında olduğunuzu gösteriyor. İdeal kilonuza ulaşmak için yaklaşık ${weightDiff} kg vermeniz önerilir. Sağlık riskinizi değerlendirmek ve uygun bir kilo yönetimi programı oluşturmak için mutlaka bir sağlık uzmanına başvurun.`;
};

// Öneri başlığı
const getRecommendationTitle = () => {
  const bmi = results.value.bmi;

  if (bmi < 18.5)
    return `Sağlıklı Kilo Almak İçin Kişisel Öneriler (${results.value.height} cm boy için)`;
  if (bmi < 25)
    return `Sağlıklı Kilonuzu Korumak İçin Kişisel Öneriler`;
  return `Sağlıklı Kilo Vermek İçin Kişisel Öneriler (${Math.abs(
    results.value.weightDifference
  ).toFixed(1)} kg)`;
};

// Sağlık önerileri
const getHealthTips = () => {
  const bmi = results.value.bmi;
  const weight = results.value.weight;

  if (bmi < 18.5) {
    // Zayıf kişiler için öneriler
    const calorieNeeded = Math.round(weight * 35); // Kilo almak için günlük kalori ihtiyacı tahmini
    const proteinNeeded = Math.round(weight * 1.6); // Günlük protein ihtiyacı tahmini

    return [
      `Günlük kalori alımınızı artırın (yaklaşık ${calorieNeeded} kalori hedefleyin)`,
      `Günde en az ${proteinNeeded}g protein tüketin (et, balık, yumurta, süt ürünleri, baklagiller)`,
      `Sağlıklı yağlar içeren besinleri diyetinize ekleyin (avokado, zeytinyağı, kuruyemişler)`,
      `Günde 5-6 küçük öğün yemeyi deneyin`,
      `Kas kütlesi kazanmak için haftada 2-3 kez direnç egzersizleri yapın`,
      `Yemeklerden hemen önce su içmekten kaçının, öğünler arasında için`,
      `Aşırı kafein tüketiminden kaçının, metabolizmanızı hızlandırabilir`,
      `Yeterli uyku alın (günde 7-9 saat) ve stresi yönetin`,
    ];
  }

  if (bmi < 25) {
    // Normal kilolu kişiler için öneriler
    const waterNeeded =
      Math.round(weight * 0.033 * 10) / 10; // Günlük su ihtiyacı tahmini (L)
    const calorieNeeded = Math.round(weight * 30); // Kilo korumak için günlük kalori ihtiyacı tahmini

    return [
      `Günlük yaklaşık ${calorieNeeded} kalori alımı ile dengeli beslenmeye devam edin`,
      `Günde en az ${waterNeeded} litre su için`,
      `Haftada en az 150 dakika orta yoğunlukta fiziksel aktivite yapın`,
      `Kas kütlenizi korumak için haftada 2 kez direnç egzersizleri yapın`,
      `Sebze ve meyve tüketimini günde 5 porsiyona çıkarın`,
      `İşlenmiş gıdalar ve şeker tüketimini sınırlayın`,
      `Düzenli sağlık kontrolleri yaptırın`,
      `Stresi yönetmek için meditasyon veya yoga gibi aktiviteler deneyin`,
    ];
  }

  // Fazla kilolu veya obez kişiler için öneriler
  const weightToLose = Math.abs(
    results.value.weightDifference
  ).toFixed(1);
  const waterNeeded = Math.round(weight * 0.04 * 10) / 10; // Kilo vermek için daha fazla su (L)
  const calorieNeeded = Math.round(weight * 22); // Kilo vermek için günlük kalori ihtiyacı tahmini
  const proteinNeeded = Math.round(weight * 2); // Kas kaybını önlemek için protein

  if (bmi < 30) {
    // Fazla kilolu kişiler için öneriler
    return [
      `Hedef: ${weightToLose} kg vermek için günlük kalori alımınızı ${calorieNeeded} kaloriye düşürün`,
      `Günde en az ${waterNeeded} litre su için (açlık hissini azaltmaya yardımcı olur)`,
      `Porsiyon kontrolüne dikkat edin (tabağınızın yarısı sebze, çeyreği protein, çeyreği tam tahıl olsun)`,
      `Kas kütlenizi korumak için günde ${proteinNeeded}g protein tüketin`,
      `Haftada 3-5 gün, 30-60 dakika kardiyovasküler egzersiz yapın`,
      `Haftada 2-3 kez direnç egzersizleri yapın`,
      `İşlenmiş gıdalar, şeker ve doymuş yağ tüketimini azaltın`,
      `Öğün atlamamaya özen gösterin, düzenli beslenin`,
    ];
  }

  if (bmi < 35) {
    // Obez kişiler için öneriler
    return [
      `Hedef: ${weightToLose} kg vermek için bir beslenme uzmanı ile çalışarak günlük ${calorieNeeded} kalori civarında bir diyet planlayın`,
      `Günde ${waterNeeded} litre su için (tokluğu artırır ve metabolizmayı destekler)`,
      `Günde ${proteinNeeded}g protein tüketerek kas kaybını önleyin`,
      `Şeker, işlenmiş gıdalar ve rafine karbonhidratları diyetinizden çıkarın`,
      `Haftada 5 gün, 30-60 dakika düşük etkili kardiyovasküler egzersiz yapın (yürüyüş, yüzme)`,
      `Bir sağlık uzmanı gözetiminde direnç egzersizleri yapın`,
      `Stres yönetimi ve uyku düzenine özen gösterin`,
      `Düzenli sağlık kontrolleri yaptırın ve kan değerlerinizi takip edin`,
    ];
  }

  // Aşırı obez kişiler için öneriler
  return [
    `Hedef: ${weightToLose} kg vermek için mutlaka bir doktor ve beslenme uzmanı gözetiminde program oluşturun`,
    `Günlük kalori alımınızı ${calorieNeeded} kalori civarında tutun (uzman gözetiminde)`,
    `Günde ${waterNeeded} litre su için`,
    `Günde ${proteinNeeded}g protein tüketerek kas kaybını önleyin`,
    `Doktor onayı ile düşük etkili egzersizlere başlayın (su içi egzersizler, kısa yürüyüşler)`,
    `Eklem sağlığınızı korumak için düşük etkili aktiviteleri tercih edin`,
    `Yeme alışkanlıklarınızı değiştirmek için davranışsal terapi düşünün`,
    `Düzenli sağlık kontrolleri ile ilerlemenizi ve sağlık parametrelerinizi takip edin`,
    `Obezite ile ilişkili hastalıklar için tarama testleri yaptırın`,
  ];
};
</script>

<style scoped>
/* BMI Hesaplayıcı'ya özel CSS'ler */
/* Ortak animasyonlar ve stiller calculator-animations.css dosyasına taşındı */

/* BMI sınıfları için özel renkler */
.bmi-underweight {
  color: rgb(37 99 235);
  background-color: rgb(239 246 255);
}

.bmi-normal {
  color: rgb(22 163 74);
  background-color: rgb(240 253 244);
}

.bmi-overweight {
  color: rgb(202 138 4);
  background-color: rgb(254 252 232);
}

.bmi-obese {
  color: rgb(220 38 38);
  background-color: rgb(254 242 242);
}

/* Background size utilities for gradient animations */
.bg-size-200 {
  background-size: 200% 200%;
}

.hover\:bg-pos-100:hover {
  background-position: 100% 0;
}
</style>
