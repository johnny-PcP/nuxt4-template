import type { CreateUserInput, User, UserList } from '../schema/user'
// 手動導入所有依賴
import { $fetch } from 'ofetch'
import { useProjectConfig } from '~/composables/useProjectConfig'
import { validateMultiple, validateSchema } from '~/service/schema/common'
import {
  CreateUserSchema,
  UserListResponseSchema,
  UserResponseSchema,
  UserSchema,
} from '../schema/user'

/**
 * 用戶 API 服務類別
 *
 * 統一的 API 請求處理，根據 isUseLocalApi 自動切換：
 * - isUseLocalApi = true: 使用本地 server/api 路由
 * - isUseLocalApi = false: 使用遠端 API (根據 .env 設定)
 */
export class UserApi {
  /**
   * 獲取專案配置（響應式）
   */
  private getProjectConfig() {
    const projectConfig = useProjectConfig()
    return projectConfig.value
  }

  /**
   * 統一的 API 請求方法
   */
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const config = this.getProjectConfig()

    const requestOptions: any = {
      ...options,
      timeout: config.timeout,
    }

    // 使用遠端 API 時才設定 baseURL
    if (config.baseURL) {
      requestOptions.baseURL = config.baseURL
    }

    return await $fetch<T>(url, requestOptions)
  }

  // 獲取所有用戶
  async getUsers(): Promise<UserList> {
    const config = this.getProjectConfig()

    try {
      const response = await this.request('/api/users')

      const validationResult = validateSchema(
        UserListResponseSchema,
        response,
        {
          errorMessage: 'API 回應格式驗證失敗',
        },
      )

      if (config.showConsole) {
        console.log('✅ 成功獲取用戶列表:', validationResult.data!.data)
      }

      return validationResult.data!.data
    }
    catch (error) {
      if (config.showConsole) {
        console.error('❌ 獲取用戶列表失敗:', error)
      }
      throw new Error('獲取用戶列表失敗')
    }
  }

  // 根據 ID 獲取單一用戶
  async getUserById(id: number): Promise<User | null> {
    const config = this.getProjectConfig()

    try {
      const response = await this.request(`/api/users/${id}`)

      const validationResult = validateSchema(UserResponseSchema, response, {
        errorMessage: 'API 回應格式驗證失敗',
      })

      if (config.showConsole) {
        console.log(`✅ 成功獲取用戶 ID ${id}:`, validationResult.data!.data)
      }

      return validationResult.data!.data
    }
    catch (error) {
      if (config.showConsole) {
        console.error(`❌ 獲取用戶 ID ${id} 失敗:`, error)
      }
      return null
    }
  }

  // 創建新用戶
  async createUser(userData: CreateUserInput): Promise<User> {
    const config = this.getProjectConfig()

    try {
      const inputValidation = validateSchema(CreateUserSchema, userData, {
        errorMessage: '創建用戶輸入資料驗證失敗',
      })
      const validatedInput = inputValidation.data!

      const response = await this.request('/api/users', {
        method: 'POST',
        body: JSON.stringify(validatedInput),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const responseValidation = validateSchema(UserResponseSchema, response, {
        errorMessage: 'API 回應格式驗證失敗',
      })

      if (config.showConsole) {
        console.log('✅ 成功創建用戶:', responseValidation.data!.data)
      }

      return responseValidation.data!.data
    }
    catch (error) {
      if (config.showConsole) {
        console.error('❌ 創建用戶失敗:', error)
      }
      throw new Error('創建用戶失敗')
    }
  }

  // 更新用戶
  async updateUser(id: number, userData: Partial<CreateUserInput>): Promise<User> {
    const config = this.getProjectConfig()

    try {
      const response = await this.request(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const responseValidation = validateSchema(UserResponseSchema, response, {
        errorMessage: 'API 回應格式驗證失敗',
      })

      if (config.showConsole) {
        console.log(`✅ 成功更新用戶 ID ${id}:`, responseValidation.data!.data)
      }

      return responseValidation.data!.data
    }
    catch (error) {
      if (config.showConsole) {
        console.error(`❌ 更新用戶 ID ${id} 失敗:`, error)
      }
      throw new Error('更新用戶失敗')
    }
  }

  // 刪除用戶
  async deleteUser(id: number): Promise<{ success: boolean, message: string }> {
    const config = this.getProjectConfig()

    try {
      const response = await this.request<{ success?: boolean, message?: string }>(`/api/users/${id}`, {
        method: 'DELETE',
      })

      const result = {
        success: response.success || false,
        message: response.message || '刪除成功',
      }

      if (config.showConsole) {
        console.log(`✅ 成功刪除用戶 ID ${id}:`, result)
      }

      return result
    }
    catch (error) {
      if (config.showConsole) {
        console.error(`❌ 刪除用戶 ID ${id} 失敗:`, error)
      }
      throw new Error('刪除用戶失敗')
    }
  }

  // 驗證用戶資料 - 環境條件式錯誤記錄
  validateUser(userData: unknown) {
    return validateSchema(UserSchema, userData, {
      errorMessage: '用戶資料驗證失敗',
      successMessage: '用戶資料驗證成功',
      throwOnError: false, // 驗證功能返回錯誤物件而不拋出異常
    })
  }

  // 批量驗證用戶資料
  validateUsers(userDataArray: unknown[]) {
    return validateMultiple(UserSchema, userDataArray, {
      errorMessage: '用戶資料批量驗證失敗',
      successMessage: '用戶資料批量驗證成功',
      throwOnError: false, // 批量驗證返回錯誤物件
    })
  }

  // 驗證創建用戶輸入資料
  validateCreateUserInput(inputData: unknown) {
    return validateSchema(CreateUserSchema, inputData, {
      errorMessage: '創建用戶輸入資料驗證失敗',
      successMessage: '創建用戶輸入資料驗證成功',
      throwOnError: false, // 輸入驗證返回錯誤物件
    })
  }
}

// 導出 API 實例
export const userApi = new UserApi()
