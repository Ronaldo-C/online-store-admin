import React, { useEffect, useImperativeHandle } from 'react'
import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { RoleText, UserRole } from '@/types/user'
import { EMAIL_REGEX, USER_NAME_REGEX } from '@/constans/regex'

export interface AdminFormValues {
  name: string
  username: string
  email: string | null
  userRole: UserRole
}

export interface AdminFormRef {
  submit: () => void
}

interface AdminFormProps {
  ref?: React.Ref<AdminFormRef>
  defaultValues?: Partial<AdminFormValues>
  onSubmit: (values: AdminFormValues) => void
  loading?: boolean
  children?: React.ReactNode
}

const UserRoleOptions = Object.values(UserRole).map(role => ({
  label: RoleText[role],
  value: role,
}))

const AdminForm = (props: AdminFormProps) => {
  const { ref, defaultValues, onSubmit, loading, children } = props
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminFormValues>({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      userRole: UserRole.admin,
      ...defaultValues,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
  }))

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      maxWidth={400}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Controller
        name="name"
        control={control}
        rules={{
          required: '账号不能为空',
          pattern: {
            value: USER_NAME_REGEX,
            message: '账号只能为4-20位数字、字母等字符',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="账号"
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            inputProps={{ maxLength: 20, 'aria-label': '账号', tabIndex: 0 }}
            required
            disabled={loading}
          />
        )}
      />
      <Controller
        name="username"
        control={control}
        rules={{
          required: '用户名不能为空',
          maxLength: { value: 20, message: '用户名最多20位' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="用户名"
            error={!!errors.username}
            helperText={errors.username?.message}
            fullWidth
            inputProps={{ maxLength: 20, 'aria-label': '用户名', tabIndex: 0 }}
            required
            disabled={loading}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{
          pattern: { value: EMAIL_REGEX, message: '邮箱格式不正确' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="邮箱"
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            inputProps={{ 'aria-label': '邮箱', tabIndex: 0 }}
            disabled={loading}
          />
        )}
      />
      <Controller
        name="userRole"
        control={control}
        rules={{ required: '请选择角色' }}
        render={({ field }) => (
          <FormControl component="fieldset" error={!!errors.userRole} required>
            <FormLabel component="legend">角色</FormLabel>
            <RadioGroup row {...field} aria-label="角色" tabIndex={0}>
              {UserRoleOptions.map((opt: { label: string; value: string }) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      />
      {children}
    </Box>
  )
}

export default AdminForm
