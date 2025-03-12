<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h3 class="text-xl font-semibold mb-4">Arkadaş Ekle</h3>

    <div class="mb-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Kullanıcı ara..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          @input="handleSearch"
        />
        <div v-if="searching" class="absolute right-3 top-2">
          <div
            class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-500"
          ></div>
        </div>
      </div>
    </div>

    <div v-if="error" class="text-red-500 mb-4">
      {{ error }}
    </div>

    <div v-if="searchResults.length > 0" class="space-y-3 max-h-60 overflow-y-auto">
      <div
        v-for="user in searchResults"
        :key="user._id"
        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="user.avatar"
              :src="user.avatar"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-lg font-bold text-gray-500">
              {{ getInitials(user.name) }}
            </span>
          </div>
          <div>
            <p class="font-medium">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
        </div>

        <button
          v-if="!user.isFriend && !user.isPending && !user.isBlocked"
          @click="addFriend(user._id)"
          class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          :disabled="addingFriend === user._id"
        >
          <span v-if="addingFriend === user._id">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          <span v-else>Ekle</span>
        </button>

        <span
          v-else-if="user.isPending"
          class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm"
        >
          İstek Gönderildi
        </span>

        <span
          v-else-if="user.isFriend"
          class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm"
        >
          Arkadaş
        </span>

        <span
          v-else-if="user.isBlocked"
          class="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm"
        >
          Engellendi
        </span>
      </div>
    </div>

    <div v-else-if="searchQuery && !searching" class="text-center py-4 text-gray-500">
      Sonuç bulunamadı
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useSocketClient } from '~/composables/useSocketClient';
import { useDebounceFn } from '@vueuse/core';

const authStore = useAuthStore();
const { socket, connected } = useSocketClient();

const searchQuery = ref('');
const searchResults = ref([]);
const searching = ref(false);
const error = ref('');
const addingFriend = ref(null);

// Kullanıcı adının baş harflerini al
const getInitials = name => {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

// Debounce search to avoid too many requests
const handleSearch = useDebounceFn(async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  searching.value = true;
  error.value = '';

  try {
    // Try socket first
    if (socket.value && connected.value) {
      socket.value.emit('search_users', { query: searchQuery.value }, response => {
        searching.value = false;

        if (response && response.success) {
          searchResults.value = response.data;
        } else {
          // Socket başarısız olursa REST API'ye düş
          fetchUsersFromAPI();
        }
      });
    } else {
      // Socket bağlantısı yoksa REST API'ye düş
      fetchUsersFromAPI();
    }
  } catch (err) {
    console.error('Kullanıcı arama hatası:', err);
    error.value = 'Kullanıcılar aranamadı';
    searching.value = false;
    searchResults.value = [];
  }
}, 300);

// REST API'den kullanıcıları getir
const fetchUsersFromAPI = async () => {
  try {
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery.value)}`, {
      headers: authStore.getAuthHeader(),
    });

    if (response.ok) {
      const data = await response.json();
      searchResults.value = data.users || [];
    } else {
      console.error(`API error: ${response.status}`);
      searchResults.value = [];
      error.value = 'Kullanıcılar aranamadı';
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    searchResults.value = [];
    error.value = 'Kullanıcılar aranamadı';
  } finally {
    searching.value = false;
  }
};

// Add friend function
const addFriend = async friendId => {
  addingFriend.value = friendId;
  error.value = '';

  try {
    // Try socket first
    if (socket.value && connected.value) {
      socket.value.emit('add_friend', { friendId }, response => {
        if (response.success) {
          // Update the user in search results
          const userIndex = searchResults.value.findIndex(u => u._id === friendId);
          if (userIndex !== -1) {
            searchResults.value[userIndex].isPending = true;
            searchResults.value[userIndex].friendshipStatus = 'pending';
          }
        } else {
          throw new Error(response.error || 'Arkadaş eklenemedi');
        }
        addingFriend.value = null;
      });
    } else {
      // Fallback to REST API
      const response = await fetch(`/api/users/friends/${friendId}`, {
        method: 'POST',
        headers: {
          ...authStore.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Update the user in search results
      const userIndex = searchResults.value.findIndex(u => u._id === friendId);
      if (userIndex !== -1) {
        searchResults.value[userIndex].isPending = true;
        searchResults.value[userIndex].friendshipStatus = 'pending';
      }

      addingFriend.value = null;
    }
  } catch (err) {
    console.error('Arkadaş ekleme hatası:', err);
    error.value = 'Arkadaş eklenemedi: ' + err.message;
    addingFriend.value = null;
  }
};

// Clear results when query is empty
watch(searchQuery, newVal => {
  if (!newVal) {
    searchResults.value = [];
  }
});
</script> 