import { ApiSuccessResponse } from './common'

export interface SeoMetasData {
  title: string
  description: string
  images: {
    url: string
    href?: string
  }[]
}

export type SeoMetasResponse = ApiSuccessResponse<SeoMetasData>

// update seo metas
export interface UpdateSeoMetasRequest {
  title: string
  description: string
  images: {
    url: string
    href?: string
  }[]
}
