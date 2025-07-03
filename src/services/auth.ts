import api from './api'
import type { LoginRequest, LoginResponse } from '../types/auth'

export const authService = {
  // 用户登录
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/v1/admin/auth/login', data)
    return response.data
  },
  // 获取当前用户信息
  getUserInfo: async () => {
    const response = await api.get('/v1/admin/users/info')
    return response.data
  },
}
