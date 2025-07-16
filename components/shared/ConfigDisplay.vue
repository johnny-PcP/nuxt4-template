<!--
  配置顯示組件

  負責顯示系統配置資訊
-->
<script setup lang="ts">
// 組件 Props 型別定義
interface Props {
  runtimeConfig: any
  projectConfig: any
}

defineProps<Props>()
</script>

<template>
  <div class="section config-section">
    <h2>⚙️ 系統配置</h2>
    <div class="config-grid">
      <div class="config-card">
        <h3>Runtime Config</h3>
        <pre>{{ JSON.stringify(runtimeConfig, null, 2) }}</pre>
      </div>
      <div class="config-card">
        <h3>Project Config</h3>
        <pre>{{ JSON.stringify(projectConfig, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 30px;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.config-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  animation: fadeIn 0.3s ease-out;
}

.config-card h3 {
  margin: 0 0 15px 0;
  color: #475569;
  font-size: 1.1rem;
}

.config-card pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
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

/* 響應式設計 */
@media (max-width: 768px) {
  .config-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>
