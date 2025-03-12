<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="bg-green-500 text-white p-5 relative">
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="20" r="20" stroke="#FFFFFF" stroke-width="8" />
          <circle cx="20" cy="80" r="20" stroke="#FFFFFF" stroke-width="8" />
          <circle cx="50" cy="50" r="30" stroke="#FFFFFF" stroke-width="8" />
        </svg>
      </div>
      <h2 class="text-xl font-bold relative z-10">Konuşmalarım</h2>
    </div>
    
    <div class="p-2">
      <div class="mb-4 px-2">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Konuşma ara..." 
            class="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            v-model="searchQuery"
          >
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>
      
      <div class="space-y-1 max-h-[500px] overflow-y-auto">
        <div 
          v-for="conversation in filteredConversations" 
          :key="conversation._id"
          class="p-3 rounded-lg transition-all cursor-pointer"
          :class="[
            activeConversation && activeConversation._id === conversation._id 
              ? 'bg-green-50 border-l-4 border-green-500' 
              : 'hover:bg-gray-50'
          ]"
          @click="$emit('select-conversation', conversation)"
        >
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  v-if="getOtherUser(conversation).avatar" 
                  :src="getOtherUser(conversation).avatar" 
                  alt="Avatar"
                  class="w-full h-full object-cover"
                >
                <span v-else class="text-xl font-bold text-gray-500">
                  {{ getInitials(getOtherUser(conversation).name) }}
                </span>
              </div>
              <div 
                class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                :class="[
                  getOtherUser(conversation).isOnline ? 'bg-green-500' : 'bg-gray-400'
                ]"
              ></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <h3 class="font-medium text-gray-900 truncate">
                  {{ getOtherUser(conversation).name }}
                </h3>
                <span class="text-xs text-gray-500">
                  {{ formatTime(conversation.lastMessage?.createdAt) }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500 truncate max-w-[150px]">
                  <span v-if="conversation.isTyping" class="text-green-500 italic">
                    Yazıyor...
                  </span>
                  <span v-else-if="conversation.lastMessage">
                    {{ conversation.lastMessage.content }}
                  </span>
                  <span v-else class="text-gray-400 italic">
                    Henüz mesaj yok
                  </span>
                </p>
                
                <div v-if="getUnreadCount(conversation) > 0" class="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ getUnreadCount(conversation) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredConversations.length === 0" class="py-6 text-center">
          <p class="text-gray-500">Konuşma bulunamadı</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

const props = defineProps({
  conversations: {
    type: Array,
    default: () => []
  },
  activeConversation: {
    type: Object,
    default: null
  }
});

defineEmits(['select-conversation']);

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);
const searchQuery = ref('');

// Filtrelenmiş konuşmalar
const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return props.conversations;
  
  return props.conversations.filter(conversation => {
    const otherUser = getOtherUser(conversation);
    return otherUser.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Konuşmadaki diğer kullanıcıyı bul
const getOtherUser = (conversation) => {
  return conversation.participants.find(user => user._id !== currentUser.value?._id) || {};
};

// Kullanıcı adının baş harflerini al
const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Okunmamış mesaj sayısını hesapla
const getUnreadCount = (conversation) => {
  return conversation.unreadCount || 0;
};

// Zamanı formatla
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  
  // Bugün ise saat göster
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Dün ise "Dün" göster
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Dün';
  }
  
  // Bu hafta ise gün adını göster
  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const dayDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (dayDiff < 7) {
    return dayNames[date.getDay()];
  }
  
  // Diğer durumlar için tarih göster
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
</script>