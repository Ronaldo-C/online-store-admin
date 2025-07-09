import React, { useRef, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProductForm, { ProductFormRef, ProductFormValues } from './ProductForm'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import Footer from '@/components/Footer'
import { Box } from '@mui/material'
import { productService } from '@/services/product'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assetService } from '@/services/asset'
import { CreateProductRequest } from '@/types/product'
import { ApiErrorResponse } from '@/types/common'
import { ERROR_CONFLICT_MESSAGE_CODE } from '@/constans/error-code'

const EditProduct: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const formRef = useRef<ProductFormRef>(null)
  const queryClient = useQueryClient()

  // 获取商品详情
  const { data: productDetail, isLoading } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => productService.getProduct(id!),
    enabled: !!id,
    select: res => res.data,
  })

  // 转换为表单初始值格式
  const defaultValues = useMemo(() => {
    if (!productDetail) return undefined
    return {
      ...productDetail,
      thumbnail: productDetail.thumbnail
        ? [{ id: 'thumbnail', data: productDetail.thumbnail }]
        : [],
      pictures: productDetail.pictures
        ? productDetail.pictures.map((url, idx) => ({ id: `pic-${idx}`, data: url }))
        : [],
      categoryIds: productDetail.categories?.map(c => String(c.id)) || [],
      skus:
        productDetail.skus?.map(sku => ({
          name: sku.name,
          costPrice: sku.costPrice,
          price: sku.price,
          stock: Number(sku.stock),
        })) || [],
    }
  }, [productDetail])

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const updateProductParams: CreateProductRequest = {
        ...data,
        thumbnail: data.thumbnail[0].data,
        pictures: data.pictures.map(p => p.data),
      }
      const signatureInfo = await assetService.getSignature().then(res => res.data.data)
      const file = data.thumbnail?.[0]?.file
      if (file) {
        const url = await assetService.uploadFile(file, signatureInfo)
        if (url) {
          updateProductParams.thumbnail = url
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
        updateProductParams.pictures = urls
      }
      return productService.updateProduct(id!, updateProductParams)
    },
    onSuccess: response => {
      queryClient.setQueryData(['productDetail', id], response)
      navigate('/dashboard/products')
      toast.success('编辑成功')
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
      toast.error('编辑失败')
    },
  })

  return (
    <Box>
      <Header title="编辑商品" isBack />
      <PageContainer sx={{ bgcolor: '#fff', p: 3 }}>
        <ProductForm
          ref={formRef}
          onSubmit={values => mutate(values)}
          disabled={isPending}
          loading={isLoading}
          defaultValues={defaultValues}
        />
        <Footer onSave={() => formRef.current?.submit()} saveLoading={isPending} />
      </PageContainer>
    </Box>
  )
}

export default EditProduct
