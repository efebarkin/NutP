<template>
  <div class="container mx-auto py-8 px-4">
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useSocketClient } from '~/composables/useSocketClient';
import { useRouter } from 'vue-router';

// Router
const router = useRouter();

// Auth store
const authStore = useAuthStore();

// Socket client
const { socket, connected, emit, on, off, connect, disconnect } = useSocketClient();

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
    markAsRead(conversation._id);
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

    try {
      const response = await emit('get_messages', { conversationId });
      
      if (response.success) {
        messages.value = response.data;
      } else {
        console.error('Mesajlar yüklenemedi:', response.error);
        socketError.value = 'Mesajlar yüklenemedi: ' + response.error;
      }
    } catch (error) {
      console.error('Mesajlar yüklenirken bir hata oluştu:', error);
      socketError.value = 'Mesajlar yüklenemedi: ' + error.message;
    }
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

    try {
      const response = await emit('get_conversations', {});
      
      if (response.success) {
        conversations.value = response.data;
        loading.value = false;
      } else {
        console.error('Konuşmalar yüklenemedi:', response.error);
        socketError.value = 'Konuşmalar yüklenemedi: ' + response.error;
        loading.value = false;
      }
    } catch (error) {
      console.error('Konuşmalar yüklenirken bir hata oluştu:', error);
      socketError.value = 'Konuşmalar yüklenemedi: ' + error.message;
      loading.value = false;
    }
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
      sender: authStore.user._id
    };
    conversations.value[conversationIndex].updatedAt = new Date().toISOString();
  }

  // Socket üzerinden mesaj gönder
  emit('send_message', messageData)
    .then(response => {
      if (response && response.success) {
        console.log('Mesaj başarıyla gönderildi:', response);
        
        // Geçici mesajı gerçek mesajla değiştir
        const index = messages.value.findIndex(m => m._id === tempId);
        if (index !== -1) {
          messages.value[index] = response.message || {
            ...messages.value[index],
            _id: response.messageId || messages.value[index]._id,
            _temp: false
          };
        }
      } else {
        console.error('Mesaj gönderilemedi:', response?.error);
        socketError.value = 'Mesaj gönderilemedi: ' + (response?.error || 'Bilinmeyen hata');
        
        // Geçici mesajı hatalı olarak işaretle
        const index = messages.value.findIndex(m => m._id === tempId);
        if (index !== -1) {
          messages.value[index]._error = true;
        }
      }
    })
    .catch(error => {
      console.error('Mesaj gönderirken bir hata oluştu:', error);
      socketError.value = 'Mesaj gönderilemedi: ' + error.message;
      
      // Geçici mesajı hatalı olarak işaretle
      const index = messages.value.findIndex(m => m._id === tempId);
      if (index !== -1) {
        messages.value[index]._error = true;
      }
    });
};

// Mesajları okundu olarak işaretle
const markAsRead = async conversationId => {
  if (!conversationId) return;

  try {
    const response = await emit('mark_messages_read', { conversationId });
    
    if (response && response.success) {
      console.log('Mesajlar okundu olarak işaretlendi');
      
      // UI'da okundu olarak güncelle
      const index = conversations.value.findIndex(c => c._id === conversationId);
      if (index !== -1) {
        conversations.value[index].unreadCount = 0;
      }
    } else {
      console.error('Mesajlar okundu olarak işaretlenemedi:', response?.error);
    }
  } catch (error) {
    console.error('Mesajlar okundu olarak işaretlenirken bir hata oluştu:', error);
  }
};

// Yazma durumunu güncelle
const updateTypingStatus = (isTyping) => {
  if (!activeConversation.value) return;
  
  const typingData = {
    conversationId: activeConversation.value._id,
    isTyping
  };
  
  emit('typing', typingData)
    .catch(error => {
      console.error('Yazma durumu güncellenirken bir hata oluştu:', error);
    });
};

// Socket event dinleyicilerini kur
const setupSocketListeners = () => {
  console.log('Mesajlaşma olayları dinleyicileri kuruluyor...');
  
  // Socket bağlantısını kontrol et
  if (!socket.value || !connected.value) {
    console.error('Socket bağlantısı yok, mesajlaşma olayları dinleyicileri kurulamıyor');
    return;
  }
  
  // Önceki dinleyicileri temizle
  try {
    off('new_message');
    off('message_read');
    off('typing');
    off('conversation_updated');
  } catch (error) {
    console.error('Dinleyiciler temizlenirken hata oluştu:', error);
  }
  
  // Yeni mesaj geldiğinde
  on('new_message', (data) => {
    console.log('Yeni mesaj alındı:', data);
    
    // Mesaj mevcut aktif konuşmaya aitse, mesajlar listesine ekle
    if (activeConversation.value && data.conversationId === activeConversation.value._id) {
      // Mesajı ekle
      messages.value.push(data);
      
      // Mesajı okundu olarak işaretle
      markAsRead(data.conversationId);
    }
    
    // Konuşma listesini güncelle
    const conversationIndex = conversations.value.findIndex(c => c._id === data.conversationId);
    if (conversationIndex !== -1) {
      // Konuşmayı güncelle
      conversations.value[conversationIndex].lastMessage = {
        content: data.content,
        createdAt: data.createdAt,
        sender: data.sender._id
      };
      conversations.value[conversationIndex].updatedAt = data.createdAt;
      
      // Eğer aktif konuşma değilse, okunmamış sayısını artır
      if (!activeConversation.value || activeConversation.value._id !== data.conversationId) {
        conversations.value[conversationIndex].unreadCount = (conversations.value[conversationIndex].unreadCount || 0) + 1;
      }
      
      // Konuşmayı listenin en üstüne taşı
      const conversation = conversations.value.splice(conversationIndex, 1)[0];
      conversations.value.unshift(conversation);
    } else {
      // Konuşma listede yoksa, konuşmaları yeniden yükle
      loadConversations();
    }
  });
  
  // Mesaj okunduğunda
  on('message_read', (data) => {
    console.log('Mesaj okundu bildirimi:', data);
    
    // Mesajları güncelle
    if (activeConversation.value && data.conversationId === activeConversation.value._id) {
      // Mesajları okundu olarak işaretle
      messages.value.forEach(message => {
        if (message.sender._id === authStore.user._id && !message.read) {
          message.read = true;
        }
      });
    }
  });
  
  // Karşı taraf yazıyor bildirimi
  on('typing', (data) => {
    console.log('Yazıyor bildirimi:', data);
    
    // Aktif konuşmayı güncelle
    if (activeConversation.value && data.conversationId === activeConversation.value._id) {
      // Konuşmayı güncelle
      const conversationIndex = conversations.value.findIndex(c => c._id === data.conversationId);
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].isTyping = data.isTyping;
        
        // Aktif konuşmayı da güncelle
        activeConversation.value.isTyping = data.isTyping;
      }
    }
  });
  
  // Konuşma güncellendiğinde
  on('conversation_updated', (data) => {
    console.log('Konuşma güncellendi:', data);
    
    // Konuşma listesini güncelle
    const conversationIndex = conversations.value.findIndex(c => c._id === data.conversation._id);
    if (conversationIndex !== -1) {
      conversations.value[conversationIndex] = data.conversation;
      
      // Eğer aktif konuşma ise, aktif konuşmayı da güncelle
      if (activeConversation.value && activeConversation.value._id === data.conversation._id) {
        activeConversation.value = data.conversation;
      }
    } else {
      // Konuşma listede yoksa, konuşmaları yeniden yükle
      loadConversations();
    }
  });
};

// Sayfa yüklendiğinde
onMounted(async () => {
  // Initialize auth store if needed
  if (!authStore.user?.token && localStorage.getItem('token')) {
    await authStore.initializeFromStorage();
  }

  // Check authentication
  if (!checkAuth()) return;

  // Socket bağlantısını kontrol et
  if (!connected.value) {
    console.log('Socket bağlantısı kuruluyor...');
    await connect();
  }

  // Socket dinleyicilerini kur
  setupSocketListeners();

  // Konuşmaları yükle
  await loadConversations();

  // URL'den kullanıcı ID'si varsa, o kullanıcı ile konuşma başlat
  const userId = new URLSearchParams(window.location.search).get('user');
  if (userId) {
    console.log('URL\'den kullanıcı ID\'si bulundu:', userId);
    
    // Kullanıcı ile konuşma var mı kontrol et
    const conversation = conversations.value.find(c => 
      c.participants.some(p => p._id === userId || p.id === userId)
    );
    
    if (conversation) {
      console.log('Kullanıcı ile mevcut konuşma bulundu:', conversation);
      selectConversation(conversation);
    } else {
      console.log('Kullanıcı ile konuşma bulunamadı, yeni konuşma başlatılacak');
      // Yeni konuşma başlat
      try {
        const response = await emit('create_conversation', { participantId: userId });
        
        if (response && response.success) {
          console.log('Yeni konuşma başarıyla oluşturuldu:', response);
          
          // Konuşmaları yeniden yükle
          await loadConversations();
          
          // Yeni oluşturulan konuşmayı seç
          const newConversation = conversations.value.find(c => c._id === response.conversation._id);
          if (newConversation) {
            selectConversation(newConversation);
          }
        } else {
          console.error('Konuşma oluşturulamadı:', response?.error);
          socketError.value = 'Konuşma oluşturulamadı: ' + (response?.error || 'Bilinmeyen hata');
        }
      } catch (error) {
        console.error('Konuşma oluşturulurken bir hata oluştu:', error);
        socketError.value = 'Konuşma oluşturulamadı: ' + error.message;
      }
    }
  }
});

// Sayfa kapatıldığında dinleyicileri temizle
onUnmounted(() => {
  console.log('Mesajlaşma olayları dinleyicileri temizleniyor...');
  
  // Socket bağlantısını kontrol et
  if (!socket.value) {
    console.log('Socket bağlantısı yok, temizleme işlemi atlanıyor');
    return;
  }
  
  // Socket dinleyicilerini temizle
  try {
    off('new_message');
    off('message_read');
    off('typing');
    off('conversation_updated');
  } catch (error) {
    console.error('Dinleyiciler temizlenirken hata oluştu:', error);
  }
});
</script>