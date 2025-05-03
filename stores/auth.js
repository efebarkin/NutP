import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    initialized: false,
    loading: false,
    error: null,
    refreshPromise: null,
    refreshTimer: null,
    socketToken: null,
    csrfToken: null, // CSRF token için yeni state
  }),

  getters: {
    authenticated: (state) => {
      // Eğer state.user varsa, kullanıcı giriş yapmış demektir
      if (state.user) {
        return true;
      }

      // Eğer tarayıcı ortamındaysak ve localStorage'da user bilgisi varsa
      if (process.client) {
        try {
          const userJson = localStorage.getItem('user');
          if (userJson) {
            // Geçerli bir JSON olup olmadığını kontrol et
            const user = JSON.parse(userJson);
            if (user && user._id) {
              return true;
            }
          }
        } catch (e) {
          console.error('Error checking authenticated status:', e);
          // Hatalı JSON varsa localStorage'dan temizle
          localStorage.removeItem('user');
        }
      }

      return false;
    },
    isInitialized: (state) => state.initialized,
    // Token getter'ı ekle - token'a kolay erişim için
    token: (state) => {
      // Loglama ekleyelim
      console.log('Token getter çağrıldı, state.user:', state.user ? 'mevcut' : 'yok');
      
      if (state.user?.token) {
        console.log('Token state.user.token\'dan alındı');
        return state.user.token;
      }
      
      // localStorage'dan token'ı almayı dene
      if (process.client) {
        try {
          const userJson = localStorage.getItem('user');
          console.log('localStorage user:', userJson ? 'mevcut' : 'yok');
          
          if (userJson) {
            const user = JSON.parse(userJson);
            if (user && user.token) {
              console.log('Token localStorage\'dan alındı');
              return user.token;
            }
          }
        } catch (e) {
          console.error('Error getting token from localStorage:', e);
        }
      }
      
      // Cookie'den token'ı almayı dene
      if (process.client) {
        try {
          const cookies = document.cookie.split(';');
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'auth_token') {
              console.log('Token cookie\'den alındı');
              return decodeURIComponent(value);
            }
          }
          // Mevcut tüm cookie'leri logla
          console.log('Mevcut cookies:', document.cookie);
        } catch (e) {
          console.error('Error getting token from cookie:', e);
        }
      }
      
      console.log('Token bulunamadı, null dönüyor');
      return null;
    },
    // Kullanıcı ID'si getter'ı
    userId: (state) => {
      // Loglama ekleyelim
      console.log('userId getter çağrıldı, state.user:', state.user ? 'mevcut' : 'yok');
      
      if (state.user) {
        // Önce _id alanını kontrol et
        if (state.user._id) {
          console.log('userId state.user._id\'den alındı:', state.user._id);
          return state.user._id;
        }
      }
      
      // localStorage'dan ID'yi almayı dene
      if (process.client) {
        try {
          const userJson = localStorage.getItem('user');
          console.log('localStorage user:', userJson ? 'mevcut' : 'yok');
          
          if (userJson) {
            const user = JSON.parse(userJson);
            // Önce _id alanını kontrol et
            if (user && user._id) {
              console.log('userId localStorage\'dan (_id) alındı:', user._id);
              return user._id;
            }
          }
        } catch (e) {
          console.error('Error getting userId from localStorage:', e);
        }
      }
      
      console.log('userId bulunamadı, null dönüyor');
      return null;
    }
  },

  actions: {
    async initialize() {
      if (this.initialized) return;
      try {
        this.loading = true;
        
        // CSRF token al
        await this.fetchCsrfToken();
        console.log('Auth store initialize başladı');

        // Önce localStorage'dan kullanıcı bilgisini kontrol et
        if (process.client) {
          const userJson = localStorage.getItem('user');
          console.log('localStorage user kontrolü:', userJson ? 'mevcut' : 'yok');
          
          if (userJson) {
            try {
              const user = JSON.parse(userJson);
              console.log('localStorage\'dan user parse edildi:', user._id ? 'ID mevcut' : 'ID yok');
              console.log('localStorage\'dan yüklenen user rolü:', user.role);
              
              // Rol kontrolü yap ve düzelt
              if (user.role) {
                // Eğer role bir string ise, array'e çevir
                if (typeof user.role === 'string') {
                  console.log('localStorage\'dan yüklenen role string olarak geldi, array\'e çevriliyor:', user.role);
                  user.role = [user.role];
                }
                
                // Eğer role undefined veya boş array ise, varsayılan olarak ['user'] ata
                if (!user.role || user.role.length === 0) {
                  console.log('localStorage\'dan yüklenen role boş veya tanımsız, varsayılan [user] atanıyor');
                  user.role = ['user'];
                }
                
                console.log('localStorage\'dan yüklenen son kullanıcı rolü:', user.role);
              } else {
                // Role alanı yoksa, varsayılan olarak ['user'] ata
                console.log('localStorage\'dan yüklenen kullanıcıda role alanı yok, varsayılan [user] atanıyor');
                user.role = ['user'];
              }
              
              if (user && user._id) {
                this.user = user; // setUser yerine direkt atama yapıyoruz, çünkü zaten rol kontrolü yaptık
                // Periyodik token kontrolü başlat
                this.startTokenRefreshTimer();
                console.log('localStorage\'dan kullanıcı yüklendi, ID:', user._id, 'role:', user.role);
              } else {
                console.warn('localStorage\'daki user objesinde _id alanı yok');
              }
            } catch (e) {
              console.error('Error parsing user from localStorage:', e);
              localStorage.removeItem('user');
            }
          }
        }

        // Sonra API'den session kontrolü yap
        console.log('API\'den session kontrolü yapılıyor');
        await this.checkSession();

        this.setupGlobalErrorHandler();
      } catch (error) {
        console.error('Error initializing auth store:', error);
        this.error = error.message;
      } finally {
        this.initialized = true;
        this.loading = false;
        console.log('Auth store initialize tamamlandı, user:', this.user ? 'mevcut' : 'yok');
        
        if (this.user) {
          console.log('User bilgileri:', {
            id: this.user._id,
            hasToken: !!this.user.token
          });
        }
      }
    },

    async checkSession() {
      try {
        const { data: session } = await useFetch('/api/auth/session', {
          credentials: 'include',
        });

        if (session.value?.user) {
          this.setUser(session.value.user);

          // Token yenileme gerekiyorsa
          if (session.value.needsRefresh) {
            await this.refreshToken();
          }

          // Periyodik token kontrolü başlat
          this.startTokenRefreshTimer();
        } else {
          // API'den kullanıcı bilgisi gelmezse, localStorage'a bak
          if (process.client) {
            const userJson = localStorage.getItem('user');
            if (userJson) {
              try {
                console.log(
                  "API session yok, localStorage'dan kullanıcı bilgisi kullanılıyor",
                );
                const user = JSON.parse(userJson);
                this.setUser(user);
                this.startTokenRefreshTimer();
                return; // localStorage'dan kullanıcı bilgisi bulundu, clearUser çağrılmasın
              } catch (e) {
                console.error('Error parsing user from localStorage:', e);
              }
            }
          }
          this.clearUser();
        }
      } catch (error) {
        console.error('Session check failed:', error);

        // API hatası durumunda localStorage'daki kullanıcı bilgisini kontrol et
        if (process.client) {
          const userJson = localStorage.getItem('user');
          if (userJson) {
            try {
              console.log(
                "API hatası, localStorage'dan kullanıcı bilgisi kullanılıyor",
              );
              const user = JSON.parse(userJson);
              this.setUser(user);
              this.startTokenRefreshTimer();
              return; // localStorage'dan kullanıcı bilgisi bulundu, clearUser çağrılmasın
            } catch (e) {
              console.error('Error parsing user from localStorage:', e);
            }
          }
        }
        this.clearUser();
      }
    },

    startTokenRefreshTimer() {
      // Her 14 dakikada bir token'ı yenile (15 dakikalık token süresi varsayılarak)
      const REFRESH_INTERVAL = 14 * 60 * 1000;

      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
      }

      this.refreshTimer = setInterval(() => {
        if (this.authenticated) {
          this.refreshToken();
        }
      }, REFRESH_INTERVAL);
    },

    async refreshToken() {
      // Eğer zaten bir yenileme işlemi varsa onu bekle
      if (this.refreshPromise) {
        return this.refreshPromise;
      }

      try {
        this.refreshPromise = $fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        const response = await this.refreshPromise;
        if (response?.user) {
          this.setUser(response.user);
        }
        return true;
      } catch (error) {
        console.error('Token yenileme hatası:', error);
        this.clearUser();
        return false;
      } finally {
        this.refreshPromise = null;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        // Önce CSRF token'i kontrol et, yoksa al
        if (!this.csrfToken) {
          await this.fetchCsrfToken();
        }
        
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password },
          credentials: 'include',
          headers: {
            'X-CSRF-Token': this.csrfToken
          }
        });

        if (response?.user) {
          this.setUser(response.user);
          this.startTokenRefreshTimer();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.data?.message || 'Giriş yapılırken bir hata oluştu';
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Yeni eklenen register metodu
    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        // Önce CSRF token'i kontrol et, yoksa al
        if (!this.csrfToken) {
          await this.fetchCsrfToken();
        }
        
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
          credentials: 'include',
          headers: {
            'X-CSRF-Token': this.csrfToken
          }
        });

        // Kayıt başarılı ve kullanıcı bilgileri döndüyse, otomatik giriş yap
        if (response?.success && response?.user) {
          console.log('[AuthStore] register - Kayıt başarılı, otomatik giriş yapılıyor');
          // setUser ile kullanıcı bilgilerini ayarla (bu otomatik olarak localStorage'a da kaydeder)
          this.setUser(response.user);
          // Token kontrolü için zamanlayıcıyı başlat
          this.startTokenRefreshTimer();
        }

        return response;
      } catch (error) {
        console.error('Register error:', error);
        this.error = error.data?.message || 'Kayıt olurken bir hata oluştu';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Yeni eklenen logout metodu
    async logout() {
      try {
        // Önce CSRF token'i kontrol et, yoksa al
        if (!this.csrfToken) {
          await this.fetchCsrfToken();
        }
        
        await $fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'X-CSRF-Token': this.csrfToken
          }
        });

        this.clearUser();
        this.clearSocketToken();

        // Token yenileme zamanlayıcısını durdur
        if (this.refreshTimer) {
          clearInterval(this.refreshTimer);
          this.refreshTimer = null;
        }

        // CSRF token'i temizle
        this.csrfToken = null;

        // Yönlendirme işlemi
        if (process.client) {
          window.location.href = '/login';
        }

        return true;
      } catch (error) {
        console.error('Logout error:', error);
        this.error = error.data?.message || 'Çıkış yapılırken bir hata oluştu';
        return false;
      }
    },

    setUser(user) {
      if (!user) return;
      
      console.log('setUser çağrıldı, user:', JSON.stringify(user));
      
      // Kullanıcı rolü kontrolü ve düzeltme
      if (user.role) {
        // Eğer role bir string ise, array'e çevir
        if (typeof user.role === 'string') {
          console.log('Role string olarak geldi, array\'e çevriliyor:', user.role);
          user.role = [user.role];
        }
        
        // Eğer role undefined veya null ise, varsayılan olarak ['user'] ata
        if (!user.role || user.role.length === 0) {
          console.log('Role boş veya tanımsız, varsayılan [user] atanıyor');
          user.role = ['user'];
        }
        
        console.log('Son kullanıcı rolü:', user.role);
      } else {
        // Role alanı yoksa, varsayılan olarak ['user'] ata
        console.log('Role alanı yok, varsayılan [user] atanıyor');
        user.role = ['user'];
      }
      
      // Kullanıcı bilgisini state'e kaydet
      this.user = user;
      
      // localStorage'a kaydet
      if (process.client) {
        try {
          localStorage.setItem('user', JSON.stringify(user));
          console.log('User localStorage\'a kaydedildi, _id:', user._id, 'role:', user.role);
        } catch (e) {
          console.error('Error saving user to localStorage:', e);
        }
      }
    },

    clearUser() {
      this.user = null;
      this.error = null;

      // User bilgisini localStorage'dan sil
      if (process.client) {
        try {
          localStorage.removeItem('user');
        } catch (e) {
          console.error('Error removing user from localStorage:', e);
        }
      }
    },
    
    // CSRF token'i yenile
    async refreshCsrfToken() {
      return await this.fetchCsrfToken();
    },

    setError(error) {
      this.error = error;
    },

    getAuthHeader() {
      const token = this.token;
      const headers = {
        Authorization: token ? `Bearer ${token}` : ''
      };
      
      // CSRF token varsa ekle
      if (this.csrfToken) {
        headers['X-CSRF-Token'] = this.csrfToken;
      }
      
      return headers;
    },
    
    // CSRF token al
    async fetchCsrfToken() {
      try {
        console.log('CSRF token alınıyor...');
        const { data } = await useFetch('/api/auth/csrf-token', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (data.value?.csrfToken) {
          console.log('CSRF token alındı');
          this.csrfToken = data.value.csrfToken;
          return data.value.csrfToken;
        } else {
          console.error('CSRF token alınamadı');
          return null;
        }
      } catch (error) {
        console.error('CSRF token alınırken hata:', error);
        return null;
      }
    },
    setupGlobalErrorHandler() {
      // Tarayıcı ortamında çalışıyorsa
      if (process.client) {
        // Fetch hatalarını yakala
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
          try {
            const response = await originalFetch(...args);

            // API yanıtı 401 (Unauthorized) ise ve kullanıcı giriş yapmışsa
            if (response.status === 401 && this.authenticated) {
              try {
                const data = await response.clone().json();

                // Oturum süresi dolduğunda
                if (
                  data.message &&
                  data.message.includes('Oturum süresi doldu')
                ) {
                  console.warn('Session expired, logging out automatically');
                  this.clearUser();

                  // Kullanıcıyı bilgilendir
                  const toast = useToast();
                  if (toast) {
                    toast.warning(
                      'Oturum süreniz doldu, lütfen tekrar giriş yapın',
                    );
                  }

                  // Login sayfasına yönlendir
                  window.location.href = '/login';
                }
              } catch (e) {
                // JSON parse hatası olabilir, yoksay
              }
            }

            return response;
          } catch (error) {
            console.error('Fetch error:', error);
            throw error;
          }
        };
      }
    },

    async getSocketToken() {
      try {
        // Request a socket token from our dedicated endpoint
        console.log('Requesting socket token from server');
        const response = await $fetch('/api/auth/socket-token', {
          method: 'GET',
          credentials: 'include',
        });

        if (response && response.token) {
          console.log('Received socket token from server');
          this.socketToken = response.token;
          return response.token;
        }

        // If server doesn't provide a token, create a simple one
        console.log('Creating fallback socket token');
        if (!this.user || !this.user._id) {
          console.error('Cannot create fallback token: User not authenticated');
          return null;
        }

        // Create a simple JWT-like token with the user ID
        // This is just a fallback and should be replaced with a proper server-generated token
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const now = Math.floor(Date.now() / 1000);
        const payload = btoa(
          JSON.stringify({
            userId: this.user._id,
            iat: now,
            exp: now + 3600, // 1 hour expiration
          }),
        );
        const signature = btoa(`${this.user._id}-${now}-socket`);

        const fallbackToken = `${header}.${payload}.${signature}`;
        this.socketToken = fallbackToken;
        return fallbackToken;
      } catch (error) {
        console.error('Error getting socket token:', error);

        // Create a fallback token as a last resort
        if (this.user && this.user._id) {
          const fallbackToken = `fallback.${btoa(this.user._id)}.${Date.now()}`;
          this.socketToken = fallbackToken;
          return fallbackToken;
        }

        return null;
      }
    },

    // Clear socket token when logging out
    clearSocketToken() {
      this.socketToken = null;
    },
  },
});
