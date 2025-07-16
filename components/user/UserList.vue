<!--
  用戶列表組件

  負責顯示用戶列表和相關操作
-->
<script setup lang="ts">
import type { User } from '~/service/schema/user'
import UserCard from './UserCard.vue'

// 組件 Props 型別定義
interface Props {
  users: User[]
  loading?: boolean
  error?: string
}

// 組件 Events 型別定義
interface Emits {
  loadUsers: []
  clearUsers: []
  loadSingleUser: [id: number]
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
})

const emit = defineEmits<Emits>()

// 事件處理方法
function handleLoadUsers() {
  emit('loadUsers')
}

function handleClearUsers() {
  emit('clearUsers')
}

function handleLoadSingleUser(id: number) {
  emit('loadSingleUser', id)
}
</script>

<template>
  <div class="section user-list-section">
    <h2>👥 用戶列表</h2>
    <div class="button-group">
      <button
        :disabled="loading"
        class="btn btn-primary"
        @click="handleLoadUsers"
      >
        {{ loading ? '載入中...' : '載入用戶' }}
      </button>
      <button
        class="btn btn-danger"
        @click="handleClearUsers"
      >
        清空列表
      </button>
    </div>

    <div
      v-if="users.length > 0"
      class="user-list"
    >
      <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        @load-single-user="handleLoadSingleUser"
      />
    </div>

    <div
      v-else-if="!loading"
      class="empty-state"
    >
      <p>📝 暫無用戶資料，請點擊「載入用戶」按鈕</p>
    </div>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 30px;
}

.user-list-section {
  min-height: 400px;
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

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

/* 用戶列表 */
.user-list {
  margin-top: 20px;
  display: grid;
  gap: 15px;
}

/* 空狀態 */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
}

/* 載入動畫 */
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
  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .btn {
    width: 100%;
  }
}
</style>
