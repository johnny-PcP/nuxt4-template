import antfu from '@antfu/eslint-config'

export default antfu({
  // 啟用 Vue 和 TypeScript 支援
  vue: true,
  typescript: true,

  // 格式化配置
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },

  // 自定義規則覆蓋
  rules: {
    // 換行規則 - 適合大型專案的可讀性
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 1 }, // 單行允許最多 1 個屬性
      multiline: { max: 1 }, // 多行時每行 1 個屬性
    }],

    // 允許 console（開發和調試需要）
    'no-console': 'off',

    // 禁用 Node.js 全域變數（配合 Nuxt 3 使用）
    'node/prefer-global/process': 'off',
  },
})
