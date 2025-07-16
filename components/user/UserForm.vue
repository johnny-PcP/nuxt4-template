<!--
  用戶表單組件

  負責創建新用戶的表單
-->
<script setup lang="ts">
import type { CreateUserInput } from '~/service/schema/user'
import { ref } from 'vue'

// 組件 Props 型別定義
interface Props {
  creating?: boolean
  error?: string
}

// 組件 Events 型別定義
interface Emits {
  createUser: [userData: CreateUserInput]
}

withDefaults(defineProps<Props>(), {
  creating: false,
  error: '',
})

const emit = defineEmits<Emits>()

// 表單資料
const newUser = ref<CreateUserInput>({
  name: '',
  email: '',
  age: undefined,
  isActive: true,
})

// 創建用戶方法
async function handleCreateUser() {
  emit('createUser', { ...newUser.value })

  // 重置表單
  newUser.value = {
    name: '',
    email: '',
    age: undefined,
    isActive: true,
  }
}

// 快速填入測試資料
function fillTestData(type: 'valid' | 'minimal' | 'random') {
  const testData = {
    valid: {
      name: '測試用戶',
      email: 'test@example.com',
      age: 25,
      isActive: true,
    },
    minimal: {
      name: '最少用戶',
      email: 'minimal@example.com',
      age: undefined,
      isActive: false,
    },
    random: {
      name: `隨機用戶${Math.floor(Math.random() * 1000)}`,
      email: `random${Math.floor(Math.random() * 1000)}@example.com`,
      age: Math.floor(Math.random() * 50) + 18,
      isActive: Math.random() > 0.5,
    },
  }

  newUser.value = { ...testData[type] }
}

// 清空表單
function clearForm() {
  newUser.value = {
    name: '',
    email: '',
    age: undefined,
    isActive: true,
  }
}
</script>

<template>
  <div class="section create-user-section">
    <h2>➕ 創建新用戶</h2>

    <!-- 快速填入按鈕 -->
    <div class="quick-fill-buttons">
      <button
        type="button"
        class="btn btn-success btn-sm"
        @click="fillTestData('valid')"
      >
        ✅ 標準資料
      </button>
      <button
        type="button"
        class="btn btn-info btn-sm"
        @click="fillTestData('minimal')"
      >
        📝 最少資料
      </button>
      <button
        type="button"
        class="btn btn-warning btn-sm"
        @click="fillTestData('random')"
      >
        🎲 隨機資料
      </button>
      <button
        type="button"
        class="btn btn-outline btn-sm"
        @click="clearForm"
      >
        🗑️ 清空
      </button>
    </div>

    <form
      class="user-form"
      @submit.prevent="handleCreateUser"
    >
      <div class="form-group">
        <label class="form-label">姓名:</label>
        <input
          v-model="newUser.name"
          type="text"
          required
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label class="form-label">Email:</label>
        <input
          v-model="newUser.email"
          type="email"
          required
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label class="form-label">年齡:</label>
        <input
          v-model.number="newUser.age"
          type="number"
          min="0"
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-model="newUser.isActive"
            type="checkbox"
            class="checkbox-input"
          >
          活躍狀態
        </label>
      </div>

      <button
        type="submit"
        :disabled="creating"
        class="btn btn-success btn-full"
      >
        {{ creating ? '創建中...' : '創建用戶' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 30px;
}

.create-user-section {
  position: sticky;
  top: 20px;
}

/* 表單樣式 */
.user-form {
  padding: 25px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  animation: fadeIn 0.3s ease-out;
}

.user-form:hover {
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 快速填入按鈕 */
.quick-fill-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-info {
  background: #06b6d4;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: #0891b2;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #d97706;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .quick-fill-buttons {
    flex-direction: column;
  }

  .quick-fill-buttons .btn {
    width: 100%;
    justify-content: center;
  }
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #ffffff;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: #ffffff;
}

.form-input:hover {
  border-color: #9ca3af;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-input {
  margin-right: 8px;
  cursor: pointer;
}

/* 按鈕樣式 */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  position: relative;
  overflow: hidden;
}

.btn:disabled::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: loading 1.5s infinite;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-full {
  width: 100%;
  font-weight: bold;
}

/* 動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .create-user-section {
    position: static;
    order: -1;
  }
}
</style>
