import api, { API_PREFIX } from './api'
import type { LoginRequest, LoginResponse, UpdateUserPasswordRequest } from '../types/auth'
import type { CreateUserResponse, UserResponse } from '@/types/user'

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post(`${API_PREFIX}/auth/login`, data)
    return response.data
  },
  updateUserPassword: async (data: UpdateUserPasswordRequest): Promise<UserResponse> => {
    const response = await api.post(`${API_PREFIX}/auth/update`, data)
    return response.data
  },
  resetPassword: async (data: { userId: string }): Promise<CreateUserResponse> => {
    const response = await api.post(`${API_PREFIX}/auth/reset`, data)
    return response.data
  },
}
