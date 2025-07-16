/**
 * 通用共享類型定義
 *
 * 這個檔案包含了跨多個模組使用的共享類型
 * 這些類型會被多個 composable、組件或頁面使用
 * 在實際專案中，您可以將常用的共享類型放在這裡
 */

// 驗證結果接口 (被多個驗證相關模組使用)
export interface ValidationResult {
  success: boolean
  data?: any
  error?: string
  errors?: Array<{
    field: string
    message: string
  }>
  summary?: string
}

// API 響應通用格式 (被多個 API 模組使用)
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}
