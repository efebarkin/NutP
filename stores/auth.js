import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null, // Store access token in memory only
    rememberMe: false, // Beni hatırla seçeneği
    initialized: false,
    loading: false,
    error: null,
    csrfToken: null,
    tokenRefreshTimer: null,
    sessionValidationTimer: null,
    lastValidated: null,
    validationInterval: 1000 * 60 * 60 * 24 * 2, // 2 days
    fetchInterceptorInstalled: false,
    originalFetch: null,
    socketToken: null,
    globalLogoutReason: null, // Holds reason for global logout (e.g., session expiry)
    lastRefreshAttempt: 0, // Track last refresh attempt timestamp
    refreshAttemptCount: 0, // Count consecutive refresh attempts
    maxRefreshAttempts: 3, // Maximum refresh attempts before forcing logout
    refreshCooldownMs: 30000, // 30 seconds cooldown between attempts
  }),

  getters: {
    authenticated: (state) => !!state.user,
    isInitialized: (state) => state.initialized,

    userId: (state) => state.user?._id ?? null,
  },

  actions: {
    async initialize() {
      if (this.initialized) return;

      try {
        this.loading = true;

        await this.fetchCsrfToken();

        // RememberMe değerini localStorage'dan yükle
        if (import.meta.client) {
          this.rememberMe = localStorage.getItem('rememberMe') === 'true';
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
            hasToken: !!this.accessToken,
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
          // console.log('No user data received from server, clearing session');
          console.warn(
            '[AuthStore] checkSession: No user data in response from /api/auth/session. Current this.user before clear:',
            JSON.stringify(this.user),
            'Calling clearUser.',
          );
          this.clearUser();
        }
      } catch (error) {
        console.error(
          '[AuthStore] checkSession: Error during /api/auth/session call:',
          error.data?.message || error.message || error,
        );

        // The global error handler (setupGlobalErrorHandler) is expected to catch 401s
        // from /api/auth/session, attempt a token refresh, and retry the request.
        // If the error eventually propagates back here and is still a 401,
        // it means the refresh process likely failed.
        if (
          error.data?.statusCode === 401 ||
          error.status === 401 ||
          error.response?.status === 401
        ) {
          console.warn(
            '[AuthStore] checkSession: Caught a 401. This might be after a failed refresh attempt by global handler, or if /api/auth/session is not intercepted. Clearing user.',
          );
          this.clearUser();
        } else {
          // For other types of errors (network, 5xx, etc.)
          console.warn(
            '[AuthStore] checkSession: Caught a non-401 error. Clearing user. Error:',
            error.data?.message || error.message,
          );
          this.clearUser();
        }
      }
    },

    startTokenRefreshTimer() {
      // Refresh token every 14 minutes (assuming 15 minute token lifetime)
      // RememberMe açıksa daha uzun aralıklarla kontrol et
      const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 dakika

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

      // Start session validation with appropriate interval based on rememberMe
      if (import.meta.client) {
        this.startSessionValidation();
      }
    },

    // Regular session validation check
    startSessionValidation() {
      if (!import.meta.client) return;

      // Check session validity based on rememberMe
      // RememberMe açıksa daha uzun aralıklarla kontrol et (24 saat), kapalıysa daha sık kontrol et (30 dakika)
      const SESSION_VALIDATION_INTERVAL = this.rememberMe
        ? 24 * 60 * 60 * 1000 // 24 saat (hatırla beni açıksa - 30 günlük refresh token için)
        : 30 * 60 * 1000; // 30 dakika (hatırla beni kapalıysa - 1 saatlik refresh token için)

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
              credentials: 'include', // This ensures cookies are sent/received
            });

            // If no user data, logout
            if (!response?.user) {
              // console.log('Session validation failed, logging out');
              this.logout();
            }
          } catch (error) {
            console.error('Session validation error:', error);
            // If 401, logout
            if (error.status === 401) {
              // console.log('401 Unauthorized during periodic validation, logging out');
              this.logout();
            }
            // Do not logout on network errors
          }
        }
      }, SESSION_VALIDATION_INTERVAL);
    },

    async refreshToken() {
      // Rate limiting check
      const now = Date.now();
      const timeSinceLastAttempt = now - this.lastRefreshAttempt;

      if (timeSinceLastAttempt < this.refreshCooldownMs) {
        console.warn(
          `[AuthStore] Refresh token rate limited. ${this.refreshCooldownMs - timeSinceLastAttempt}ms remaining.`,
        );
        return false;
      }

      if (this.refreshAttemptCount >= this.maxRefreshAttempts) {
        console.warn(
          '[AuthStore] Maximum refresh attempts exceeded. Forcing logout.',
        );
        this.clearUser();
        this.globalLogoutReason = {
          message:
            'Multiple authentication failures detected. Please login again.',
        };
        return false;
      }

      this.loading = true;
      this.error = null;
      this.globalLogoutReason = null; // Clear previous global logout reason
      this.lastRefreshAttempt = now;
      this.refreshAttemptCount++;

      try {
        console.log(
          `[AuthStore] refreshToken: Attempting to refresh token... (attempt ${this.refreshAttemptCount}/${this.maxRefreshAttempts})`,
        );
        await $fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include', // This ensures cookies are sent/received
          headers: { 'X-CSRF-Token': this.csrfToken },
        });

        // If /api/auth/refresh succeeds (2xx), new cookies should be set by the server.
        // Now, re-validate the session to get the user details with the new auth_token.
        console.log(
          '[AuthStore] refreshToken: /api/auth/refresh responded 2xx. New cookies assumed to be set. Calling checkSession().',
        );
        await this.checkSession(); // This will fetch /api/auth/session and update user state

        if (this.user) {
          console.log(
            '[AuthStore] refreshToken: Session re-validated successfully after refresh. User:',
            this.user._id,
          );
          // Reset rate limiting on successful refresh
          this.refreshAttemptCount = 0;
          this.lastRefreshAttempt = 0;

          this.startTokenRefreshTimer(); // Restart the timer with the new token's expiry
          return true;
        } else {
          // This case should ideally be handled within checkSession if it fails to get a user.
          console.warn(
            '[AuthStore] refreshToken: checkSession() did not result in a user after token refresh. Logging out.',
          );
          this.clearUser();
          this.globalLogoutReason = {
            message: 'Session could not be re-established after token refresh.',
          };
          return false;
        }
      } catch (error) {
        console.error(
          '[AuthStore] refreshToken: Error during token refresh:',
          error.data?.message || error.message || error,
        );

        // Don't clear user immediately on first few attempts
        if (this.refreshAttemptCount >= this.maxRefreshAttempts) {
          this.clearUser(); // Clear user data after max attempts
          this.globalLogoutReason = {
            message:
              error.data?.message ||
              'Your session has expired after multiple refresh attempts. Please login again.',
            status: error.status,
          };
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password, rememberMe = false) {
      this.loading = true;
      this.error = null;

      try {
        // Ensure we have a CSRF token
        if (!this.csrfToken) {
          await this.fetchCsrfToken();
        }

        // console.log('Attempting login for:', email);
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password, rememberMe },
          credentials: 'include', // This ensures cookies are sent/received
          headers: {
            'X-CSRF-Token': this.csrfToken,
          },
        });

        if (response?.user) {
          // console.log('Login successful');
          // Store access token in memory only
          this.accessToken = response.user.accessToken;
          // Store user data without sensitive tokens
          const { accessToken, refreshToken, ...userData } = response.user;
          this.setUser(userData);

          // RememberMe değerini kaydet
          this.rememberMe = rememberMe;
          if (import.meta.client) {
            if (rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            } else {
              localStorage.removeItem('rememberMe');
            }
          }

          this.startTokenRefreshTimer();
          return true;
        }
        return false;
      } catch (error) {
        // This 'error' is what $fetch throws after global interceptor (if any) has processed the response
        console.error(
          '[AuthStore login catch] Received error:',
          JSON.parse(JSON.stringify(error)),
        );

        // Check if this error has verification data attached by setupGlobalErrorHandler
        if (error.response && error.response.verificationData) {
          const verificationData = error.response.verificationData;
          console.log(
            '[AuthStore login catch] Found verificationData attached to error.response:',
            JSON.parse(JSON.stringify(verificationData)),
          );

          // Create a structured error object with the verification data
          const verificationError = {
            statusCode: 403,
            message:
              'Email adresiniz henüz doğrulanmamış. Doğrulama kodunu girmeniz gerekiyor.',
            data: {
              requiresVerification: true,
              userId: verificationData.userId,
              email: verificationData.email,
            },
          };

          this.error = verificationError.message;
          console.log(
            '[AuthStore login catch] Throwing verification error for UI:',
            JSON.parse(JSON.stringify({ data: verificationError })),
          );
          throw { data: verificationError }; // This is the structure login.vue expects
        }

        // Nitro/h3 errors ($fetch) usually nest the actual error payload (from createError) in `error.data`
        const errorPayloadFromFetch = error.data;
        console.log(
          '[AuthStore login catch] Extracted errorPayloadFromFetch (error.data):',
          errorPayloadFromFetch
            ? JSON.parse(JSON.stringify(errorPayloadFromFetch))
            : 'undefined',
        );

        // Fallback check for verification error in error.data structure
        if (
          errorPayloadFromFetch?.statusCode === 403 &&
          errorPayloadFromFetch?.data?.requiresVerification === true
        ) {
          console.log(
            '[AuthStore login catch] CORRECTLY IDENTIFIED verification error in error.data. Re-throwing for UI with structure { data: errorPayloadFromFetch }:',
            JSON.parse(JSON.stringify({ data: errorPayloadFromFetch })),
          );
          this.error =
            errorPayloadFromFetch.message ||
            'Email adresiniz henüz doğrulanmamış.';
          throw { data: errorPayloadFromFetch }; // This is the structure login.vue expects in err.data
        } else {
          console.log(
            '[AuthStore login catch] Did NOT identify as verification error. Handling as other error. errorPayloadFromFetch:',
            errorPayloadFromFetch
              ? JSON.parse(JSON.stringify(errorPayloadFromFetch))
              : 'undefined',
            'Full error:',
            JSON.parse(JSON.stringify(error)),
          );
          this.error =
            errorPayloadFromFetch?.message ||
            error.message ||
            'Giriş yapılırken bir hata oluştu';
          throw error; // Re-throw the original error (or a generic one if no message)
        }
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

        // console.log('Attempting registration for:', userData.email);
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
          credentials: 'include', // This ensures cookies are sent/received
          headers: {
            'X-CSRF-Token': this.csrfToken,
          },
        });

        // If registration successful and user data returned, auto-login
        if (response?.success && response?.user) {
          // console.log('Registration successful');
          // Store access token in memory only
          this.accessToken = response.user.accessToken;
          // Store user data without sensitive tokens
          const { accessToken, refreshToken, ...userData } = response.user;
          this.setUser(userData);
          this.startTokenRefreshTimer();
        }

        return response;
      } catch (error) {
        console.error(
          'Registration error:',
          error.data?.message || error.message,
        );
        this.error = error.data?.message || error.message;
        // Similar to login, clearing user might be too aggressive here.
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        // console.log('logout action called');
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
              'X-CSRF-Token': this.csrfToken,
            },
          });
          // console.log('Logout API call successful');
        } catch (serverError) {
          console.error('Logout API call failed:', serverError);
          // Continue with client-side cleanup even if server call fails
        }

        // Client-side cleanup
        this.clearUser();
        this.clearSocketToken();
        this.csrfToken = null;

        // console.log('User cleared after logout');

        // Optional: Redirect to login page after logout
        // This is now handled by the globalLogoutReason watcher in app.vue if triggered by session expiry
        if (import.meta.client) {
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

      // Create a plain object to avoid prototype chain issues during serialization
      const normalizedUser = JSON.parse(JSON.stringify(user));

      // Normalize user role
      if (!normalizedUser.role) {
        normalizedUser.role = ['user'];
      } else if (typeof normalizedUser.role === 'string') {
        normalizedUser.role = [normalizedUser.role];
      } else if (normalizedUser.role.length === 0) {
        normalizedUser.role = ['user'];
      }

      // Save user to state (without tokens)
      this.user = normalizedUser;

      // Save non-sensitive data to localStorage
      if (import.meta.client) {
        try {
          // Only store non-sensitive data
          const localStorageUser = {
            id: this.user.id || this.user._id,
            name: this.user.name,
            role: this.user.role,
          };
          localStorage.setItem('user', JSON.stringify(localStorageUser));
          console.log(
            'User saved to localStorage, id:',
            localStorageUser.id,
            'name:',
            localStorageUser.name,
          );
        } catch (e) {
          console.error('Error saving user to localStorage:', e);
        }
      }
    },

    clearUser() {
      // console.log('clearUser called, clearing all session data');
      // Restore original fetch if interceptor was installed
      if (
        import.meta.client &&
        this.fetchInterceptorInstalled &&
        this.originalFetch
      ) {
        window.fetch = this.originalFetch;
        this.fetchInterceptorInstalled = false;
        this.originalFetch = null;
      }
      // Clear all auth-related state
      this.user = null;
      this.accessToken = null;
      this.socketToken = null;
      this.error = null;
      this.csrfToken = null;

      // RememberMe değerini temizle (eğer kullanıcı logout yaptıysa)
      if (import.meta.client && !this.rememberMe) {
        localStorage.removeItem('rememberMe');
      }
      this.rememberMe = false;

      // Clear user from localStorage
      if (import.meta.client) {
        try {
          localStorage.removeItem('user');
          // console.log('User removed from localStorage');
        } catch (e) {
          console.error('Error removing user from localStorage:', e);
        }
      }

      // Clear all timers
      if (this.tokenRefreshTimer) {
        clearInterval(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
        // console.log('Token refresh timer stopped');
      }

      if (this.sessionValidationTimer) {
        clearInterval(this.sessionValidationTimer);
        this.sessionValidationTimer = null;
        // console.log('Session validation timer stopped');
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
      if (!import.meta.client) return;
      try {
        // console.log('Fetching CSRF token...');
        const response = await $fetch('/api/auth/csrf-token', {
          method: 'GET',
          credentials: 'include',
        });

        if (response?.csrfToken) {
          // console.log('CSRF token fetched and set.');
          this.csrfToken = response.csrfToken;
          return response.csrfToken;
        } else {
          console.error('CSRF token not found in response');
          this.csrfToken = null;
          return null;
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return null;
      }
    },

    setupGlobalErrorHandler() {
      // Only run in browser
      if (!import.meta.client || this.fetchInterceptorInstalled) return;
      // console.log('Setting up global fetch error handler');
      this.originalFetch = window.fetch;
      this.fetchInterceptorInstalled = true;
      // Intercept fetch calls
      const originalFetch = this.originalFetch;
      window.fetch = async (...args) => {
        const [urlOrRequest, config] = args;
        let response;
        try {
          response = await this.originalFetch(...args); // Use the stored original fetch

          if (response.status === 401) {
            const requestUrl =
              typeof urlOrRequest === 'string'
                ? urlOrRequest
                : urlOrRequest.url;

            const nonGlobalLogoutPaths = [
              '/api/auth/login',
              '/api/auth/register',
              '/api/auth/refresh', // refreshToken itself handles its 401s
            ];

            const isSpecificAuthPath = nonGlobalLogoutPaths.some((path) =>
              requestUrl.includes(path),
            );

            if (!isSpecificAuthPath) {
              console.warn(`[AuthStore] Global 401 detected on ${requestUrl}.`);

              if (!this.user || !this.user._id) {
                console.warn(
                  `[AuthStore] Global 401: No user context in store. Cannot attempt refresh. Proceeding to logout.`,
                );
                if (!this.globalLogoutReason) {
                  // Ensure logout reason is set
                  this.clearUser(); // Make sure state is clean
                  this.globalLogoutReason = {
                    message: 'Your session has expired. Please login again.',
                  };
                }
                return response; // Return original 401 response
              }

              console.warn(
                `[AuthStore] Global 401: User context found (User ID: ${this.user._id}). Attempting token refresh.`,
              );
              try {
                const refreshSuccessful = await this.refreshToken();
                console.warn(
                  `[AuthStore] Global 401 - refreshSuccessful: ${refreshSuccessful}`,
                );

                if (refreshSuccessful) {
                  console.warn(
                    `[AuthStore] Global 401 - Token refresh successful for ${requestUrl}. Retrying original request.`,
                  );
                  return await this.originalFetch(...args);
                } else {
                  console.warn(
                    `[AuthStore] Global 401 - Token refresh failed for ${requestUrl}. Original 401 will propagate or logout triggered.`,
                  );
                  // If refresh failed, globalLogoutReason should be set by refreshToken.
                  // Ensure clearUser is also called if somehow missed by refreshToken's logic for a specific error type.
                  if (!this.globalLogoutReason) {
                    console.warn(
                      '[AuthStore] Global 401 - Setting fallback globalLogoutReason and clearing user.',
                    );
                    this.clearUser();
                    this.globalLogoutReason = {
                      message:
                        'Your session could not be refreshed. Please login again.',
                    };
                  }
                  return response; // Return original 401 response
                }
              } catch (refreshError) {
                console.warn(
                  `[AuthStore] Global 401 - Error during token refresh attempt for ${requestUrl}:`,
                  refreshError,
                );
                // Ensure user is cleared and logout is signalled if not already handled by refreshToken.
                if (!this.globalLogoutReason) {
                  this.clearUser();
                  this.globalLogoutReason = {
                    message:
                      'An error occurred while trying to refresh your session. Please login again.',
                  };
                }
                return response; // Return original 401 response
              }
            } else {
              console.warn(
                `[AuthStore] Global 401 detected on specific auth path ${requestUrl}. Handling as per specific path logic.`,
              );
              // Handle 401s for specific auth paths (login, register, refresh)
              try {
                const clonedResponse = response.clone();
                const data = await clonedResponse.json();
                if (data.message && data.message.includes('Session expired')) {
                  // console.warn(`'Session expired' message detected on specific auth path ${requestUrl}, ensuring logout.`);
                  this.clearUser();
                  this.globalLogoutReason = {
                    message: 'Your session has expired, please login again.',
                  };
                }
              } catch (e) {
                // Ignore if JSON parsing fails for these specific paths; their primary error handling is in their actions.
              }
              // Return the original response for these paths to be handled by their specific catch blocks.
              return response;
            }
          } else if (response.status === 403) {
            const requestUrl =
              typeof urlOrRequest === 'string'
                ? urlOrRequest
                : urlOrRequest.url;
            console.warn(`[AuthStore] Global 403 detected on ${requestUrl}.`);

            // Special handling for login endpoint 403s that might be verification errors
            if (requestUrl.includes('/api/auth/login')) {
              try {
                // Check for custom verification headers
                const requiresVerification = response.headers.get(
                  'X-Requires-Verification',
                );
                const userId = response.headers.get('X-Verification-User-Id');
                const email = response.headers.get('X-Verification-Email');

                console.warn(
                  '[AuthStore Global 403 Handler] Checking headers for verification:',
                  {
                    'X-Requires-Verification': requiresVerification,
                    'X-Verification-User-Id': userId,
                    'X-Verification-Email': email,
                  },
                );

                if (requiresVerification === 'true' && userId && email) {
                  console.warn(
                    '[AuthStore] Global 403 from /api/auth/login IS a "requiresVerification" error based on headers. LETTING IT PROPAGATE to login action catch block.',
                  );

                  // Attach verification data to the response object for the login action to use
                  response.verificationData = {
                    requiresVerification: true,
                    userId,
                    email,
                  };

                  return response; // Let the login action's catch block handle it
                } else {
                  console.warn(
                    '[AuthStore] Global 403 from /api/auth/login is NOT a "requiresVerification" error. Treating as general forbidden.',
                  );
                }
              } catch (e) {
                console.error(
                  '[AuthStore] Error checking verification headers:',
                  e,
                );
                console.warn(
                  '[AuthStore] Global 403 from /api/auth/login - failed to check headers. Treating as general forbidden.',
                );
              }
            }

            // For other 403s, or if the /api/auth/login 403 inspection decided it's general forbidden
            console.warn(
              '[AuthStore] Global 403 (or unhandled login 403) is being treated as a general "Forbidden" error. Setting reason and logging out.',
            );
            this.globalLogoutReason = {
              message: 'You do not have permission to access this resource.',
            };
            await this.logout(); // This initiates logout
            return response; // Still return the original response, logout process is async
          }
          return response;
        } catch (error) {
          // Network errors or other fetch-related errors
          console.error('Global fetch error:', error);
          throw error; // Re-throw to be handled by the caller
        }
      };
    },

    async getSocketToken() {
      try {
        // Request socket token from server
        // console.log('Requesting socket token from server');
        const response = await $fetch('/api/auth/socket-token', {
          method: 'GET',
          credentials: 'include',
        });

        if (response && response.socketToken) {
          // console.log('Socket token received from server:', this.socketToken ? '******' : null);
          this.socketToken = response.socketToken;
          return response.socketToken;
        }

        // If server doesn't provide a token, log an error and return null.
        console.error(
          'Failed to retrieve a valid socket token from the server.',
        );
        this.socketToken = null; // Ensure state is cleared
        return null;
      } catch (error) {
        console.error(
          'Error fetching socket token:',
          error.data?.message || error.message,
        );
        this.socketToken = null; // Ensure state is cleared on error
        return null;
      }
    },

    // Clear socket token
    clearSocketToken() {
      this.socketToken = null;
    },

    acknowledgeGlobalLogout() {
      this.globalLogoutReason = null;
    },
  },
});
