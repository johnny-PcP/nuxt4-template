<!--
  驗證示例組件

  負責顯示 Zod 驗證示例
-->
<script setup lang="ts">
import { ref } from 'vue'
import { testUserValidation, validationExamples } from '~/utils/demo/validation'

// 組件 Props 型別定義
interface Props {
  projectConfig: any
}

const props = defineProps<Props>()

// 本地狀態
const testData = ref('')
const validationResult = ref('')

// 驗證方法
function validateData() {
  if (!testData.value) {
    validationResult.value = '請輸入測試資料'
    return
  }

  validationResult.value = testUserValidation(testData.value, props.projectConfig.showConsole)
}

// 快速填入測試資料
function fillTestData(type: 'valid' | 'minimal' | 'invalid' | 'partial') {
  testData.value = validationExamples[type]()
  // 自動觸發驗證
  validateData()
}

// 清空資料
function clearData() {
  testData.value = ''
  validationResult.value = ''
}
</script>

<template>
  <div class="section validation-section">
    <h2>🔍 Zod 驗證示例</h2>
    <div class="validation-demo">
      <div class="input-group">
        <label>測試資料 (JSON格式):</label>

        <!-- 快速測試按鈕 -->
        <div class="quick-test-buttons">
          <button
            class="btn btn-success"
            @click="fillTestData('valid')"
          >
            ✅ 有效資料
          </button>
          <button
            class="btn btn-info"
            @click="fillTestData('minimal')"
          >
            📝 最少資料
          </button>
          <button
            class="btn btn-warning"
            @click="fillTestData('invalid')"
          >
            ❌ 無效資料
          </button>
          <button
            class="btn btn-secondary"
            @click="fillTestData('partial')"
          >
            🔹 部分資料
          </button>
          <button
            class="btn btn-outline"
            @click="clearData"
          >
            🗑️ 清空
          </button>
        </div>

        <textarea
          v-model="testData"
          placeholder="{&quot;name&quot;: &quot;測試&quot;, &quot;email&quot;: &quot;test@example.com&quot;}"
          class="test-input"
        />

        <div class="action-buttons">
          <button
            class="btn btn-primary"
            @click="validateData"
          >
            🔍 驗證資料
          </button>
        </div>
      </div>

      <div
        v-if="validationResult"
        class="validation-result"
      >
        <pre>{{ validationResult }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 30px;
}

.validation-demo {
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #374151;
}

/* 快速測試按鈕區域 */
.quick-test-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.quick-test-buttons .btn {
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 6px;
}

.test-input {
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 15px;
}

.test-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.validation-result {
  margin-top: 20px;
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.validation-result pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
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

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
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

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
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
  .quick-test-buttons {
    flex-direction: column;
  }

  .quick-test-buttons .btn {
    width: 100%;
    justify-content: center;
  }
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
