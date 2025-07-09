import { productCategoryService } from '@/services/product-category'
import { MenuItem, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFormContext } from 'react-hook-form'
import { ProductSearchForm } from '..'

const CategoryMultiSelectForSearch = () => {
  const { control } = useFormContext<ProductSearchForm>()

  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['product-categories', 'all'],
    queryFn: () => productCategoryService.getProductCategories({}),
  })

  return (
    <Controller
      name="categoryIds"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          select
          label="商品分类"
          size="small"
          variant="outlined"
          SelectProps={{ multiple: true }}
          sx={{ minWidth: 240 }}
          inputProps={{ 'aria-label': '商品分类筛选', tabIndex: 0 }}
          disabled={isCategoryLoading}
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

export default CategoryMultiSelectForSearch
