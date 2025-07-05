import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import AdminForm, { AdminFormValues } from './AdminForm'
import { userService } from '@/services/user'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import Footer from '@/components/Footer'
import { useRef } from 'react'
import type { AdminFormRef } from './AdminForm'

const EditAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', id],
    queryFn: () => userService.getUser(id!),
    enabled: !!id,
  })
  const { mutate, isPending } = useMutation({
    mutationFn: (form: AdminFormValues) => userService.updateUser(id!, form),
    onSuccess: () => {
      toast.success('修改成功')
      navigate('/dashboard/admins')
    },
    onError: () => toast.error('修改失败'),
  })

  const defaultValues = data?.data
    ? {
        name: data.data.name,
        username: data.data.username,
        email: data.data.email || '',
        userRole: data.data.userRole,
      }
    : undefined

  const formRef = useRef<AdminFormRef>(null)

  return (
    <>
      <Header title="编辑管理员" isBack />
      <PageContainer sx={{ bgcolor: '#fff', p: 3 }}>
        <AdminForm
          ref={formRef}
          defaultValues={defaultValues}
          onSubmit={values => mutate(values)}
          loading={isPending || isLoading}
        />
        <Footer
          onSave={() => formRef.current?.submit()}
          saveLoading={isPending || isLoading}
          saveDisabled={isPending || isLoading}
        />
      </PageContainer>
    </>
  )
}

export default EditAdmin
