import React, { useRef } from 'react'
import toast from 'react-hot-toast'
import ProductForm, { ProductFormRef, ProductFormValues } from './ProductForm'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import Footer from '@/components/Footer'
import { Box } from '@mui/material'
import { productService } from '@/services/product'
import { useMutation } from '@tanstack/react-query'
import { assetService } from '@/services/asset'
import { CreateProductRequest } from '@/types/product'
import { ApiErrorResponse } from '@/types/common'
import { ERROR_CONFLICT_MESSAGE_CODE } from '@/constans/error-code'
import useCustomNavigate from '@/hooks/useCustomNavigate'

const CreateProduct: React.FC = () => {
  const navigate = useCustomNavigate()
  const formRef = useRef<ProductFormRef>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      console.log(data)

      const createProductParams: CreateProductRequest = {
        ...data,
        thumbnail: data.thumbnail[0].data,
        pictures: data.pictures.map(p => p.data),
      }

      const signatureInfo = await assetService.getSignature().then(res => res.data.data)
      const file = data.thumbnail?.[0]?.file
      if (file) {
        const url = await assetService.uploadFile(file, signatureInfo)
        if (url) {
          createProductParams.thumbnail = url
        }
      }
      if (data.pictures && data.pictures.length > 0) {
        const urls = await Promise.all(
          data.pictures.map(async p => {
            const file = p.file
            if (file) {
              const url = await assetService.uploadFile(file, signatureInfo)
              return url
            } else {
              return p.data
            }
          })
        )
        createProductParams.pictures = urls
      }
      return productService.createProduct(createProductParams)
    },
    onSuccess: () => {
      navigate('/dashboard/products')
      toast.success('新增成功')
    },
    onError: error => {
      const err = error as { response?: { data?: ApiErrorResponse } }
      if (err.response?.data?.msg === `number|${ERROR_CONFLICT_MESSAGE_CODE.DUPLICATE_SLUG}`) {
        toast.error('商品编号已存在')
        return
      }
      if (
        err.response?.data?.msg === `categoryIds|${ERROR_CONFLICT_MESSAGE_CODE.INVALID_RELATION}`
      ) {
        toast.error('商品分类不存在')
        return
      }
      toast.error('新增失败')
    },
  })

  return (
    <Box>
      <Header title="新增商品" isBack />
      <PageContainer sx={{ bgcolor: '#fff', p: 3 }}>
        <ProductForm ref={formRef} onSubmit={values => mutate(values)} disabled={isPending} />
        <Footer onSave={() => formRef.current?.submit()} saveLoading={isPending} />
      </PageContainer>
    </Box>
  )
}

export default CreateProduct
