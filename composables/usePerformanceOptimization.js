// composables/usePerformanceOptimization.js
import { shallowRef, shallowReactive, computed, watchEffect } from 'vue';

export const usePerformanceOptimization = () => {
  // Throttle function
  const throttle = (fn, delay = 100) => {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return fn(...args);
      }
    };
  };

  // Debounce function
  const debounce = (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  // Memoized computed with shallow reactivity
  const useShallowComputed = (getter) => {
    const value = shallowRef();
    watchEffect(() => {
      value.value = getter();
    });
    return computed(() => value.value);
  };

  return {
    throttle,
    debounce,
    useShallowComputed,
    shallowReactive,
  };
};
