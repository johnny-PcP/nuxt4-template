/**
 * Demo 驗證相關的工具函數
 *
 * 這個文件包含了示例驗證的工具函數
 * 在實際專案中，您可以參考這些函數來創建自己的驗證工具
 */

import { userApi } from '~/service/api/user'

// 設定驗證示例的工廠函數
export const validationExamples = {
  // 完整有效資料
  valid: () => JSON.stringify(
    {
      id: 1,
      name: '有效用戶',
      email: 'valid@example.com',
      age: 30,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    null,
    2,
  ),

  // 最少有效資料
  minimal: () => JSON.stringify(
    {
      id: 2,
      name: '最少資料用戶',
      email: 'minimal@example.com',
      isActive: false,
      // age 和 createdAt 是可選的
    },
    null,
    2,
  ),

  // 無效資料
  invalid: () => JSON.stringify(
    {
      id: '不是數字', // 錯誤：id 應該是數字
      name: '', // 錯誤：name 不能為空
      email: '不是email格式', // 錯誤：email 格式錯誤
      age: -5, // 錯誤：age 不能小於1
      isActive: '不是布林值', // 錯誤：isActive 應該是布林值
      createdAt: '不是有效日期格式', // 錯誤：日期格式錯誤
    },
    null,
    2,
  ),

  // 部分資料
  partial: () => JSON.stringify(
    {
      id: 3,
      name: '部分資料用戶',
      email: 'partial@example.com',
      // 缺少 age (可選)、isActive (必需) 和 createdAt (可選)
      // 這會導致 isActive 缺失的錯誤
    },
    null,
    2,
  ),
}

// Zod 驗證功能
export function testUserValidation(testData: string, showConsole: boolean = false): string {
  try {
    const data = JSON.parse(testData)

    const result = userApi.validateUser(data)

    if (result.success && result.data) {
      return `✅ ${
        result.summary || '驗證成功'
      }\n\n驗證後的資料:\n${JSON.stringify(result.data, null, 2)}`
    }
    else {
      // 顯示詳細的錯誤信息
      let errorMessage = `❌ ${result.summary || '驗證失敗'}`

      if (result.errors && result.errors.length > 0) {
        errorMessage += '\n\n詳細錯誤:'
        result.errors.forEach((err, index) => {
          errorMessage += `\n${index + 1}. ${err.field}: ${err.message}`
        })
      }
      else if (result.error) {
        errorMessage += `\n\n錯誤訊息: ${result.error}`
      }

      return errorMessage
    }
  }
  catch (err) {
    // 在 console 模式開啟時記錄 JSON 解析錯誤
    if (showConsole) {
      console.error('JSON 解析錯誤:', err)
    }

    return `❌ JSON 解析失敗:\n${
      err instanceof Error ? err.message : '未知錯誤'
    }`
  }
}
