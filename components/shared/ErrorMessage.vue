<!--
  錯誤訊息組件

  負責顯示錯誤訊息
-->
<script setup lang="ts">
// 組件 Props 型別定義
interface Props {
  error?: string
}

withDefaults(defineProps<Props>(), {
  error: '',
})
</script>

<template>
  <div
    v-if="error"
    class="error-message"
  >
    <h2>❌ 錯誤信息</h2>
    <p>{{ error }}</p>
  </div>
</template>

<style scoped>
.error-message {
  margin-top: 20px;
  padding: 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  animation: fadeIn 0.3s ease-out;
}

.error-message h2 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
}

.error-message p {
  margin: 0;
  font-weight: 500;
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
