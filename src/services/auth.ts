import api, { API_PREFIX } from './api'
import type {
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  UpdateUserSelfRequest,
  UserResponse,
} from '../types/auth'

export const authService = {
  // 用户登录
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post(`${API_PREFIX}/auth/login`, data)
    return response.data
  },
  // 获取当前用户信息
  getUserInfo: async (): Promise<UserResponse> => {
    const response = await api.get(`${API_PREFIX}/users/info`)
    return response.data
  },
  resetPassword: async (data: ResetPasswordRequest): Promise<UserResponse> => {
    const response = await api.post(`${API_PREFIX}/auth/update`, data)
    return response.data
  },
  updateUserSelf: async (data: UpdateUserSelfRequest): Promise<UserResponse> => {
    const response = await api.patch(`${API_PREFIX}/users/info`, data)
    return response.data
  },
}
