import { useAuthStore } from '@/stores/auth';

export const getAuthToken = () => {
  const authStore = useAuthStore();
  return authStore.token;
};

export const isAuthenticated = () => {
  const authStore = useAuthStore();
  return !!authStore.token;
};

export const logout = () => {
  const authStore = useAuthStore();
  authStore.logout();
};

export const login = async (credentials) => {
  const authStore = useAuthStore();
  await authStore.login(credentials);
};

export const register = async (userData) => {
  const authStore = useAuthStore();
  await authStore.register(userData);
};

export const refreshToken = async () => {
  const authStore = useAuthStore();
  await authStore.refreshToken();
};

export const updateProfile = async (profileData) => {
  const authStore = useAuthStore();
  await authStore.updateProfile(profileData);
};
