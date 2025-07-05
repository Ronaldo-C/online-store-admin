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

// 通用接口分页响应类型
export interface ApiSuccessResponsePagination<T = unknown> {
  id: number
  code: number
  data: {
    list: T[]
    total: number
    totalPage: number
    currentPage: number
    size: number
  }
}
