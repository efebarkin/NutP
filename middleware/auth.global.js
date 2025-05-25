import { useAuthStore } from '~/stores/auth';
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

// Sadece giriş yapmış kullanıcılara açık sayfalar
const protectedPages = [
  '/meals/create',
  '/meals/edit',
  '/dashboard',
  '/favorites',
  '/settings',
  '/notifications',
  '/messages'
];

// Sadece giriş yapmamış kullanıcılara açık sayfalar
const authPages = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
];

// Admin sayfaları - Bu sayfalar için admin.js middleware'i kullanılacak
const adminPages = [
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/admin/foods',
  '/admin/settings'
];

export default defineNuxtRouteMiddleware(async (to) => {
  // SSR sırasında kontrol yapma
  if (process.server) return;

  const authStore = useAuthStore();
  
  // İlk kez yükleniyorsa auth store'u başlat
  if (!authStore.isInitialized) {
    await authStore.initialize();
  } else {
    // Sayfa yenilendiğinde kullanıcı durumunu kontrol et
    // localStorage'dan kullanıcı bilgisini kontrol et
    const userJson = localStorage.getItem('user');
    
    // localStorage'da kullanıcı var ama store'da yoksa
    if (userJson && !authStore.user) {
      try {
        console.log('Middleware: localStorage\'dan kullanıcı bilgisi yükleniyor');
        const user = JSON.parse(userJson);
        authStore.setUser(user);
        // Token yenileme zamanlayıcısını başlat
        authStore.startTokenRefreshTimer();
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('user');
      }
    } 
    // localStorage'da kullanıcı yok ama store'da varsa
    // else if (!userJson && authStore.user) { 
    //   console.log('Middleware: localStorage\'da kullanıcı bilgisi yok ama store\'da var, temizleniyor (COMMENTED OUT)');
    //   // authStore.clearUser(); // Potentially problematic if session was just re-established by checkSession
    // } 
  }
  
  // Authenticated durumunu yeniden kontrol et
  const isAuthenticated = authStore.authenticated;
  console.log('Middleware: isAuthenticated =', isAuthenticated, 'path =', to.path);
  
  const path = to.path.replace(/\/$/, ''); // trailing slash'i kaldır

  // Korumalı sayfalara erişim kontrolü
  const isProtectedPage = protectedPages.some(page => path.startsWith(page));
  if (isProtectedPage && !isAuthenticated) {
    console.log('Middleware: Korumalı sayfaya erişim engellendi, login\'e yönlendiriliyor');
    // Yönlendirme sonrası kullanıcıyı geri getirmek için yolu kaydet
    localStorage.setItem('redirectPath', to.fullPath);
    return navigateTo('/login');
  }

  // Admin sayfalarına erişim kontrolü
  const isAdminPage = adminPages.some(page => path.startsWith(page));
  if (isAdminPage) {
    // Admin sayfaları için admin.js middleware'i kullanılacak
    // Burada sadece giriş yapmış olma durumunu kontrol ediyoruz
    if (!isAuthenticated) {
      console.log('Middleware: Admin sayfasına erişim engellendi, login\'e yönlendiriliyor');
      localStorage.setItem('redirectPath', to.fullPath);
      return navigateTo('/login');
    }
    
    // Admin rolü kontrolü admin.js middleware'inde yapılacak
  }

  // Giriş yapmış kullanıcının auth sayfalarına erişimini engelle
  const isAuthPage = authPages.some(page => path === page);
  if (isAuthPage && isAuthenticated) {
    console.log('Middleware: Giriş yapmış kullanıcı auth sayfasına erişmeye çalışıyor, ana sayfaya yönlendiriliyor');
    return navigateTo('/');
  }

  // Diğer tüm sayfalar herkese açık
  return;
});
