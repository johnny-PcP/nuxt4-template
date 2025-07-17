<!--
  Nuxt 3 + Zod + Service 資料流示例頁面

  這個頁面展示了組件化架構的示例
  在實際專案中，您可以參考這個頁面來創建自己的頁面結構
-->
<script setup lang="ts">
import ConfigDisplay from '~/components/shared/ConfigDisplay.vue'
import ErrorMessage from '~/components/shared/ErrorMessage.vue'
import ValidationDemo from '~/components/shared/ValidationDemo.vue'
import UserForm from '~/components/user/UserForm.vue'
import UserList from '~/components/user/UserList.vue'
import { useProjectConfig } from '~/composables/useProjectConfig'
import { useUserDataFlow } from '~/composables/useUserDataFlow'

// 取得統一配置
const projectConfig = useProjectConfig()

// 使用用戶資料流 composable
const {
  userState,
  error,
  clearUsers,
  loadUsers,
  loadSingleUser,
  createNewUser,
} = useUserDataFlow()
</script>

<template>
  <div class="container">
    <h1 class="page-title text-2xl font-bold text-center text-gray-800 mb-6">
      Nuxt + Zod + Service 資料流示例
    </h1>
    <div class="info-box mx-auto mb-6 max-w-2xl p-4 rounded-lg  shadow-sm">
      <p class="text-center mb-2 text-gray-700">
        改變
        <span class="inline-block bg-gray-100 text-blue-600 px-2 py-0.5 rounded font-mono font-semibold shadow">
          .env.development
        </span>
        內
        <span class="inline-block bg-gray-100 text-green-600 px-2 py-0.5 rounded font-mono font-semibold shadow">
          NUXT_PUBLIC_IS_USE_LOCAL_API
        </span>
        與
        <span class="inline-block bg-gray-100 text-green-600 px-2 py-0.5 rounded font-mono font-semibold shadow">
          NUXT_PUBLIC_IS_SHOW_CONSOLE
        </span>
        後，重新執行
        <span class="inline-block bg-gray-100 text-yellow-600 px-2 py-0.5 rounded font-mono font-semibold shadow">
          npm run dev
        </span>
        ，觀看不同狀態。
      </p>
    </div>

    <!-- API 配置資訊 -->
    <ConfigDisplay
      :runtime-config="projectConfig.runtimeConfig"
      :project-config="projectConfig"
    />

    <!-- 主要內容區域 -->
    <div class="main-content">
      <!-- 用戶列表區域 -->
      <UserList
        :users="userState.users"
        :loading="userState.loading"
        :error="error"
        @load-users="loadUsers"
        @clear-users="clearUsers"
        @load-single-user="loadSingleUser"
      />

      <!-- 創建用戶區域 -->
      <UserForm
        :creating="userState.creating"
        :error="error"
        @create-user="createNewUser"
      />
    </div>

    <!-- 錯誤信息 -->
    <ErrorMessage :error="error" />

    <!-- Zod 驗證示例 -->
    <ValidationDemo :project-config="projectConfig" />
  </div>
</template>

<style scoped>
/* 容器和佈局 */
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  line-height: 1.6;
}

.page-title {
  color: #1f2937;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

/* 主要內容區域 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .main-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .page-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr 350px;
    gap: 25px;
  }
}
</style>
