<template>
  <div class="settings-page min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Ayarlar
        </h1>
        <p class="mt-2 text-gray-600">
          Hesabınızı ve uygulamanızı yönetin
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sol Sidebar - Navigasyon -->
        <div class="lg:col-span-1">
          <!-- Navigasyon Menüsü -->
          <nav
            class="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div class="p-4 border-b border-gray-200">
              <h2
                class="text-lg font-semibold text-gray-900"
              >
                Ayarlar
              </h2>
            </div>
            <ul class="py-2">
              <li
                v-for="item in navigationItems"
                :key="item.key"
              >
                <button
                  @click="setActiveSection(item.key)"
                  :class="[
                    'w-full text-left px-4 py-3 flex items-center space-x-3 transition-all duration-200 hover:bg-gray-50',
                    activeSection === item.key
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500 font-medium'
                      : 'text-gray-700',
                  ]"
                >
                  <i
                    :class="item.icon"
                    class="text-sm w-4"
                  ></i>
                  <span>{{ item.label }}</span>
                </button>
              </li>
            </ul>
          </nav>

          <!-- Kullanıcı Bilgi Kartı -->
          <div
            class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <span
                  class="text-blue-600 font-semibold text-lg"
                >
                  {{ userInitials }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-medium text-gray-900 truncate"
                >
                  {{ user?.name || 'Kullanıcı' }}
                </p>
                <p class="text-sm text-gray-500 truncate">
                  {{ user?.email }}
                </p>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100">
              <div
                class="flex justify-between text-xs text-gray-500"
              >
                <span>Üyelik</span>
                <span>{{
                  formatDate(user?.createdAt)
                }}</span>
              </div>
              <div
                class="flex justify-between text-xs text-gray-500 mt-1"
              >
                <span>Rol</span>
                <span class="capitalize">{{
                  userRole
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sağ Taraf - İçerik -->
        <div class="lg:col-span-3">
          <!-- Hesap Ayarları -->
          <div
            v-if="activeSection === 'account'"
            class="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div
              class="px-6 py-4 border-b border-gray-200 bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <i
                    class="fas fa-user text-blue-600 text-sm"
                  ></i>
                </div>
                <div>
                  <h2
                    class="text-xl font-semibold text-gray-900"
                  >
                    Hesap Ayarları
                  </h2>
                  <p class="text-sm text-gray-600">
                    Hesap bilgilerinizi ve şifrenizi yönetin
                  </p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <!-- Şifre Değiştirme -->
              <div class="mb-8">
                <div class="mb-4">
                  <h3
                    class="text-lg font-medium text-gray-900 flex items-center"
                  >
                    <i
                      class="fas fa-lock mr-2 text-gray-500"
                    ></i>
                    Şifre Değiştir
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    Hesabınızın güvenliği için düzenli
                    olarak şifrenizi güncelleyin
                  </p>
                </div>
                <div
                  class="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <PasswordChangeForm />
                </div>
              </div>

              <!-- Hesap Bilgileri -->
              <div>
                <div class="mb-4">
                  <h3
                    class="text-lg font-medium text-gray-900 flex items-center"
                  >
                    <i
                      class="fas fa-info-circle mr-2 text-gray-500"
                    ></i>
                    Hesap Bilgileri
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    Hesabınızla ilgili temel bilgiler
                  </p>
                </div>
                <div
                  class="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <dl
                    class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500"
                      >
                        Ad Soyad
                      </dt>
                      <dd
                        class="mt-1 text-sm text-gray-900"
                      >
                        {{ user?.name || 'Belirtilmemiş' }}
                      </dd>
                    </div>
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500"
                      >
                        E-posta
                      </dt>
                      <dd
                        class="mt-1 text-sm text-gray-900"
                      >
                        {{ user?.email || 'Belirtilmemiş' }}
                      </dd>
                    </div>
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500"
                      >
                        Rol
                      </dt>
                      <dd class="mt-1">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {{ userRole }}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500"
                      >
                        Üyelik Tarihi
                      </dt>
                      <dd
                        class="mt-1 text-sm text-gray-900"
                      >
                        {{ formatDate(user?.createdAt) }}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Hedefler -->
          <div
            v-if="activeSection === 'goals'"
            class="space-y-6"
          >
            <!-- Header -->
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div class="flex items-center space-x-3 mb-1">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center"
                >
                  <i
                    class="fas fa-target text-white text-lg"
                  ></i>
                </div>
                <div>
                  <h2
                    class="text-2xl font-semibold text-gray-900"
                  >
                    Günlük Hedefler
                  </h2>
                  <p class="text-gray-600">
                    Kişiselleştirilmiş hedeflerinizi yönetin
                  </p>
                </div>
              </div>
            </div>

            <!-- Goals Grid -->
            <div
              class="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <!-- Su Hedefi -->
              <div
                class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div class="p-6">
                  <div
                    class="flex items-center space-x-3 mb-4"
                  >
                    <div
                      class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
                    >
                      <i
                        class="fas fa-tint text-blue-600 text-sm"
                      ></i>
                    </div>
                    <div>
                      <h3
                        class="text-lg font-medium text-gray-900"
                      >
                        Su Hedefi
                      </h3>
                      <p class="text-sm text-gray-500">
                        Günlük hidrasyon
                      </p>
                    </div>
                  </div>
                  <WaterGoalForm />
                </div>
              </div>

              <!-- Kalori Hedefi -->
              <div
                class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div class="p-6">
                  <div
                    class="flex items-center space-x-3 mb-4"
                  >
                    <div
                      class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"
                    >
                      <i
                        class="fas fa-fire text-orange-600 text-sm"
                      ></i>
                    </div>
                    <div>
                      <h3
                        class="text-lg font-medium text-gray-900"
                      >
                        Kalori Hedefi
                      </h3>
                      <p class="text-sm text-gray-500">
                        Günlük enerji alımı
                      </p>
                    </div>
                  </div>
                  <CalorieGoalForm />
                </div>
              </div>
            </div>
          </div>

          <!-- Tercihler -->
          <div
            v-if="activeSection === 'preferences'"
            class="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div
              class="px-6 py-4 border-b border-gray-200 bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
                >
                  <i
                    class="fas fa-cog text-purple-600 text-sm"
                  ></i>
                </div>
                <div>
                  <h2
                    class="text-xl font-semibold text-gray-900"
                  >
                    Tercihler
                  </h2>
                  <p class="text-sm text-gray-600">
                    Uygulama tercihlerinizi yönetin
                  </p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="text-center py-12">
                <i
                  class="fas fa-tools text-4xl text-gray-400 mb-4"
                ></i>
                <h3
                  class="text-lg font-medium text-gray-900 mb-2"
                >
                  Yakında Gelecek
                </h3>
                <p class="text-gray-600">
                  Tercihler sekmesi geliştirilme aşamasında.
                </p>
              </div>
            </div>
          </div>

          <!-- Gizlilik -->
          <div
            v-if="activeSection === 'privacy'"
            class="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div
              class="px-6 py-4 border-b border-gray-200 bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"
                >
                  <i
                    class="fas fa-shield-alt text-red-600 text-sm"
                  ></i>
                </div>
                <div>
                  <h2
                    class="text-xl font-semibold text-gray-900"
                  >
                    Gizlilik & Güvenlik
                  </h2>
                  <p class="text-sm text-gray-600">
                    Gizlilik ayarlarınızı yönetin
                  </p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="text-center py-12">
                <i
                  class="fas fa-user-shield text-4xl text-gray-400 mb-4"
                ></i>
                <h3
                  class="text-lg font-medium text-gray-900 mb-2"
                >
                  Yakında Gelecek
                </h3>
                <p class="text-gray-600">
                  Gizlilik ayarları geliştirilme aşamasında.
                </p>
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
import { useAuthStore } from '~/stores/auth';
import PasswordChangeForm from '~/components/user/PasswordChangeForm.vue';
import WaterGoalForm from '~/components/user/WaterGoalForm.vue';
import CalorieGoalForm from '~/components/user/CalorieGoalForm.vue';

// Auth store
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Aktif section
const activeSection = ref('account');

// Navigasyon öğeleri
const navigationItems = [
  {
    key: 'account',
    label: 'Hesap',
    icon: 'fas fa-user',
  },
  {
    key: 'goals',
    label: 'Hedefler',
    icon: 'fas fa-target',
  },
  {
    key: 'preferences',
    label: 'Tercihler',
    icon: 'fas fa-cog',
  },
  {
    key: 'privacy',
    label: 'Gizlilik',
    icon: 'fas fa-shield-alt',
  },
];

// Section değiştirme
const setActiveSection = section => {
  activeSection.value = section;
};

// Kullanıcı baş harfleri (avatar için)
const userInitials = computed(() => {
  if (!user.value?.name) return '?';
  return user.value.name
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
});

// Kullanıcı rolü
const userRole = computed(() => {
  if (!user.value?.role) return 'Kullanıcı';
  if (Array.isArray(user.value.role)) {
    return user.value.role
      .map(r => r.charAt(0).toUpperCase() + r.slice(1))
      .join(', ');
  }
  return (
    user.value.role.charAt(0).toUpperCase() +
    user.value.role.slice(1)
  );
});

// Tarih formatı
const formatDate = dateString => {
  if (!dateString) return 'Bilinmiyor';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Sayfa yüklenirken oturum durumunu kontrol et
onMounted(async () => {
  try {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!authStore.authenticated) {
      await navigateTo('/login');
    }
  } catch (error) {
    console.error(
      'Ayarlar sayfası yüklenirken hata:',
      error
    );
    await navigateTo('/login');
  }
});
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 64px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
}

/* GitHub benzeri nav button hover efektleri */
.settings-page nav button {
  transition: all 0.15s ease-in-out;
}

.settings-page nav button:hover {
  background-color: #f9fafb;
  transform: translateX(2px);
}

.settings-page nav button.bg-blue-50 {
  font-weight: 500;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Modern card hover efektleri */
.settings-page .bg-white {
  transition: box-shadow 0.15s ease-in-out;
}

.settings-page .bg-white:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* İkon container hover efektleri */
.settings-page .w-8.h-8 {
  transition: transform 0.15s ease-in-out;
}

.settings-page .w-8.h-8:hover {
  transform: scale(1.05);
}

/* Form container gelişmiş styling */
.settings-page .bg-gray-50.border {
  background: linear-gradient(
    145deg,
    #f9fafb 0%,
    #f3f4f6 100%
  );
  border: 1px solid #e5e7eb;
}

.settings-page .bg-blue-50.border {
  background: linear-gradient(
    145deg,
    #eff6ff 0%,
    #dbeafe 100%
  );
  border: 1px solid #bfdbfe;
}

.settings-page .bg-orange-50.border {
  background: linear-gradient(
    145deg,
    #fff7ed 0%,
    #fed7aa 100%
  );
  border: 1px solid #fdba74;
}

/* Responsive improvements */
@media (max-width: 1024px) {
  .settings-page .grid.grid-cols-1.lg\\:grid-cols-4 {
    grid-template-columns: 1fr;
  }

  .settings-page nav {
    margin-bottom: 2rem;
  }

  .settings-page nav ul {
    display: flex;
    overflow-x: auto;
    padding: 0.5rem;
  }

  .settings-page nav li {
    flex-shrink: 0;
  }

  .settings-page nav button {
    white-space: nowrap;
    min-width: 120px;
  }
}

/* Mikro animasyonlar */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-page .lg\\:col-span-3 > div {
  animation: fadeIn 0.3s ease-out;
}

/* Badge styling */
.settings-page .inline-flex.items-center.px-2\.5 {
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* Divider styling */
.settings-page .border-t.border-gray-100 {
  border-color: rgba(229, 231, 235, 0.5);
}
</style>
