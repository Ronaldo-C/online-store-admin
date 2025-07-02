import api from './api';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const authService = {
  // 用户登录
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/v1/admin/auth/login', data);
    return response.data;
  },
}; 