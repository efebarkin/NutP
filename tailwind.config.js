/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './node_modules/@nuxt/ui/dist/**/*.{mjs,js,vue}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

