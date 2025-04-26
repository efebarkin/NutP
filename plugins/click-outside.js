export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    mounted(el, binding) {
      el._clickOutside = (event) => {
        // Check if the click was outside the element and its children
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event);
        }
      };
      document.addEventListener('click', el._clickOutside);
      document.addEventListener('touchstart', el._clickOutside);
    },
    unmounted(el) {
      document.removeEventListener('click', el._clickOutside);
      document.removeEventListener('touchstart', el._clickOutside);
    }
  });
});
