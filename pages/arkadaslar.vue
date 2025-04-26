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
                        v-if="request.recipient && request.recipient.avatar"
                        :src="request.recipient.avatar"
                        alt="Avatar"
                        class="w-full h-full object-cover"
                      />
                      <span v-else class="text-lg font-bold text-gray-500">
                        {{
                          request.recipient && request.recipient.name
                            ? request.recipient.name.charAt(0).toUpperCase()
                            : '?'
                        }}
                      </span>
                    </div>

                    <div>
                      <h3 class="font-medium text-gray-800">
                        {{ request.recipient && request.recipient.name ? request.recipient.name : 'İsimsiz Kullanıcı' }}
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
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useSocketClient } from '~/composables/useSocketClient';
import { emitter } from '~/utils/emitter';
import FriendSearch from '~/components/FriendSearch.vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

// Toast servisini başlat
const toast = useToast();

// Sayfa durumu
const loading = ref(false);
const loadingRequests = ref(false);
const loadingSentRequests = ref(false);
const error = ref(null);
const errorRequests = ref(null);
const errorSentRequests = ref(null);

// Arkadaşlar ve istekler
const friends = ref([]);
const friendRequests = ref([]);
const sentRequests = ref([]);
const searchResults = ref([]); // Arama sonuçları için ref ekledim

// Auth store ve router
const authStore = useAuthStore();
const router = useRouter();

// Socket bağlantısı
const { socket, connected, emit, on, off, connect, disconnect } = useSocketClient();

// Kullanıcı ID'si
const userId = computed(() => {
  // Önce authStore.userId getter'ını kullan
  const id = authStore.userId;
  if (id) {
    console.log('arkadaslar.vue: userId authStore.userId\'den alındı:', id);
    return id;
  }
  
  // Sonra user objesinden _id veya id alanını kontrol et
  if (authStore.user) {
    if (authStore.user._id) {
      console.log('arkadaslar.vue: userId authStore.user._id\'den alındı:', authStore.user._id);
      return authStore.user._id;
    }
    
    if (authStore.user.id) {
      console.log('arkadaslar.vue: userId authStore.user.id\'den alındı:', authStore.user.id);
      return authStore.user.id;
    }
  }
  
  console.log('arkadaslar.vue: userId bulunamadı');
  return null;
});

// Socket bağlantısını izle
watch(connected, (isConnected) => {
  console.log('Socket bağlantı durumu değişti:', isConnected);
  if (isConnected) {
    // Bağlantı kurulduğunda verileri yeniden yükle
    fetchFriends();
    fetchFriendRequests();
    fetchSentRequests();
    
    // Socket olaylarını dinle
    setupSocketListeners();
  }
});

// Arkadaşları getir
const fetchFriends = async () => {
  try {
    if (!userId.value) {
      console.error('Kullanıcı ID bulunamadı, arkadaşlar getirilemedi');
      return;
    }
    
    loading.value = true;
    error.value = null;
    
    console.log('Arkadaşlar getiriliyor, userId:', userId.value);
    console.log('Socket bağlantı durumu:', connected.value ? 'Bağlı' : 'Bağlı değil');

    // Socket ile dene
    if (connected.value && socket.value) {
      console.log('Socket ile arkadaşlar getiriliyor...');
      
      try {
        // emit fonksiyonu artık Promise döndürüyor
        const response = await emit('get_friends', {});
        
        if (response && response.success) {
          // Gelen verileri işle ve kontrol et
          const friendsData = response.data || [];
          
          console.log('Socket arkadaşlar ham veri:', friendsData);
          
          // Her bir arkadaşı kontrol et ve gerekirse düzelt
          friends.value = friendsData.map(friend => {
            // Arkadaş objesi yoksa veya eksikse, boş bir obje ile doldur
            if (!friend || typeof friend !== 'object') {
              console.warn('Eksik arkadaş objesi:', friend);
              return {
                _id: 'unknown',
                name: 'İsimsiz Kullanıcı',
                avatar: null,
                isOnline: false
              };
            }
            
            // Online durumunu kontrol et
            if (friend.isOnline === undefined) {
              friend.isOnline = false;
            }
            
            return friend;
          });
          
          console.log(`${friends.value.length} arkadaş bulundu (Socket)`);
          console.log('İşlenmiş arkadaşlar:', JSON.stringify(friends.value));
          loading.value = false;
        } else {
          console.error('Socket arkadaş getirme hatası:', response?.error);
          // Socket başarısız olursa REST API'ye düş
          await fetchFriendsFromAPI();
        }
      } catch (error) {
        console.error('Socket arkadaş getirme hatası:', error);
        // Hata durumunda REST API'ye düş
        await fetchFriendsFromAPI();
      }
    } else {
      console.log('Socket bağlantısı yok, REST API ile arkadaşlar getiriliyor...');
      // Socket bağlantısı yoksa REST API'ye düş
      await fetchFriendsFromAPI();
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
    console.log('REST API ile arkadaşlar getiriliyor...');
    
    const response = await fetch('/api/friendship/friends', {
      headers: authStore.getAuthHeader(),
      credentials: 'include', // Cookie'leri de gönder
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API yanıtı:', data);
      
      // Gelen verileri işle ve kontrol et
      const friendsData = data.friends || [];
      
      console.log('API arkadaşlar ham veri:', friendsData);
      
      // Her bir arkadaşı kontrol et ve gerekirse düzelt
      friends.value = friendsData.map(friend => {
        // Arkadaş objesi yoksa veya eksikse, boş bir obje ile doldur
        if (!friend || typeof friend !== 'object') {
          console.warn('API: Eksik arkadaş objesi:', friend);
          return {
            _id: 'unknown',
            name: 'İsimsiz Kullanıcı',
            avatar: null,
            isOnline: false
          };
        }
        
        // Online durumunu kontrol et
        if (friend.isOnline === undefined) {
          friend.isOnline = false;
        }
        
        return friend;
      });
      
      console.log(`${friends.value.length} arkadaş bulundu (API)`);
      console.log('API İşlenmiş arkadaşlar:', JSON.stringify(friends.value));
    } else {
      console.error(`API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Hata detayı:', errorText);
      
      // Eğer endpoint yoksa, boş dizi kullan ve hata gösterme
      if (response.status === 404) {
        console.log("Arkadaşlar endpoint'i bulunamadı, boş dizi kullanılıyor");
        error.value = null;
      } else {
        error.value = 'Arkadaşlar getirilirken bir hata oluştu';
      }
      
      friends.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    error.value = 'Arkadaşlar getirilirken bir hata oluştu';
    friends.value = []; // Hata durumunda boş dizi
  } finally {
    loading.value = false;
  }
};

// Arkadaşlık isteklerini getir
const fetchFriendRequests = async () => {
  try {
    if (!userId.value) {
      console.error('Kullanıcı ID bulunamadı, arkadaşlık istekleri getirilemedi');
      return;
    }
    
    loadingRequests.value = true;
    errorRequests.value = null;
    
    console.log('Arkadaşlık istekleri getiriliyor, userId:', userId.value);
    
    // Socket ile dene
    if (connected.value && socket.value) {
      console.log('Socket ile arkadaşlık istekleri getiriliyor...');
      
      try {
        // emit fonksiyonu artık Promise döndürüyor
        const response = await emit('get_friend_requests', {});
        
        if (response && response.success) {
          // Gelen verileri işle
          friendRequests.value = response.data || [];
          console.log(`${friendRequests.value.length} arkadaşlık isteği bulundu (Socket)`);
          loadingRequests.value = false;
        } else {
          console.error('Socket arkadaşlık istekleri getirme hatası:', response?.error);
          // Socket başarısız olursa REST API'ye düş
          await fetchFriendRequestsFromAPI();
        }
      } catch (error) {
        console.error('Socket arkadaşlık istekleri getirme hatası:', error);
        // Hata durumunda REST API'ye düş
        await fetchFriendRequestsFromAPI();
      }
    } else {
      console.log('Socket bağlantısı yok, REST API ile arkadaşlık istekleri getiriliyor...');
      // Socket bağlantısı yoksa REST API'ye düş
      await fetchFriendRequestsFromAPI();
    }
  } catch (err) {
    console.error('Arkadaşlık istekleri getirilirken hata:', err);
    errorRequests.value = 'Arkadaşlık istekleri getirilirken bir hata oluştu';
    loadingRequests.value = false;
    friendRequests.value = []; // Hata durumunda boş dizi
  }
};

// REST API'den arkadaşlık isteklerini getir
const fetchFriendRequestsFromAPI = async () => {
  try {
    console.log('REST API ile arkadaşlık istekleri getiriliyor...');
    
    const response = await fetch('/api/friendship/requests', {
      headers: authStore.getAuthHeader(),
      credentials: 'include', // Cookie'leri de gönder
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API yanıtı:', data);
      
      // Gelen verileri işle
      friendRequests.value = data.requests || [];
      
      console.log(`${friendRequests.value.length} arkadaşlık isteği bulundu (API)`);
      console.log('API Arkadaşlık İstekleri:', JSON.stringify(friendRequests.value));
    } else {
      console.error(`API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Hata detayı:', errorText);
      
      // Eğer endpoint yoksa, boş dizi kullan ve hata gösterme
      if (response.status === 404) {
        console.log("Arkadaşlık istekleri endpoint'i bulunamadı, boş dizi kullanılıyor");
        errorRequests.value = null;
      } else {
        errorRequests.value = 'Arkadaşlık istekleri getirilirken bir hata oluştu';
      }
      
      friendRequests.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    errorRequests.value = 'Arkadaşlık istekleri getirilirken bir hata oluştu';
    friendRequests.value = []; // Hata durumunda boş dizi
  } finally {
    loadingRequests.value = false;
  }
};

// Gönderilen istekleri getir
const fetchSentRequests = async () => {
  try {
    if (!userId.value) {
      console.error('Kullanıcı ID bulunamadı, gönderilen istekler getirilemedi');
      return;
    }
    
    loadingSentRequests.value = true;
    errorSentRequests.value = null;
    
    console.log('Gönderilen istekler getiriliyor, userId:', userId.value);
    
    // Socket ile dene
    if (connected.value && socket.value) {
      console.log('Socket ile gönderilen istekler getiriliyor...');
      
      try {
        // emit fonksiyonu artık Promise döndürüyor
        const response = await emit('get_sent_requests', {});
        
        if (response && response.success) {
          // Gelen verileri işle
          sentRequests.value = response.data || [];
          console.log(`${sentRequests.value.length} gönderilen istek bulundu (Socket)`);
          loadingSentRequests.value = false;
        } else {
          console.error('Socket gönderilen istekler getirme hatası:', response?.error);
          // Socket başarısız olursa REST API'ye düş
          await fetchSentRequestsFromAPI();
        }
      } catch (error) {
        console.error('Socket gönderilen istekler getirme hatası:', error);
        // Hata durumunda REST API'ye düş
        await fetchSentRequestsFromAPI();
      }
    } else {
      console.log('Socket bağlantısı yok, REST API ile gönderilen istekler getiriliyor...');
      // Socket bağlantısı yoksa REST API'ye düş
      await fetchSentRequestsFromAPI();
    }
  } catch (err) {
    console.error('Gönderilen istekler getirilirken hata:', err);
    errorSentRequests.value = 'Gönderilen istekler getirilirken bir hata oluştu';
    loadingSentRequests.value = false;
    sentRequests.value = []; // Hata durumunda boş dizi
  }
};

// REST API'den gönderilen istekleri getir
const fetchSentRequestsFromAPI = async () => {
  try {
    console.log('REST API ile gönderilen istekler getiriliyor...');
    
    const response = await fetch('/api/friendship/sent-requests', {
      headers: authStore.getAuthHeader(),
      credentials: 'include', // Cookie'leri de gönder
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API yanıtı:', data);
      
      // Gelen verileri işle
      sentRequests.value = data.sentRequests || [];
      
      console.log(`${sentRequests.value.length} gönderilen istek bulundu (API)`);
      console.log('API Gönderilen İstekler:', JSON.stringify(sentRequests.value));
    } else {
      console.error(`API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Hata detayı:', errorText);
      
      // Eğer endpoint yoksa, boş dizi kullan ve hata gösterme
      if (response.status === 404) {
        console.log("Gönderilen istekler endpoint'i bulunamadı, boş dizi kullanılıyor");
        errorSentRequests.value = null;
      } else {
        errorSentRequests.value = 'Gönderilen istekler getirilirken bir hata oluştu';
      }
      
      sentRequests.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    errorSentRequests.value = 'Gönderilen istekler getirilirken bir hata oluştu';
    sentRequests.value = []; // Hata durumunda boş dizi
  } finally {
    loadingSentRequests.value = false;
  }
};

// Arkadaşlık isteğini kabul et
const acceptFriendRequest = async requestId => {
  try {
    console.log('Arkadaşlık isteği kabul ediliyor, requestId:', requestId);
    
    // Socket ile dene
    if (connected.value) {
      try {
        const response = await emit('accept_friend_request', { requestId });
        
        if (response && response.success) {
          console.log('Arkadaşlık isteği başarıyla kabul edildi (Socket)');
          toast.success('Arkadaşlık isteği kabul edildi');
          
          // Listeleri güncelle
          fetchFriendRequests();
          fetchFriends();
          return;
        } else {
          console.error('Socket arkadaşlık isteği kabul etme hatası:', response?.error);
        }
      } catch (error) {
        console.error('Socket arkadaşlık isteği kabul etme hatası:', error);
      }
    }
    
    // Socket başarısız olursa veya bağlantı yoksa REST API'ye düş
    await acceptFriendRequestViaAPI(requestId);
    
  } catch (err) {
    console.error('Arkadaşlık isteği kabul edilirken hata:', err);
    toast.error('Arkadaşlık isteği kabul edilirken bir hata oluştu');
  }
};

// REST API ile arkadaşlık isteğini kabul et
const acceptFriendRequestViaAPI = async requestId => {
  try {
    console.log('REST API ile arkadaşlık isteği kabul ediliyor...');
    
    const response = await fetch(`/api/friendship/accept/${requestId}`, {
      method: 'POST',
      headers: authStore.getAuthHeader(),
      credentials: 'include', // Cookie'leri de gönder
    });

    if (response.ok) {
      console.log('REST API: Arkadaşlık isteği başarıyla kabul edildi');
      
      // Listeleri güncelle
      fetchFriendRequests();
      fetchFriends();
      
      // Başarı mesajı göster
      toast.success('Arkadaşlık isteği kabul edildi');
    } else {
      console.error(`API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Hata detayı:', errorText);
      toast.error('İstek kabul edilemedi: ' + (errorText || 'Bilinmeyen hata'));
    }
  } catch (err) {
    console.error('REST API ile istek kabul edilirken hata:', err);
    toast.error('İstek kabul edilirken bir hata oluştu');
  }
};

// Arkadaşlık isteğini reddet
const rejectFriendRequest = async requestId => {
  try {
    console.log('Arkadaşlık isteği reddediliyor, requestId:', requestId);
    
    // Socket ile dene
    if (connected.value) {
      try {
        const response = await emit('reject_friend_request', { requestId });
        
        if (response && response.success) {
          console.log('Arkadaşlık isteği başarıyla reddedildi (Socket)');
          toast.info('Arkadaşlık isteği reddedildi');
          
          // Listeleri güncelle
          fetchFriendRequests();
          return;
        } else {
          console.error('Socket arkadaşlık isteği reddetme hatası:', response?.error);
        }
      } catch (error) {
        console.error('Socket arkadaşlık isteği reddetme hatası:', error);
      }
    }
    
    // Socket başarısız olursa veya bağlantı yoksa REST API'ye düş
    await rejectFriendRequestViaAPI(requestId);
    
  } catch (err) {
    console.error('Arkadaşlık isteği reddedilirken hata:', err);
    toast.error('Arkadaşlık isteği reddedilirken bir hata oluştu');
  }
};

// REST API ile arkadaşlık isteğini reddet
const rejectFriendRequestViaAPI = async requestId => {
  try {
    console.log('REST API ile arkadaşlık isteği reddediliyor...');
    
    const response = await fetch(`/api/friendship/reject/${requestId}`, {
      method: 'POST',
      headers: authStore.getAuthHeader(),
      credentials: 'include', // Cookie'leri de gönder
    });

    if (response.ok) {
      console.log('REST API: Arkadaşlık isteği başarıyla reddedildi');
      
      // Listeleri güncelle
      fetchFriendRequests();
      
      // Başarı mesajı göster
      toast.info('Arkadaşlık isteği reddedildi');
    } else {
      console.error(`API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Hata detayı:', errorText);
      toast.error('İstek reddedilemedi: ' + (errorText || 'Bilinmeyen hata'));
    }
  } catch (err) {
    console.error('REST API ile istek reddedilirken hata:', err);
    toast.error('İstek reddedilirken bir hata oluştu');
  }
};

// Arkadaşlık isteğini iptal et
const cancelFriendRequest = async requestId => {
  try {
    // Socket ile dene
    if (connected.value) {
      try {
        const response = await emit('cancel_friend_request', { requestId });
        
        if (response && response.success) {
          console.log('Arkadaşlık isteği başarıyla iptal edildi (Socket)');
          toast.info('Arkadaşlık isteği iptal edildi');
          
          // Listeleri güncelle
          fetchSentRequests();
          return;
        } else {
          console.error('Socket arkadaşlık isteği iptal etme hatası:', response?.error);
        }
      } catch (error) {
        console.error('Socket arkadaşlık isteği iptal etme hatası:', error);
      }
    }
    
    // Socket başarısız olursa veya bağlantı yoksa REST API'ye düş
    await cancelFriendRequestViaAPI(requestId);
    
  } catch (err) {
    console.error('Arkadaşlık isteği iptal edilirken hata:', err);
    toast.error('Arkadaşlık isteği iptal edilirken bir hata oluştu');
  }
};

// REST API ile arkadaşlık isteğini iptal et
const cancelFriendRequestViaAPI = async requestId => {
  try {
    console.log('REST API ile arkadaşlık isteği iptal ediliyor...');
    
    const response = await fetch(`/api/friendship/cancel/${requestId}`, {
      method: 'POST',
      headers: authStore.getAuthHeader(),
      credentials: 'include', // Cookie'leri de gönder
    });

    if (response.ok) {
      console.log('REST API: Arkadaşlık isteği başarıyla iptal edildi');
      
      // Listeleri güncelle
      fetchSentRequests();
      
      // Başarı mesajı göster
      toast.info('Arkadaşlık isteği iptal edildi');
    } else {
      console.error(`API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Hata detayı:', errorText);
      toast.error('İstek iptal edilemedi: ' + (errorText || 'Bilinmeyen hata'));
    }
  } catch (err) {
    console.error('REST API ile istek iptal edilirken hata:', err);
    toast.error('İstek iptal edilirken bir hata oluştu');
  }
};

// Arkadaşlıktan çıkar
const removeFriend = async friendId => {
  try {
    console.log('Arkadaşlıktan çıkarılıyor, friendId:', friendId);
    
    // Socket ile dene
    if (connected.value) {
      try {
        const response = await emit('remove_friend', { friendId });
        
        if (response && response.success) {
          console.log('Arkadaşlıktan başarıyla çıkarıldı (Socket)');
          toast.info('Arkadaşlıktan çıkarıldı');
          
          // Listeleri güncelle
          fetchFriends();
          return;
        } else {
          console.error('Socket arkadaşlıktan çıkarma hatası:', response?.error);
        }
      } catch (error) {
        console.error('Socket arkadaşlıktan çıkarma hatası:', error);
      }
    }
    
    // Socket başarısız olursa veya bağlantı yoksa REST API'ye düş
    await removeFriendViaAPI(friendId);
    
  } catch (err) {
    console.error('Arkadaşlıktan çıkarılırken hata:', err);
    toast.error('Arkadaşlıktan çıkarılırken bir hata oluştu');
  }
};

// REST API ile arkadaşlıktan çıkmak
const removeFriendViaAPI = async friendId => {
  try {
    console.log('REST API ile arkadaşlıktan çıkılıyor...');
    
    const response = await fetch(`/api/friendship/remove/${friendId}`, {
      method: 'POST',
      headers: authStore.getAuthHeader(),
      credentials: 'include', // Cookie'leri de gönder
    });

    if (response.ok) {
      console.log('REST API: Arkadaşlıktan başarıyla çıkarıldı');
      
      // Listeleri güncelle
      fetchFriends();
      
      // Başarı mesajı göster
      toast.info('Arkadaşlıktan çıkarıldı');
    } else {
      console.error(`API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Hata detayı:', errorText);
      toast.error('Arkadaşlıktan çıkılamadı: ' + (errorText || 'Bilinmeyen hata'));
    }
  } catch (err) {
    console.error('REST API ile arkadaşlıktan çıkılırken hata:', err);
    toast.error('Arkadaşlıktan çıkılırken bir hata oluştu');
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

// Socket olaylarını dinle
const setupSocketListeners = () => {
  console.log('Arkadaşlık olayları dinleyicileri kuruluyor...');
  
  // Socket bağlantısını kontrol et
  if (!socket.value || !connected.value) {
    console.error('Socket bağlantısı yok, arkadaşlık olayları dinleyicileri kurulamıyor');
    return;
  }
  
  // Önceki dinleyicileri temizle
  try {
    off('friend_request_received');
    off('friend_request_accepted');
    off('friend_request_rejected');
    off('friend_request_canceled');
    off('friend_removed');
    off('user_status_changed');
  } catch (error) {
    console.error('Dinleyiciler temizlenirken hata oluştu:', error);
  }
  
  // Yeni arkadaşlık isteği alındığında
  on('friend_request_received', (data) => {
    console.log('Yeni arkadaşlık isteği alındı:', data);
    toast.info(`${data.requester.name || 'Bir kullanıcı'} size arkadaşlık isteği gönderdi`);
    fetchFriendRequests(); // İstekleri yenile
  });
  
  // Arkadaşlık isteği kabul edildiğinde
  on('friend_request_accepted', (data) => {
    console.log('Arkadaşlık isteği kabul edildi:', data);
    toast.success(`${data.recipient.name || 'Bir kullanıcı'} arkadaşlık isteğinizi kabul etti`);
    fetchFriends(); // Arkadaşları yenile
    fetchSentRequests(); // Gönderilen istekleri yenile
  });
  
  // Arkadaşlık isteği reddedildiğinde
  on('friend_request_rejected', (data) => {
    console.log('Arkadaşlık isteği reddedildi:', data);
    toast.info(`${data.recipient.name || 'Bir kullanıcı'} arkadaşlık isteğinizi reddetti`);
    fetchSentRequests(); // Gönderilen istekleri yenile
  });
  
  // Arkadaşlık isteği iptal edildiğinde
  on('friend_request_canceled', (data) => {
    console.log('Arkadaşlık isteği iptal edildi:', data);
    fetchFriendRequests(); // İstekleri yenile
  });
  
  // Arkadaşlıktan çıkarıldığında
  on('friend_removed', (data) => {
    console.log('Arkadaşlıktan çıkarıldı:', data);
    toast.info(`${data.remover.name || 'Bir kullanıcı'} sizi arkadaşlıktan çıkardı`);
    fetchFriends(); // Arkadaşları yenile
  });
  
  // Kullanıcı durumu değiştiğinde
  on('user_status_changed', (data) => {
    console.log('Kullanıcı durumu değişti:', data);
    
    // Arkadaşlar listesinde kullanıcıyı bul ve durumunu güncelle
    const friendIndex = friends.value.findIndex(f => f._id === data.userId);
    if (friendIndex !== -1) {
      friends.value[friendIndex].isOnline = data.isOnline;
      console.log(`${friends.value[friendIndex].name} kullanıcısının durumu güncellendi: ${data.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}`);
    }
  });
};

// Sayfa yüklendiğinde
onMounted(async () => {
  // Kullanıcı giriş yapmışsa verileri yükle
  if (authStore.authenticated && userId.value) {
    console.log('Arkadaşlar sayfası yükleniyor, userId:', userId.value);
    
    // Socket bağlantısını kontrol et
    if (!connected.value) {
      console.log('Socket bağlantısı kuruluyor...');
      await connect();
    }
    
    // Verileri yükle
    fetchFriends();
    fetchFriendRequests();
    fetchSentRequests();
    
    // Socket olaylarını dinle
    setupSocketListeners();
  } else {
    console.log('Kullanıcı giriş yapmamış, veriler yüklenmiyor');
  }
});

// Sayfa kapatıldığında dinleyicileri temizle
onBeforeUnmount(() => {
  console.log('Arkadaşlık olayları dinleyicileri temizleniyor...');
  
  // Socket bağlantısını kontrol et
  if (!socket.value) {
    console.log('Socket bağlantısı yok, temizleme işlemi atlanıyor');
    return;
  }
  
  // Socket dinleyicilerini temizle
  try {
    off('friend_request_received');
    off('friend_request_accepted');
    off('friend_request_rejected');
    off('friend_request_canceled');
    off('friend_removed');
    off('user_status_changed');
  } catch (error) {
    console.error('Dinleyiciler temizlenirken hata oluştu:', error);
  }
});
</script>