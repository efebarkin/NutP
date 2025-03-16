<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Profil Bilgileri -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-4 mb-6">
          <div class="bg-primary-100 rounded-full p-4">
            <i class="fas fa-user text-3xl text-primary-600"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ user?.name || 'Kullanıcı' }}</h1>
            <p class="text-gray-600">{{ user?.email }}</p>
          </div>
        </div>

        <!-- İstatistikler -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2">Toplam Öğün</h3>
            <p class="text-2xl font-bold text-primary-600">{{ totalMeals }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2">Toplam Kalori</h3>
            <p class="text-2xl font-bold text-primary-600">{{ totalCalories }} kcal</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2">Son Aktivite</h3>
            <p class="text-2xl font-bold text-primary-600">{{ lastActivity }}</p>
          </div>
        </div>

        <!-- Arkadaşlar ve Mesajlar Bölümü -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <!-- Arkadaşlar Bölümü -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-bold mb-6 flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-users text-blue-500 mr-2"></i>
                Arkadaşlar
              </div>
              <button @click="fetchFriends" class="text-sm text-primary-500 hover:text-primary-700">
                <i class="fas fa-sync-alt"></i> Yenile
              </button>
            </h2>

            <div v-if="loadingFriends" class="flex justify-center py-8">
              <div
                class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"
              ></div>
            </div>

            <div v-else-if="friends.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-user-friends text-4xl mb-3 text-gray-300"></i>
              <p>Henüz arkadaşınız bulunmuyor.</p>
              <button
                @click="showAddFriendModal = true"
                class="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
              >
                <i class="fas fa-user-plus mr-2"></i> Arkadaş Ekle
              </button>
            </div>

            <div v-else class="space-y-3 max-h-80 overflow-y-auto">
              <div
                v-for="friend in friends"
                :key="friend._id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div class="flex items-center">
                  <div class="bg-primary-100 rounded-full p-2 mr-3">
                    <i class="fas fa-user text-primary-600"></i>
                  </div>
                  <div>
                    <p class="font-medium">{{ friend.name }}</p>
                    <p class="text-xs text-gray-500">{{ getUserStatus(friend._id) }}</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="startConversation(friend._id)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <i class="fas fa-comment"></i>
                  </button>
                  <button @click="removeFriend(friend._id)" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-user-minus"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-4 text-center">
              <NuxtLink to="/messages" class="text-primary-500 hover:text-primary-700 font-medium">
                <i class="fas fa-comments mr-1"></i> Tüm Mesajları Görüntüle
              </NuxtLink>
            </div>
          </div>

          <!-- Son Mesajlar Bölümü -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-bold mb-6 flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-comments text-green-500 mr-2"></i>
                Son Mesajlar
              </div>
              <button
                @click="fetchRecentConversations"
                class="text-sm text-primary-500 hover:text-primary-700"
              >
                <i class="fas fa-sync-alt"></i> Yenile
              </button>
            </h2>

            <div v-if="loadingConversations" class="flex justify-center py-8">
              <div
                class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"
              ></div>
            </div>

            <div
              v-else-if="recentConversations.length === 0"
              class="text-center py-8 text-gray-500"
            >
              <i class="fas fa-comment-slash text-4xl mb-3 text-gray-300"></i>
              <p>Henüz mesajlaşmanız bulunmuyor.</p>
              <NuxtLink
                to="/messages"
                class="mt-4 inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
              >
                <i class="fas fa-comment-dots mr-2"></i> Mesajlaşmaya Başla
              </NuxtLink>
            </div>

            <div v-else class="space-y-3 max-h-80 overflow-y-auto">
              <div
                v-for="conversation in recentConversations"
                :key="conversation._id"
                class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                @click="goToConversation(conversation._id)"
              >
                <div class="flex justify-between items-start mb-1">
                  <p class="font-medium">{{ getConversationName(conversation) }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(conversation.updatedAt) }}</p>
                </div>
                <p class="text-sm text-gray-600 truncate">{{ getLastMessage(conversation) }}</p>
                <div v-if="conversation.unreadCount > 0" class="mt-1">
                  <span class="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                    {{ conversation.unreadCount }} yeni
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 text-center">
              <NuxtLink to="/messages" class="text-primary-500 hover:text-primary-700 font-medium">
                <i class="fas fa-comments mr-1"></i> Tüm Mesajları Görüntüle
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Son Öğünler -->
        <div class="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 class="text-xl font-bold mb-6 flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-utensils text-primary-500 mr-2"></i>
              Son Öğünler
            </div>
            <button @click="fetchMeals" class="text-sm text-primary-500 hover:text-primary-700">
              <i class="fas fa-sync-alt"></i> Yenile
            </button>
          </h2>

          <div v-if="loading" class="flex justify-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"
            ></div>
          </div>

          <div v-else-if="recentMeals.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-utensils text-4xl mb-3 text-gray-300"></i>
            <p>Henüz öğün eklenmemiş</p>
            <NuxtLink
              to="/ogun"
              class="mt-4 inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Öğün Ekle
            </NuxtLink>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="meal in recentMeals"
              :key="meal._id"
              class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-300"
            >
              <div class="flex justify-between items-center mb-2">
                <div>
                  <h3 class="font-medium">{{ getMealTypeName(meal.mealType) }}</h3>
                  <p class="text-sm text-gray-500">{{ formatDate(meal.date) }}</p>
                </div>
                <div class="text-sm text-gray-600 font-medium">
                  {{ calculateTotalCalories(meal) }} kcal
                </div>
              </div>

              <div class="space-y-2">
                <div
                  v-for="food in meal.foods"
                  :key="food._id"
                  class="flex justify-between text-sm"
                >
                  <span class="flex items-center">
                    <i class="fas fa-circle text-xs text-primary-400 mr-2"></i>
                    {{ getFoodName(food.food) }}
                  </span>
                  <span class="text-gray-600">
                    {{ food.quantity.value }}{{ food.quantity.unit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Favori Besinler -->
        <div class="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 class="text-xl font-bold mb-6 flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-heart text-red-500 mr-2"></i>
              Favori Besinler
            </div>
            <NuxtLink
              to="/favoriler"
              class="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              <span>Tümünü Gör</span>
              <i class="fas fa-chevron-right ml-1"></i>
            </NuxtLink>
          </h2>

          <div v-if="loading" class="text-center py-4">
            <span class="text-gray-600">Yükleniyor...</span>
          </div>

          <div v-else-if="favorites.length === 0" class="text-center py-8">
            <i class="fas fa-heart-broken text-4xl text-gray-400 mb-2"></i>
            <p class="text-gray-600">Henüz favori besininiz yok</p>
            <NuxtLink
              to="/yiyecekler"
              class="mt-4 inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Besinleri Keşfet
            </NuxtLink>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="favorite in favorites.slice(0, 6)"
              :key="favorite.id"
              class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-300"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-medium text-lg mb-1">{{ favorite.name.tr }}</h3>
                  <p v-if="favorite.category.name?.tr" class="text-sm text-gray-500 mb-2">
                    {{ favorite.category.name.tr }}
                  </p>
                  <div class="space-y-1">
                    <p class="text-sm text-gray-600 flex items-center">
                      <i class="fas fa-fire-alt text-orange-500 mr-2"></i>
                      {{ favorite.nutrients.energy.value }} {{ favorite.nutrients.energy.unit }}
                    </p>
                    <p class="text-sm text-gray-600 flex items-center">
                      <i class="fas fa-egg text-blue-500 mr-2"></i>
                      {{ favorite.nutrients.protein.value }} {{ favorite.nutrients.protein.unit }}
                    </p>
                    <p class="text-sm text-gray-600 flex items-center">
                      <i class="fas fa-bread-slice text-yellow-500 mr-2"></i>
                      {{ favorite.nutrients.carbohydrates.value }}
                      {{ favorite.nutrients.carbohydrates.unit }}
                    </p>
                    <p class="text-sm text-gray-600 flex items-center">
                      <i class="fas fa-cheese text-green-500 mr-2"></i>
                      {{ favorite.nutrients.fat.value }} {{ favorite.nutrients.fat.unit }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-col items-end space-y-2">
                  <button
                    @click="removeFavorite(favorite.id)"
                    class="text-red-500 hover:text-red-700 transition-colors duration-200"
                    :disabled="removing[favorite.id]"
                  >
                    <i class="fas fa-heart text-xl"></i>
                  </button>
                  <button
                    @click="addToMeal(favorite)"
                    class="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors duration-200"
                  >
                    Öğüne Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Friend Search -->
        <FriendSearch />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'vue-toastification';
import { useSocketClient } from '~/composables/useSocketClient';
import { useRouter } from 'vue-router';
import FriendSearch from '~/components/FriendSearch.vue';

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const { socket, connected, getUserStatus } = useSocketClient();

// Kullanıcı bilgisi
const user = computed(() => authStore.user || {});

// Sayfa durumu
const loading = ref(true);
const error = ref(null);
const totalMeals = ref(0);
const totalCalories = ref(0);
const lastActivity = ref('Henüz aktivite yok');
const recentMeals = ref([]);
const favorites = ref([]);
const loadingFavorites = ref(false);
const removing = ref({});

// Arkadaşlar ve mesajlar için state
const friends = ref([]);
const loadingFriends = ref(false);
const showAddFriendModal = ref(false);
const recentConversations = ref([]);
const loadingConversations = ref(false);

// Arkadaşları getir
const fetchFriends = async () => {
  try {
    loading.value = true;

    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit('get_friends', {}, response => {
        if (response && response.success) {
          friends.value = response.data || [];
          loading.value = false;
        } else {
          // Socket başarısız olursa REST API'ye düş
          fetchFriendsFromAPI();
        }
      });
    } else {
      // Socket bağlantısı yoksa REST API'ye düş
      fetchFriendsFromAPI();
    }
  } catch (err) {
    console.error('Arkadaşlar getirilirken hata:', err);
    error.value = 'Arkadaşlar getirilirken bir hata oluştu';
    loading.value = false;
    friends.value = []; // Hata durumunda boş dizi
  }
};

// REST API'den arkadaşları getir
const fetchFriendsFromAPI = async () => {
  try {
    const response = await fetch('/api/users/friends', {
      headers: authStore.getAuthHeader(),
    });

    if (response.ok) {
      const data = await response.json();
      friends.value = data.friends || [];
    } else {
      console.error(`API error: ${response.status}`);
      friends.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    friends.value = []; // Hata durumunda boş dizi
  } finally {
    loading.value = false;
  }
};

// Arkadaş ekle
const addFriend = async email => {
  if (!email) return;

  try {
    const response = await fetch('/api/users/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.user?.token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Arkadaş eklenirken bir hata oluştu');
    }

    toast.success('Arkadaş başarıyla eklendi');
    fetchFriends();
    showAddFriendModal.value = false;
  } catch (error) {
    console.error('Arkadaş eklenirken hata:', error);
    toast.error(error.message || 'Arkadaş eklenirken bir hata oluştu');
  }
};

// Arkadaş kaldır
const removeFriend = async friendId => {
  if (!friendId) return;

  if (!confirm('Bu arkadaşı silmek istediğinize emin misiniz?')) {
    return;
  }

  try {
    const response = await fetch(`/api/users/friends/${friendId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.user?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Arkadaş kaldırılırken bir hata oluştu');
    }

    toast.success('Arkadaş başarıyla kaldırıldı');
    fetchFriends();
  } catch (error) {
    console.error('Arkadaş kaldırılırken hata:', error);
    toast.error('Arkadaş kaldırılırken bir hata oluştu');
  }
};

// Konuşma başlat
const startConversation = async userId => {
  if (!userId) return;

  try {
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.user?.token}`,
      },
      body: JSON.stringify({ participants: [userId] }),
    });

    if (!response.ok) {
      throw new Error('Konuşma başlatılırken bir hata oluştu');
    }

    const data = await response.json();
    router.push(`/messages?conversation=${data.conversation._id}`);
  } catch (error) {
    console.error('Konuşma başlatılırken hata:', error);
    toast.error('Konuşma başlatılırken bir hata oluştu');
  }
};

// Son konuşmaları getir
const fetchRecentConversations = async () => {
  try {
    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit('get_conversations', { limit: 5 }, response => {
        if (response && response.success) {
          recentConversations.value = response.data || [];
        } else {
          // Socket başarısız olursa REST API'ye düş
          fetchConversationsFromAPI();
        }
      });
    } else {
      // Socket bağlantısı yoksa REST API'ye düş
      fetchConversationsFromAPI();
    }
  } catch (err) {
    console.error('Konuşmalar getirilirken hata:', err);
    error.value = 'Konuşmalar getirilirken bir hata oluştu';
    recentConversations.value = []; // Hata durumunda boş dizi
  }
};

// REST API'den konuşmaları getir
const fetchConversationsFromAPI = async () => {
  try {
    const response = await fetch('/api/conversations?limit=5', {
      headers: authStore.getAuthHeader(),
    });

    if (response.ok) {
      const data = await response.json();
      recentConversations.value = data || [];
    } else {
      console.error(`API error: ${response.status}`);
      recentConversations.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    recentConversations.value = []; // Hata durumunda boş dizi
  }
};

// Konuşma adını getir
const getConversationName = conversation => {
  if (!conversation || !conversation.participants) return 'Konuşma';

  // Grup konuşması ise
  if (conversation.isGroup && conversation.name) {
    return conversation.name;
  }

  // Birebir konuşma ise
  const otherParticipant = conversation.participants.find(p => p._id !== authStore.user?._id);
  return otherParticipant ? otherParticipant.name : 'Konuşma';
};

// Son mesajı getir
const getLastMessage = conversation => {
  if (!conversation || !conversation.lastMessage) return 'Henüz mesaj yok';

  if (conversation.lastMessage.sender._id === authStore.user?._id) {
    return `Siz: ${conversation.lastMessage.content}`;
  }

  return conversation.lastMessage.content;
};

// Konuşmaya git
const goToConversation = conversationId => {
  if (!conversationId) return;
  router.push(`/messages?conversation=${conversationId}`);
};

// İstatistikler hesaplama
const updateStatistics = () => {
  totalMeals.value = recentMeals.value.length;

  totalCalories.value = recentMeals.value
    .reduce((total, meal) => {
      const mealCalories = meal.foods.reduce((mealTotal, food) => {
        const calories = food.food?.nutrients?.energy?.value || 0;
        const quantity = food.quantity?.value || 0;
        const multiplier = food.quantity?.unit === 'g' ? quantity / 100 : 1;
        return mealTotal + calories * multiplier;
      }, 0);
      return total + mealCalories;
    }, 0)
    .toFixed(0);

  const lastMeal = recentMeals.value[0];
  lastActivity.value = lastMeal ? formatDate(lastMeal.date) : 'Henüz aktivite yok';
};

// Öğünleri getir
const fetchMeals = async () => {
  try {
    const headers = authStore.getAuthHeader();
    const response = await $fetch('/api/meals/recent', {
      headers,
    });

    if (!Array.isArray(response)) {
      recentMeals.value = [];
      return;
    }

    // Öğünleri işle ve besin verilerini standardize et
    recentMeals.value = response.map(meal => {
      return {
        ...meal,
        foods: meal.foods.map(food => {
          // Besin verisini standardize et
          const standardFood = {
            _id: food._id || food.id,
            name: {
              tr: food.food?.name?.tr || food.food?.tr || food.name || 'İsimsiz',
            },
            nutrients: {
              energy: {
                value: food.food?.nutrients?.energy?.value || food.food?.calories || 0,
                unit: 'kcal',
              },
              protein: {
                value: food.food?.nutrients?.protein?.value || food.food?.protein || 0,
                unit: 'g',
              },
              fat: {
                value: food.food?.nutrients?.fat?.value || food.food?.fat || 0,
                unit: 'g',
              },
              carbohydrates: {
                value: food.food?.nutrients?.carbohydrates?.value || food.food?.carbs || 0,
                unit: 'g',
              },
            },
            quantity: {
              value: food.quantity?.value || food.quantity || 0,
              unit: food.quantity?.unit || 'g',
            },
          };
          return {
            ...food,
            food: standardFood,
          };
        }),
      };
    });
    updateStatistics();
  } catch (error) {
    console.error('Error fetching meals:', error);
    toast.error('Öğünler yüklenirken bir hata oluştu');
    recentMeals.value = [];
  }
};

// Favorileri getir
const fetchFavorites = async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/favorites', {
      headers: authStore.getAuthHeader(),
    });

    // API yanıtını kontrol et ve düzenle
    if (!response || !Array.isArray(response)) {
      favorites.value = [];
      return;
    }

    // Her bir favori besini işle
    favorites.value = response.map(fav => {
      // Temel favori objesi
      const favorite = {
        id: fav._id || fav.id,
        name: {
          tr: fav.name?.tr || fav.food?.name?.tr || fav.food?.tr || fav.name || 'İsimsiz',
        },
        category: fav.category || fav.food?.category || {},
        nutrients: {
          energy: {
            value:
              fav.nutrients?.energy?.value ||
              fav.food?.nutrients?.energy?.value ||
              fav.calories ||
              0,
            unit: 'kcal',
          },
          protein: {
            value:
              fav.nutrients?.protein?.value ||
              fav.food?.nutrients?.protein?.value ||
              fav.protein ||
              0,
            unit: 'g',
          },
          fat: {
            value: fav.nutrients?.fat?.value || fav.food?.nutrients?.fat?.value || fav.fat || 0,
            unit: 'g',
          },
          carbohydrates: {
            value:
              fav.nutrients?.carbohydrates?.value ||
              fav.food?.nutrients?.carbohydrates?.value ||
              fav.carbs ||
              0,
            unit: 'g',
          },
        },
        portionSize: {
          value: fav.portionSize?.value || fav.food?.portionSize?.value || 100,
          unit: fav.portionSize?.unit || fav.food?.portionSize?.unit || 'g',
        },
      };

      return favorite;
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    toast.error('Favoriler yüklenirken bir hata oluştu');
    favorites.value = [];
  } finally {
    loading.value = false;
  }
};

// Favori kaldır
const removeFavorite = async favoriteId => {
  try {
    removing.value[favoriteId] = true;
    await $fetch(`/api/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: authStore.getAuthHeader(),
    });
    favorites.value = favorites.value.filter(f => f.id !== favoriteId);
    toast.success('Favori başarıyla kaldırıldı');
  } catch (error) {
    console.error('Error removing favorite:', error);
    toast.error('Favori kaldırılırken bir hata oluştu');
  } finally {
    removing.value[favoriteId] = false;
  }
};

// Öğüne ekle
const addToMeal = async food => {
  try {
    await $fetch('/api/meals', {
      method: 'POST',
      body: {
        foodId: food._id,
        quantity: 1,
        mealType: 'breakfast',
        date: new Date().toISOString(),
      },
      headers: authStore.getAuthHeader(),
    });
    toast.success('Besin öğüne eklendi');
  } catch (error) {
    console.error('Error adding to meal:', error);
    toast.error('Öğüne eklenirken bir hata oluştu');
  }
};

// Yardımcı fonksiyonlar
const formatDate = date => {
  return new Date(date).toLocaleDateString('tr-TR');
};

const getMealTypeName = type => {
  const types = {
    breakfast: 'Sabah',
    lunch: 'Öğle',
    dinner: 'Akşam',
    snack: 'Ara',
  };
  return types[type] || type;
};

const calculateTotalCalories = meal => {
  if (!meal?.foods?.length) return 0;

  return meal.foods
    .reduce((total, food) => {
      const calories = food.food?.nutrients?.energy?.value || 0;
      const quantity = food.quantity?.value || 0;
      const multiplier = food.quantity?.unit === 'g' ? quantity / 100 : 1;
      return total + calories * multiplier;
    }, 0)
    .toFixed(0);
};

const getFoodName = food => {
  if (!food) return '';

  if (typeof food === 'string') {
    try {
      food = JSON.parse(food);
    } catch (e) {
      return food;
    }
  }

  // Besin verisi obje olarak gelmiş
  if (food.name) return food.name;
  if (food.tr) return food.tr;
  if (food.en) return food.en;

  return 'İsimsiz Besin';
};

// Sayfa yüklendiğinde verileri getir
onMounted(() => {
  fetchMeals();
  fetchFavorites();
  fetchFriends();
  fetchRecentConversations();
});
</script>
