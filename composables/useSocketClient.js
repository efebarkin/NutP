import { ref, computed, watch, onUnmounted, reactive, onMounted } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';

/**
 * Socket.io istemcisini yönetmek için composable
 * Auth store ile entegre çalışır ve kullanıcı oturum durumuna göre bağlantıyı yönetir
 */
export const useSocketClient = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  // Socket bağlantısı
  const socket = ref(null);
  const connected = ref(false);
  const connecting = ref(false);
  const socketUrl = process.env.SOCKET_URL || 'http://localhost:3000';
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 3;

  // Kullanıcı durumları
  const userStatuses = reactive(new Map());

  // Auth durumunu izle
  const isAuthenticated = computed(() => authStore.authenticated);

  // Get socket token directly from API
  const getSocketToken = async (userId) => {
    try {
      const response = await fetch('/api/auth/socket-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error getting socket token:', error);
      return null;
    }
  };

  // Initialize socket connection
  const initSocket = async () => {
    // Prevent multiple connection attempts
    if (connecting.value || connected.value) {
      console.log('Socket already connecting or connected');
      return;
    }

    connecting.value = true;

    try {
      console.log('Socket.io bağlantı başlatılıyor, URL:', socketUrl);

      // Get auth store
      const authStore = useAuthStore();

      // Debug auth store state
      console.log('Auth store initialized:', authStore.isInitialized);
      console.log('Auth store authenticated:', authStore.authenticated);
      console.log('Auth store user:', authStore.user);

      // Check if user is authenticated
      if (!authStore.authenticated) {
        console.error('User is not authenticated');
        connecting.value = false;
        return;
      }

      // Get user ID for authentication
      const userId = authStore.user?.id;

      if (!userId) {
        console.error('User ID not available');
        connecting.value = false;
        return;
      }

      console.log('User ID available:', userId);

      // Get socket token directly from API
      const token = await getSocketToken(userId);

      console.log('Socket token available:', !!token);

      if (!token) {
        console.error('Could not get socket token');
        connecting.value = false;
        return;
      }

      // Connect with token
      socket.value = io(socketUrl, {
        auth: { token },
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: false,
      });

      // Handle connection events
      socket.value.on('connect', () => {
        console.log('Socket connected successfully');
        connected.value = true;
        connecting.value = false;
        reconnectAttempts = 0;
      });

      socket.value.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        connected.value = false;
        connecting.value = false;

        // If we're getting authentication errors, try a different approach
        if (
          error.message.includes('Authentication error') &&
          reconnectAttempts < MAX_RECONNECT_ATTEMPTS
        ) {
          reconnectAttempts++;
          console.log(
            `Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`,
          );

          setTimeout(async () => {
            disconnectSocket();

            // Try different authentication methods
            if (reconnectAttempts === 1) {
              // Try with a different auth format
              console.log('Trying with different auth format');
              const freshToken = await getSocketToken(userId);
              if (freshToken) {
                socket.value = io(socketUrl, {
                  auth: { token: freshToken },
                  withCredentials: true,
                  transports: ['websocket', 'polling'],
                });
                setupSocketEvents();
              }
            } else if (reconnectAttempts === 2) {
              // Try with a different auth field
              console.log('Trying with different auth field');
              const freshToken = await getSocketToken(userId);
              if (freshToken) {
                socket.value = io(socketUrl, {
                  auth: {
                    authorization: `Bearer ${freshToken}`,
                  },
                  withCredentials: true,
                  transports: ['websocket', 'polling'],
                });
                setupSocketEvents();
              }
            } else {
              // Last resort: try with query parameter
              console.log('Trying with token as query parameter');
              const freshToken = await getSocketToken(userId);
              if (freshToken) {
                socket.value = io(`${socketUrl}?token=${freshToken}`, {
                  withCredentials: true,
                  transports: ['websocket', 'polling'],
                });
                setupSocketEvents();
              }
            }
          }, 1000 * reconnectAttempts);
        }
      });

      socket.value.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        connected.value = false;
        connecting.value = false;
      });

      // Kullanıcı durumu değişikliklerini dinle
      socket.value.on('user_status_change', ({ userId, status }) => {
        userStatuses.set(userId, status);
      });

      // Bağlantıyı başlat
      socket.value.connect();
    } catch (error) {
      console.error('Socket initialization error:', error);
      connecting.value = false;
    }
  };

  // Set up common socket events
  const setupSocketEvents = () => {
    if (!socket.value) return;

    socket.value.on('connect', () => {
      console.log('Socket connected successfully');
      connected.value = true;
      connecting.value = false;
      reconnectAttempts = 0;
    });

    socket.value.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      connected.value = false;
      connecting.value = false;
    });

    socket.value.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      connected.value = false;
      connecting.value = false;
    });
  };

  // Socket bağlantısını kapat
  const disconnectSocket = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connected.value = false;
      connecting.value = false;
    }
  };

  // Kullanıcı durumunu güncelle
  const updateUserStatus = (status) => {
    if (socket.value && connected.value) {
      socket.value.emit('update_status', { status }, (response) => {
        if (response.success) {
          console.log(`Kullanıcı durumu güncellendi: ${status}`);
        } else {
          console.error(
            'Kullanıcı durumu güncellenirken hata:',
            response.error,
          );
        }
      });
    }
  };

  // Kullanıcı durumunu al
  const getUserStatus = (userId) => {
    return userStatuses.get(userId) || 'offline';
  };

  // Kullanıcının çevrimiçi olup olmadığını kontrol et
  const isUserOnline = (userId) => {
    const status = userStatuses.get(userId);
    return status === 'online' || status === 'away';
  };

  // Initialize socket when auth store is ready
  onMounted(() => {
    // If auth store is not initialized, initialize it
    if (!authStore.isInitialized) {
      console.log('Auth store not initialized, initializing...');
      // Use Promise API to avoid useFetch warning
      Promise.resolve(authStore.initialize()).then(() => {
        if (authStore.authenticated) {
          initSocket();
        }
      });
    } else if (authStore.authenticated) {
      // If already authenticated, initialize socket
      console.log(
        'Auth store already initialized and authenticated, connecting socket...',
      );
      initSocket();
    }

    // Watch for auth store changes
    const unwatch = watch(
      [
        () => authStore.isInitialized,
        () => authStore.authenticated,
        () => authStore.user,
      ],
      ([initialized, authenticated, user]) => {
        console.log('Auth store changed:', {
          initialized,
          authenticated,
          user: !!user,
        });

        if (
          initialized &&
          authenticated &&
          user &&
          !connected.value &&
          !connecting.value
        ) {
          console.log('Auth conditions met, connecting socket...');
          initSocket();
        } else if (!authenticated && connected.value) {
          console.log('User logged out, disconnecting socket...');
          disconnectSocket();
        }
      },
      { immediate: true },
    );

    // Clean up watcher on unmount
    onUnmounted(() => {
      unwatch();
    });
  });

  // Clean up on unmount
  onUnmounted(() => {
    disconnectSocket();
  });

  // API fallback for when socket is not connected
  const fetchFriendsAPI = async () => {
    try {
      const response = await fetch('/api/users/me/friends', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || authStore.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.friends;
    } catch (error) {
      console.error('Error fetching friends via API:', error);
      throw error;
    }
  };

  const fetchConversationsAPI = async (limit = 10, skip = 0) => {
    try {
      const response = await fetch(
        `/api/conversations?limit=${limit}&skip=${skip}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || authStore.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching conversations via API:', error);
      throw error;
    }
  };

  return {
    socket,
    connected,
    initSocket,
    disconnectSocket,
    updateUserStatus,
    getUserStatus,
    isUserOnline,
    userStatuses,
    fetchFriendsAPI,
    fetchConversationsAPI,
  };
};
