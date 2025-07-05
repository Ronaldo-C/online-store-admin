import React, { useEffect, useImperativeHandle } from 'react'
import { Box, TextField } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import type { CreateProductCategoryRequest } from '@/types/product-category'

export interface ProductCategoryFormRef {
  submit: () => void
}

interface ProductCategoryFormProps {
  ref?: React.Ref<ProductCategoryFormRef>
  defaultValues?: Partial<CreateProductCategoryRequest>
  onSubmit: (values: CreateProductCategoryRequest) => void
  loading?: boolean
  children?: React.ReactNode
}

const ProductCategoryForm = (props: ProductCategoryFormProps) => {
  const { ref, defaultValues, onSubmit, loading, children } = props
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductCategoryRequest>({
    defaultValues: {
      name: '',
      ...defaultValues,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
  }))

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      maxWidth={400}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: '分类名称不能为空', maxLength: { value: 20, message: '最多20个字符' } }}
        render={({ field }) => (
          <TextField
            {...field}
            label="分类名称"
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            inputProps={{ maxLength: 20, 'aria-label': '分类名称', tabIndex: 0 }}
            required
            disabled={loading}
          />
        )}
      />
      {children}
    </Box>
  )
}

export default ProductCategoryForm
