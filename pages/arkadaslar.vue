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

// Arkadaşlar ve istekler
const friends = ref([]);
const friendRequests = ref([]);
const sentRequests = ref([]);
const searchResults = ref([]); // Arama sonuçları için ref ekledim

// Auth store ve router
const authStore = useAuthStore();
const router = useRouter();

// Socket bağlantısı
const { socket, connected, emit, on, connect, disconnect } = useSocketClient();

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
      
      // Promise kullanarak Socket.io yanıtını bekle
      const socketPromise = new Promise((resolve) => {
        emit('get_friends', {}, response => {
          console.log('Socket get_friends yanıtı:', response);
          resolve(response);
        });
      });
      
      // Timeout ile Socket.io yanıtını bekle
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: false, error: 'Socket timeout' });
        }, 5000); // 5 saniye timeout
      });
      
      // İlk yanıt veren Promise'i al
      const response = await Promise.race([socketPromise, timeoutPromise]);
      
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
    error.value = null;

    // Socket ile dene
    if (connected.value) {
      console.log('Socket ile arkadaşlık istekleri getiriliyor...');
      emit('get_friend_requests', {}, response => {
        console.log('Socket get_friend_requests yanıtı:', response);
        
        if (response && response.success) {
          // Gelen verileri işle ve kontrol et
          const requestsData = response.data || [];
          
          // Her bir isteği kontrol et ve gerekirse düzelt
          friendRequests.value = requestsData.map(request => {
            // İstek objesi yoksa veya eksikse, boş bir obje ile doldur
            if (!request || typeof request !== 'object') {
              console.warn('Eksik istek objesi:', request);
              return {
                _id: 'unknown',
                requester: {
                  _id: 'unknown',
                  name: 'İsimsiz Kullanıcı',
                  avatar: null
                }
              };
            }
            return request;
          });
          
          console.log(`${friendRequests.value.length} arkadaşlık isteği bulundu (Socket)`);
          console.log('Arkadaşlık İstekleri:', JSON.stringify(friendRequests.value));
          loadingRequests.value = false;
        } else {
          console.error('Socket arkadaşlık isteği getirme hatası:', response?.error);
          // Socket başarısız olursa REST API'ye düş
          fetchFriendRequestsFromAPI();
        }
      });
    } else {
      console.log('Socket bağlantısı yok, REST API ile arkadaşlık istekleri getiriliyor...');
      // Socket bağlantısı yoksa REST API'ye düş
      fetchFriendRequestsFromAPI();
    }
  } catch (err) {
    console.error('Arkadaşlık istekleri getirilirken hata:', err);
    error.value = 'Arkadaşlık istekleri getirilirken bir hata oluştu';
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
      
      // Gelen verileri işle ve kontrol et
      const requestsData = data.requests || [];
      
      // Her bir isteği kontrol et ve gerekirse düzelt
      friendRequests.value = requestsData.map(request => {
        // İstek objesi yoksa veya eksikse, boş bir obje ile doldur
        if (!request || typeof request !== 'object') {
          console.warn('API: Eksik istek objesi:', request);
          return {
            _id: 'unknown',
            requester: {
              _id: 'unknown',
              name: 'İsimsiz Kullanıcı',
              avatar: null
            }
          };
        }
        return request;
      });
      
      console.log(`${friendRequests.value.length} arkadaşlık isteği bulundu (API)`);
      console.log('API Arkadaşlık İstekleri:', JSON.stringify(friendRequests.value));
    } else {
      console.error(`API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Hata detayı:', errorText);
      
      // Eğer endpoint yoksa, boş dizi kullan ve hata gösterme
      if (response.status === 404) {
        console.log("Arkadaşlık istekleri endpoint'i bulunamadı, boş dizi kullanılıyor");
        error.value = null;
      } else {
        error.value = 'Arkadaşlık istekleri getirilirken bir hata oluştu';
      }
      
      friendRequests.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    error.value = 'Arkadaşlık istekleri getirilirken bir hata oluştu';
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
    error.value = null;

    // Socket ile dene
    if (connected.value) {
      console.log('Socket ile gönderilen istekler getiriliyor...');
      emit('get_sent_requests', {}, response => {
        console.log('Socket get_sent_requests yanıtı:', response);
        
        if (response && response.success) {
          // Gelen verileri işle ve kontrol et
          const requestsData = response.data || [];
          
          // Her bir isteği kontrol et ve gerekirse düzelt
          sentRequests.value = requestsData.map(request => {
            // İstek objesi yoksa veya eksikse, boş bir obje ile doldur
            if (!request || typeof request !== 'object') {
              console.warn('Eksik istek objesi:', request);
              return {
                _id: 'unknown',
                recipient: {
                  _id: 'unknown',
                  name: 'İsimsiz Kullanıcı',
                  avatar: null
                }
              };
            }
            return request;
          });
          
          console.log(`${sentRequests.value.length} gönderilen istek bulundu (Socket)`);
          console.log('Gönderilen İstekler:', JSON.stringify(sentRequests.value));
          loadingSentRequests.value = false;
        } else {
          console.error('Socket gönderilen istek getirme hatası:', response?.error);
          // Socket başarısız olursa REST API'ye düş
          fetchSentRequestsFromAPI();
        }
      });
    } else {
      console.log('Socket bağlantısı yok, REST API ile gönderilen istekler getiriliyor...');
      // Socket bağlantısı yoksa REST API'ye düş
      fetchSentRequestsFromAPI();
    }
  } catch (err) {
    console.error('Gönderilen istekler getirilirken hata:', err);
    error.value = 'Gönderilen istekler getirilirken bir hata oluştu';
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
      
      // Gelen verileri işle ve kontrol et
      const requestsData = data.sentRequests || [];
      
      // Her bir isteği kontrol et ve gerekirse düzelt
      sentRequests.value = requestsData.map(request => {
        // İstek objesi yoksa veya eksikse, boş bir obje ile doldur
        if (!request || typeof request !== 'object') {
          console.warn('API: Eksik istek objesi:', request);
          return {
            _id: 'unknown',
            recipient: {
              _id: 'unknown',
              name: 'İsimsiz Kullanıcı',
              avatar: null
            }
          };
        }
        return request;
      });
      
      console.log(`${sentRequests.value.length} gönderilen istek bulundu (API)`);
      console.log('API Gönderilen İstekler:', JSON.stringify(sentRequests.value));
    } else {
      console.error(`API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Hata detayı:', errorText);
      
      // Eğer endpoint yoksa, boş dizi kullan ve hata gösterme
      if (response.status === 404) {
        console.log("Gönderilen istekler endpoint'i bulunamadı, boş dizi kullanılıyor");
        error.value = null;
      } else {
        error.value = 'Gönderilen istekler getirilirken bir hata oluştu';
      }
      
      sentRequests.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    error.value = 'Gönderilen istekler getirilirken bir hata oluştu';
    sentRequests.value = []; // Hata durumunda boş dizi
  } finally {
    loadingSentRequests.value = false;
  }
};

// Arkadaşlık isteğini kabul et
const acceptFriendRequest = async requestId => {
  try {
    console.log('Arkadaşlık isteği kabul ediliyor, requestId:', requestId);
    
    // İsteği bul
    const request = friendRequests.value.find(req => req._id === requestId);
    if (!request) {
      console.error('Kabul edilecek istek bulunamadı:', requestId);
      toast.error('İstek bulunamadı');
      return;
    }
    
    // Socket ile dene
    if (connected.value && socket.value) {
      console.log('Socket ile arkadaşlık isteği kabul ediliyor...');
      
      // Promise kullanarak Socket.io yanıtını bekle
      const socketPromise = new Promise((resolve) => {
        emit('accept_friend_request', { requestId }, response => {
          console.log('Socket accept_friend_request yanıtı:', response);
          resolve(response);
        });
      });
      
      // Timeout ile Socket.io yanıtını bekle
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: false, error: 'Socket timeout' });
        }, 5000); // 5 saniye timeout
      });
      
      // İlk yanıt veren Promise'i al
      const response = await Promise.race([socketPromise, timeoutPromise]);
      
      if (response && response.success) {
        console.log('Arkadaşlık isteği başarıyla kabul edildi:', response);
        
        // İsteği listeden kaldır
        friendRequests.value = friendRequests.value.filter(req => req._id !== requestId);
        
        // Eğer yanıtta friend verisi varsa, arkadaşlar listesine ekle
        if (response.friend && response.friend._id) {
          console.log('Yanıtta gelen arkadaş:', response.friend);
          
          // Arkadaşın zaten listede olup olmadığını kontrol et
          const existingFriendIndex = friends.value.findIndex(f => f._id === response.friend._id);
          
          if (existingFriendIndex === -1) {
            // Online durumunu ekle
            const newFriend = {
              ...response.friend,
              isOnline: response.friend.isOnline !== undefined ? response.friend.isOnline : false
            };
            
            console.log('Arkadaşlar listesine yeni arkadaş ekleniyor:', newFriend);
            friends.value.push(newFriend);
          } else {
            console.log('Bu arkadaş zaten listede var, güncelleniyor');
            // Mevcut arkadaşı güncelle
            friends.value[existingFriendIndex] = {
              ...friends.value[existingFriendIndex],
              ...response.friend,
              isOnline: response.friend.isOnline !== undefined ? response.friend.isOnline : friends.value[existingFriendIndex].isOnline
            };
          }
        } else {
          // Arkadaşlar listesini yeniden yükle
          console.log('Yanıtta friend verisi yok, arkadaşlar listesini yeniliyorum');
          fetchFriends();
        }
        
        // Başarı mesajı göster
        toast.success('Arkadaşlık isteği kabul edildi');
      } else {
        console.error('İstek kabul edilemedi:', response?.error);
        toast.error('İstek kabul edilemedi: ' + (response?.error || 'Bilinmeyen hata'));
        
        // Socket başarısız olursa REST API'ye düş
        await acceptFriendRequestViaAPI(requestId);
      }
    } else {
      console.log('Socket bağlantısı yok, REST API ile arkadaşlık isteği kabul ediliyor...');
      // Socket bağlantısı yoksa REST API'ye düş
      await acceptFriendRequestViaAPI(requestId);
    }
  } catch (err) {
    console.error('İstek kabul edilirken hata:', err);
    toast.error('İstek kabul edilirken bir hata oluştu');
  }
};

// REST API ile arkadaşlık isteğini kabul et
const acceptFriendRequestViaAPI = async requestId => {
  try {
    console.log('REST API ile arkadaşlık isteği kabul ediliyor...');
    
    // İsteği bul
    const request = friendRequests.value.find(req => req._id === requestId);
    if (!request) {
      console.error('API: Kabul edilecek istek bulunamadı:', requestId);
      toast.error('İstek bulunamadı');
      return;
    }
    
    const response = await fetch(`/api/friendship/accept/${requestId}`, {
      method: 'POST',
      headers: authStore.getAuthHeader(),
      credentials: 'include', // Cookie'leri de gönder
    });

    if (response.ok) {
      console.log('REST API: Arkadaşlık isteği başarıyla kabul edildi');
      
      // İsteği listeden kaldır
      friendRequests.value = friendRequests.value.filter(req => req._id !== requestId);
      
      try {
        // Yanıtı JSON olarak parse et
        const data = await response.json();
        console.log('REST API yanıtı:', data);
        
        // Eğer yanıtta friend verisi varsa, arkadaşlar listesine ekle
        if (data && data.friend && data.friend._id) {
          console.log('API: Yanıtta gelen arkadaş:', data.friend);
          
          // Arkadaşın zaten listede olup olmadığını kontrol et
          const existingFriendIndex = friends.value.findIndex(f => f._id === data.friend._id);
          
          if (existingFriendIndex === -1) {
            // Online durumunu ekle
            const newFriend = {
              ...data.friend,
              isOnline: data.friend.isOnline !== undefined ? data.friend.isOnline : false
            };
            
            console.log('API: Arkadaşlar listesine yeni arkadaş ekleniyor:', newFriend);
            friends.value.push(newFriend);
          } else {
            console.log('API: Bu arkadaş zaten listede var, güncelleniyor');
            // Mevcut arkadaşı güncelle
            friends.value[existingFriendIndex] = {
              ...friends.value[existingFriendIndex],
              ...data.friend,
              isOnline: data.friend.isOnline !== undefined ? data.friend.isOnline : friends.value[existingFriendIndex].isOnline
            };
          }
        } else {
          // Arkadaşlar listesini yeniden yükle
          console.log('API: Yanıtta friend verisi yok, arkadaşlar listesini yeniliyorum');
          fetchFriends();
        }
      } catch (parseError) {
        console.error('API yanıtı parse edilirken hata:', parseError);
        // JSON parse hatası durumunda arkadaşlar listesini yeniden yükle
        fetchFriends();
      }
      
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
    // Socket ile dene
    if (connected.value) {
      emit('reject_friend_request', { requestId }, response => {
        console.log('Socket reject_friend_request yanıtı:', response);
        
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
    if (connected.value) {
      emit('cancel_friend_request', { requestId }, response => {
        console.log('Socket cancel_friend_request yanıtı:', response);
        
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
    if (connected.value) {
      emit('remove_friend', { friendId }, response => {
        console.log('Socket remove_friend yanıtı:', response);
        
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

// Socket olaylarını dinle
const setupSocketListeners = () => {
  console.log('Arkadaşlık olayları dinleyicileri ayarlanıyor...');
  
  // Önceki dinleyicileri temizle
  emitter.off('friendship:request_accepted');
  emitter.off('friendship:request_received');
  emitter.off('friendship:request_rejected');
  emitter.off('friendship:friend_removed');
  
  // Arkadaşlık isteği kabul edildiğinde
  emitter.on('friendship:request_accepted', (data) => {
    console.log('Emitter: Arkadaşlık isteği kabul edildi olayı alındı:', data);
    
    if (!data) {
      console.error('Geçersiz arkadaşlık isteği kabul edildi verisi:', data);
      return;
    }
    
    // İsteği listeden kaldır
    if (data.requestId) {
      console.log('İstek listeden kaldırılıyor:', data.requestId);
      friendRequests.value = friendRequests.value.filter(req => req._id !== data.requestId);
    }
    
    // Eğer friend verisi varsa, arkadaşlar listesine ekle
    if (data.friend && data.friend._id) {
      console.log('Kabul edilen arkadaşlık isteğinden gelen arkadaş:', data.friend);
      
      // Arkadaşın zaten listede olup olmadığını kontrol et
      const existingFriendIndex = friends.value.findIndex(f => f._id === data.friend._id);
      
      if (existingFriendIndex === -1) {
        // Online durumunu ekle
        const newFriend = {
          ...data.friend,
          isOnline: data.friend.isOnline !== undefined ? data.friend.isOnline : false
        };
        
        console.log('Arkadaşlar listesine yeni arkadaş ekleniyor:', newFriend);
        friends.value.push(newFriend);
      } else {
        console.log('Bu arkadaş zaten listede var, güncelleniyor');
        // Mevcut arkadaşı güncelle
        friends.value[existingFriendIndex] = {
          ...friends.value[existingFriendIndex],
          ...data.friend,
          isOnline: data.friend.isOnline !== undefined ? data.friend.isOnline : friends.value[existingFriendIndex].isOnline
        };
      }
    } else {
      console.log('Friend verisi yok veya eksik, arkadaşlar listesini yeniliyorum');
      fetchFriends();
    }
  });
  
  // Arkadaşlık isteği alındığında
  emitter.on('friendship:request_received', (data) => {
    console.log('Emitter: Yeni arkadaşlık isteği alındı olayı:', data);
    
    if (!data || !data.requester || !data.requestId) {
      console.error('Geçersiz arkadaşlık isteği alındı verisi:', data);
      return;
    }
    
    // İsteğin zaten listede olup olmadığını kontrol et
    const existingRequestIndex = friendRequests.value.findIndex(req => req._id === data.requestId);
    
    if (existingRequestIndex === -1) {
      // Yeni isteği ekle
      const newRequest = {
        _id: data.requestId,
        requester: data.requester,
        status: 'pending',
        createdAt: new Date()
      };
      
      console.log('Arkadaşlık istekleri listesine yeni istek ekleniyor:', newRequest);
      friendRequests.value.push(newRequest);
    } else {
      console.log('Bu istek zaten listede var, güncelleniyor');
      // Mevcut isteği güncelle
      friendRequests.value[existingRequestIndex] = {
        ...friendRequests.value[existingRequestIndex],
        requester: data.requester,
        status: 'pending'
      };
    }
  });
  
  // Arkadaşlık isteği reddedildiğinde
  emitter.on('friendship:request_rejected', (data) => {
    console.log('Emitter: Arkadaşlık isteği reddedildi olayı:', data);
    
    if (!data || !data.requestId) {
      console.error('Geçersiz arkadaşlık isteği reddedildi verisi:', data);
      return;
    }
    
    // İsteği listeden kaldır
    console.log('İstek listeden kaldırılıyor:', data.requestId);
    friendRequests.value = friendRequests.value.filter(req => req._id !== data.requestId);
  });
  
  // Arkadaş kaldırıldığında
  emitter.on('friendship:friend_removed', (data) => {
    console.log('Emitter: Arkadaş kaldırıldı olayı:', data);
    
    if (!data || !data.friendId) {
      console.error('Geçersiz arkadaş kaldırıldı verisi:', data);
      return;
    }
    
    // Arkadaşı listeden kaldır
    console.log('Arkadaş listeden kaldırılıyor:', data.friendId);
    friends.value = friends.value.filter(friend => friend._id !== data.friendId);
  });
  
  console.log('Arkadaşlık olayları dinleyicileri ayarlandı');
};

// Sayfa kapatıldığında dinleyicileri temizle
onBeforeUnmount(() => {
  console.log('Arkadaşlık olayları dinleyicileri temizleniyor...');
  
  // Emitter dinleyicilerini temizle
  emitter.off('friendship:request_accepted');
  emitter.off('friendship:request_received');
  emitter.off('friendship:request_rejected');
  emitter.off('friendship:friend_removed');
});

// Sayfa yüklendiğinde
onMounted(async () => {
  console.log('Arkadaşlar sayfası yüklendi');
  
  // Auth durumunu kontrol et
  if (!authStore.authenticated) {
    console.log('Kullanıcı oturum açmamış, yönlendiriliyor...');
    return router.push('/giris');
  }
  
  // Kullanıcı kimliğini kontrol et
  if (!userId.value) {
    console.error('Kullanıcı kimliği bulunamadı');
    toast.error('Kullanıcı bilgilerinize erişilemiyor');
    return router.push('/giris');
  }
  
  console.log('Kullanıcı kimliği:', userId.value);
  
  // Socket bağlantısını kontrol et ve gerekirse bağlan
  if (!connected.value || !socket.value) {
    console.log('Socket bağlantısı kuruluyor...');
    connect();
  } else {
    console.log('Socket zaten bağlı');
  }
  
  // Socket olaylarını dinle
  setupSocketListeners();
  
  try {
    // Arkadaşları yükle
    await fetchFriends();
    
    // Arkadaşlık isteklerini yükle
    await fetchFriendRequests();
    
    // Gönderilen istekleri yükle
    await fetchSentRequests();
    
    // Yükleme durumunu güncelle
    loading.value = false;
  } catch (error) {
    console.error('Veri yükleme hatası:', error);
    toast.error('Veriler yüklenirken bir hata oluştu');
    loading.value = false;
  }
});
</script>