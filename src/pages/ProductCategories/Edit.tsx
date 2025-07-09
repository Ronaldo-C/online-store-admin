import React, { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ProductCategoryForm from './ProductCategoryForm'
import type { CreateProductCategoryRequest } from '@/types/product-category'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import Footer from '@/components/Footer'
import type { ProductCategoryFormRef } from './ProductCategoryForm'
import { productCategoryService } from '@/services/product-category'

const EditProductCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['product-category', id],
    queryFn: () => productCategoryService.getProductCategory(id!),
    enabled: !!id,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (form: CreateProductCategoryRequest) =>
      productCategoryService.updateProductCategory(id!, form),
    onSuccess: () => {
      toast.success('修改成功')
      navigate('/dashboard/product-categories')
    },
    onError: () => toast.error('修改失败'),
  })

  const defaultValues = data?.data
    ? {
        name: data.data.name,
      }
    : undefined

  const formRef = useRef<ProductCategoryFormRef>(null)

  return (
    <>
      <Header title="编辑商品分类" isBack />
      <PageContainer sx={{ bgcolor: '#fff', p: 3 }}>
        <ProductCategoryForm
          ref={formRef}
          defaultValues={defaultValues}
          onSubmit={values => mutate(values)}
          loading={isPending || isLoading}
        />
        <Footer onSave={() => formRef.current?.submit()} saveLoading={isPending || isLoading} />
      </PageContainer>
    </>
  )
}

export default EditProductCategory
