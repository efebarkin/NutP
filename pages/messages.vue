<template>
  <div class="container mx-auto py-8 px-4">
    <AuthCheck>
      <!-- Socket Error Message -->
      <div
        v-if="socketError"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert"
      >
        <strong class="font-bold">Hata!</strong>
        <span class="block sm:inline"> {{ socketError }}</span>
        <button @click="socketError = null" class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-[70vh]">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"
        ></div>
      </div>

      <div v-else class="flex flex-col md:flex-row gap-6">
        <!-- Sol Taraf - Konuşma Listesi -->
        <div class="w-full md:w-1/3">
          <ConversationList
            :conversations="conversations"
            :active-conversation="activeConversation"
            @select-conversation="selectConversation"
          />
        </div>

        <!-- Sağ Taraf - Mesajlaşma Alanı -->
        <div class="w-full md:w-2/3">
          <div
            v-if="!activeConversation"
            class="bg-white rounded-xl shadow-lg p-8 text-center h-[600px] flex flex-col items-center justify-center"
          >
            <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-comments text-3xl text-green-500"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Mesajlaşmaya Başlayın</h2>
            <p class="text-gray-600">
              Mesajlaşmak için sol taraftan bir konuşma seçin veya yeni bir konuşma başlatın.
            </p>
          </div>

          <MessageArea
            v-else
            :conversation="activeConversation"
            :messages="messages"
            :current-user="authStore.user"
            @send-message="sendMessage"
            @mark-as-read="markAsRead"
            @typing="updateTypingStatus"
          />
        </div>
      </div>
    </AuthCheck>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useSocketClient } from '~/composables/useSocketClient';
import { useRouter } from 'vue-router';
import AuthCheck from '~/components/AuthCheck';

// Router
const router = useRouter();

// Auth store
const authStore = useAuthStore();

// Socket client
const { socket, connected } = useSocketClient();

// Sayfa durumu
const loading = ref(true);
const conversations = ref([]);
const activeConversation = ref(null);
const messages = ref([]);
const socketError = ref(null);

// Check authentication and redirect if needed
const checkAuth = () => {
  if (!authStore.authenticated) {
    console.log('User not authenticated, redirecting to login');
    router.push('/auth/login');
    return false;
  }
  return true;
};

// Konuşma seç
const selectConversation = conversation => {
  activeConversation.value = conversation;
  loadMessages(conversation._id);

  // Okunmamış mesajları okundu olarak işaretle
  if (conversation.unreadCount > 0) {
    socket.value.emit('mark_messages_read', { conversationId: conversation._id });

    // UI'da da güncelle
    const index = conversations.value.findIndex(c => c._id === conversation._id);
    if (index !== -1) {
      conversations.value[index].unreadCount = 0;
    }
  }
};

// Mesajları yükle
const loadMessages = async conversationId => {
  try {
    messages.value = []; // Önceki mesajları temizle

    if (!socket.value || !connected.value) {
      socketError.value = 'Socket bağlantısı kurulamadı. Lütfen sayfayı yenileyin.';
      return;
    }

    // Socket üzerinden mesajları iste
    socket.value.emit('get_messages', { conversationId }, response => {
      if (response.success) {
        messages.value = response.data;
      } else {
        console.error('Mesajlar yüklenemedi:', response.error);
        socketError.value = 'Mesajlar yüklenemedi: ' + response.error;
      }
    });
  } catch (error) {
    console.error('Mesajlar yüklenirken bir hata oluştu:', error);
    socketError.value = 'Mesajlar yüklenemedi: ' + error.message;
  }
};

// Konuşmaları yükle
const loadConversations = async () => {
  try {
    loading.value = true;
    socketError.value = null;

    if (!socket.value || !connected.value) {
      socketError.value = 'Socket bağlantısı kurulamadı. Lütfen sayfayı yenileyin.';
      loading.value = false;
      return;
    }

    // Socket üzerinden konuşmaları iste
    socket.value.emit('get_conversations', {}, response => {
      if (response.success) {
        conversations.value = response.data;
        loading.value = false;
      } else {
        console.error('Konuşmalar yüklenemedi:', response.error);
        socketError.value = 'Konuşmalar yüklenemedi: ' + response.error;
        loading.value = false;
      }
    });
  } catch (error) {
    console.error('Konuşmalar yüklenirken bir hata oluştu:', error);
    socketError.value = 'Konuşmalar yüklenemedi: ' + error.message;
    loading.value = false;
  }
};

// Mesaj gönder
const sendMessage = content => {
  if (!activeConversation.value) return;

  const messageData = {
    conversationId: activeConversation.value._id,
    content,
    sender: authStore.user._id,
  };

  // Socket üzerinden mesaj gönder
  socket.value.emit('send_message', messageData);

  // Optimistik UI güncellemesi
  const tempId = Date.now().toString();
  const newMessage = {
    _id: tempId,
    content,
    sender: authStore.user,
    createdAt: new Date().toISOString(),
    read: false,
    _temp: true, // Geçici mesaj olduğunu belirtmek için
  };

  messages.value.push(newMessage);

  // Konuşma listesini güncelle
  const conversationIndex = conversations.value.findIndex(
    c => c._id === activeConversation.value._id
  );
  if (conversationIndex !== -1) {
    conversations.value[conversationIndex].lastMessage = {
      content,
      createdAt: new Date().toISOString(),
    };

    // Konuşmayı en üste taşı
    const conversation = conversations.value.splice(conversationIndex, 1)[0];
    conversations.value.unshift(conversation);
  }
};

// Mesajları okundu olarak işaretle
const markAsRead = messageIds => {
  if (!activeConversation.value) return;

  socket.value.emit('mark_messages_read', {
    conversationId: activeConversation.value._id,
    messageIds,
  });
};

// Yazıyor durumunu güncelle
const updateTypingStatus = isTyping => {
  if (!activeConversation.value) return;

  socket.value.emit('typing', {
    conversationId: activeConversation.value._id,
    isTyping,
  });
};

// Socket event listeners
const setupSocketListeners = () => {
  // Yeni mesaj alındığında
  socket.value.on('new_message', message => {
    // Eğer mesaj aktif konuşmaya aitse, mesajlar listesine ekle
    if (activeConversation.value && message.conversationId === activeConversation.value._id) {
      // Geçici mesajı kaldır (eğer varsa)
      messages.value = messages.value.filter(m => !m._temp);

      // Yeni mesajı ekle
      messages.value.push(message);

      // Mesajı okundu olarak işaretle
      socket.value.emit('mark_messages_read', { conversationId: message.conversationId });
    }

    // Konuşma listesini güncelle
    const conversationIndex = conversations.value.findIndex(c => c._id === message.conversationId);
    if (conversationIndex !== -1) {
      // Konuşmanın son mesajını güncelle
      conversations.value[conversationIndex].lastMessage = {
        content: message.content,
        createdAt: message.createdAt,
      };

      // Eğer aktif konuşma değilse, okunmamış mesaj sayısını artır
      if (!activeConversation.value || activeConversation.value._id !== message.conversationId) {
        conversations.value[conversationIndex].unreadCount =
          (conversations.value[conversationIndex].unreadCount || 0) + 1;
      }

      // Konuşmayı en üste taşı
      const conversation = conversations.value.splice(conversationIndex, 1)[0];
      conversations.value.unshift(conversation);
    } else {
      // Eğer konuşma listede yoksa, konuşmaları yeniden yükle
      loadConversations();
    }
  });

  // Kullanıcı yazıyor durumu güncellendiğinde
  socket.value.on('user_typing', ({ conversationId, isTyping }) => {
    const conversationIndex = conversations.value.findIndex(c => c._id === conversationId);
    if (conversationIndex !== -1) {
      conversations.value[conversationIndex].isTyping = isTyping;
    }
  });

  // Kullanıcı çevrimiçi durumu güncellendiğinde
  socket.value.on('user_status_change', ({ userId, isOnline }) => {
    // Tüm konuşmalardaki kullanıcıların durumunu güncelle
    conversations.value.forEach(conversation => {
      const userIndex = conversation.participants.findIndex(p => p._id === userId);
      if (userIndex !== -1) {
        conversation.participants[userIndex].isOnline = isOnline;
      }
    });
  });
};

// Sayfa yüklendiğinde
onMounted(async () => {
  // Initialize auth store if needed
  if (!authStore.user?.token && localStorage.getItem('token')) {
    authStore.initialize();
  }

  // Kullanıcı giriş yapmış mı kontrol et
  if (!checkAuth()) {
    loading.value = false;
    return;
  }

  // Socket bağlantısı kurulduğunda
  watch(
    connected,
    isConnected => {
      if (isConnected) {
        socketError.value = null;
        setupSocketListeners();
        loadConversations();
      } else {
        socketError.value = 'Socket bağlantısı kurulamadı. Lütfen sayfayı yenileyin.';
        loading.value = false;
      }
    },
    { immediate: true }
  );
});

// Sayfa kapatıldığında
onUnmounted(() => {
  if (socket.value) {
    socket.value.off('new_message');
    socket.value.off('user_typing');
    socket.value.off('user_status_change');
  }
});
</script>