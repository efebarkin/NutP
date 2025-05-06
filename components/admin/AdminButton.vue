<template>
  <div v-if="isAdmin" class="admin-button-container">
    <NuxtLink to="/admin" class="admin-button" title="Admin Paneli" @click="navigateToAdmin">
      <div class="admin-icon">
        <span class="material-icons">admin_panel_settings</span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Admin paneline programatik olarak yönlendir
const navigateToAdmin = (event) => {
  event.preventDefault(); // Varsayılan davranışı engelle
  
  // Admin rolü kontrolü
  if (isAdmin.value) {
    router.push('/admin');
  } else {
    console.error('Admin rolü yok, yönlendirme engellendi');
  } 
};

const isAdmin = computed(() => {
  if (!authStore.user) {
    return false;
  }
  
  if (!authStore.user.role) {
    return false;
  }
  
  // Role bir dizi veya string olabilir, her iki durumu da kontrol et
  if (Array.isArray(authStore.user.role)) {
    const hasAdminRole = authStore.user.role.includes('admin');
    return hasAdminRole;
  } else if (typeof authStore.user.role === 'string') {
    const hasAdminRole = authStore.user.role === 'admin';
    return hasAdminRole;
  }
  
  return false;
});
</script>

<style scoped>
.admin-button-container {
  position: relative;
  margin-left: 10px;
}

.admin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(255, 255, 0, 0.7);
  animation: pulse 2s infinite;
}

.admin-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.material-icons {
  font-size: 24px;
}

/* Animasyon efekti */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(19, 184, 121, 0.87);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 0, 0);
  }
}

/* Sarı-beyaz dönen animasyon efekti */
.admin-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(transparent, rgba(255, 255, 255, 0.8), transparent 30%);
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
