import { defineEventHandler, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = Number.parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody(event)

  // 直接回傳更新成功的假資料
  return {
    success: true,
    data: {
      id,
      name: body.name || '更新後的用戶',
      email: body.email || 'updated@example.com',
      age: body.age || 30,
      isActive: body.isActive ?? true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: new Date().toISOString(),
    },
  }
})
