// 通用接口成功响应类型
export interface ApiSuccessResponse<T = unknown> {
  id: number
  code: number
  data: T
}

// 通用接口失败响应类型
export interface ApiErrorResponse {
  code: number
  msg: string
  id: number
  timestamp: string
}
