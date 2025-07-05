import { Box, Button, TableSortLabel } from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user'
import type { UserData } from '@/types/user'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import CommonTable, { ColumnType } from '@/components/CommonTable'
import { StatusText, RoleText, UserStatus, UserRole } from '@/types/user'
import SearchForm from '@/components/SearchForm'
import { formatToLocalTime } from '@/utils/format'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/atoms/userAtom'
import Modal from '@/components/Modal'
import BoxMUI from '@mui/material/Box'
import ButtonMUI from '@mui/material/Button'
import { CreateUserResponse } from '@/types/user'
import { authService } from '@/services/auth'

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
  const [modalOpen, setModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')

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

  // 重置密码
  const { mutate: handleResetPassword, isPending: isResetting } = useMutation({
    mutationFn: (id: string) => authService.resetPassword({ userId: id }),
    onSuccess: (res: CreateUserResponse) => {
      setNewPassword(res?.data?.password || '')
      setModalOpen(true)
    },
    onError: () => toast.error('重置失败'),
  })

  // 编辑跳转
  const handleEdit = (id: string) => {
    navigate(`/dashboard/admins/edit/${id}`)
  }

  const handleCopy = async () => {
    if (!newPassword) return
    try {
      await navigator.clipboard.writeText(newPassword)
      toast.success('密码已复制')
    } catch {
      toast.error('复制失败')
    }
  }

  const handleModalConfirm = () => {
    setModalOpen(false)
  }

  const handleModalCancel = () => {
    setModalOpen(false)
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
              color="primary"
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
              color="primary"
              onClick={() => handleResetPassword(user.id)}
              aria-label="重置密码"
              tabIndex={0}
              sx={{ ml: 1 }}
              disabled={isResetting}
              onKeyDown={e => {
                if (!isSelf && (e.key === 'Enter' || e.key === ' ')) handleResetPassword(user.id)
              }}
            >
              重置密码
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
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
          <CommonTable<UserData>
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
      <Modal
        open={modalOpen}
        title="重置密码成功"
        description={
          <BoxMUI display="flex" alignItems="center" gap={2}>
            <span>新密码：{newPassword}</span>
            <ButtonMUI
              variant="outlined"
              size="small"
              onClick={handleCopy}
              aria-label="复制密码"
              tabIndex={0}
            >
              复制
            </ButtonMUI>
          </BoxMUI>
        }
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        confirmText="确定"
        cancelText="关闭"
      />
    </Box>
  )
}

export default Admins
