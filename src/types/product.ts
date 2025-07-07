import { ApiSuccessResponse, ApiSuccessResponsePagination, ListRequest } from './common'
import { ProductCategoryData } from './product-category'
import { OutputData } from '@editorjs/editorjs'

export interface ProductData {
  id: bigint
  name: string
  number: string
  shelfStatus: boolean
  thumbnail: string
  pictures: string[]
  description: OutputData
  skus: ProductSku[]
  categories: ProductCategoryData[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  operatedBy: string
}

export interface ProductSku {
  id: bigint
  name: string
  number: string
  costPrice: number
  price: number
  stock: bigint
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  operatedBy: string
}

// list
export interface ListProductRequest extends ListRequest {
  categoryIds?: string
}

export type ListProductResponse = ApiSuccessResponsePagination<ProductData>

// detail
export type ProductDetailResponse = ApiSuccessResponse<ProductData>

// create
export interface CreateProductRequest {
  name: string
  number: string
  shelfStatus: boolean
  thumbnail: string
  pictures: string[]
  description: OutputData
  skus: ProductSku[]
  categories: string[]
}
