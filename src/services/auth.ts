import api, { API_PREFIX } from './api'
import type { LoginRequest, LoginResponse, ResetPasswordRequest } from '../types/auth'
import type { UserResponse } from '@/types/user'
import type { UpdateUserSelfRequest } from '@/types/user'

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post(`${API_PREFIX}/auth/login`, data)
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
