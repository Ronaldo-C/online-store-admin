import { ApiSuccessResponse } from './common'

export interface SignatureForOSS {
  policy: string
  signature: string
  ossAccessKeyId: string
  host: string
}

export type GetSignatureForOSSResponse = ApiSuccessResponse<SignatureForOSS>
