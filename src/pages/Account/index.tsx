import React from 'react'
import { Box, Typography, Paper, Button, Chip } from '@mui/material'
import { useAtom, useSetAtom } from 'jotai'
import { tokenAtom, userAtom } from '@/atoms/userAtom'
import Header from '@/components/Header'
import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/user'
import { UserResponse } from '@/types/user'
import { RoleText } from '@/types/user'
import PageContainer from '@/components/PageContainer'
import useCustomNavigate from '@/hooks/useCustomNavigate'

const Account: React.FC = () => {
  const [user, setUser] = useAtom(userAtom)
  const setToken = useSetAtom(tokenAtom)
  const navigate = useCustomNavigate()

  const { data: userInfo, isSuccess } = useQuery<UserResponse>({
    queryKey: ['userInfo'],
    queryFn: userService.getUserInfo,
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
    <Box>
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
      <PageContainer sx={{ bgcolor: '#fff' }}>
        <Paper elevation={0} sx={{ minWidth: 320 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h6" fontWeight={700}>
              {user?.name}
            </Typography>
            {user?.userRole && (
              <Chip label={RoleText[user.userRole]} size="small" color="default" />
            )}
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
      </PageContainer>
    </Box>
  )
}

export default Account
