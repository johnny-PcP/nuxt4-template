/**
 * 用戶資料流相關的 Composable
 *
 * 這個 composable 專注於用戶資料的管理，遵循單一職責原則
 */

import type { CreateUserInput, User } from '~/service/schema/user'
import { onMounted, ref } from 'vue'
import { useProjectConfig } from '~/composables/useProjectConfig'
import { userApi } from '~/service/api/user'

// 用戶狀態管理
interface UserState {
  users: User[]
  loading: boolean
  creating: boolean
}

export function useUserDataFlow() {
  // 取得專案配置
  const projectConfig = useProjectConfig()

  // 錯誤狀態管理
  const error = ref<string>('')

  // 響應式資料
  const userState = ref<UserState>({
    users: [],
    loading: false,
    creating: false,
  })

  // 清空用戶列表
  function clearUsers() {
    userState.value.users = []
  }

  // 載入用戶列表
  async function loadUsers() {
    userState.value.loading = true
    error.value = '' // 清空之前的錯誤

    try {
      userState.value.users = await userApi.getUsers()

      // 僅在需要時顯示 debug 資訊
      if (projectConfig.value.showConsole) {
        console.log('載入的用戶:', userState.value.users)
      }
    }
    catch (err) {
      error.value = `載入用戶失敗: ${err instanceof Error ? err.message : '未知錯誤'}`
    }
    finally {
      userState.value.loading = false
    }
  }

  // 載入單一用戶
  async function loadSingleUser(id: number): Promise<void> {
    try {
      const user = await userApi.getUserById(id)
      if (user) {
        // 更新列表中的用戶
        const index = userState.value.users.findIndex(u => u.id === id)
        if (index !== -1) {
          userState.value.users[index] = user
        }
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '載入用戶失敗'
    }
  }

  // 創建新用戶
  async function createNewUser(userData: CreateUserInput) {
    userState.value.creating = true
    error.value = '' // 清空之前的錯誤

    try {
      const createdUser = await userApi.createUser(userData)

      // 添加到列表
      userState.value.users.push(createdUser)

      // 僅在需要時顯示 debug 資訊
      if (projectConfig.value.showConsole) {
        console.log('創建的用戶:', createdUser)
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '創建用戶失敗'
    }
    finally {
      userState.value.creating = false
    }
  }

  // 在組件掛載時載入用戶
  onMounted(() => {
    loadUsers()
  })

  return {
    // 狀態
    userState: userState.value,
    error,

    // 方法
    loadUsers,
    loadSingleUser,
    createNewUser,
    clearUsers,
  }
}
