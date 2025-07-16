<!--
  用戶卡片組件

  負責顯示單一用戶的資訊
-->
<script setup lang="ts">
import type { User } from '~/service/schema/user'

// 組件 Props 型別定義
interface Props {
  user: User
}

// 組件 Events 型別定義
interface Emits {
  loadSingleUser: [id: number]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 日期格式化方法
function formatDate(dateString?: string): string {
  if (!dateString)
    return '未提供'
  return new Date(dateString).toLocaleString('zh-TW')
}

// 重新載入用戶事件
function handleReloadUser() {
  emit('loadSingleUser', props.user.id)
}
</script>

<template>
  <div class="user-card">
    <h3 class="user-name">
      {{ user.name }}
    </h3>
    <p><strong>資料ID:</strong> {{ user.id }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>年齡:</strong> {{ user.age || '未提供' }}</p>
    <p>
      <strong>狀態:</strong>
      <span
        :class="{
          'status-active': user.isActive,
          'status-inactive': !user.isActive,
        }"
        class="status-badge"
      >
        {{ user.isActive ? '✅ 活躍' : '❌ 非活躍' }}
      </span>
    </p>
    <p><strong>建立時間:</strong> {{ formatDate(user.createdAt) }}</p>
    <button
      class="btn btn-secondary"
      @click="handleReloadUser"
    >
      重新載入此用戶
    </button>
  </div>
</template>

<style scoped>
.user-card {
  border: 1px solid #e5e7eb;
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  animation: fadeIn 0.3s ease-out;
}

.user-card:hover {
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.user-name {
  margin: 0 0 15px 0;
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 600;
}

.user-card p {
  margin: 8px 0;
  color: #4b5563;
}

/* 狀態標籤 */
.status-badge {
  font-weight: 500;
}

.status-active {
  color: #10b981;
}

.status-inactive {
  color: #ef4444;
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

.btn-secondary {
  background: #8b5cf6;
  color: white;
  margin-top: 15px;
  padding: 8px 16px;
  font-size: 13px;
}

.btn-secondary:hover:not(:disabled) {
  background: #7c3aed;
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
</style>
