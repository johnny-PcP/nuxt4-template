import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4, // 從 Nuxt 3 升級，建議保留一段時間
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/icon',
  ],
  components: false, // 禁用自動導入 components
  imports: {
    autoImport: false, // 禁用自動導入 composables 和 utils
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'], // 運行時配置
  runtimeConfig: {
    // 私有配置 (僅在伺服器端可用)
    apiSecret: process.env.API_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    // 可以被 NUXT_API_ENV 環境變數覆蓋 (僅伺服器端)
    apiEnv: process.env.NUXT_API_ENV || 'development',

    // 公開配置 (客戶端和伺服器端都可用)
    public: {
      // 是否使用本地 server/api 處理 API 請求（限定開發環境使用）
      // 可以被 NUXT_PUBLIC_IS_USE_LOCAL_API 環境變數覆蓋
      isUseLocalApi: process.env.NUXT_PUBLIC_IS_USE_LOCAL_API === 'true',
      // 是否顯示通用函式的錯誤訊息與一般訊息告警
      // 可以被 NUXT_PUBLIC_IS_SHOW_CONSOLE 環境變數覆蓋
      isShowConsole: process.env.NUXT_PUBLIC_IS_SHOW_CONSOLE === 'true',
      // 全站 API 地址，可以被 NUXT_PUBLIC_API_BASE_URL 環境變數覆蓋
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
      // 環境資訊（客戶端可用）
      environment: process.env.NODE_ENV || 'development',
      // API 超時設定（毫秒）- 客戶端和伺服器端都可用
      // 可以被 NUXT_PUBLIC_API_TIMEOUT 環境變數覆蓋
      apiTimeout: Number(process.env.NUXT_PUBLIC_API_TIMEOUT) || 5000,
    },
  },
  compatibilityDate: '2025-05-15',
  vite: {
    plugins: [tailwindcss()],
  },

  eslint: {
    config: {
      stylistic: true, // 啟用風格檢查
    },
  },
})
