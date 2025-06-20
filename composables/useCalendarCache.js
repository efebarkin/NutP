/**
 * Vue 3 + Nuxt 3 Compatible Calendar Cache Mechanism (SSR-Safe)
 * Multi-layer caching with smart invalidation and performance optimization
 */

import { ref, computed } from 'vue';

// Cache configuration
const CACHE_CONFIG = {
  // Time-to-live settings (in milliseconds)
  TTL: {
    WATER_DATA: 5 * 60 * 1000, // 5 minutes for water data
    MEAL_DATA: 3 * 60 * 1000, // 3 minutes for meal data (more dynamic)
    USER_GOALS: 30 * 60 * 1000, // 30 minutes for user goals
    STATIC_DATA: 60 * 60 * 1000, // 1 hour for relatively static data
  },
  // Cache size limits
  MAX_ENTRIES: {
    MEMORY: 50, // Max entries in memory cache
    STORAGE: 100, // Max entries in persistent storage
  },
  // Storage keys
  STORAGE_KEYS: {
    WATER_CACHE: 'calendar_water_cache',
    MEAL_CACHE: 'calendar_meal_cache',
    GOALS_CACHE: 'user_goals_cache',
    CACHE_META: 'calendar_cache_meta',
  },
};

// Global cache state - SSR safe
const memoryCache = ref(new Map());
const cacheStats = ref({
  hits: 0,
  misses: 0,
  evictions: 0,
  lastCleanup: Date.now(),
});

// SSR-safe storage helpers
const isClient = () => {
  return (
    import.meta.client &&
    typeof window !== 'undefined' &&
    window.sessionStorage &&
    window.localStorage
  );
};

const getStorageItem = (key, useLocalStorage = false) => {
  if (!isClient()) return null;

  try {
    const storage = useLocalStorage
      ? window.localStorage
      : window.sessionStorage;
    if (!storage) return null;

    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`[Cache] Failed to get storage item:`, error);
    return null;
  }
};

const setStorageItem = (key, value, useLocalStorage = false) => {
  if (!isClient()) return;

  try {
    const storage = useLocalStorage
      ? window.localStorage
      : window.sessionStorage;
    if (!storage) return;

    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[Cache] Failed to set storage item:`, error);
  }
};

const removeStorageItem = (key, useLocalStorage = false) => {
  if (!isClient()) return;

  try {
    const storage = useLocalStorage
      ? window.localStorage
      : window.sessionStorage;
    if (!storage) return;

    storage.removeItem(key);
  } catch (error) {
    console.warn(`[Cache] Failed to remove storage item:`, error);
  }
};

// Persistent storage management
const getPersistentCache = (type) => {
  switch (type) {
    case 'water':
      return getStorageItem(CACHE_CONFIG.STORAGE_KEYS.WATER_CACHE) || {};
    case 'meal':
      return getStorageItem(CACHE_CONFIG.STORAGE_KEYS.MEAL_CACHE) || {};
    case 'goals':
      return getStorageItem(CACHE_CONFIG.STORAGE_KEYS.GOALS_CACHE, true) || {};
    default:
      return {};
  }
};

const setPersistentCache = (type, data) => {
  switch (type) {
    case 'water':
      setStorageItem(CACHE_CONFIG.STORAGE_KEYS.WATER_CACHE, data);
      break;
    case 'meal':
      setStorageItem(CACHE_CONFIG.STORAGE_KEYS.MEAL_CACHE, data);
      break;
    case 'goals':
      setStorageItem(CACHE_CONFIG.STORAGE_KEYS.GOALS_CACHE, data, true);
      break;
  }
};

/**
 * Generate cache key from parameters
 */
function generateCacheKey(type, params = {}) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join('|');

  return `${type}:${sortedParams}`;
}

/**
 * Check if cache entry is valid (not expired)
 */
function isCacheEntryValid(entry, ttl) {
  if (!entry || !entry.timestamp) return false;
  return Date.now() - entry.timestamp < ttl;
}

/**
 * Create cache entry with metadata
 */
function createCacheEntry(data, metadata = {}) {
  return {
    data,
    timestamp: Date.now(),
    accessCount: 0,
    metadata: {
      size: JSON.stringify(data).length,
      ...metadata,
    },
  };
}

/**
 * Memory cache management
 */
function cleanupMemoryCache() {
  const cache = memoryCache.value;
  const entries = Array.from(cache.entries());

  // Remove expired entries
  const now = Date.now();
  let removedCount = 0;

  for (const [key, entry] of entries) {
    const ttl = key.startsWith('water:')
      ? CACHE_CONFIG.TTL.WATER_DATA
      : key.startsWith('meal:')
        ? CACHE_CONFIG.TTL.MEAL_DATA
        : key.startsWith('goals:')
          ? CACHE_CONFIG.TTL.USER_GOALS
          : CACHE_CONFIG.TTL.STATIC_DATA;

    if (!isCacheEntryValid(entry, ttl)) {
      cache.delete(key);
      removedCount++;
    }
  }

  // If still over limit, remove least recently accessed
  if (cache.size > CACHE_CONFIG.MAX_ENTRIES.MEMORY) {
    const sortedEntries = Array.from(cache.entries()).sort(
      (a, b) => (a[1].lastAccess || 0) - (b[1].lastAccess || 0),
    );

    const toRemove = cache.size - CACHE_CONFIG.MAX_ENTRIES.MEMORY;
    for (let i = 0; i < toRemove; i++) {
      cache.delete(sortedEntries[i][0]);
      removedCount++;
    }
  }

  cacheStats.value.evictions += removedCount;
  cacheStats.value.lastCleanup = now;

  console.log(
    `[Cache] Cleanup completed: removed ${removedCount} entries, ${cache.size} remaining`,
  );
}

/**
 * Get data from cache (multi-layer lookup)
 */
function getCachedData(type, params = {}) {
  const key = generateCacheKey(type, params);
  const now = Date.now();

  // Layer 1: Memory cache (fastest)
  const memoryEntry = memoryCache.value.get(key);
  const ttl = type.startsWith('water')
    ? CACHE_CONFIG.TTL.WATER_DATA
    : type.startsWith('meal')
      ? CACHE_CONFIG.TTL.MEAL_DATA
      : type.startsWith('goals')
        ? CACHE_CONFIG.TTL.USER_GOALS
        : CACHE_CONFIG.TTL.STATIC_DATA;

  if (memoryEntry && isCacheEntryValid(memoryEntry, ttl)) {
    memoryEntry.lastAccess = now;
    memoryEntry.accessCount++;
    cacheStats.value.hits++;

    console.log(`[Cache] Memory hit for ${key}`);
    return memoryEntry.data;
  }

  // Layer 2: Persistent storage (only on client)
  if (isClient()) {
    const cacheType = type.startsWith('water')
      ? 'water'
      : type.startsWith('meal')
        ? 'meal'
        : type.startsWith('goals')
          ? 'goals'
          : null;

    if (cacheType) {
      const persistentCache = getPersistentCache(cacheType);
      const persistentEntry = persistentCache[key];

      if (persistentEntry && isCacheEntryValid(persistentEntry, ttl)) {
        // Promote to memory cache
        const entry = createCacheEntry(
          persistentEntry.data,
          persistentEntry.metadata,
        );
        entry.lastAccess = now;
        memoryCache.value.set(key, entry);

        cacheStats.value.hits++;
        console.log(`[Cache] Storage hit for ${key}, promoted to memory`);
        return persistentEntry.data;
      }
    }
  }

  cacheStats.value.misses++;
  console.log(`[Cache] Miss for ${key}`);
  return null;
}

/**
 * Set data to cache (multi-layer storage)
 */
function setCachedData(type, params = {}, data, metadata = {}) {
  const key = generateCacheKey(type, params);
  const entry = createCacheEntry(data, metadata);

  // Store in memory cache
  memoryCache.value.set(key, { ...entry, lastAccess: Date.now() });

  // Store in persistent cache (only on client)
  if (isClient()) {
    const cacheType = type.startsWith('water')
      ? 'water'
      : type.startsWith('meal')
        ? 'meal'
        : type.startsWith('goals')
          ? 'goals'
          : null;

    if (cacheType) {
      const persistentCache = getPersistentCache(cacheType);
      persistentCache[key] = entry;

      // Cleanup persistent storage if needed
      const entries = Object.keys(persistentCache);
      if (entries.length > CACHE_CONFIG.MAX_ENTRIES.STORAGE) {
        const sortedEntries = entries
          .map((k) => [k, persistentCache[k]])
          .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));

        const toRemove = entries.length - CACHE_CONFIG.MAX_ENTRIES.STORAGE;
        for (let i = 0; i < toRemove; i++) {
          delete persistentCache[sortedEntries[i][0]];
        }
      }

      setPersistentCache(cacheType, persistentCache);
    }
  }

  console.log(`[Cache] Stored ${key} (${entry.metadata.size} bytes)`);

  // Cleanup memory cache if needed
  if (memoryCache.value.size > CACHE_CONFIG.MAX_ENTRIES.MEMORY) {
    cleanupMemoryCache();
  }
}

/**
 * Invalidate cache entries
 */
function invalidateCache(pattern) {
  const memory = memoryCache.value;
  let removedCount = 0;

  // Invalidate memory cache
  for (const key of memory.keys()) {
    if (
      typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)
    ) {
      memory.delete(key);
      removedCount++;
    }
  }

  // Invalidate persistent caches (only on client)
  if (isClient()) {
    const cacheTypes = ['water', 'meal', 'goals'];
    for (const cacheType of cacheTypes) {
      const cache = getPersistentCache(cacheType);

      for (const key of Object.keys(cache)) {
        if (
          typeof pattern === 'string'
            ? key.includes(pattern)
            : pattern.test(key)
        ) {
          delete cache[key];
          removedCount++;
        }
      }

      setPersistentCache(cacheType, cache);
    }
  }

  console.log(
    `[Cache] Invalidated ${removedCount} entries matching pattern:`,
    pattern,
  );
  return removedCount;
}

/**
 * Main composable function
 */
export function useCalendarCache() {
  // Performance metrics (return plain values, not computed)
  const getHitRate = () => {
    const total = cacheStats.value.hits + cacheStats.value.misses;
    return total > 0
      ? parseFloat(((cacheStats.value.hits / total) * 100).toFixed(1))
      : 0.0;
  };

  const getCacheSize = () => memoryCache.value.size;

  // Cache operations
  const get = getCachedData;
  const set = setCachedData;
  const invalidate = invalidateCache;

  // Cleanup function for component unmounting
  const cleanup = () => {
    cleanupMemoryCache();
  };

  // Cache statistics and debugging
  const getStats = () => {
    const persistentSizes = {};

    if (isClient()) {
      persistentSizes.water = Object.keys(getPersistentCache('water')).length;
      persistentSizes.meal = Object.keys(getPersistentCache('meal')).length;
      persistentSizes.goals = Object.keys(getPersistentCache('goals')).length;
    }

    return {
      ...cacheStats.value,
      hitRate: getHitRate(),
      memorySize: getCacheSize(),
      persistentSizes,
    };
  };

  // Clear all caches
  const clearAll = () => {
    memoryCache.value.clear();

    if (isClient()) {
      removeStorageItem(CACHE_CONFIG.STORAGE_KEYS.WATER_CACHE);
      removeStorageItem(CACHE_CONFIG.STORAGE_KEYS.MEAL_CACHE);
      removeStorageItem(CACHE_CONFIG.STORAGE_KEYS.GOALS_CACHE, true);
      removeStorageItem(CACHE_CONFIG.STORAGE_KEYS.CACHE_META, true);
    }

    cacheStats.value = {
      hits: 0,
      misses: 0,
      evictions: 0,
      lastCleanup: Date.now(),
    };
    console.log('[Cache] All caches cleared');
  };

  return {
    // Core operations
    get,
    set,
    invalidate,
    cleanup,

    // Statistics and debugging
    getStats,
    clearAll,
    get hitRate() {
      return getHitRate();
    },
    get cacheSize() {
      return getCacheSize();
    },

    // Reactive stats
    stats: computed(() => getStats()),
  };
}

/**
 * Specialized calendar cache helpers
 */
export function useCalendarDataCache() {
  const cache = useCalendarCache();

  // Water calendar specific methods
  const getWaterCalendar = (year, month) => {
    return cache.get('water_calendar', { year, month });
  };

  const setWaterCalendar = (year, month, data) => {
    return cache.set('water_calendar', { year, month }, data, {
      dataType: 'water_calendar',
      month: `${year}-${month}`,
    });
  };

  // Meal calendar specific methods
  const getMealCalendar = (year, month) => {
    return cache.get('meal_calendar', { year, month });
  };

  const setMealCalendar = (year, month, data) => {
    return cache.set('meal_calendar', { year, month }, data, {
      dataType: 'meal_calendar',
      month: `${year}-${month}`,
    });
  };

  // User goals cache
  const getUserGoals = (userId) => {
    return cache.get('user_goals', { userId });
  };

  const setUserGoals = (userId, goals) => {
    return cache.set('user_goals', { userId }, goals, {
      dataType: 'user_goals',
      userId,
    });
  };

  // Invalidation helpers
  const invalidateMonth = (year, month) => {
    return cache.invalidate(`${year}-${month}`);
  };

  const invalidateUser = (userId) => {
    return cache.invalidate(`userId:${userId}`);
  };

  const invalidateWaterData = () => {
    return cache.invalidate('water_');
  };

  const invalidateMealData = () => {
    return cache.invalidate('meal_');
  };

  return {
    ...cache,

    // Specialized getters/setters
    getWaterCalendar,
    setWaterCalendar,
    getMealCalendar,
    setMealCalendar,
    getUserGoals,
    setUserGoals,

    // Specialized invalidation
    invalidateMonth,
    invalidateUser,
    invalidateWaterData,
    invalidateMealData,
  };
}
