import { useRuntimeConfig } from '#app'
import { computed } from 'vue'
import { validateSchema } from '~/service/schema/common'
import { ProjectConfigSchema } from '~/service/schema/config'

/**
 * 專案配置管理函數
 *
 * 根據環境變數提供統一的配置接口，所有配置都經過 Zod 驗證
 * 確保配置的類型安全性和完整性
 *
 * 配置邏輯：
 * - 開發環境：
 *   - isUseLocalApi = true 時，使用當前 URL 的 /api 路徑（baseURL = ''）
 *   - isUseLocalApi = false 時，使用 NUXT_PUBLIC_API_BASE_URL 的值
 * - 正式環境：
 *   - 忽略 isUseLocalApi 設定，直接使用 NUXT_PUBLIC_API_BASE_URL
 * - showConsole 控制是否顯示客製的 console 訊息
 *
 * 注意事項：
 * - 只使用客戶端可存取的 runtime config 屬性（public 和 app）
 * - 環境判斷使用 config.public.environment 而非 server-only 的 config.apiEnv
 * - API timeout 使用 config.public.apiTimeout，支援客戶端和伺服器端統一設定
 * - 使用 computed 進行響應式緩存，避免重複計算
 *
 * @returns {ComputedRef} 響應式的專案配置物件
 *
 * @example
 * ```typescript
 * const config = useProjectConfig()
 * // config.value.environment     // 'development' | 'production'
 * // config.value.baseURL         // API 基礎 URL
 * // config.value.isUseLocalApi   // true = 本地 API, false = 遠端 API
 * // config.value.showConsole     // true = 顯示 console, false = 不顯示
 * // config.value.runtimeConfig   // 原始 runtime config (用於展示)
 * ```
 */
export function useProjectConfig() {
  return computed(() => {
    const config = useRuntimeConfig()

    // 取得環境資訊 - 使用 public 配置中的環境資訊
    const environment = String(config.public.environment || 'development')
    const isProduction = environment === 'production'
    const isUseLocalApi = Boolean(config.public.isUseLocalApi)

    // 根據環境決定 baseURL
    let baseURL: string

    if (isProduction) {
      // 正式環境：直接使用 NUXT_PUBLIC_API_BASE_URL
      baseURL = String(config.public.apiBaseUrl || '')
    }
    else {
      // 開發環境：根據 isUseLocalApi 決定
      if (isUseLocalApi) {
        // 使用當前 URL 的 /api 路徑
        baseURL = ''
      }
      else {
        // 使用 NUXT_PUBLIC_API_BASE_URL
        baseURL = String(config.public.apiBaseUrl || '')
      }
    }

    // 配置物件組裝
    const rawConfig = {
      // API 服務配置
      environment,
      baseURL,
      timeout: Number(config.public.apiTimeout || 5000), // 使用公開的 apiTimeout 設定

      // 是否使用本地 API（正式環境忽略此設定）
      isUseLocalApi: isProduction ? false : isUseLocalApi,

      // 是否顯示客製的 console 訊息
      showConsole: Boolean(config.public.isShowConsole),
    }

    // 配置驗證與回傳
    const result = validateSchema(ProjectConfigSchema, rawConfig, {
      errorMessage: 'Config配置驗證失敗',
    })

    // 準備 runtime config 用於展示（只包含客戶端可存取的部分）
    const runtimeConfigForDisplay = {
      public: config.public,
      app: config.app,
    }

    return {
      ...result.data!,
      runtimeConfig: runtimeConfigForDisplay,
    }
  })
}
