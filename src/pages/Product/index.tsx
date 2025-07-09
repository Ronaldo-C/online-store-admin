import { Box, Button, Chip, Avatar } from '@mui/material'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import SearchForm from '@/components/SearchForm'
import CommonTable, { ColumnType } from '@/components/CommonTable'
import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { productService } from '@/services/product'
import type { ProductData } from '@/types/product'
import { formatToLocalTime } from '@/utils/format'
import { useNavigate } from 'react-router-dom'
import CategoryMultiSelectForSearch from './components/CategoryMultiSelectForSearch'

// 搜索表单字段类型
export interface ProductSearchForm {
  search: string
  categoryIds: string[]
}

export default function ProductList() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 删除商品
  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error('删除失败')
    },
  })

  const handleDelete = (id: string | number | bigint) => {
    deleteProduct(String(id))
  }

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

  const handleCreate = () => {
    navigate('/dashboard/products/create')
  }

  const handleEdit = (id: string | number | bigint) => {
    navigate(`/dashboard/products/edit/${String(id)}`)
  }

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
    {
      title: '操作',
      dataIndex: 'actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            aria-label="删除商品"
            tabIndex={0}
            onClick={() => handleDelete(record.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') handleDelete(record.id)
            }}
            disabled={isDeleting}
          >
            删除
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            aria-label="编辑商品"
            tabIndex={0}
            onClick={() => handleEdit(record.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') handleEdit(record.id)
            }}
          >
            编辑
          </Button>
        </Box>
      ),
    },
  ]

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
          fields={<CategoryMultiSelectForSearch />}
          loading={isProductLoading}
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
