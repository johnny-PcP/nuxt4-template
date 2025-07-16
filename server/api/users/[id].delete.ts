import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = Number.parseInt(getRouterParam(event, 'id') || '0')

  // 直接回傳刪除成功的假資料
  return {
    success: true,
    message: `用戶 ${id} 已刪除`,
    data: {
      id,
      deletedAt: new Date().toISOString(),
    },
  }
})
