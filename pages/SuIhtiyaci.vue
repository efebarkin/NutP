<template>
  <div
    class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-green-50 py-8 relative overflow-hidden"
  >
    <!-- Water droplet background elements with emerald theme -->
    <div
      class="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <!-- Water droplets with emerald colors -->
      <div
        class="absolute top-10 left-1/4 w-8 h-8 text-emerald-500 animate-bounce-slow"
        style="animation-delay: 0.5s"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>
      <div
        class="absolute top-20 right-1/4 w-6 h-6 text-teal-400 animate-bounce-slow"
        style="animation-delay: 1s"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>
      <div
        class="absolute top-40 left-1/3 w-10 h-10 text-green-500 animate-bounce-slow"
        style="animation-delay: 1.5s"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>
      <div
        class="absolute bottom-20 right-1/3 w-7 h-7 text-emerald-300 animate-bounce-slow"
        style="animation-delay: 2s"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>
      <div
        class="absolute bottom-40 left-1/5 w-5 h-5 text-teal-400 animate-bounce-slow"
        style="animation-delay: 2.5s"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>
    </div>

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
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
              />
            </svg>
          </div>
        </div>

        <h1
          class="text-6xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-6 leading-tight"
        >
          Günlük Su İhtiyacı Hesaplama
        </h1>

        <div class="max-w-3xl mx-auto">
          <p
            class="text-xl text-gray-600 leading-relaxed mb-8"
          >
            Sağlıklı bir yaşam için günlük su ihtiyacınızı
            hesaplayın. Kişisel özelliklerinize ve aktivite
            seviyenize göre ne kadar su içmeniz gerektiğini
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
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-bold text-emerald-700 mb-2"
              >
                Su İhtiyacınızı Hesaplayın
              </h2>
              <p class="text-gray-600">
                Verilerinizi girin ve kişiselleştirilmiş
                sonuçlarınızı görün
              </p>
            </div>

            <form
              @submit.prevent="calculateWaterNeeds"
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

              <!-- Yaş Input -->
              <div class="space-y-2">
                <label
                  class="text-lg font-medium text-gray-700"
                  >Yaş</label
                >
                <input
                  v-model.number="formData.age"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 no-spinners"
                  required
                  placeholder="Yaşınızı girin"
                />
              </div>

              <!-- Kilo Input -->
              <div class="space-y-2">
                <label
                  class="text-lg font-medium text-gray-700"
                  >Kilo (kg)</label
                >
                <input
                  v-model.number="formData.weight"
                  type="number"
                  min="0"
                  step="0.1"
                  class="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 no-spinners"
                  required
                  placeholder="Kilonuzu girin"
                />
              </div>

              <!-- Aktivite Seviyesi -->
              <div class="space-y-2">
                <label
                  class="text-lg font-medium text-gray-700"
                  >Aktivite Seviyesi</label
                >
                <select
                  v-model="formData.activityLevel"
                  class="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  required
                >
                  <option value="sedentary">
                    Hareketsiz (Masa başı iş)
                  </option>
                  <option value="light">
                    Hafif Aktivite (Haftada 1-3 gün
                    egzersiz)
                  </option>
                  <option value="moderate">
                    Orta Aktivite (Haftada 3-5 gün egzersiz)
                  </option>
                  <option value="active">
                    Aktif (Haftada 6-7 gün egzersiz)
                  </option>
                  <option value="very_active">
                    Çok Aktif (Günde 2 kez egzersiz/fiziksel
                    iş)
                  </option>
                </select>
              </div>

              <!-- İklim Koşulları -->
              <div class="space-y-2">
                <label
                  class="text-lg font-medium text-gray-700"
                  >İklim Koşulları</label
                >
                <select
                  v-model="formData.climate"
                  class="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  required
                >
                  <option value="normal">Normal</option>
                  <option value="hot">
                    Sıcak ve Nemli
                  </option>
                  <option value="cold">Soğuk</option>
                </select>
              </div>

              <!-- Hesapla Butonu -->
              <button
                type="submit"
                class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-500/50 shadow-lg"
              >
                <span
                  class="flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                    />
                  </svg>
                  Su İhtiyacımı Hesapla
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Sonuçlar Bölümü -->
        <div
          v-if="results"
          class="space-y-6 animate-fade-in"
          style="animation-delay: 300ms"
        >
          <!-- Su İhtiyacı Kartı -->
          <div
            class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl"
          >
            <h3
              class="text-xl font-semibold mb-4 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2 text-emerald-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                />
              </svg>
              Günlük Su İhtiyacınız
            </h3>
            <div
              class="flex items-center justify-between mb-4"
            >
              <span
                class="text-3xl font-bold text-emerald-600"
              >
                {{ results.waterInLiters.toFixed(1) }} Litre
              </span>
              <span
                class="text-lg font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700"
              >
                {{ results.waterInGlasses }} Bardak
              </span>
            </div>
            <div
              class="w-full bg-gray-200 rounded-full h-2.5 mb-6"
            >
              <div
                class="h-2.5 bg-emerald-600 rounded-full transition-all duration-1000"
                :style="{
                  width: `${Math.min(
                    100,
                    (results.waterInLiters / 4) * 100
                  )}%`,
                }"
              ></div>
            </div>
            <p class="text-gray-600 mb-4">
              Bu miktar, vücut ağırlığınız, yaşınız,
              cinsiyetiniz, aktivite seviyeniz ve iklim
              koşullarınıza göre hesaplanmıştır.
            </p>

            <!-- Su Tüketim Önerileri -->
            <div
              class="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100"
            >
              <h4
                class="font-semibold text-emerald-800 mb-2"
              >
                Su Tüketim Önerileri
              </h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-emerald-500 mt-0.5 flex-shrink-0"
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
                  <span
                    >Güne bir bardak su ile başlayın -
                    metabolizmanızı harekete geçirir.</span
                  >
                </li>
                <li class="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-emerald-500 mt-0.5 flex-shrink-0"
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
                  <span
                    >Her öğün sırasında ve sonrasında su
                    için.</span
                  >
                </li>
                <li class="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-emerald-500 mt-0.5 flex-shrink-0"
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
                  <span
                    >Egzersiz öncesi, sırası ve sonrasında
                    su tüketiminizi artırın.</span
                  >
                </li>
                <li class="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-emerald-500 mt-0.5 flex-shrink-0"
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
                  <span
                    >Yanınızda her zaman su şişesi
                    bulundurun.</span
                  >
                </li>
              </ul>
            </div>
          </div>

          <!-- Su Tüketiminin Faydaları -->
          <div
            class="bg-emerald-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-8 hover:bg-emerald-500/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl"
          >
            <h3
              class="text-xl font-semibold mb-4 flex items-center"
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Yeterli Su Tüketiminin Faydaları
            </h3>
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <div
                class="p-4 bg-emerald-50 rounded-lg border border-emerald-100 transition-all duration-300 hover:shadow-md"
              >
                <h4
                  class="font-semibold text-emerald-800 mb-2"
                >
                  Fiziksel Sağlık
                </h4>
                <ul class="space-y-1 text-gray-700">
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-emerald-500 rounded-full mr-2"
                    ></div>
                    <span
                      >Toksinlerin atılmasını sağlar</span
                    >
                  </li>
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-emerald-500 rounded-full mr-2"
                    ></div>
                    <span>Eklem ağrılarını azaltır</span>
                  </li>
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-emerald-500 rounded-full mr-2"
                    ></div>
                    <span>Vücut ısısını düzenler</span>
                  </li>
                </ul>
              </div>
              <div
                class="p-4 bg-teal-50 rounded-lg border border-teal-100 transition-all duration-300 hover:shadow-md"
              >
                <h4
                  class="font-semibold text-teal-800 mb-2"
                >
                  Zihinsel Performans
                </h4>
                <ul class="space-y-1 text-gray-700">
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-teal-500 rounded-full mr-2"
                    ></div>
                    <span>Konsantrasyonu artırır</span>
                  </li>
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-teal-500 rounded-full mr-2"
                    ></div>
                    <span>Hafızayı güçlendirir</span>
                  </li>
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-teal-500 rounded-full mr-2"
                    ></div>
                    <span>Ruh halini iyileştirir</span>
                  </li>
                </ul>
              </div>
              <div
                class="p-4 bg-green-50 rounded-lg border border-green-100 transition-all duration-300 hover:shadow-md"
              >
                <h4
                  class="font-semibold text-green-800 mb-2"
                >
                  Cilt Sağlığı
                </h4>
                <ul class="space-y-1 text-gray-700">
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-green-500 rounded-full mr-2"
                    ></div>
                    <span>Cildi nemlendirir</span>
                  </li>
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-green-500 rounded-full mr-2"
                    ></div>
                    <span>Akne oluşumunu azaltır</span>
                  </li>
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-green-500 rounded-full mr-2"
                    ></div>
                    <span>Erken yaşlanmayı önler</span>
                  </li>
                </ul>
              </div>
              <div
                class="p-4 bg-emerald-50 rounded-lg border border-emerald-100 transition-all duration-300 hover:shadow-md"
              >
                <h4
                  class="font-semibold text-emerald-800 mb-2"
                >
                  Sindirim Sistemi
                </h4>
                <ul class="space-y-1 text-gray-700">
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-emerald-500 rounded-full mr-2"
                    ></div>
                    <span>Kabızlığı önler</span>
                  </li>
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-emerald-500 rounded-full mr-2"
                    ></div>
                    <span>Sindirime yardımcı olur</span>
                  </li>
                  <li class="flex items-center">
                    <div
                      class="w-2 h-2 bg-emerald-500 rounded-full mr-2"
                    ></div>
                    <span>Metabolizmayı hızlandırır</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Bilgilendirici Bölüm (Sonuçlar yoksa) -->
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
              Su İhtiyacı Neden Önemli?
            </h3>
            <div
              class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto"
            ></div>
          </div>

          <!-- Info Content -->
          <div class="space-y-6">
            <!-- Info Explanation -->
            <div
              class="bg-emerald-50/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/30"
            >
              <p
                class="text-gray-700 leading-relaxed text-lg mb-4"
              >
                Vücudumuzun yaklaşık %60'ı sudan oluşur. Su,
                vücudumuzun düzgün çalışması için hayati
                öneme sahiptir. Yeterli su tüketimi:
              </p>

              <!-- Importance Points -->
              <div class="space-y-4">
                <div
                  class="group/tip bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30 hover:bg-white/80 transition-all duration-300 hover:scale-[1.02] animate-slide-in-up"
                >
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 mt-1">
                      <div
                        class="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg group-hover/tip:scale-110 transition-transform duration-300"
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p
                        class="text-gray-700 leading-relaxed group-hover/tip:text-gray-800 transition-colors duration-300"
                      >
                        Vücut sıcaklığını düzenler ve
                        termoregülasyonu sağlar
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="group/tip bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30 hover:bg-white/80 transition-all duration-300 hover:scale-[1.02] animate-slide-in-up"
                  style="animation-delay: 100ms"
                >
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 mt-1">
                      <div
                        class="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg group-hover/tip:scale-110 transition-transform duration-300"
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
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p
                        class="text-gray-700 leading-relaxed group-hover/tip:text-gray-800 transition-colors duration-300"
                      >
                        Besin fonksiyonlarını destekler ve
                        konsantrasyonu artırır
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="group/tip bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30 hover:bg-white/80 transition-all duration-300 hover:scale-[1.02] animate-slide-in-up"
                  style="animation-delay: 200ms"
                >
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 mt-1">
                      <div
                        class="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg group-hover/tip:scale-110 transition-transform duration-300"
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
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p
                        class="text-gray-700 leading-relaxed group-hover/tip:text-gray-800 transition-colors duration-300"
                      >
                        Toksinlerin atılmasına yardımcı olur
                        ve böbrek sağlığını destekler
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="group/tip bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30 hover:bg-white/80 transition-all duration-300 hover:scale-[1.02] animate-slide-in-up"
                  style="animation-delay: 300ms"
                >
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 mt-1">
                      <div
                        class="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg group-hover/tip:scale-110 transition-transform duration-300"
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
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p
                        class="text-gray-700 leading-relaxed group-hover/tip:text-gray-800 transition-colors duration-300"
                      >
                        Cildi nemlendirir ve sağlıklı tutar,
                        erken yaşlanmayı önler
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="group/tip bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30 hover:bg-white/80 transition-all duration-300 hover:scale-[1.02] animate-slide-in-up"
                  style="animation-delay: 400ms"
                >
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 mt-1">
                      <div
                        class="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg group-hover/tip:scale-110 transition-transform duration-300"
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p
                        class="text-gray-700 leading-relaxed group-hover/tip:text-gray-800 transition-colors duration-300"
                      >
                        Eklemleri yağlar ve korur, kas
                        performansını artırır
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
                    💧
                    <strong>Başlamak için:</strong> Kişisel
                    bilgilerinizi girin ve günlük su
                    ihtiyacınızı hesaplayın. Sağlıklı bir
                    yaşam için yeterli su tüketimi çok
                    önemlidir.
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
import { ref, onMounted } from 'vue';

// Form verileri
const formData = ref({
  gender: 'male',
  age: null,
  weight: null,
  activityLevel: 'moderate',
  climate: 'normal',
});

// Sonuçlar
const results = ref(null);
const isInitialRender = ref(true);

// Component mounted hook to prevent double rendering
onMounted(() => {
  // Set a small timeout to ensure the component is fully mounted
  setTimeout(() => {
    isInitialRender.value = false;
  }, 100);
});

// Su ihtiyacını hesapla
const calculateWaterNeeds = () => {
  // Prevent calculation during initial render
  if (isInitialRender.value) return;
  // Temel hesaplama: Vücut ağırlığı (kg) * 0.033 = Su ihtiyacı (L)
  let waterNeeds = formData.value.weight * 0.033;

  // Yaş faktörü
  if (formData.value.age < 30) {
    waterNeeds *= 1.1; // Genç yetişkinler için %10 artış
  } else if (formData.value.age > 55) {
    waterNeeds *= 0.95; // Yaşlı yetişkinler için %5 azalma
  }

  // Cinsiyet faktörü
  if (formData.value.gender === 'female') {
    waterNeeds *= 0.95; // Kadınlar için %5 azalma
  }

  // Aktivite seviyesi faktörü
  switch (formData.value.activityLevel) {
    case 'sedentary':
      waterNeeds *= 0.9;
      break;
    case 'light':
      waterNeeds *= 1.0;
      break;
    case 'moderate':
      waterNeeds *= 1.1;
      break;
    case 'active':
      waterNeeds *= 1.2;
      break;
    case 'very_active':
      waterNeeds *= 1.3;
      break;
  }

  // İklim faktörü
  switch (formData.value.climate) {
    case 'hot':
      waterNeeds *= 1.2; // Sıcak iklimde %20 artış
      break;
    case 'cold':
      waterNeeds *= 0.95; // Soğuk iklimde %5 azalma
      break;
  }

  // Bardak sayısı (1 bardak = 250 ml)
  const glassesOfWater = Math.round(waterNeeds * 4);

  // Sonuçları güncelle
  results.value = {
    waterInLiters: waterNeeds,
    waterInGlasses: glassesOfWater,
  };

  // Sayfayı sonuçlara doğru kaydır
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
</script>

<style scoped>
/* Su İhtiyacı sayfasına özel CSS'ler */
/* Ortak animasyonlar ve stiller calculator-animations.css dosyasına taşındı */

/* Su damlaları için özel animasyon (water-specific) */
.water-droplets .droplet {
  opacity: 0.6;
  transform-origin: center bottom;
}

.water-droplets .droplet:hover {
  opacity: 1;
  transform: scale(1.1);
}
</style>
