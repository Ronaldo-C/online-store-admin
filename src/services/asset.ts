import { GetSignatureForOSSResponse, SignatureForOSS } from '@/types/asset'
import api, { VITE_API_VERSION } from './api'
import axios from 'axios'

export const assetService = {
  getSignature: () =>
    api.get<GetSignatureForOSSResponse>(`${VITE_API_VERSION}/assets/get-signature`),
  uploadFile: async (file: File, signatureInfo: SignatureForOSS) => {
    const formData = new FormData()
    formData.append('name', file.name)
    formData.append('policy', signatureInfo.policy)
    formData.append('OSSAccessKeyId', signatureInfo.ossAccessKeyId)
    formData.append('success_action_status', '200')
    formData.append('signature', signatureInfo.signature)
    formData.append('key', file.name)
    formData.append('file', file)
    const res = await axios.post(signatureInfo.host, formData)
    let url = ''
    if (res.status === 200) {
      url = `${signatureInfo.host}/${file.name}`
    }
    return url
  },
}
