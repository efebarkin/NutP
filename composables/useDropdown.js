// composables/useDropdown.js
import { ref, nextTick } from 'vue';

export const useDropdown = (options = {}) => {
  const isOpen = ref(false);
  const activeIndex = ref(-1);

  const {
    autoClose = true,
    closeOnRouteChange = true,
    trapFocus = true,
  } = options;

  const toggle = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      activeIndex.value = -1;
    }
  };

  const open = () => {
    isOpen.value = true;
    activeIndex.value = -1;
  };

  const close = () => {
    isOpen.value = false;
    activeIndex.value = -1;
  };

  const handleKeyNavigation = (event, items = []) => {
    if (!isOpen.value || !items.length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        activeIndex.value =
          activeIndex.value < items.length - 1 ? activeIndex.value + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        activeIndex.value =
          activeIndex.value > 0 ? activeIndex.value - 1 : items.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIndex.value >= 0) {
          // Let the component handle the click
          return true;
        }
        break;
      case 'Escape':
        event.preventDefault();
        close();
        return true;
      case 'Tab':
        if (autoClose) {
          close();
        }
        break;
    }
    return false;
  };

  return {
    isOpen,
    activeIndex,
    toggle,
    open,
    close,
    handleKeyNavigation,
  };
};
