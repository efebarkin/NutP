/**
 * Calendar Cache Integration Plugin
 * Automatically integrates cache invalidation with the existing application
 */

export default defineNuxtPlugin(() => {
  // Only run on client side
  if (import.meta.server) return;

  const { $router } = useNuxtApp();

  // Provide cache manager globally
  return {
    provide: {
      calendarCache: () =>
        import('~/composables/useCalendarCacheManager').then((m) =>
          m.useCalendarCacheManager(),
        ),
    },
  };
});
