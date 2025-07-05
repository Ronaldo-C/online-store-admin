import React from 'react'
import { Box, Typography, Paper, Button, Chip } from '@mui/material'
import { useAtom, useSetAtom } from 'jotai'
import { tokenAtom, userAtom } from '@/atoms/userAtom'
import Header from '@/components/Header'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { UserResponse } from '@/types/auth'
import { useNavigate } from 'react-router-dom'
import { UserRoleOptions } from '@/types/user'

const Account: React.FC = () => {
  const [user, setUser] = useAtom(userAtom)
  const setToken = useSetAtom(tokenAtom)
  const navigate = useNavigate()

  const { data: userInfo, isSuccess } = useQuery<UserResponse>({
    queryKey: ['userInfo'],
    queryFn: authService.getUserInfo,
  })

  if (isSuccess && userInfo?.data) {
    setUser(userInfo.data)
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    navigate('/auth/login')
  }

  const handleEdit = () => navigate('/dashboard/account/edit')
  const handleChangePassword = () => navigate('/dashboard/account/password')

  return (
    <Box sx={{ background: '#f3f4f6', minHeight: '100vh' }}>
      <Header title="我的账号">
        <Box>
          <Button onClick={handleChangePassword} variant="outlined" sx={{ mr: 2 }}>
            修改密码
          </Button>
          <Button onClick={handleEdit} variant="contained">
            编辑
          </Button>
        </Box>
      </Header>
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 2, px: 2 }}>
        <Paper elevation={1} sx={{ p: 4, minWidth: 320 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h6" fontWeight={700}>
              {user?.name}
            </Typography>
            <Chip
              label={UserRoleOptions.find(option => option.value === user?.userRole)?.label}
              size="small"
              color="default"
            />
          </Box>
          {user?.username && (
            <Typography variant="body1" mb={2}>
              <strong>姓名：</strong>
              {user.username}
            </Typography>
          )}
          {user?.email && (
            <Typography variant="body1" mb={2}>
              <strong>邮箱：</strong>
              {user.email}
            </Typography>
          )}
          <Box mt={2}>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 2 }}
              aria-label="登出"
              tabIndex={0}
              onClick={handleLogout}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleLogout()
                }
              }}
            >
              登出
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default Account
