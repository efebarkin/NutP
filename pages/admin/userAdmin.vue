<template>
  <div>
    <!-- Action Bar -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="relative w-full sm:w-64">
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Kullanıcı ara..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="applyFiltersAndSearch"
          >
          <div class="absolute left-3 top-2.5 text-gray-400">
            <i class="fas fa-search"></i>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <button 
            @click="showFilters = !showFilters"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors relative"
          >
            <i class="fas fa-filter mr-2"></i>
            <span>Filtrele</span>
            <span v-if="activeFilterCount > 0" class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ activeFilterCount }}
            </span>
          </button>
          <button 
            @click="applyFiltersAndSearch"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <i class="fas fa-search mr-2"></i>
            <span>Ara</span>
          </button>
          <button 
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <i class="fas fa-plus"></i>
            <span>Yeni Ekle</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Filters Panel -->
    <div v-if="showFilters" class="bg-white rounded-lg shadow-sm p-4 mb-6 transition-all duration-300 ease-in-out">
      <div class="mb-3 border-b border-gray-200 pb-2">
        <h3 class="text-lg font-medium text-gray-800">Gelişmiş Filtreler</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Rol Filtresi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Rolü</label>
          <select 
            v-model="filters.role" 
            class="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tümü</option>
            <option value="admin">Admin</option>
            <option value="user">Kullanıcı</option>
            <option value="nutritionist">Diyetisyen</option>
            <option value="trainer">Antrenör</option>
          </select>
        </div>
        
        <!-- Durum Filtresi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
          <select 
            v-model="filters.status" 
            class="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tümü</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>
        
        <!-- Tarih Aralığı Filtresi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
          <div class="flex space-x-2">
            <div class="flex-1">
              <input 
                type="date" 
                v-model="filters.dateFrom" 
                class="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Başlangıç"
              >
            </div>
            <div class="flex-1">
              <input 
                type="date" 
                v-model="filters.dateTo" 
                class="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bitiş"
              >
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-4 flex justify-end space-x-2">
        <button 
          @click="resetFilters" 
          class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <i class="fas fa-times mr-2"></i>
          Filtreleri Temizle
        </button>
        <button 
          @click="applyFiltersAndSearch" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <i class="fas fa-check mr-2"></i>
          Uygula
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ users.length }}</h3>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <i class="fas fa-users text-blue-600"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Aktif Kullanıcılar</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ activeUsers }}</h3>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <i class="fas fa-user-check text-green-600"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Son Kayıt</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ lastRegistrationDate }}</h3>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <i class="fas fa-calendar-alt text-purple-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">Kullanıcı Listesi</h2>
        <span class="text-sm text-gray-500">Toplam: {{ users.length }} kullanıcı</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-1 cursor-pointer" @click="sortBy('name')">
                  <span>Kullanıcı</span>
                  <i class="fas fa-sort text-gray-400"></i>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-1 cursor-pointer" @click="sortBy('email')">
                  <span>E-posta</span>
                  <i class="fas fa-sort text-gray-400"></i>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-1">
                  <span>Rol</span>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-1">
                  <span>Durum</span>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-1 cursor-pointer" @click="sortBy('createdAt')">
                  <span>Kayıt Tarihi</span>
                  <i class="fas fa-sort text-gray-400"></i>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-10 text-center">
                <div class="flex justify-center">
                  <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
                <p class="mt-2 text-sm text-gray-500">Kullanıcılar yükleniyor...</p>
              </td>
            </tr>
            <tr v-else-if="!loading && users.length === 0">
              <td colspan="6" class="px-6 py-10 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="bg-gray-100 rounded-full p-3">
                    <i class="fas fa-search text-gray-400 text-xl"></i>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    {{ searchTerm ? 'Eşleşen kullanıcı bulunamadı.' : 'Gösterilecek kullanıcı yok.' }}
                  </p>
                  <button v-if="searchTerm" @click="searchTerm = ''; fetchUsers()" class="mt-2 text-sm text-blue-600 hover:text-blue-700">
                    Aramayı Temizle
                  </button>
                </div>
              </td>
            </tr>
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img v-if="user.profilePicture" :src="user.profilePicture" class="h-full w-full object-cover" alt="Kullanıcı fotoğrafı" @error="handleImageError($event, user)" />
                    <i v-else class="fas fa-user text-gray-500"></i>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name || 'İsimsiz Kullanıcı' }}</div>
                    <div class="text-xs text-gray-500">ID: {{ user._id.substring(0, 8) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getRoleBadgeClass(user.role)">
                  {{ getRoleName(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusBadgeClass(user.isActive)">
                  {{ user.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-3">
                  <button 
                    @click="openEditModal(user._id)" 
                    class="text-gray-500 hover:text-gray-700 transition-colors" 
                    title="Düzenle"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="text-gray-500 hover:text-gray-700 transition-colors" title="Detaylar">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="confirmDeleteUser(user._id)" 
                    class="text-red-500 hover:text-red-700 transition-colors"
                    title="Sil"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Sayfa 1 / 1
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Önceki
          </button>
          <button class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Sonraki
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'vue-toastification';
import { useHead } from '#app';
import role from '~/middleware/role';

useHead({ titleTemplate: '%s | Kullanıcı Yönetimi' });

// Toast kullanımı
const toast = useToast();

// Reactive durumlar
const users = ref([]);
const loading = ref(false);
const searchTerm = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingUserId = ref(null);
const sortConfig = ref({ key: 'createdAt', direction: 'desc' });
const showFilters = ref(false);

// Filtreleme durumları
const filters = ref({
  role: '',
  status: '',
  dateFrom: '',
  dateTo: ''
});

// Aktif filtre sayısı
const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.value.role) count++;
  if (filters.value.status) count++;
  if (filters.value.dateFrom) count++;
  if (filters.value.dateTo) count++;
  return count;
});

// Hesaplanan özellikler
const activeUsers = computed(() => {
  return users.value.filter(user => user.isActive).length;
});

const lastRegistrationDate = computed(() => {
  if (users.value.length === 0) return '-';
  
  // En son kaydolan kullanıcıyı bul
  const sortedUsers = [...users.value].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  return formatDate(sortedUsers[0].createdAt);
});

// Filtreleri sıfırla
function resetFilters() {
  filters.value = {
    role: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  };
  applyFiltersAndSearch();
}

// Filtreleri ve aramayı uygula
function applyFiltersAndSearch() {
  fetchUsers(searchTerm.value, filters.value);
}

// Bileşen yüklendiğinde CSRF token al ve kullanıcıları çek
onMounted(async () => {
  // Auth store'u çağır
  const authStore = useAuthStore();
  
  // CSRF token'i kontrol et, yoksa al
  if (!authStore.csrfToken) {
    await authStore.fetchCsrfToken();
  }
  
  await fetchUsers();
});

// Kullanıcıları API'den çeken fonksiyon
async function fetchUsers(searchQuery = '', filterParams = {}) {
  loading.value = true;
  try {
    // API endpoint'ine query parametreleri ekle
    const params = new URLSearchParams();
    
    // Arama parametresi
    if (searchQuery && searchQuery.trim() !== '') {
      params.append('search', searchQuery.trim());
    }
    
    // Filtreleme parametreleri
    if (filterParams.role) {
      params.append('role', filterParams.role);
    }
    
    if (filterParams.status) {
      params.append('status', filterParams.status);
    }
    
    if (filterParams.dateFrom) {
      params.append('dateFrom', filterParams.dateFrom);
    }
    
    if (filterParams.dateTo) {
      params.append('dateTo', filterParams.dateTo);
    }
    
    // Auth store'dan CSRF token al
    const authStore = useAuthStore();
    
    // Endpoint'i oluştur ve API'yi çağır
    const response = await fetch(`/api/user/users${params.toString() ? '?' + params.toString() : ''}`, {
      headers: {
        'Authorization': authStore.token,
        'X-CSRF-Token': authStore.csrfToken
      }
    });
    
    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API'den gelen yanıtı işle
    if (data && data.users) {
      console.log('Kullanıcılar yüklendi:', data.users.length);
      users.value = data.users;
    } else {
      console.warn('API beklenmeyen format döndürdü:', data);
      users.value = [];
    }
  } catch (err) {
    console.error('Kullanıcıları getirirken hata:', err);
    showToast('error', 'Kullanıcıları getirirken bir hata oluştu.');
    users.value = [];
  } finally {
    loading.value = false;
  }
}


// Sıralama fonksiyonu
function sortBy(key) {
  if (sortConfig.value.key === key) {
    // Aynı sütuna tekrar tıklandığında sıralamayı tersine çevir
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    // Farklı bir sütuna tıklandığında varsayılan olarak artan sıralama yap
    sortConfig.value.key = key;
    sortConfig.value.direction = 'asc';
  }
  
  // Sıralama uygula
  users.value.sort((a, b) => {
    let valueA, valueB;
    
    // Özel durumlar için değerleri al
    if (key === 'name') {
      valueA = a.name || '';
      valueB = b.name || '';
    } else if (key === 'createdAt') {
      valueA = new Date(a.createdAt || 0);
      valueB = new Date(b.createdAt || 0);
    } else {
      valueA = a[key] || '';
      valueB = b[key] || '';
    }
    
    // Karşılaştırma yap
    if (valueA < valueB) {
      return sortConfig.value.direction === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortConfig.value.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// Kullanıcı silme onayı
function confirmDeleteUser(id) {
  if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
    deleteUser(id);
  }
}

// Kullanıcı silme fonksiyonu
async function deleteUser(id) {
  try {
    // Auth store'dan CSRF token al
    const authStore = useAuthStore();
    
    const response = await fetch(`/api/user/${id}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': authStore.csrfToken
      }
    });
    
    // Önce response.ok kontrolü yap
    if (!response.ok) {
      throw new Error(`Silme işlemi başarısız: ${response.status}`);
    }
    
    // Yanıtı JSON olarak çöz
    const result = await response.json();
    
    // API'den dönen user objesi varsa işlem başarılı kabul edilir
    if (result.user) {
      // Başarıyla silindi, listeyi yeniden çek
      await fetchUsers(searchTerm.value); 
      showToast('success', 'Kullanıcı başarıyla silindi.');
    } else {
      showToast('error', 'Kullanıcı bulunamadı veya silme işlemi başarısız oldu.');
    }
  } catch (err) {
    console.error('Silme hatası:', err);
    showToast('error', 'Silme sırasında bir hata oluştu: ' + (err.message || ''));
  }
}

// Düzenleme modalını açma fonksiyonu
function openEditModal(id) {
  editingUserId.value = id;
  showEditModal.value = true;
  // Burada kullanıcı detaylarını getirme kodunu ekleyebilirsiniz
}

// Resim yükleme hatasını işleyen fonksiyon
function handleImageError(event, user) {
  console.error(`Fotoğraf yükleme hatası (${user._id}):`, user.profilePicture);
  // Hatalı resim için varsayılan ikon göster
  event.target.style.display = 'none';
}

// Yardımcı fonksiyonlar
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getRoleName(role) {
  const roleMap = {
    'admin': 'Admin',
    'user': 'Kullanıcı',
    'nutritionist': 'Diyetisyen',
    'trainer': 'Antrenör'
  };
  return roleMap[role] || role;
}

function getRoleBadgeClass(role) {
  const classMap = {
    'admin': 'bg-purple-100 text-purple-800',
    'user': 'bg-blue-100 text-blue-800',
    'nutritionist': 'bg-green-100 text-green-800',
    'trainer': 'bg-yellow-100 text-yellow-800'
  };
  return classMap[role] || 'bg-gray-100 text-gray-800';
}

function getStatusBadgeClass(isActive) {
  return isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
}

function showToast(type, message) {
  toast[type](message, {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
  });
}

// FontAwesome ikonları için CDN linki
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    }
  ]
});

// Middleware ile admin yetkilendirmesi eklemek iyi olur
definePageMeta({
  middleware: role(['admin']),
  layout: 'admin', // Admin layout kullan
  pageTransition: {
    name: 'page',
    mode: 'out-in',
    onBeforeEnter: () => {
      // Sayfa geçişi başlamadan önce içeriğin yüklenmesini bekle
      return new Promise(resolve => {
        nextTick(() => {
          // İçerik yüklendiğinde resolve et
          resolve();
        });
      });
    }
  }
});
</script>

<style scoped>
/* Modern scrollbar için stiller */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>