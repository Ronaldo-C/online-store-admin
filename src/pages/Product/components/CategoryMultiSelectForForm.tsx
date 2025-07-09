import { productCategoryService } from '@/services/product-category'
import { MenuItem, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFormContext } from 'react-hook-form'
import { ProductFormValues } from '../ProductForm'

const CategoryMultiSelectForForm = ({ disabled }: { disabled?: boolean }) => {
  const { control } = useFormContext<ProductFormValues>()

  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['product-categories', 'all'],
    queryFn: () => productCategoryService.getProductCategories({}),
  })

  return (
    <Controller
      name="categoryIds"
      control={control}
      rules={{ required: '请选择商品分类' }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          label="商品分类"
          size="small"
          variant="outlined"
          SelectProps={{ multiple: true }}
          sx={{
            minWidth: 240,
            '& .MuiFormLabel-root': { top: '8px' },
            '& .MuiInputBase-input.MuiOutlinedInput-input': {
              padding: '16.5px 14px !important',
            },
          }}
          inputProps={{ 'aria-label': '商品分类筛选', tabIndex: 0 }}
          disabled={isCategoryLoading || disabled}
          error={!!error}
          helperText={error?.message}
          required
        >
          {(categoryData?.data?.list || []).map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}

export default CategoryMultiSelectForForm
