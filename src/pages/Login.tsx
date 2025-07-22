import React, { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/auth'
import type { LoginRequest } from '../types/auth'
import type { ApiErrorResponse } from '../types/common'
import { useSetAtom } from 'jotai'
import { userAtom, tokenAtom } from '@/atoms/userAtom'
import {
  ERROR_AUTH_MESSAGE_CODE,
  ERROR_NOTFOUND_MESSAGE_CODE,
  ERROR_UNAUTHORIZED_MESSAGE_CODE,
} from '../constans/error-code'
import useCustomNavigate from '@/hooks/useCustomNavigate'

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    name: '',
    password: '',
  })
  const [error, setError] = useState<string>('')
  const navigate = useCustomNavigate()
  const setUser = useSetAtom(userAtom)
  const setToken = useSetAtom(tokenAtom)

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: data => {
      if ('data' in data && data.data.accessToken) {
        setUser(data.data)
        setToken(data.data.accessToken)
        navigate('/dashboard/account')
      } else {
        setUser(null)
        setToken(null)
        setError('登录失败，请重试')
      }
    },
    onError: (error: unknown) => {
      setUser(null)
      setToken(null)
      let msg = '网络错误，请稍后重试'
      const err = error as { response?: { data?: ApiErrorResponse } }
      if (err?.response?.data?.msg) {
        switch (err.response.data.msg) {
          case ERROR_NOTFOUND_MESSAGE_CODE.NOT_FOUND:
            msg = '账户不存在'
            break
          case ERROR_UNAUTHORIZED_MESSAGE_CODE.UNAUTHORIZED:
            msg = '密码错误'
            break
          case ERROR_AUTH_MESSAGE_CODE.STATUS_ERROR:
          case ERROR_AUTH_MESSAGE_CODE.LOCKED:
            msg = '账户异常'
            break
          default:
            msg = '登录失败'
        }
      }
      setError(msg)
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    loginMutation.mutate(formData)
  }

  return (
    <Container
      component="main"
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f6fa',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          在线商店管理系统
        </Typography>
        <Typography component="h2" variant="h6" color="textSecondary" gutterBottom>
          管理员登录
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="用户名"
            name="name"
            autoComplete="username"
            autoFocus
            value={formData.name}
            onChange={handleInputChange}
            disabled={loginMutation.isPending}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loginMutation.isPending}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? <CircularProgress size={24} color="inherit" /> : '登录'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage
