import { useEffect } from 'react'
import { Box, TextField } from '@mui/material'
import Header from '@/components/Header'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import type { ControllerRenderProps } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'
import { EMAIL_REGEX } from '@/constans/regex'
import { userService } from '@/services/user'
import PageContainer from '@/components/PageContainer'

interface FormData {
  username: string
  email: string
}

const AccountEdit = () => {
  const navigate = useNavigate()
  const { data } = useQuery({ queryKey: ['userInfo'], queryFn: userService.getUserInfo })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: { username: '', email: '' },
    mode: 'onChange',
  })

  useEffect(() => {
    if (data && data.data) {
      reset({ username: data.data.username || '', email: data.data.email || undefined })
    }
  }, [data, reset])

  const mutation = useMutation({
    mutationFn: userService.updateUserSelf,
    onSuccess: () => {
      toast.success('修改成功')
      navigate('/dashboard/account')
    },
    onError: () => {
      toast.error('保存失败')
    },
  })

  const onSubmit = (form: FormData) => {
    mutation.mutate(form)
  }

  return (
    <Box>
      <Header title="编辑个人信息" isBack />
      <PageContainer sx={{ bgcolor: '#fff' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} maxWidth={400}>
          <Controller
            name="username"
            control={control}
            rules={{
              required: '姓名不能为空',
              minLength: { value: 4, message: '姓名最少4个字符' },
              maxLength: { value: 20, message: '姓名最多20个字符' },
            }}
            render={({ field }: { field: ControllerRenderProps<FormData, 'username'> }) => (
              <TextField
                {...field}
                label="姓名"
                error={!!errors.username}
                helperText={errors.username?.message}
                fullWidth
                margin="normal"
                aria-label="用户名"
                required
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              pattern: {
                value: EMAIL_REGEX,
                message: '邮箱格式不正确',
              },
            }}
            render={({ field }: { field: ControllerRenderProps<FormData, 'email'> }) => (
              <TextField
                {...field}
                label="邮箱"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                margin="normal"
                aria-label="邮箱"
              />
            )}
          />
        </Box>
      </PageContainer>
      <Footer
        onSave={handleSubmit(onSubmit)}
        saveLoading={mutation.isPending}
        saveDisabled={mutation.isPending}
      />
    </Box>
  )
}

export default AccountEdit
