import { z } from 'zod'

/**
 * 專案配置 Schema 定義
 *
 * 定義專案運行時所需的所有配置項目和驗證規則
 * 確保配置的類型安全性和完整性
 */
export const ProjectConfigSchema = z.object({
  // API 服務配置
  environment: z.enum(['development', 'production']),
  // baseURL 可以為空字串（使用本地 server/api 時）
  baseURL: z.string(),
  timeout: z.number().positive('API 超時時間必須大於 0'),

  // 是否使用本地 API：true = 本地 server/api，false = 遠端 API
  isUseLocalApi: z.boolean(),

  // 是否顯示 console 訊息
  showConsole: z.boolean(),
}).refine((data) => {
  // 正式環境：baseURL 不能為空
  if (data.environment === 'production' && !data.baseURL) {
    return false
  }

  // 開發環境：當使用遠端 API 時，baseURL 不能為空
  if (data.environment === 'development' && !data.isUseLocalApi && !data.baseURL) {
    return false
  }

  return true
}, {
  message: '當使用遠端 API 時，baseURL 不能為空',
  path: ['baseURL'],
})

/**
 * 專案配置型別
 *
 * 從 ProjectConfigSchema 推導出的 TypeScript 型別
 * 確保編譯時和運行時的型別一致性
 */
export type ProjectConfigType = z.infer<typeof ProjectConfigSchema>
