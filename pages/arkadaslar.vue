<template>
  <div class="container mx-auto py-8 px-4">
    <div v-if="!authStore.authenticated">
      <div class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div
          class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <i class="fas fa-lock text-3xl text-red-500"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Erişim Engellendi</h2>
        <p class="text-gray-600 mb-6">
          Bu sayfayı görüntüleyebilmek için giriş yapmanız gerekmektedir.
        </p>
        <NuxtLink
          to="/auth/login"
          class="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Giriş Yap
        </NuxtLink>
      </div>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-8 text-gray-800 flex items-center">
        <i class="fas fa-users text-green-500 mr-3"></i>
        Arkadaşlarım
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Sol Taraf - Arkadaş Listesi -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <h2 class="text-xl font-semibold flex items-center">
                <i class="fas fa-user-friends mr-2"></i>
                Arkadaşlarım
                <span class="ml-2 bg-white text-green-600 text-sm py-1 px-2 rounded-full">
                  {{ friends.length }}
                </span>
              </h2>
            </div>

            <div class="p-6">
              <div v-if="loading" class="flex justify-center py-8">
                <div
                  class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"
                ></div>
              </div>

              <div v-else-if="!friends || friends.length === 0" class="text-center py-12">
                <div
                  class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <i class="fas fa-users text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Henüz Arkadaşınız Yok</h3>
                <p class="text-gray-500 mb-6">Yeni arkadaşlar eklemek için arama yapabilirsiniz.</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="friend in friends"
                  :key="friend._id"
                  class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center space-x-4">
                    <div class="relative">
                      <div
                        class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                      >
                        <img
                          v-if="friend.avatar"
                          :src="friend.avatar"
                          alt="Avatar"
                          class="w-full h-full object-cover"
                        />
                        <span v-else class="text-lg font-bold text-gray-500">
                          {{ friend.name ? friend.name.charAt(0).toUpperCase() : '?' }}
                        </span>
                      </div>
                      <div
                        class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                        :class="[friend.isOnline ? 'bg-green-500' : 'bg-gray-400']"
                      ></div>
                    </div>

                    <div>
                      <h3 class="font-medium text-gray-800">
                        {{ friend.name || 'İsimsiz Kullanıcı' }}
                      </h3>
                      <p class="text-xs text-gray-500">
                        {{ friend.isOnline ? 'Çevrimiçi' : 'Çevrimdışı' }}
                      </p>
                    </div>
                  </div>

                  <div class="flex space-x-2">
                    <NuxtLink
                      :to="`/mesajlar?user=${friend._id}`"
                      class="p-2 text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                      title="Mesaj Gönder"
                    >
                      <i class="fas fa-comment"></i>
                    </NuxtLink>

                    <button
                      class="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      title="Arkadaşlıktan Çıkar"
                      @click="removeFriend(friend._id)"
                    >
                      <i class="fas fa-user-minus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Arkadaşlık İstekleri -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
            <div class="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <h2 class="text-xl font-semibold flex items-center">
                <i class="fas fa-user-clock mr-2"></i>
                Arkadaşlık İstekleri
                <span
                  v-if="friendRequests.length > 0"
                  class="ml-2 bg-white text-yellow-600 text-sm py-1 px-2 rounded-full"
                >
                  {{ friendRequests.length }}
                </span>
              </h2>
            </div>

            <div class="p-6">
              <div v-if="loadingRequests" class="flex justify-center py-8">
                <div
                  class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-500"
                ></div>
              </div>

              <div
                v-else-if="!friendRequests || friendRequests.length === 0"
                class="text-center py-8"
              >
                <p class="text-gray-500">Şu anda bekleyen arkadaşlık isteği bulunmuyor.</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="request in friendRequests"
                  :key="request._id"
                  class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        v-if="request.requester.avatar"
                        :src="request.requester.avatar"
                        alt="Avatar"
                        class="w-full h-full object-cover"
                      />
                      <span v-else class="text-lg font-bold text-gray-500">
                        {{
                          request.requester.name
                            ? request.requester.name.charAt(0).toUpperCase()
                            : '?'
                        }}
                      </span>
                    </div>

                    <div>
                      <h3 class="font-medium text-gray-800">
                        {{ request.requester.name || 'İsimsiz Kullanıcı' }}
                      </h3>
                      <p class="text-xs text-gray-500">
                        {{ formatDate(request.createdAt) }} tarihinde istek gönderdi
                      </p>
                    </div>
                  </div>

                  <div class="flex space-x-2">
                    <button
                      class="p-2 text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                      title="Kabul Et"
                      @click="acceptFriendRequest(request._id)"
                    >
                      <i class="fas fa-check"></i>
                    </button>

                    <button
                      class="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      title="Reddet"
                      @click="rejectFriendRequest(request._id)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sağ Taraf - Arkadaş Arama -->
        <div class="md:col-span-1">
          <FriendSearch @friend-added="refreshFriends" />

          <!-- Gönderilen İstekler -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
            <div class="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <h2 class="text-xl font-semibold flex items-center">
                <i class="fas fa-paper-plane mr-2"></i>
                Gönderilen İstekler
              </h2>
            </div>

            <div class="p-6">
              <div v-if="loadingSentRequests" class="flex justify-center py-8">
                <div
                  class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"
                ></div>
              </div>

              <div v-else-if="!sentRequests || sentRequests.length === 0" class="text-center py-8">
                <p class="text-gray-500">Gönderdiğiniz bekleyen istek bulunmuyor.</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="request in sentRequests"
                  :key="request._id"
                  class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        v-if="request.recipient.avatar"
                        :src="request.recipient.avatar"
                        alt="Avatar"
                        class="w-full h-full object-cover"
                      />
                      <span v-else class="text-lg font-bold text-gray-500">
                        {{
                          request.recipient.name
                            ? request.recipient.name.charAt(0).toUpperCase()
                            : '?'
                        }}
                      </span>
                    </div>

                    <div>
                      <h3 class="font-medium text-gray-800">
                        {{ request.recipient.name || 'İsimsiz Kullanıcı' }}
                      </h3>
                      <p class="text-xs text-gray-500">
                        {{ formatDate(request.createdAt) }} tarihinde gönderildi
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      class="p-2 text-white bg-gray-500 rounded-full hover:bg-gray-600 transition-colors"
                      title="İsteği İptal Et"
                      @click="cancelFriendRequest(request._id)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
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
import { useAuthStore } from '~/stores/auth';
import { useSocketClient } from '~/composables/useSocketClient';
import FriendSearch from '~/components/FriendSearch.vue';

const authStore = useAuthStore();
const { socket, connected } = useSocketClient();

// Sayfa durumu
const loading = ref(false);
const loadingRequests = ref(false);
const loadingSentRequests = ref(false);
const error = ref(null);

// Arkadaşlar ve istekler
const friends = ref([]);
const friendRequests = ref([]);
const sentRequests = ref([]);

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
    // Mevcut API endpoint'inize göre düzenlendi
    const response = await fetch('/api/friendship/friends', {
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

// Arkadaşlık isteklerini getir
const fetchFriendRequests = async () => {
  try {
    loadingRequests.value = true;

    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit('get_friend_requests', {}, response => {
        if (response && response.success) {
          friendRequests.value = response.data || [];
          loadingRequests.value = false;
        } else {
          // Socket başarısız olursa REST API'ye düş
          fetchFriendRequestsFromAPI();
        }
      });
    } else {
      // Socket bağlantısı yoksa REST API'ye düş
      fetchFriendRequestsFromAPI();
    }
  } catch (err) {
    console.error('Arkadaşlık istekleri getirilirken hata:', err);
    friendRequests.value = []; // Hata durumunda boş dizi
    loadingRequests.value = false;
  }
};

// REST API'den arkadaşlık isteklerini getir
const fetchFriendRequestsFromAPI = async () => {
  try {
    // Mevcut API endpoint'inize göre düzenlendi
    const response = await fetch('/api/friendship/requests', {
      headers: authStore.getAuthHeader(),
    });

    if (response.ok) {
      const data = await response.json();
      friendRequests.value = data.requests || [];
    } else {
      console.error(`API error: ${response.status}`);
      friendRequests.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    friendRequests.value = []; // Hata durumunda boş dizi
  } finally {
    loadingRequests.value = false;
  }
};

// Gönderilen istekleri getir
const fetchSentRequests = async () => {
  try {
    loadingSentRequests.value = true;

    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit('get_sent_requests', {}, response => {
        if (response && response.success) {
          sentRequests.value = response.data || [];
          loadingSentRequests.value = false;
        } else {
          // Socket başarısız olursa REST API'ye düş
          fetchSentRequestsFromAPI();
        }
      });
    } else {
      // Socket bağlantısı yoksa REST API'ye düş
      fetchSentRequestsFromAPI();
    }
  } catch (err) {
    console.error('Gönderilen istekler getirilirken hata:', err);
    sentRequests.value = []; // Hata durumunda boş dizi
    loadingSentRequests.value = false;
  }
};

// REST API'den gönderilen istekleri getir
const fetchSentRequestsFromAPI = async () => {
  try {
    // Mevcut API endpoint'inize göre düzenlendi
    const response = await fetch('/api/friendship/sent-requests', {
      headers: authStore.getAuthHeader(),
    });

    if (response.ok) {
      const data = await response.json();
      sentRequests.value = data.requests || [];
    } else {
      console.error(`API error: ${response.status}`);
      // Eğer endpoint yoksa, boş dizi kullan ve hata gösterme
      if (response.status === 404) {
        console.log("Gönderilen istekler endpoint'i bulunamadı, boş dizi kullanılıyor");
      }
      sentRequests.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    sentRequests.value = []; // Hata durumunda boş dizi
  } finally {
    loadingSentRequests.value = false;
  }
};

// Arkadaşlık isteğini kabul et
const acceptFriendRequest = async requestId => {
  try {
    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit('accept_friend_request', { requestId }, response => {
        if (response && response.success) {
          // İsteği listeden kaldır
          friendRequests.value = friendRequests.value.filter(req => req._id !== requestId);
          // Arkadaşları yeniden yükle
          fetchFriends();
        } else {
          console.error('İstek kabul edilemedi:', response?.error);
        }
      });
    } else {
      // REST API'ye düş - mevcut API endpoint'inize göre düzenlendi
      const response = await fetch(`/api/friendship/accept/${requestId}`, {
        method: 'POST',
        headers: authStore.getAuthHeader(),
      });

      if (response.ok) {
        // İsteği listeden kaldır
        friendRequests.value = friendRequests.value.filter(req => req._id !== requestId);
        // Arkadaşları yeniden yükle
        fetchFriends();
      } else {
        console.error(`API error: ${response.status}`);
      }
    }
  } catch (err) {
    console.error('İstek kabul edilirken hata:', err);
  }
};

// Arkadaşlık isteğini reddet
const rejectFriendRequest = async requestId => {
  try {
    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit('reject_friend_request', { requestId }, response => {
        if (response && response.success) {
          // İsteği listeden kaldır
          friendRequests.value = friendRequests.value.filter(req => req._id !== requestId);
        } else {
          console.error('İstek reddedilemedi:', response?.error);
        }
      });
    } else {
      // REST API'ye düş - mevcut API endpoint'inize göre düzenlendi
      const response = await fetch(`/api/friendship/reject/${requestId}`, {
        method: 'POST',
        headers: authStore.getAuthHeader(),
      });

      if (response.ok) {
        // İsteği listeden kaldır
        friendRequests.value = friendRequests.value.filter(req => req._id !== requestId);
      } else {
        console.error(`API error: ${response.status}`);
      }
    }
  } catch (err) {
    console.error('İstek reddedilirken hata:', err);
  }
};

// Arkadaşlık isteğini iptal et
const cancelFriendRequest = async requestId => {
  try {
    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit('cancel_friend_request', { requestId }, response => {
        if (response && response.success) {
          // İsteği listeden kaldır
          sentRequests.value = sentRequests.value.filter(req => req._id !== requestId);
        } else {
          console.error('İstek iptal edilemedi:', response?.error);
        }
      });
    } else {
      // REST API'ye düş - mevcut API endpoint'inize göre düzenlendi
      const response = await fetch(`/api/friendship/cancel/${requestId}`, {
        method: 'POST',
        headers: authStore.getAuthHeader(),
      });

      if (response.ok) {
        // İsteği listeden kaldır
        sentRequests.value = sentRequests.value.filter(req => req._id !== requestId);
      } else {
        console.error(`API error: ${response.status}`);
      }
    }
  } catch (err) {
    console.error('İstek iptal edilirken hata:', err);
  }
};

// Arkadaşlıktan çıkar
const removeFriend = async friendId => {
  try {
    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit('remove_friend', { friendId }, response => {
        if (response && response.success) {
          // Arkadaşı listeden kaldır
          friends.value = friends.value.filter(friend => friend._id !== friendId);
        } else {
          console.error('Arkadaş çıkarılamadı:', response?.error);
        }
      });
    } else {
      // REST API'ye düş - mevcut API endpoint'inize göre düzenlendi
      const response = await fetch(`/api/friendship/remove/${friendId}`, {
        method: 'POST',
        headers: authStore.getAuthHeader(),
      });

      if (response.ok) {
        // Arkadaşı listeden kaldır
        friends.value = friends.value.filter(friend => friend._id !== friendId);
      } else {
        console.error(`API error: ${response.status}`);
      }
    }
  } catch (err) {
    console.error('Arkadaş çıkarılırken hata:', err);
  }
};

// Tarihi formatla
const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR');
};

// Arkadaş eklendiğinde listeleri yenile
const refreshFriends = () => {
  fetchFriends();
  fetchSentRequests();
};

// Sayfa yüklendiğinde
onMounted(() => {
  if (authStore.authenticated) {
    fetchFriends();
    fetchFriendRequests();
    fetchSentRequests();
  }
});
</script> 