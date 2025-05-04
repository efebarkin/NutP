// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    strict: true,
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  // @ts-ignore - Pinia yapılandırması için TypeScript hatası görmezden gelinecek
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  plugins: [
    '~/plugins/csrf.js' // CSRF token plugin'i ekle
  ],
  app: {
    layoutTransition: {
      name: 'admin-page',
      mode: 'out-in'
    },
    head: {
      title: 'NutP',
      titleTemplate: '%s | pt.com',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      script: [
        {
          src: 'https://kit.fontawesome.com/a076d05399.js',
          async: true,
          crossorigin: 'anonymous'
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ],
      // Content Security Policy ayarları - görsel kaynaklarını genişlet
      meta: [
        {
          name: 'Content-Security-Policy',
          content: "img-src 'self' data: blob: https:;"
        }
      ]
    },
  },
  css: [
    '@/assets/css/main.css',
    '@/assets/css/admin-transitions.css',
  ],
  build: {
    transpile: ['vue-toastification'],
  },
  $production: {
    app: {
      head: {
        title: 'PROD',
      },
    },
    routeRules: {
      '/**': { isr: true },
      '/socket.io/**': { proxy: 'http://localhost:3000' }
    },
  },
  $development: {
    app: {
      head: {
        title: 'DEV',
      },
    },
    routeRules: {
      '/socket.io/**': { proxy: '' }
    },
  },
  $env: {
    staging: {
      //
    },
  },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutdb',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    csrfSecret: process.env.CSRF_SECRET || 'csrf-secret-key', // CSRF Secret key
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'eu-north-1',
      bucketName: process.env.AWS_BUCKET_NAME || 'nutproject',
    },
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      csrfEnabled: process.env.CSRF_ENABLED !== 'false', // CSRF koruması aktif mi
    },
  },
  vite: {},
  webpack: {},
  compatibilityDate: '2024-12-29',
  // Nitro yapılandırması - server middleware'leri ve diğer ayarlar burada tanımlanır
  nitro: {
    plugins: ["~/server/db/index.js"],
    experimental: {
      asyncContext: true
    },
    // Server routes yapılandırması
    routeRules: {
      '/api/**': {
        // API isteklerinde CORS ve güvenlik ayarları
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-CSRF-Token'
        }
      }
    }
  }
});
