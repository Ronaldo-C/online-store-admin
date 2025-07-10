import api, { API_PREFIX } from './api'
import { UpdateSeoMetasRequest, SeoMetasResponse } from '@/types/seo-metas'

export const seoMetasService = {
  updateSeoMetas: async (data: UpdateSeoMetasRequest) => {
    const response = await api.put<SeoMetasResponse>(`${API_PREFIX}/seo-metas`, data)
    return response.data
  },
  getSeoMetas: async () => {
    const response = await api.get<SeoMetasResponse>(`${API_PREFIX}/seo-metas`)
    return response.data
  },
}
