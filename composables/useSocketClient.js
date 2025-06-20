import { ref, computed, watch, onUnmounted, reactive, onMounted } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';
import { emitter } from '~/utils/emitter'; // emitter'ı import et

// Global değişkenler - sayfa geçişlerinde korunacak
let globalSocket = null;
let globalConnected = false;
let globalConnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;
const userStatuses = reactive(new Map());

/**
 * Socket.io istemcisini yönetmek için composable
 * Auth store ile entegre çalışır ve kullanıcı oturum durumuna göre bağlantıyı yönetir
 */
export const useSocketClient = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  // Socket bağlantısı - global değişkenleri ref olarak dışa aç
  const socket = ref(globalSocket);
  const connected = ref(globalConnected);
  const connecting = ref(globalConnecting);
  const socketUrl = process.env.SOCKET_URL || 'http://localhost:3000';

  // Kullanıcı durumları
  // const userStatuses = reactive(new Map());

  // Auth durumunu izle
  const isAuthenticated = computed(() => authStore.authenticated);

  // Get socket token directly from API
  const getSocketToken = async (userId) => {
    try {
      if (!userId) {
        console.error('getSocketToken: userId parametresi gerekli');
        return null;
      }

      console.log('Socket token alınıyor, userId:', userId);

      // Önce auth store'dan token'ı al
      const authStore = useAuthStore();
      let authToken = authStore.user?.token;

      if (!authToken) {
        console.warn(
          'Auth token bulunamadı, refresh token ile yenilemeyi dene',
        );

        try {
          // Refresh token endpoint'ini çağır
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.user && refreshData.user.token) {
              authToken = refreshData.user.token;
              authStore.setUser(refreshData.user);
              console.log('Auth token refresh ile yenilendi');
            }
          } else {
            console.error('Refresh token hatası:', refreshResponse.status);
          }
        } catch (refreshError) {
          console.error('Refresh token sırasında hata:', refreshError);
        }
      }

      // Socket token endpoint'ini çağır
      const response = await fetch('/api/auth/socket-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          console.log('Socket token başarıyla alındı');
          // Socket token'ı auth store'a kaydet
          authStore.socketToken = data.token;
          return data.token;
        } else {
          console.error('Socket token API yanıt verdi ama token yok');
        }
      } else if (response.status === 401) {
        console.warn(
          'Socket token alınırken 401 hatası, token yenilemeyi dene',
        );

        // Refresh token endpoint'ini çağır
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.user && refreshData.user.token) {
            // Auth store'u güncelle
            authStore.setUser(refreshData.user);
            console.log('Token yenilendi, socket token tekrar deneniyor');

            // Yeniden socket token isteği yap
            return getSocketToken(userId);
          }
        } else {
          console.error('Token yenileme hatası:', refreshResponse.status);
        }
      } else {
        console.error('Socket token alınamadı, status:', response.status);
        const errorText = await response.text();
        console.error('Hata detayı:', errorText);
      }

      return null;
    } catch (error) {
      console.error('Error getting socket token:', error);
      return null;
    }
  };

  // Socket bağlantısı kur
  const connect = async () => {
    try {
      if (connecting.value) {
        console.log('Zaten bağlantı kurulmaya çalışılıyor, işlem atlanıyor');
        return;
      }

      if (connected.value && socket.value) {
        console.log('Zaten bağlı, yeniden bağlanma işlemi atlanıyor');
        return;
      }

      // Kullanıcı kimliğini al
      const userId = authStore.userId;
      if (!userId) {
        console.error(
          'Kullanıcı kimliği bulunamadı, socket bağlantısı kurulamıyor',
        );
        return;
      }

      console.log('Socket bağlantısı kuruluyor, userId:', userId);

      // Auth token'ı al
      let token = null;

      // Önce auth store'dan token'ı al
      if (authStore.user && authStore.user.token) {
        token = authStore.user.token;
        console.log("Auth store'dan token alındı");
      } else {
        console.warn(
          "Auth store'da token bulunamadı, socket token almayı dene",
        );
        token = await getSocketToken(userId);
      }

      if (!token) {
        console.error('Token alınamadı, socket bağlantısı kurulamıyor');
        return;
      }

      // Socket.io bağlantısı kur
      connectWithToken(userId, token);
    } catch (error) {
      console.error('Socket bağlantısı kurulurken hata:', error);
      connecting.value = false;
    }
  };

  // Token ile socket bağlantısı kur
  const connectWithToken = (userId, token) => {
    if (!userId || !token) {
      console.error('connectWithToken: userId ve token gerekli');
      return;
    }

    try {
      // Zaten bağlanma işlemi devam ediyorsa işlemi atla
      if (globalConnecting) {
        console.log('Zaten bağlanma işlemi devam ediyor, işlem atlanıyor');
        return;
      }

      // Zaten bağlıysa işlemi atla
      if (globalConnected && globalSocket) {
        console.log('Zaten bağlı, yeniden bağlanma işlemi atlanıyor');
        socket.value = globalSocket;
        connected.value = globalConnected;
        return;
      }

      // Bağlanma durumunu güncelle
      globalConnecting = true;
      connecting.value = globalConnecting;

      // Tarayıcının mevcut URL'sini kullan
      const currentUrl = import.meta.client
        ? window.location.origin
        : socketUrl;

      console.log('Socket.io bağlantısı kuruluyor...');
      console.log('Socket URL:', currentUrl);
      console.log('UserId:', userId);
      console.log('Token var mı:', token ? 'Evet' : 'Hayır');

      // Mevcut socket varsa bağlantıyı kapat
      if (globalSocket) {
        console.log('Mevcut socket bağlantısı kapatılıyor...');
        globalSocket.disconnect();
        globalSocket = null;
        socket.value = null;
      }

      // Socket.io bağlantısı oluştur
      globalSocket = io(currentUrl, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: false, // Manuel olarak yeniden bağlanma yapacağız
        auth: {
          token: token,
          userId: userId,
        },
        query: {
          token: token,
          userId: userId,
        },
      });

      socket.value = globalSocket;

      // Bağlantı olaylarını dinle
      globalSocket.on('connect', () => {
        console.log(
          'Socket.io bağlantısı kuruldu, socket ID:',
          globalSocket.id,
        );
        globalConnected = true;
        connected.value = globalConnected;
        globalConnecting = false;
        connecting.value = globalConnecting;
        reconnectAttempts = 0; // Yeniden bağlanma sayacını sıfırla

        // Kullanıcı durumu dinleyicilerini ayarla
        setupUserStatusListeners();

        // Arkadaşlık olaylarını dinle
        setupFriendshipListeners();

        // Bağlantı kuruldu olayını yayınla
        emitter.emit('socket:connected', { socketId: globalSocket.id });
      });

      globalSocket.on('connect_error', (error) => {
        console.error('Socket.io bağlantı hatası:', error.message);

        // Hata detaylarını logla
        if (error.data) {
          console.error('Bağlantı hatası detayları:', error.data);
        }

        globalConnected = false;
        connected.value = globalConnected;
        globalConnecting = false;
        connecting.value = globalConnecting;

        // Token hatası durumunda token yenilemeyi dene
        if (
          error.message.includes('Authentication error') ||
          error.message.includes('Token')
        ) {
          console.log('Token hatası, token yenilemeyi dene...');
          refreshToken(userId);
        } else {
          // Diğer hatalar için yeniden bağlanmayı dene
          handleReconnect(userId);
        }

        // Bağlantı hatası olayını yayınla
        emitter.emit('socket:connect_error', { error: error.message });
      });

      globalSocket.on('disconnect', (reason) => {
        console.log('Socket.io bağlantısı kesildi, sebep:', reason);
        globalConnected = false;
        connected.value = globalConnected;

        // Bağlantı kesildi olayını yayınla
        emitter.emit('socket:disconnected', { reason });

        // Bağlantı kesilme sebebine göre işlem yap
        if (reason === 'io server disconnect') {
          // Sunucu tarafından bağlantı kesildi, yeniden bağlanmayı dene
          console.log(
            'Sunucu tarafından bağlantı kesildi, yeniden bağlanmayı dene...',
          );
          refreshToken(userId);
        } else if (reason === 'transport close' || reason === 'ping timeout') {
          // Ağ hatası, yeniden bağlanmayı dene
          console.log('Ağ hatası, yeniden bağlanmayı dene...');
          handleReconnect(userId);
        }
      });
    } catch (error) {
      console.error('Socket.io bağlantı kurulurken hata:', error);
      globalConnected = false;
      connected.value = globalConnected;
      globalConnecting = false;
      connecting.value = false;
    }
  };

  // Yeniden bağlanma işlemi
  const handleReconnect = (userId) => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log(
        `Maksimum yeniden bağlanma denemesi (${MAX_RECONNECT_ATTEMPTS}) aşıldı`,
      );
      return;
    }

    reconnectAttempts++;
    const delay = reconnectAttempts * 2000; // Her denemede artan gecikme

    console.log(
      `${reconnectAttempts}. yeniden bağlanma denemesi ${delay}ms sonra yapılacak`,
    );

    setTimeout(() => {
      connect();
    }, delay);
  };

  // Token yenileme ve yeniden bağlanma
  const refreshToken = async (userId) => {
    if (!userId) {
      console.error('refreshToken: userId parametresi gerekli');
      return false;
    }

    console.log('Token yenileniyor, userId:', userId);

    try {
      // Refresh token endpoint'ini çağır
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Cookie'leri de gönder
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user && data.user.token) {
          // Auth store'u güncelle
          authStore.setUser(data.user);
          console.log('Token yenilendi, yeniden bağlanılıyor...');

          // Yeni token ile bağlan
          connectWithToken(userId, data.user.token);
          return true;
        } else {
          console.error('Refresh yanıtında token bulunamadı:', data);
        }
      } else {
        console.error('Token yenileme hatası:', response.status);

        // Socket token'ı almayı dene
        const socketToken = await getSocketToken(userId);
        if (socketToken) {
          console.log('Socket token alındı, yeniden bağlanılıyor...');
          connectWithToken(userId, socketToken);
          return true;
        } else {
          console.error('Socket token alınamadı');
        }
      }
    } catch (error) {
      console.error('Token yenileme sırasında hata:', error);
    }

    // Yeniden bağlanma denemesi yap
    handleReconnect(userId);
    return false;
  };

  // Arkadaşlık olaylarını dinle
  const setupFriendshipListeners = () => {
    console.log('Arkadaşlık olayları dinleyicileri ayarlanıyor...');

    if (!socket.value) {
      console.error('Socket bağlantısı yok, arkadaşlık olayları dinlenemiyor');
      return;
    }

    // Önceki dinleyicileri temizle
    socket.value.off('friend_request_accepted');
    socket.value.off('friend_request_received');
    socket.value.off('friend_request_rejected');
    socket.value.off('friend_removed');

    // Arkadaşlık isteği kabul edildiğinde
    socket.value.on('friend_request_accepted', (data) => {
      console.log('Socket: Arkadaşlık isteği kabul edildi olayı alındı:', data);

      if (!data) {
        console.error('Geçersiz arkadaşlık isteği kabul edildi verisi:', data);
        return;
      }

      // Veri yapısını kontrol et ve düzelt
      const eventData = {
        requestId: data.requestId,
        friend: data.friend || {},
      };

      console.log('Emitter ile yayınlanacak veri:', eventData);

      // Emitter ile olayı bildir
      emitter.emit('friendship:request_accepted', eventData);
    });

    // Arkadaşlık isteği alındığında
    socket.value.on('friend_request_received', (data) => {
      console.log('Socket: Yeni arkadaşlık isteği alındı olayı:', data);

      if (!data) {
        console.error('Geçersiz arkadaşlık isteği alındı verisi:', data);
        return;
      }

      // Veri yapısını kontrol et ve düzelt
      const eventData = {
        requestId: data.requestId,
        requester: data.requester || {},
      };

      console.log('Emitter ile yayınlanacak veri:', eventData);

      // Emitter ile olayı bildir
      emitter.emit('friendship:request_received', eventData);
    });

    // Arkadaşlık isteği reddedildiğinde
    socket.value.on('friend_request_rejected', (data) => {
      console.log('Socket: Arkadaşlık isteği reddedildi olayı:', data);

      if (!data) {
        console.error('Geçersiz arkadaşlık isteği reddedildi verisi:', data);
        return;
      }

      // Veri yapısını kontrol et ve düzelt
      const eventData = {
        requestId: data.requestId,
      };

      console.log('Emitter ile yayınlanacak veri:', eventData);

      // Emitter ile olayı bildir
      emitter.emit('friendship:request_rejected', eventData);
    });

    // Arkadaş kaldırıldığında
    socket.value.on('friend_removed', (data) => {
      console.log('Socket: Arkadaş kaldırıldı olayı:', data);

      if (!data) {
        console.error('Geçersiz arkadaş kaldırıldı verisi:', data);
        return;
      }

      // Veri yapısını kontrol et ve düzelt
      const eventData = {
        friendId: data.friendId,
      };

      console.log('Emitter ile yayınlanacak veri:', eventData);

      // Emitter ile olayı bildir
      emitter.emit('friendship:friend_removed', eventData);
    });

    console.log('Arkadaşlık olayları dinleyicileri ayarlandı');
  };

  // Kullanıcı durumu dinleyicilerini ayarla
  const setupUserStatusListeners = () => {
    if (!globalSocket) {
      console.error('setupUserStatusListeners: Socket bağlantısı yok');
      return;
    }

    // Önceki dinleyicileri temizle
    globalSocket.off('user:online');
    globalSocket.off('user:offline');

    // Kullanıcı çevrimiçi olduğunda
    globalSocket.on('user:online', (data) => {
      console.log('Kullanıcı çevrimiçi:', data);
      emitter.emit('user:online', data);
    });

    // Kullanıcı çevrimdışı olduğunda
    globalSocket.on('user:offline', (data) => {
      console.log('Kullanıcı çevrimdışı:', data);
      emitter.emit('user:offline', data);
    });

    console.log('Kullanıcı durumu dinleyicileri ayarlandı');
  };

  // Set up common socket events
  const setupSocketEvents = () => {
    if (!globalSocket) return;

    globalSocket.on('disconnect', (reason) => {
      console.log('Socket.io bağlantısı kesildi:', reason);
      globalConnected = false;
      connected.value = globalConnected;
    });

    globalSocket.on('connect_error', (error) => {
      console.error('Socket.io bağlantı hatası:', error.message);
      globalConnected = false;
      connected.value = globalConnected;

      // Bağlantı hatası token ile ilgiliyse
      if (
        error.message.includes('Authentication error') ||
        error.message.includes('Token')
      ) {
        console.log('Token hatası nedeniyle yeniden token alınacak');
        // Token'ı yenilemeyi dene
        const userId =
          authStore.userId || authStore.user?._id || authStore.user?.id;
        if (userId) {
          getSocketToken(userId).then((token) => {
            if (token) {
              // Yeni token ile bağlantıyı yeniden kur
              disconnectSocket();
              connectWithToken(userId, token);
            }
          });
        }
      }
    });

    // Kullanıcı durumu değişikliklerini dinle
    globalSocket.on('user_status_change', (data) => {
      if (data && data.userId && data.status) {
        userStatuses.set(data.userId, data.status);
      }
    });
  };

  // Disconnect socket
  const disconnectSocket = () => {
    if (globalSocket) {
      globalSocket.disconnect();
      globalSocket = null;
      globalConnected = false;
      connected.value = globalConnected;
    }
  };

  // Emit event to server
  const emit = (event, data, callback) => {
    if (!globalSocket || !globalConnected) {
      console.warn('Socket.io bağlantısı yok, olay gönderilemiyor:', event);
      return;
    }

    globalSocket.emit(event, data, callback);
  };

  // Listen for event from server
  const on = (event, callback) => {
    if (!globalSocket) {
      console.warn('Socket.io bağlantısı yok, olay dinlenemiyor:', event);
      return;
    }

    globalSocket.on(event, callback);
  };

  // Remove event listener
  const off = (event, callback) => {
    if (!globalSocket) return;
    globalSocket.off(event, callback);
  };

  // Kullanıcı durumunu al
  const getUserStatus = (userId) => {
    return userStatuses.get(userId) || 'offline';
  };

  // Auth durumu değiştiğinde socket bağlantısını yönet
  watch(
    () => authStore.authenticated,
    (newValue) => {
      if (newValue) {
        connect();
      } else {
        disconnectSocket();
      }
    },
    { immediate: true },
  );

  // Component mounted olduğunda bağlantıyı kur (eğer zaten bağlı değilse)
  onMounted(() => {
    if (authStore.authenticated && !globalSocket) {
      console.log('Component mounted: Socket bağlantısı kuruluyor');
      connect();
    } else if (globalSocket) {
      // Eğer global socket zaten varsa, local ref'i güncelle
      socket.value = globalSocket;
      connected.value = globalConnected;
    }
  });

  // Component unmounted olduğunda bağlantıyı KAPATMA
  // Sayfa geçişlerinde bağlantının korunması için bu kodu yorum satırına alıyoruz
  // onUnmounted(() => {
  //   disconnectSocket();
  // });

  return {
    socket,
    connected,
    emit,
    on,
    off,
    getUserStatus,
    connect,
    disconnectSocket,
  };
};

export default useSocketClient;
