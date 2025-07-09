import React, { useEffect, useImperativeHandle } from 'react'
import { useForm, useFieldArray, Controller, FormProvider } from 'react-hook-form'
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  IconButton,
  InputAdornment,
  Skeleton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Editor from '@/components/Editor'
import ImageUploader, { ImageObject } from '@/components/ImageUploader'
import type { OutputData } from '@editorjs/editorjs'
import CategoryMultiSelectForForm from './components/CategoryMultiSelectForForm'

export type ProductFormValues = {
  name: string
  number: string
  shelfStatus: boolean
  thumbnail: ImageObject[]
  pictures: ImageObject[]
  description?: OutputData
  categoryIds: string[]
  skus: {
    name: string
    costPrice: number
    price: number
    stock: number
  }[]
}

const defaultSku = { name: '', costPrice: 0, price: 0, stock: 0 }

export type ProductFormRef = {
  submit: () => void
}

interface ProductFormProps {
  ref: React.Ref<ProductFormRef>
  defaultValues?: Partial<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void
  loading?: boolean
  disabled?: boolean
}

const ProductForm = ({ defaultValues, onSubmit, loading, ref, disabled }: ProductFormProps) => {
  const methods = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      number: '',
      shelfStatus: true,
      thumbnail: undefined as any,
      pictures: [],
      description: undefined,
      categoryIds: [],
      skus: [defaultSku],
      ...defaultValues,
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skus',
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
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box maxWidth={400} display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6">商品信息</Typography>
          <Controller
            name="name"
            control={control}
            rules={{ required: '商品名称为必填' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="商品名称"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={disabled}
              />
            )}
          />
          <Controller
            name="number"
            control={control}
            rules={{ required: '商品编号为必填' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="商品编号"
                fullWidth
                required
                error={!!errors.number}
                helperText={errors.number?.message}
                disabled={disabled}
              />
            )}
          />
          <CategoryMultiSelectForForm disabled={disabled} />
          <Controller
            name="shelfStatus"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch {...field} checked={field.value} color="primary" disabled={disabled} />
                }
                label="上架状态"
                disabled={disabled}
              />
            )}
          />
          <Controller
            name="thumbnail"
            control={control}
            rules={{
              required: '主图为必填',
              validate: v => (v.length > 0 ? true : '主图为必填'),
            }}
            render={({ field }) => (
              <Box mb={2}>
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  label="主图"
                  multiple={false}
                  disabled={disabled}
                />
                <Typography variant="caption" color="error">
                  {errors.thumbnail?.message}
                </Typography>
              </Box>
            )}
          />
          <Controller
            name="pictures"
            control={control}
            render={({ field }) => (
              <Box mb={2}>
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  label="辅图（可多选）"
                  multiple
                  disabled={disabled}
                />
              </Box>
            )}
          />
        </Box>
        <Box maxWidth={800} display="flex" flexDirection="column" gap={2}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => {
              return (
                <Box my={2}>
                  {loading ? (
                    <Skeleton variant="rectangular" height={100} />
                  ) : (
                    <Editor
                      defaultValue={defaultValues?.description}
                      onChange={field.onChange}
                      label="商品描述"
                      disabled={disabled}
                    />
                  )}
                </Box>
              )
            }}
          />
          <Typography variant="h6" mt={3} mb={1}>
            SKU 列表
          </Typography>
          {fields.map((item, idx) => (
            <Box key={item.id} display="flex" gap={2} alignItems="center" mb={2}>
              <Controller
                name={`skus.${idx}.name` as const}
                control={control}
                rules={{ required: 'SKU名称必填' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="SKU名称"
                    required
                    error={!!errors.skus?.[idx]?.name}
                    helperText={errors.skus?.[idx]?.name?.message}
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                name={`skus.${idx}.costPrice` as const}
                control={control}
                rules={{ required: '成本价必填' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="成本价"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      inputProps: { step: 0.01, min: 0 },
                    }}
                    error={!!errors.skus?.[idx]?.costPrice}
                    helperText={errors.skus?.[idx]?.costPrice?.message}
                    onChange={e => {
                      const value = e.target.value
                      field.onChange(value === '' ? 0 : parseFloat(Number(value).toFixed(2)))
                    }}
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                name={`skus.${idx}.price` as const}
                control={control}
                rules={{ required: '售价必填', validate: v => (v >= 0 ? true : '售价不能为负数') }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="售价"
                    type="number"
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      inputProps: { step: 0.01, min: 0 },
                    }}
                    error={!!errors.skus?.[idx]?.price}
                    helperText={errors.skus?.[idx]?.price?.message}
                    onChange={e => {
                      const value = e.target.value
                      field.onChange(value === '' ? 0 : parseFloat(Number(value).toFixed(2)))
                    }}
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                name={`skus.${idx}.stock` as const}
                control={control}
                rules={{
                  required: '库存必填',
                  min: { value: 0, message: '库存不能小于0' },
                  validate: v => Number.isInteger(Number(v)) || '库存必须为整数',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="库存"
                    type="number"
                    required
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                    error={!!errors.skus?.[idx]?.stock}
                    helperText={errors.skus?.[idx]?.stock?.message}
                    onChange={e => {
                      const value = e.target.value
                      field.onChange(value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0))
                    }}
                    disabled={disabled}
                  />
                )}
              />
              <IconButton
                aria-label="删除SKU"
                onClick={() => remove(idx)}
                disabled={fields.length === 1 || disabled}
                tabIndex={0}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => append(defaultSku)}
            sx={{ mb: 2 }}
            tabIndex={0}
            aria-label="添加SKU"
            disabled={disabled}
          >
            添加SKU
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default ProductForm
