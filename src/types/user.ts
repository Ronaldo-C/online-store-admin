import type { ApiSuccessResponse, ApiSuccessResponsePagination } from './common'

export interface UserData {
  id: string
  name: string
  username: string
  password: string
  email: string | null
  status: UserStatus
  userRole: UserRole
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  operatedBy: string
}

export enum UserRole {
  superAdmin = 'superAdmin',
  admin = 'admin',
}

export enum UserStatus {
  active = 'active',
  unusual = 'unusual',
  locked = 'locked',
  deleted = 'deleted',
}

export const StatusText: Record<UserStatus, string> = {
  active: '正常',
  unusual: '异常',
  locked: '已锁定',
  deleted: '已删除',
}

export const RoleText: Record<UserRole, string> = {
  superAdmin: '超级管理员',
  admin: '管理员',
}

export interface UpdateUserSelfRequest {
  username: string
  email: string
}

export type UserResponse = ApiSuccessResponse<UserData>

export type UserListResponse = ApiSuccessResponsePagination<UserData>

// create user
export interface CreateUserRequest {
  name: string
  username: string
  email: string | null
  userRole: UserRole
}

export type CreateUserResponse = ApiSuccessResponse<UserData & { password: string }>
