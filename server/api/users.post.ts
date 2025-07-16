import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 直接回傳創建成功的假資料
  return {
    success: true,
    data: {
      id: 999, // 假的新 ID
      name: body.name || '新用戶',
      email: body.email || 'new@example.com',
      age: body.age || 25,
      isActive: body.isActive || false,
      createdAt: new Date().toISOString(),
    },
  }
})
