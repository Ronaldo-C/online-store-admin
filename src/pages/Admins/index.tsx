import { Box, Button, TableSortLabel } from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user'
import type { UserData } from '@/types/user'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import TableWithPagination, { ColumnType } from '@/components/common/TableWithPagination'
import { StatusText, RoleText, UserStatus, UserRole } from '@/types/user'
import SearchForm from '@/components/common/SearchForm'
import { formatToLocalTime } from '@/utils/format'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/atoms/userAtom'

type SearchForm = {
  search: string
}

const Admins = () => {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const currentUser = useAtomValue(userAtom)

  // 获取用户列表
  const { data, isLoading } = useQuery({
    queryKey: ['users', page, size, searchValue, sortField, sortOrder],
    queryFn: () =>
      userService.getUsers({
        page,
        size,
        search: searchValue,
        sort: sortField ? `${sortField}:${sortOrder}` : undefined,
      }),
  })

  // 删除用户
  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => toast.error('删除失败'),
  })

  // 锁定/解锁
  const { mutate: handleLock } = useMutation({
    mutationFn: (user: UserData) =>
      user.status === 'locked' ? userService.unlockUser(user.id) : userService.lockUser(user.id),
    onSuccess: () => {
      toast.success('操作成功')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => toast.error('操作失败'),
  })

  // 编辑跳转
  const handleEdit = (id: string) => {
    navigate(`/dashboard/admins/edit/${id}`)
  }

  const columns: ColumnType<UserData>[] = [
    { title: '账号', dataIndex: 'name' },
    { title: '姓名', dataIndex: 'username' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '状态', dataIndex: 'status', render: v => StatusText[v as UserStatus] },
    { title: '角色', dataIndex: 'userRole', render: v => RoleText[v as UserRole] },
    {
      title: (
        <TableSortLabel
          active={sortField === 'createdAt'}
          direction={sortField === 'createdAt' ? sortOrder : 'desc'}
          onClick={() => {
            if (sortField === 'createdAt') {
              setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
            } else {
              setSortField('createdAt')
              setSortOrder('desc')
            }
            setPage(1)
          }}
        >
          创建时间
        </TableSortLabel>
      ),
      dataIndex: 'createdAt',
      render: v => formatToLocalTime(String(v)),
    },
    {
      title: '操作',
      dataIndex: 'actions',
      align: 'center',
      render: (_, user: UserData) => {
        const isSelf = user.id === currentUser?.id
        return (
          <>
            <Button
              size="small"
              variant="outlined"
              color={user.status === 'locked' ? 'success' : 'warning'}
              onClick={() => handleLock(user)}
              aria-label={user.status === 'locked' ? '解锁账户' : '锁定账户'}
              tabIndex={0}
              disabled={isSelf}
              onKeyDown={e => {
                if (!isSelf && (e.key === 'Enter' || e.key === ' ')) handleLock(user)
              }}
            >
              {user.status === 'locked' ? '解锁' : '锁定'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleDelete(user.id)}
              aria-label="删除账户"
              tabIndex={0}
              sx={{ ml: 1 }}
              disabled={isSelf}
              onKeyDown={e => {
                if (!isSelf && (e.key === 'Enter' || e.key === ' ')) handleDelete(user.id)
              }}
            >
              删除
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => handleEdit(user.id)}
              aria-label="编辑账户"
              tabIndex={0}
              sx={{ ml: 1 }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') handleEdit(user.id)
              }}
            >
              编辑
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <Box>
      <Header title="管理员列表">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard/admins/create')}
        >
          新增管理员
        </Button>
      </Header>
      <PageContainer sx={{ bgcolor: '#fff', p: 3 }}>
        <SearchForm
          onSearch={values => {
            setPage(1)
            setSearchValue(values.search?.trim?.() || '')
          }}
          onReset={() => {
            setSearchValue('')
            setPage(1)
          }}
          defaultValues={{ search: '' }}
          searchPlaceholder="搜索用户名/邮箱"
        />
        {data && (
          <TableWithPagination<UserData>
            columns={columns}
            dataSource={data.data.list}
            isLoading={isLoading}
            page={page}
            totalPage={data.data.totalPage}
            onPageChange={setPage}
            size={size}
            onSizeChange={newSize => {
              setSize(newSize)
              setPage(1)
            }}
            rowKey={record => record.id}
          />
        )}
      </PageContainer>
    </Box>
  )
}

export default Admins
