import { useRuntimeConfig } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Global fetch instance
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include', // Cookie'leri gönder
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  // Global error handler
  nuxtApp.hook('app:error', (..._args) => {
    console.log('Global error caught');
  });

  // Provide the fetch instance as well for custom API calls
  return {
    provide: {
      apiFetch: api
    }
  };
});
