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

const CreateProductCategory: React.FC = () => {
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateProductCategoryRequest) =>
      productCategoryService.createProductCategory(data),
    onSuccess: () => {
      toast.success('新增成功')
      navigate('/dashboard/product-categories')
    },
    onError: () => toast.error('新增失败'),
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
        <Footer
          onSave={() => formRef.current?.submit()}
          saveLoading={isPending}
          saveDisabled={isPending}
        />
      </PageContainer>
    </>
  )
}

export default CreateProductCategory
