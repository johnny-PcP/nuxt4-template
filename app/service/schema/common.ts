import type { ZodSchema } from 'zod'
import { z } from 'zod'
import { useProjectConfig } from '~/composables/useProjectConfig'

// API 基礎回應結構 Schema
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

// API 回應包裝 Schema 生成函數
export function createApiResponseSchema<T extends ZodSchema>(dataSchema: T) {
  return BaseResponseSchema.extend({
    data: dataSchema,
  })
}

// 驗證選項介面
export interface ValidationOptions {
  errorMessage?: string
  successMessage?: string
  throwOnError?: boolean
}

// 驗證結果介面
export interface ValidationResult<T> {
  success: boolean
  data?: T
  error?: string
  errors?: Array<{
    field: string
    message: string
    value?: unknown
  }>
  summary?: string
}

// 輔助函數：檢查是否應該顯示 console 訊息
function shouldShowConsole(): boolean {
  try {
    const projectConfig = useProjectConfig()
    return projectConfig.value.showConsole
  }
  catch {
    // 如果配置讀取失敗，回退到環境變數檢查
    return process.env.NODE_ENV !== 'production'
  }
}

// 輔助函數：根據路徑提取物件中的值
function getValueAtPath(obj: unknown, path: (string | number)[]): unknown {
  try {
    let current = obj
    for (const key of path) {
      if (current === null || current === undefined) {
        return undefined
      }
      if (typeof current === 'object' && current !== null) {
        current = (current as Record<string | number, unknown>)[key]
      }
      else {
        return undefined
      }
    }
    return current
  }
  catch {
    return undefined
  }
}

// 通用 Schema 驗證函數
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: ValidationOptions | string = {},
): ValidationResult<T> {
  // 向後兼容處理
  const opts
    = typeof options === 'string'
      ? { errorMessage: options, throwOnError: true }
      : options

  const {
    errorMessage = '資料驗證失敗',
    successMessage = '資料驗證成功',
    throwOnError = true, // 改為預設 true
  } = opts

  try {
    const result = schema.safeParse(data)

    if (result.success) {
      return {
        success: true,
        data: result.data,
        summary: successMessage,
      }
    }

    // 錯誤格式化
    const formattedErrors = result.error.errors.map((err) => {
      // 從原始資料中提取實際值
      const actualValue = getValueAtPath(data, err.path)
      return {
        field: err.path.join('.'),
        message: getChineseErrorMessage(err),
        value: actualValue,
      }
    })

    const errorResult: ValidationResult<T> = {
      success: false,
      error: errorMessage,
      errors: formattedErrors,
      summary: `${errorMessage}: 發現 ${formattedErrors.length} 個驗證錯誤`,
    }

    if (shouldShowConsole()) {
      console.error(errorMessage, errorResult)

      console.group(`Schema 驗證失敗 - 發現 ${formattedErrors.length} 個欄位錯誤`)

      console.error('錯誤訊息:', errorMessage)
      console.table(errorResult.errors)
      console.groupEnd()
    }

    if (throwOnError) {
      throw new Error(errorResult.summary)
    }

    return errorResult
  }
  catch (error) {
    const catchError = error instanceof Error ? error.message : '未知錯誤'
    const errorResult: ValidationResult<T> = {
      success: false,
      error: catchError,
      summary: `${errorMessage}: ${catchError}`,
    }

    // 根據配置決定是否顯示 console 訊息
    if (shouldShowConsole()) {
      console.group('💥 系統執行異常')
      console.error('錯誤訊息:', errorMessage)
      console.error('原始錯誤:', error)
      console.groupEnd()
    }

    if (throwOnError) {
      throw error
    }

    return errorResult
  }
}
// 批量驗證函數
export function validateMultiple<T>(
  schema: z.ZodSchema<T>,
  dataArray: unknown[],
  options: ValidationOptions = {},
): ValidationResult<T[]> {
  const results: T[] = []
  const errors: Array<{ index: number, error: string }> = []

  const { throwOnError = true } = options

  dataArray.forEach((data, index) => {
    // 批量驗證內部總是不拋出異常，收集所有錯誤
    const result = validateSchema(schema, data, {
      ...options,
      throwOnError: false, // 強制為 false，確保能收集所有錯誤
    })

    if (result.success && result.data) {
      results.push(result.data)
    }
    else {
      errors.push({ index, error: result.error || '驗證失敗' })
    }
  })

  if (errors.length > 0) {
    const errorResult: ValidationResult<T[]> = {
      success: false,
      error: '批量驗證失敗',
      summary: `${errors.length}/${dataArray.length} 項目驗證失敗`,
    }

    // 根據 throwOnError 決定是拋出異常還是返回錯誤
    if (throwOnError) {
      throw new Error(errorResult.summary)
    }

    return errorResult
  }

  return {
    success: true,
    data: results,
    summary: `批量驗證成功: ${results.length} 項目`,
  }
}

// 中文錯誤訊息轉換函數
function getChineseErrorMessage(error: z.ZodIssue): string {
  switch (error.code) {
    case 'invalid_type':
      return `期望 ${error.expected}，但收到 ${error.received}`
    case 'invalid_string':
      if (error.validation === 'email')
        return '無效的電子郵件格式'
      if (error.validation === 'url')
        return '無效的網址格式'
      return '字串格式無效'
    case 'too_small':
      if (error.type === 'string')
        return `字串長度必須大於等於 ${error.minimum}`
      return `值必須大於等於 ${error.minimum}`
    case 'too_big':
      if (error.type === 'string')
        return `字串長度必須小於等於 ${error.maximum}`
      return `值必須小於等於 ${error.maximum}`
    case 'invalid_enum_value':
      return `必須是以下值之一: ${error.options.join(', ')}`
    case 'unrecognized_keys':
      return `不允許的欄位: ${error.keys.join(', ')}`
    case 'invalid_date':
      return '無效的日期格式'
    default:
      return error.message
  }
}
