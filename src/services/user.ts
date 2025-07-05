import api, { API_PREFIX } from './api'
import type {
  CreateUserRequest,
  CreateUserResponse,
  UserListRequest,
  UserListResponse,
  UserResponse,
} from '@/types/user'
import type { UpdateUserSelfRequest } from '@/types/user'

export const userService = {
  // 获取当前用户信息
  getUserInfo: async (): Promise<UserResponse> => {
    const response = await api.get(`${API_PREFIX}/users/info`)
    return response.data
  },
  // 更新当前用户信息
  updateUserSelf: async (data: UpdateUserSelfRequest): Promise<UserResponse> => {
    const response = await api.patch(`${API_PREFIX}/users/info`, data)
    return response.data
  },
  // 用户列表
  getUsers: async (data: UserListRequest): Promise<UserListResponse> => {
    const response = await api.get(`${API_PREFIX}/users`, { params: data })
    return response.data
  },
  deleteUser: async (id: string): Promise<UserResponse> => {
    const response = await api.delete(`${API_PREFIX}/users/${id}`)
    return response.data
  },
  lockUser: async (id: string): Promise<UserResponse> => {
    const response = await api.patch(`${API_PREFIX}/users/${id}/lock`)
    return response.data
  },
  unlockUser: async (id: string): Promise<UserResponse> => {
    const response = await api.patch(`${API_PREFIX}/users/${id}/unlock`)
    return response.data
  },
  // 新增用户
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await api.post(`${API_PREFIX}/users`, data)
    return response.data
  },
  getUser: async (id: string): Promise<UserResponse> => {
    const response = await api.get(`${API_PREFIX}/users/${id}`)
    return response.data
  },
  updateUser: async (id: string, data: CreateUserRequest): Promise<UserResponse> => {
    const response = await api.patch(`${API_PREFIX}/users/${id}`, data)
    return response.data
  },
}
