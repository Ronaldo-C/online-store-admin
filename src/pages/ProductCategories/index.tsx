import { Box, Button, TableSortLabel } from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productCategoryService } from '@/services/product-category'
import type { ProductCategoryData } from '@/types/product-category'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import CommonTable, { ColumnType } from '@/components/CommonTable'
import SearchForm from '@/components/SearchForm'
import { formatToLocalTime } from '@/utils/format'

const ProductCategories = () => {
  const [searchValue, setSearchValue] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // 获取所有商品分类
  const { data, isLoading } = useQuery({
    queryKey: ['product-categories', searchValue],
    queryFn: () => productCategoryService.getProductCategories({ search: searchValue }),
  })

  // 删除分类
  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => productCategoryService.deleteProductCategory(id),
    onSuccess: () => {
      toast.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['product-categories'] })
    },
    onError: () => toast.error('删除失败'),
  })

  // 编辑跳转
  const handleEdit = (id: string) => {
    navigate(`/dashboard/product-categories/edit/${id}`)
  }

  const columns: ColumnType<ProductCategoryData>[] = [
    { title: '分类名称', dataIndex: 'name' },
    {
      title: <TableSortLabel disabled>创建时间</TableSortLabel>,
      dataIndex: 'createdAt',
      render: v => formatToLocalTime(String(v)),
    },
    {
      title: '操作',
      dataIndex: 'actions',
      align: 'center',
      render: (_, category: ProductCategoryData) => (
        <>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(category.id)}
            aria-label="删除分类"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') handleDelete(category.id)
            }}
          >
            删除
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleEdit(category.id)}
            aria-label="编辑分类"
            tabIndex={0}
            sx={{ ml: 1 }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') handleEdit(category.id)
            }}
          >
            编辑
          </Button>
        </>
      ),
    },
  ]

  return (
    <Box>
      <Header title="商品分类列表">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard/product-categories/create')}
        >
          新增分类
        </Button>
      </Header>
      <PageContainer sx={{ bgcolor: '#fff', p: 3 }}>
        <SearchForm
          onSearch={values => {
            setSearchValue(values.search?.trim?.() || '')
          }}
          onReset={() => {
            setSearchValue('')
          }}
          defaultValues={{ search: '' }}
          searchPlaceholder="搜索分类名称"
        />
        <CommonTable<ProductCategoryData>
          columns={columns}
          dataSource={data?.data?.list || []}
          isLoading={isLoading}
          pagination={false}
          rowKey={record => record.id}
        />
      </PageContainer>
    </Box>
  )
}

export default ProductCategories
