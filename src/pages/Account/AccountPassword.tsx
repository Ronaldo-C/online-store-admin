import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { authService } from '@/services/auth'
import { useNavigate } from 'react-router-dom'
import { Box, TextField } from '@mui/material'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/atoms/userAtom'
import { ApiErrorResponse } from '@/types/common'
import { ERROR_UNAUTHORIZED_MESSAGE_CODE } from '@/constans/error-code'
import PageContainer from '@/components/PageContainer'

interface FormData {
  password: string
  updatedPassword: string
  confirmPassword: string
}

const AccountPassword = () => {
  const navigate = useNavigate()
  const user = useAtomValue(userAtom)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: { password: '', updatedPassword: '', confirmPassword: '' },
    mode: 'onChange',
  })

  const mutation = useMutation({
    mutationFn: (form: FormData) =>
      authService.updateUserPassword({
        userId: user?.id || '',
        password: form.password,
        updatedPassword: form.updatedPassword,
      }),
    onSuccess: () => {
      toast.success('修改成功')
      navigate('/dashboard/account')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: ApiErrorResponse } }
      if (err.response?.data?.msg === ERROR_UNAUTHORIZED_MESSAGE_CODE.UNAUTHORIZED) {
        toast.error('旧密码错误')
        return
      }
      toast.error('修改失败')
    },
  })

  const onSubmit = (form: FormData) => mutation.mutate(form)
  const updatedPassword = watch('updatedPassword')

  return (
    <Box>
      <Header title="修改密码" isBack />
      <PageContainer sx={{ bgcolor: '#fff' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} maxWidth={400}>
          <Controller
            name="password"
            control={control}
            rules={{
              required: '旧密码不能为空',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="旧密码"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                margin="normal"
                aria-label="旧密码"
                required
              />
            )}
          />
          <Controller
            name="updatedPassword"
            control={control}
            rules={{
              required: '新密码不能为空',
              minLength: { value: 8, message: '新密码最少8位' },
              maxLength: { value: 20, message: '新密码最多20位' },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="新密码"
                type="password"
                error={!!errors.updatedPassword}
                helperText={errors.updatedPassword?.message}
                fullWidth
                margin="normal"
                aria-label="新密码"
                required
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: '请确认新密码',
              validate: value => value === updatedPassword || '两次输入的新密码不一致',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="确认新密码"
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
                margin="normal"
                aria-label="确认新密码"
                required
              />
            )}
          />
        </Box>
        <Footer onSave={handleSubmit(onSubmit)} saveLoading={mutation.isPending} />
      </PageContainer>
    </Box>
  )
}

export default AccountPassword
