<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px]">
    <!-- Mesajlaşma Başlığı -->
    <div class="bg-green-500 text-white p-4 flex justify-between items-center relative">
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 80C31 65 40 65 50 80C60 95 69 95 80 80" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
          <path d="M20 60C31 45 40 45 50 60C60 75 69 75 80 60" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
          <path d="M20 40C31 25 40 25 50 40C60 55 69 55 80 40" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
        </svg>
      </div>
      
      <div class="flex items-center space-x-3 relative z-10">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              v-if="otherUser.avatar" 
              :src="otherUser.avatar" 
              alt="Avatar"
              class="w-full h-full object-cover"
            >
            <span v-else class="text-lg font-bold text-gray-500">
              {{ getInitials(otherUser.name) }}
            </span>
          </div>
          <div 
            class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
            :class="[
              otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
            ]"
          ></div>
        </div>
        
        <div>
          <h3 class="font-semibold">{{ otherUser.name }}</h3>
          <p class="text-xs text-green-100">
            {{ otherUser.isOnline ? 'Çevrimiçi' : 'Çevrimdışı' }}
            <span v-if="conversation.isTyping" class="ml-2 animate-pulse">
              yazıyor...
            </span>
          </p>
        </div>
      </div>
      
      <div class="relative z-10">
        <button class="p-2 rounded-full hover:bg-green-600 transition-colors">
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>
    
    <!-- Mesajlar -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
      @scroll="handleScroll"
    >
      <div v-if="loading" class="flex justify-center items-center h-full">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
      
      <template v-else>
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full">
          <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-comments text-2xl text-green-500"></i>
          </div>
          <p class="text-gray-500">Henüz mesaj yok. Konuşmaya başlayın!</p>
        </div>
        
        <template v-else>
          <div 
            v-for="(message, index) in messages" 
            :key="message._id"
            class="flex"
            :class="[
              message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'
            ]"
          >
            <!-- Tarih Ayırıcı -->
            <div 
              v-if="shouldShowDateSeparator(message, index)"
              class="w-full text-center my-4"
            >
              <div class="inline-block px-4 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                {{ formatMessageDate(message.createdAt) }}
              </div>
            </div>
            
            <!-- Mesaj Balonu -->
            <div 
              class="max-w-[75%] rounded-2xl px-4 py-2 shadow-sm"
              :class="[
                message.sender._id === currentUser._id 
                  ? 'bg-green-500 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              ]"
            >
              <p>{{ message.content }}</p>
              <div 
                class="text-xs mt-1 flex justify-end items-center space-x-1"
                :class="[
                  message.sender._id === currentUser._id 
                    ? 'text-green-100' 
                    : 'text-gray-500'
                ]"
              >
                <span>{{ formatMessageTime(message.createdAt) }}</span>
                <span v-if="message.sender._id === currentUser._id">
                  <i 
                    class="fas fa-check-double" 
                    :class="[
                      message.read ? 'text-blue-400' : ''
                    ]"
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
    
    <!-- Mesaj Gönderme Alanı -->
    <div class="border-t p-3">
      <form @submit.prevent="sendMessage" class="flex items-center space-x-2">
        <button 
          type="button"
          class="p-2 text-gray-500 hover:text-green-500 transition-colors"
        >
          <i class="fas fa-paperclip"></i>
        </button>
        
        <div class="flex-1 relative">
          <input 
            v-model="newMessage"
            type="text"
            placeholder="Mesajınızı yazın..."
            class="w-full py-2 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            @input="handleTyping"
          >
        </div>
        
        <button 
          type="submit"
          class="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!newMessage.trim()"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
  conversation: {
    type: Object,
    required: true
  },
  messages: {
    type: Array,
    default: () => []
  },
  currentUser: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['send-message', 'mark-as-read', 'typing']);

const newMessage = ref('');
const loading = ref(false);
const messagesContainer = ref(null);
const isTyping = ref(false);
const lastTypingTime = ref(0);

// Diğer kullanıcı
const otherUser = computed(() => {
  return props.conversation.participants.find(user => user._id !== props.currentUser._id) || {};
});

// Kullanıcı adının baş harflerini al
const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Mesaj gönder
const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  
  emit('send-message', newMessage.value);
  newMessage.value = '';
  
  // Yazıyor durumunu kapat
  isTyping.value = false;
  emit('typing', false);
  
  // Mesaj listesinin en altına kaydır
  scrollToBottom();
};

// Mesaj listesinin en altına kaydır
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Scroll olayını yönet (eski mesajları yükleme için)
const handleScroll = () => {
  if (messagesContainer.value && messagesContainer.value.scrollTop === 0) {
    // Burada daha eski mesajları yükleme işlemi yapılabilir
    console.log('Daha eski mesajlar yüklenebilir');
  }
};

// Tarih ayırıcısı gösterilmeli mi?
const shouldShowDateSeparator = (message, index) => {
  if (index === 0) return true;
  
  const currentDate = new Date(message.createdAt).toDateString();
  const prevDate = new Date(props.messages[index - 1].createdAt).toDateString();
  
  return currentDate !== prevDate;
};

// Mesaj tarihini formatla
const formatMessageDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // Bugün ise "Bugün" göster
  if (date.toDateString() === now.toDateString()) {
    return 'Bugün';
  }
  
  // Dün ise "Dün" göster
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Dün';
  }
  
  // Diğer durumlar için tarih göster
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Mesaj saatini formatla
const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

// Yazıyor durumunu yönet
const handleTyping = useDebounceFn(() => {
  const now = Date.now();
  const TYPING_TIMER_LENGTH = 3000; // 3 saniye
  
  if (!isTyping.value) {
    isTyping.value = true;
    emit('typing', true);
  }
  
  lastTypingTime.value = now;
  
  setTimeout(() => {
    const timeNow = Date.now();
    const timeDiff = timeNow - lastTypingTime.value;
    
    if (timeDiff >= TYPING_TIMER_LENGTH && isTyping.value) {
      isTyping.value = false;
      emit('typing', false);
    }
  }, TYPING_TIMER_LENGTH);
}, 300);

// Mesajlar değiştiğinde en alta kaydır
watch(() => props.messages.length, () => {
  scrollToBottom();
});

// Konuşma değiştiğinde en alta kaydır
watch(() => props.conversation, () => {
  scrollToBottom();
});

onMounted(() => {
  scrollToBottom();
});
</script>