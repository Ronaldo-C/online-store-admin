import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import AdminForm, { AdminFormValues } from './AdminForm'
import { userService } from '@/services/user'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import Footer from '@/components/Footer'
import { useRef } from 'react'
import type { AdminFormRef } from './AdminForm'

const CreateAdmin: React.FC = () => {
  const navigate = useNavigate()
  const { mutate, isPending } = useMutation({
    mutationFn: (data: AdminFormValues) => userService.createUser(data),
    onSuccess: () => {
      toast.success('新增成功')
      navigate('/dashboard/admins')
    },
    onError: () => toast.error('新增失败'),
  })

  const formRef = useRef<AdminFormRef>(null)

  return (
    <>
      <Header title="新增管理员" isBack />
      <PageContainer sx={{ bgcolor: '#fff', p: 3 }}>
        <AdminForm ref={formRef} onSubmit={values => mutate(values)} loading={isPending} />
        <Footer
          onSave={() => formRef.current?.submit()}
          saveLoading={isPending}
          saveDisabled={isPending}
        />
      </PageContainer>
    </>
  )
}

export default CreateAdmin
