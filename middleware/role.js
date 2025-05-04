import { useAuthStore } from '~/stores/auth';
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

/**
 * Rol bazlı erişim kontrolü için middleware
 * Kullanımı:
 * 
 * Sayfa veya layout dosyasında:
 * definePageMeta({
 *   middleware: [
 *     // Tek bir rol için
 *     (to) => role(to, 'admin')
 *     
 *     // veya birden fazla rol için
 *     (to) => role(to, ['admin', 'moderator'])
 *   ]
 * })
 */

export default function(requiredRoles) {
  return defineNuxtRouteMiddleware(async (to) => {
    // SSR sırasında kontrol yapma
    if (process.server) return;
  
    const authStore = useAuthStore();
    
    // İlk kez yükleniyorsa auth store'u başlat
    if (!authStore.isInitialized) {
      await authStore.initialize();
    }
    
    // Authenticated durumunu kontrol et
    const isAuthenticated = authStore.authenticated;
    
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isAuthenticated) {
      console.log('Role Middleware: Kullanıcı giriş yapmamış, login sayfasına yönlendiriliyor');
      // Yönlendirme sonrası kullanıcıyı geri getirmek için yolu kaydet
      localStorage.setItem('redirectPath', to.fullPath);
      return navigateTo('/login');
    }
    
    // Kullanıcı rollerini kontrol et
    const userRoles = authStore.user?.role || [];
    
    // requiredRoles string veya array olabilir
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Kullanıcının gerekli rollerden en az birine sahip olup olmadığını kontrol et
    const hasRequiredRole = roles.some(role => {
      // userRoles array veya string olabilir
      if (Array.isArray(userRoles)) {
        return userRoles.includes(role);
      }
      return userRoles === role;
    });
    
    // Gerekli role sahip değilse ana sayfaya yönlendir
    if (!hasRequiredRole) {
      console.log(`Role Middleware: Kullanıcı gerekli role sahip değil (${roles.join(', ')}), erişim engellendi`);
      
      // Toast mesajı göster (eğer toast kütüphanesi varsa)
      try {
        const toast = useToast();
        if (toast) {
          toast.error('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
        }
      } catch (e) {
        console.error('Toast bildirimi gösterilirken hata:', e);
      }
      
      return navigateTo('/');
    }
    
    console.log(`Role Middleware: Erişim onaylandı (${roles.join(', ')})`);
    return;
  });
}
