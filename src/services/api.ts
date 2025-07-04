import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
export const API_PREFIX = import.meta.env.VITE_API_PREFIX as string

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  config => {
    const tempToken = localStorage.getItem('token')
    let token: string | null
    try {
      if (tempToken) {
        token = JSON.parse(tempToken)
      } else {
        token = null
      }
    } catch (error: unknown) {
      token = tempToken
      console.error(error)
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
