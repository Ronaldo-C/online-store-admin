import { ApiSuccessResponse } from './common'

export interface ProductCategoryData {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  operatedBy: string
}

export interface CreateProductCategoryRequest {
  name: string
}

export type ListProductCategoryResponse = ApiSuccessResponse<ProductCategoryData[]>

export type ProductCategoryResponse = ApiSuccessResponse<ProductCategoryData>
