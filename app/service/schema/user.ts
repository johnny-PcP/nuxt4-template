import { z } from 'zod'
import { createApiResponseSchema } from './common'

// 用戶資料結構 Schema
export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, '姓名不能為空'),
  email: z.string().email('電子郵件格式錯誤'),
  age: z.number().min(1, '年齡應大於1').optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime().optional(),
})

// 用戶列表結構 Schema
export const UserListSchema = z.array(UserSchema)

// API 回應包裝 Schema
export const UserResponseSchema = createApiResponseSchema(UserSchema)
export const UserListResponseSchema = createApiResponseSchema(UserListSchema)

// TypeScript 型別推導
export type User = z.infer<typeof UserSchema>
export type UserList = z.infer<typeof UserListSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type UserListResponse = z.infer<typeof UserListResponseSchema>

// 建立用戶表單 Schema
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
}).extend({
  isActive: z.boolean().default(true), // 預設啟用狀態
})
export type CreateUserInput = z.infer<typeof CreateUserSchema>
