import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ProductCategoryForm from './ProductCategoryForm'
import type { CreateProductCategoryRequest } from '@/types/product-category'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import Footer from '@/components/Footer'
import type { ProductCategoryFormRef } from './ProductCategoryForm'
import { productCategoryService } from '@/services/product-category'
import { ApiErrorResponse } from '@/types/common'
import { ERROR_CONFLICT_MESSAGE_CODE } from '@/constans/error-code'

const CreateProductCategory: React.FC = () => {
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateProductCategoryRequest) =>
      productCategoryService.createProductCategory(data),
    onSuccess: () => {
      toast.success('新增成功')
      navigate('/dashboard/product-categories')
    },
    onError: error => {
      const err = error as { response?: { data?: ApiErrorResponse } }
      if (err.response?.data?.msg === `name|${ERROR_CONFLICT_MESSAGE_CODE.DUPLICATE_SLUG}`) {
        toast.error('商品分类名称已存在')
        return
      }
      toast.error('新增失败')
    },
  })

  const formRef = useRef<ProductCategoryFormRef>(null)

  return (
    <>
      <Header title="新增商品分类" isBack />
      <PageContainer sx={{ bgcolor: '#fff', p: 3 }}>
        <ProductCategoryForm
          ref={formRef}
          onSubmit={values => mutate(values)}
          loading={isPending}
        />
        <Footer onSave={() => formRef.current?.submit()} saveLoading={isPending} />
      </PageContainer>
    </>
  )
}

export default CreateProductCategory
