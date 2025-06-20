/**
 * Calendar Cache Management Composable
 * Handles cache invalidation strategies for different user actions
 */

import { useCalendarDataCache } from './useCalendarCache';
import { useAuthStore } from '~/stores/auth';

export function useCalendarCacheManager() {
  const cache = useCalendarDataCache();
  const authStore = useAuthStore();

  /**
   * Invalidate cache when user adds/updates water entries
   */
  const invalidateWaterEntry = (date) => {
    const entryDate = new Date(date);
    const year = entryDate.getFullYear();
    const month = entryDate.getMonth() + 1;

    console.log(
      `💧 Invalidating water cache for ${year}/${month} due to water entry change`,
    );

    // Invalidate specific month
    cache.invalidateMonth(year, month);

    // If it's current month, also invalidate current month specifically
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year === currentYear && month === currentMonth) {
      cache.invalidateWaterData();
    }
  };

  /**
   * Invalidate cache when user adds/updates meal entries
   */
  const invalidateMealEntry = (date) => {
    const entryDate = new Date(date);
    const year = entryDate.getFullYear();
    const month = entryDate.getMonth() + 1;

    console.log(
      `🍽️ Invalidating meal cache for ${year}/${month} due to meal entry change`,
    );

    // Invalidate specific month
    cache.invalidateMonth(year, month);

    // If it's current month, also invalidate current month specifically
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year === currentYear && month === currentMonth) {
      cache.invalidateMealData();
    }
  };

  /**
   * Invalidate user-specific cache when goals change
   */
  const invalidateUserGoals = () => {
    if (!authStore.user) return;

    console.log(
      `👤 Invalidating user goals cache for user ${authStore.user.id}`,
    );

    cache.invalidateUser(authStore.user.id);

    // Also invalidate current month data since goal changes affect calculations
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    cache.invalidateMonth(currentYear, currentMonth);
  };

  /**
   * Smart invalidation for bulk operations
   */
  const invalidateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log(
      `📅 Invalidating cache for date range: ${startDate} to ${endDate}`,
    );

    // Get all months in the range
    const monthsToInvalidate = new Set();

    const current = new Date(start);
    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1;
      monthsToInvalidate.add(`${year}-${month}`);

      // Move to next month
      current.setMonth(current.getMonth() + 1);
    }

    // Invalidate each month
    monthsToInvalidate.forEach((monthKey) => {
      const [year, month] = monthKey.split('-').map(Number);
      cache.invalidateMonth(year, month);
    });
  };

  /**
   * Emergency cache clear (for debugging or critical issues)
   */
  const emergencyCacheClear = () => {
    console.log('🚨 Emergency cache clear initiated');
    cache.clearAll();
  };

  /**
   * Preload strategy for better UX
   */
  const preloadUserData = async () => {
    if (!authStore.user) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Preload current month and adjacent months
    const monthsToPreload = [
      { year: currentYear, month: currentMonth }, // Current month
      {
        year: currentMonth === 1 ? currentYear - 1 : currentYear,
        month: currentMonth === 1 ? 12 : currentMonth - 1,
      }, // Previous month
      {
        year: currentMonth === 12 ? currentYear + 1 : currentYear,
        month: currentMonth === 12 ? 1 : currentMonth + 1,
      }, // Next month
    ];

    console.log('🔮 Preloading user data for optimal UX');

    for (const { year, month } of monthsToPreload) {
      // Check if already cached
      const hasWaterData = cache.getWaterCalendar(year, month);
      const hasMealData = cache.getMealCalendar(year, month);

      if (!hasWaterData || !hasMealData) {
        try {
          const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
          const endDate = `${year}-${String(month).padStart(2, '0')}-${String(new Date(year, month, 0).getDate()).padStart(2, '0')}`;

          const promises = [];

          if (!hasWaterData) {
            promises.push(
              $fetch('/api/water/range', {
                credentials: 'include',
                query: {
                  startDate,
                  endDate,
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
              }).then((data) => ({ type: 'water', data })),
            );
          }

          if (!hasMealData) {
            promises.push(
              $fetch('/api/meals/range', {
                credentials: 'include',
                query: {
                  startDate,
                  endDate,
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
              }).then((data) => ({ type: 'meal', data })),
            );
          }

          const results = await Promise.allSettled(promises);

          results.forEach((result) => {
            if (result.status === 'fulfilled') {
              const { type, data } = result.value;
              if (type === 'water') {
                cache.setWaterCalendar(year, month, data);
              } else if (type === 'meal') {
                cache.setMealCalendar(year, month, data);
              }
              console.log(`✅ Preloaded ${type} data for ${year}/${month}`);
            }
          });
        } catch (error) {
          console.error(`❌ Preload failed for ${year}/${month}:`, error);
        }
      }
    }
  };

  /**
   * Health check for cache system
   */
  const performCacheHealthCheck = () => {
    const stats = cache.getStats();
    const issues = [];

    // Check hit rate
    if (parseFloat(stats.hitRate) < 30) {
      issues.push('Low cache hit rate (< 30%)');
    }

    // Check memory usage
    if (stats.memorySize > 40) {
      issues.push('High memory cache usage (> 40 entries)');
    }

    // Check if cache is being used effectively
    const totalRequests = stats.hits + stats.misses;
    if (totalRequests > 10 && parseFloat(stats.hitRate) < 50) {
      issues.push(
        'Cache efficiency below optimal (< 50% hit rate with significant usage)',
      );
    }

    const healthStatus = {
      healthy: issues.length === 0,
      issues,
      stats,
      recommendations: [],
    };

    if (!healthStatus.healthy) {
      if (issues.some((issue) => issue.includes('hit rate'))) {
        healthStatus.recommendations.push(
          'Consider adjusting TTL values or prefetch strategy',
        );
      }
      if (issues.some((issue) => issue.includes('memory'))) {
        healthStatus.recommendations.push(
          'Consider reducing MAX_ENTRIES or implementing more aggressive cleanup',
        );
      }
    }

    console.log('🏥 Cache health check:', healthStatus);
    return healthStatus;
  };

  return {
    // Invalidation methods
    invalidateWaterEntry,
    invalidateMealEntry,
    invalidateUserGoals,
    invalidateDateRange,
    emergencyCacheClear,

    // Optimization methods
    preloadUserData,
    performCacheHealthCheck,

    // Direct cache access
    ...cache,
  };
}
