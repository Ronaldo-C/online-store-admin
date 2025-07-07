import {
  CreateProductRequest,
  ListProductRequest,
  ListProductResponse,
  ProductDetailResponse,
} from '@/types/product'
import api, { API_PREFIX } from './api'

export const productService = {
  createProduct: async (data: CreateProductRequest) => {
    const response = await api.post<ProductDetailResponse>(`${API_PREFIX}/products`, data)
    return response.data
  },
  getProducts: async (data: ListProductRequest) => {
    const response = await api.get<ListProductResponse>(`${API_PREFIX}/products`, {
      params: data,
    })
    return response.data
  },
  getProduct: async (id: string) => {
    const response = await api.get<ProductDetailResponse>(`${API_PREFIX}/products/${id}`)
    return response.data
  },
  updateProduct: async (id: string, data: CreateProductRequest) => {
    const response = await api.patch<ProductDetailResponse>(`${API_PREFIX}/products/${id}`, data)
    return response.data
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete<ProductDetailResponse>(`${API_PREFIX}/products/${id}`)
    return response.data
  },
}
