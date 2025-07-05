import {
  CreateProductCategoryRequest,
  ListProductCategoryResponse,
  ProductCategoryResponse,
} from '@/types/product-category'
import api, { API_PREFIX } from './api'

export const productCategoryService = {
  createProductCategory: async (data: CreateProductCategoryRequest) => {
    const response = await api.post<ProductCategoryResponse>(
      `${API_PREFIX}/product-categories`,
      data
    )
    return response.data
  },
  getProductCategories: async (data: { search?: string }) => {
    const response = await api.get<ListProductCategoryResponse>(
      `${API_PREFIX}/product-categories`,
      {
        params: {
          ...data,
          isAll: true,
        },
      }
    )
    return response.data
  },
  deleteProductCategory: async (id: string) => {
    const response = await api.delete<ProductCategoryResponse>(
      `${API_PREFIX}/product-categories/${id}`
    )
    return response.data
  },
  updateProductCategory: async (id: string, data: CreateProductCategoryRequest) => {
    const response = await api.patch<ProductCategoryResponse>(
      `${API_PREFIX}/product-categories/${id}`,
      data
    )
    return response.data
  },
  getProductCategory: async (id: string) => {
    const response = await api.get<ProductCategoryResponse>(
      `${API_PREFIX}/product-categories/${id}`
    )
    return response.data
  },
}
