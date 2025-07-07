import React from 'react'
import { Box, Button, Chip, MenuItem, TextField, Avatar } from '@mui/material'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import SearchForm from '@/components/SearchForm'
import CommonTable, { ColumnType } from '@/components/CommonTable'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product'
import { productCategoryService } from '@/services/product-category'
import type { ProductData } from '@/types/product'
import { formatToLocalTime } from '@/utils/format'
import { useNavigate } from 'react-router-dom'
import { Controller, useFormContext } from 'react-hook-form'

// 搜索表单字段类型
interface ProductSearchForm {
  search: string
  categoryIds: string[]
}

// 商品分类选择字段组件
const CategoryMultiSelect: React.FC<{ options: { id: string; name: string }[] }> = ({
  options,
}) => {
  // 通过 useFormContext 获取控制器
  const { control } = useFormContext<ProductSearchForm>()

  return (
    <Controller
      name="categoryIds"
      control={control}
      defaultValue={[]}
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
        >
          {options.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}

export default function ProductList() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const navigate = useNavigate()

  // 获取商品分类，用于搜索下拉
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['product-categories', 'all'],
    queryFn: () => productCategoryService.getProductCategories({}),
  })

  // 获取商品列表
  const { data: productData, isLoading: isProductLoading } = useQuery({
    queryKey: ['products', page, size, searchValue, selectedCategoryIds.join(',')],
    queryFn: () =>
      productService.getProducts({
        page,
        size,
        search: searchValue,
        categoryIds: selectedCategoryIds.join(','),
      }),
  })

  const columns: ColumnType<ProductData>[] = [
    {
      title: '封面图',
      dataIndex: 'thumbnail',
      render: v => <Avatar src={String(v)} variant="rounded" sx={{ width: 56, height: 56 }} />,
    },
    { title: '商品名称', dataIndex: 'name' },
    { title: '商品编号', dataIndex: 'number' },
    {
      title: '上架状态',
      dataIndex: 'shelfStatus',
      render: v => (v ? '上架' : '下架'),
    },
    {
      title: '商品分类',
      dataIndex: 'categories',
      render: (_, record) =>
        record.categories && record.categories.length
          ? record.categories.map(cat => (
              <Chip key={cat.id} label={cat.name} size="small" sx={{ mr: 0.5 }} />
            ))
          : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      render: v => formatToLocalTime(String(v)),
    },
  ]

  const handleCreate = () => {
    navigate('/dashboard/products/create')
  }

  return (
    <Box>
      <Header title="商品列表">
        <Button variant="contained" color="primary" onClick={handleCreate}>
          新增商品
        </Button>
      </Header>
      <PageContainer sx={{ bgcolor: '#fff', p: 3 }}>
        <SearchForm<ProductSearchForm>
          onSearch={values => {
            setSearchValue(values.search?.trim?.() || '')
            setSelectedCategoryIds(values.categoryIds || [])
            setPage(1)
          }}
          onReset={() => {
            setSearchValue('')
            setSelectedCategoryIds([])
            setPage(1)
          }}
          defaultValues={{ search: '', categoryIds: [] }}
          searchPlaceholder="搜索商品名称/编号"
          fields={<CategoryMultiSelect options={categoryData?.data?.list || []} />}
          loading={isProductLoading || isCategoryLoading}
        />
        {productData && (
          <CommonTable<ProductData>
            columns={columns}
            dataSource={productData.data.list}
            isLoading={isProductLoading}
            page={page}
            totalPage={productData.data.totalPage}
            onPageChange={setPage}
            size={size}
            onSizeChange={newSize => {
              setSize(newSize)
              setPage(1)
            }}
            rowKey={record => String(record.id)}
          />
        )}
      </PageContainer>
    </Box>
  )
}
