import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null, // Store access token in memory only
    initialized: false,
    loading: false,
    error: null,
    csrfToken: null,
    tokenRefreshTimer: null,
    sessionValidationTimer: null,
    lastValidated: null,
    validationInterval: 1000 * 60 * 60 * 24 * 2, // 2 days
  }),

  getters: {
    authenticated: (state) => !!state.user,
    isInitialized: (state) => state.initialized,
    
    token: (state) => {
      if (state.accessToken) return state.accessToken;
      
      if (!import.meta.client) return null;
      
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) return null;
        return JSON.parse(userJson)?.accessToken ?? null;
      } catch (error) {
        console.error('Error getting token from localStorage:', error);
        return null;
      }
    },
    
    userId: (state) => {
      if (state.user?._id) return state.user._id;
      
      if (!import.meta.client) return null;
      
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) return null;
        return JSON.parse(userJson)?._id ?? null;
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        return null;
      }
    }
  },

  actions: {
    async initialize() {
      if (this.initialized) return;
      
      try {
        this.loading = true;
        
        await this.fetchCsrfToken();

        // Check auth cookie and clear localStorage if needed
        if (import.meta.client && !this.checkAuthCookie()) {
          localStorage.removeItem('user');
        }

        // Load user from localStorage if we're in the browser
        if (import.meta.client) {
          this.loadUserFromLocalStorage();
        }

        // Check session with the server
        await this.checkSession();

        // Setup global error handler for auth-related responses
        this.setupGlobalErrorHandler();
      } catch (error) {
        console.error('Error initializing auth store:', error);
        this.error = error.message;
      } finally {
        this.initialized = true;
        this.loading = false;
        
        if (this.user) {
          console.log('User information:', {
            _id: this.user._id,
            hasToken: !!this.accessToken
          });
        }
      }
    },

    loadUserFromLocalStorage() {
      if (!import.meta.client) return;
      
      const userJson = localStorage.getItem('user');
      if (!userJson) return;
      
      try {
        const user = JSON.parse(userJson);
        
        // Normalize role to always be an array
        if (!user.role) {
          user.role = ['user'];
        } else if (typeof user.role === 'string') {
          user.role = [user.role];
        } else if (user.role.length === 0) {
          user.role = ['user'];
        }
        
        if (user._id) {
          this.user = user;
          this.startTokenRefreshTimer();
        } else {
          console.warn('User object in localStorage has no _id field');
          localStorage.removeItem('user');
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('user');
      }
    },

    async checkSession() {
      try {
        // Check session status with server
        const response = await $fetch('/api/auth/session', {
          credentials: 'include',
        });

        // If we got user data from server
        if (response?.user) {
          console.log('Session valid, user data received:', response.user._id);
          this.setUser(response.user);

          // Refresh token if needed
          if (response.needsRefresh) {
            console.log('Token refresh needed');
            await this.refreshToken();
          }

          // Start token refresh timer
          this.startTokenRefreshTimer();
        } else {
          // No user data from server
          console.log('No user data received from server, clearing session');
          this.clearUser();
        }
      } catch (error) {
        console.error('Session check error:', error);
        
        // Handle 401 Unauthorized
        if (error.status === 401) {
          console.log('401 Unauthorized, clearing session');
          this.clearUser();
          return;
        }
        
        // For network errors, try to use cached data
        if (error.name === 'NetworkError' || error.message?.includes('network')) {
          console.log('Network error, checking offline mode');
          
          // In network error case, keep existing user data if available
          if (this.user) {
            console.log('Using cached user data for offline mode');
            return;
          }
        }
        
        // For other errors, clear user
        this.clearUser();
      }
    },

    startTokenRefreshTimer() {
      // Refresh token every 14 minutes (assuming 15 minute token lifetime)
      const REFRESH_INTERVAL = 14 * 60 * 1000;

      // Clear existing timer if any
      if (this.tokenRefreshTimer) {
        clearInterval(this.tokenRefreshTimer);
      }

      // Set token refresh timer
      this.tokenRefreshTimer = setInterval(() => {
        if (this.authenticated) {
          this.refreshToken();
        }
      }, REFRESH_INTERVAL);
      
      // Start session validation
      if (import.meta.client) {
        this.startSessionValidation();
      }
    },
    
    // Regular session validation check
    startSessionValidation() {
      if (!import.meta.client) return;
      
      // Check session validity every 2 days
      const SESSION_VALIDATION_INTERVAL = 2 * 24 * 60 * 60 * 1000;
      
      // Clear existing timer if any
      if (this.sessionValidationTimer) {
        clearInterval(this.sessionValidationTimer);
      }
      
      this.sessionValidationTimer = setInterval(async () => {
        if (this.authenticated) {
          try {
            // Check session with server
            const response = await $fetch('/api/auth/session', {
              method: 'GET',
              credentials: 'include',
            });
            
            // If no user data, logout
            if (!response?.user) {
              console.log('Session validation failed, logging out');
              this.logout();
            }
          } catch (error) {
            console.error('Session validation error:', error);
            // If 401, logout
            if (error.status === 401) {
              console.log('401 Unauthorized during validation, logging out');
              this.logout();
            }
            // Do not logout on network errors
          }
        }
      }, SESSION_VALIDATION_INTERVAL);
    },

    async refreshToken() {
      // If there's already a refresh in progress, wait for it
      if (this.refreshPromise) {
        return this.refreshPromise;
      }

      try {
        this.refreshPromise = $fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include', // Send HttpOnly refresh token cookie
        });

        const response = await this.refreshPromise;
        if (response.accessToken) {
          // Update the in-memory access token
          this.accessToken = response.accessToken;
          
          // Update user data if provided
          if (response.user) {
            const { accessToken, refreshToken, ...userData } = response.user;
            this.setUser(userData);
          }
          
          return true;
        }
        return false;
      } catch (error) {
        console.error('Token refresh error:', error);
        return false;
      } finally {
        this.refreshPromise = null;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        // Ensure we have a CSRF token
        if (!this.csrfToken) {
          await this.fetchCsrfToken();
        }
        
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password },
          credentials: 'include', // This ensures cookies are sent/received
          headers: {
            'X-CSRF-Token': this.csrfToken
          }
        });

        if (response?.user) {
          console.log('Login successful, user:', response.user);
          // Store access token in memory only
          this.accessToken = response.user.accessToken;
          // Store user data without sensitive tokens
          const { accessToken, refreshToken, ...userData } = response.user;
          this.setUser(userData);
          this.startTokenRefreshTimer();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.data?.message || 'Error during login';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        // Ensure we have a CSRF token
        if (!this.csrfToken) {
          await this.fetchCsrfToken();
        }
        
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
          credentials: 'include', // This ensures cookies are sent/received
          headers: {
            'X-CSRF-Token': this.csrfToken
          }
        });

        // If registration successful and user data returned, auto-login
        if (response?.success && response?.user) {
          console.log('[AuthStore] register - Registration successful, auto-login');
          // Store access token in memory only
          this.accessToken = response.user.accessToken;
          // Store user data without sensitive tokens
          const { accessToken, refreshToken, ...userData } = response.user;
          this.setUser(userData);
          this.startTokenRefreshTimer();
        }

        return response;
      } catch (error) {
        console.error('Register error:', error);
        this.error = error.data?.message || 'Error during registration';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        console.log('Starting logout process...');
        
        // Ensure we have a CSRF token
        if (!this.csrfToken) {
          await this.fetchCsrfToken();
        }
        
        // Clear cookies on server
        try {
          await $fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'X-CSRF-Token': this.csrfToken
            }
          });
          console.log('Server-side cookies cleared');
        } catch (serverError) {
          console.error('Server logout error:', serverError);
          // Continue with client-side cleanup even if server call fails
        }

        // Client-side cleanup
        this.clearUser();
        this.clearSocketToken();
        this.csrfToken = null;
        
        console.log('All session data cleared');

        // Handle redirect
        if (import.meta.client) {
          // Try to manually clear browser cookies
          document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          console.log('Browser cookies manually cleared');
          
          window.location.href = '/login';
        }

        return true;
      } catch (error) {
        console.error('Logout error:', error);
        this.error = error.data?.message || 'Error during logout';
        
        // Clean up anyway
        this.clearUser();
        this.clearSocketToken();
        
        return false;
      }
    },

    setUser(user) {
      if (!user) return;
      
      // Normalize user role
      if (!user.role) {
        user.role = ['user'];
      } else if (typeof user.role === 'string') {
        user.role = [user.role];
      } else if (user.role.length === 0) {
        user.role = ['user'];
      }
      
      // Save user to state (without tokens)
      this.user = user;
      
      // Save non-sensitive data to localStorage
      if (import.meta.client) {
        try {
          // Only store non-sensitive data
          const localStorageUser = {
            id: this.user.id || this.user._id,
            name: this.user.name,
            role: this.user.role
          };
          localStorage.setItem('user', JSON.stringify(localStorageUser));
          console.log('User saved to localStorage, id:', localStorageUser.id, 'name:', localStorageUser.name);
        } catch (e) {
          console.error('Error saving user to localStorage:', e);
        }
      }
    },

    clearUser() {
      console.log('clearUser called, clearing all session data');
      this.user = null;
      this.error = null;

      // Clear user from localStorage
      if (import.meta.client) {
        try {
          localStorage.removeItem('user');
          console.log('User removed from localStorage');
        } catch (e) {
          console.error('Error removing user from localStorage:', e);
        }
      }
      
      // Clear all timers
      if (this.tokenRefreshTimer) {
        clearInterval(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
        console.log('Token refresh timer stopped');
      }
      
      if (this.sessionValidationTimer) {
        clearInterval(this.sessionValidationTimer);
        this.sessionValidationTimer = null;
        console.log('Session validation timer stopped');
      }
    },
    
    // Refresh CSRF token
    async refreshCsrfToken() {
      return await this.fetchCsrfToken();
    },
    
    // Check for auth cookie
    checkAuthCookie() {
      if (!import.meta.client) return false;
      
      try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'auth_token' && value) {
            console.log('auth_token cookie found');
            return true;
          }
        }
        console.log('auth_token cookie not found');
        return false;
      } catch (e) {
        console.error('Cookie check error:', e);
        return false;
      }
    },
    
    // Check for refresh cookie
    checkRefreshCookie() {
      if (!import.meta.client) return false;

      try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'refresh_token' && value) {
            console.log('refresh_token cookie found');
            return true;
          }
        }
        console.log('refresh_token cookie not found');
        return false;
      } catch (e) {
        console.error('Cookie check error (refresh):', e);
        return false;
      }
    },

    setError(error) {
      this.error = error;
    },

    getAuthHeader() {
      const headers = {};
      
      // Use the in-memory access token
      if (this.accessToken) {
        headers.Authorization = `Bearer ${this.accessToken}`;
      }
      
      // Add CSRF token if available
      if (this.csrfToken) {
        headers['X-CSRF-Token'] = this.csrfToken;
      }
      
      return headers;
    },
    
    // Get CSRF token
    async fetchCsrfToken() {
      try {
        console.log('Fetching CSRF token...');
        const response = await $fetch('/api/auth/csrf-token', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response?.csrfToken) {
          console.log('CSRF token received');
          this.csrfToken = response.csrfToken;
          return response.csrfToken;
        } else {
          console.error('Failed to get CSRF token');
          return null;
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return null;
      }
    },
    
    setupGlobalErrorHandler() {
      // Only run in browser
      if (!import.meta.client) return;
      
      // Intercept fetch calls
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);

          // If response is 401 and user is authenticated
          if (response.status === 401 && this.authenticated) {
            try {
              const data = await response.clone().json();

              // Check for session expiration message
              if (data.message && data.message.includes('Session expired')) {
                console.warn('Session expired, logging out automatically');
                this.clearUser();

                // Notify user
                const toast = useToast();
                if (toast) {
                  toast.warning('Your session has expired, please login again');
                }

                // Redirect to login
                window.location.href = '/login';
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }

          return response;
        } catch (error) {
          console.error('Fetch error:', error);
          throw error;
        }
      };
    },

    async getSocketToken() {
      try {
        // Request socket token from server
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

        // If server doesn't provide a token, create a fallback
        console.log('Creating fallback socket token');
        if (!this.user || !this.user._id) {
          console.error('Cannot create fallback token: User not authenticated');
          return null;
        }

        // Create a simple JWT-like token with the user ID
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

        // Create a simple fallback token as last resort
        if (this.user && this.user._id) {
          const fallbackToken = `fallback.${btoa(this.user._id)}.${Date.now()}`;
          this.socketToken = fallbackToken;
          return fallbackToken;
        }

        return null;
      }
    },

    // Clear socket token
    clearSocketToken() {
      this.socketToken = null;
    },
  },
});