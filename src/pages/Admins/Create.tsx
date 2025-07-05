import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import AdminForm, { AdminFormValues } from './AdminForm'
import { userService } from '@/services/user'
import Header from '@/components/Header'
import PageContainer from '@/components/PageContainer'
import Footer from '@/components/Footer'
import type { AdminFormRef } from './AdminForm'
import Modal from '@/components/Modal'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { CreateUserResponse } from '@/types/user'

const CreateAdmin: React.FC = () => {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const formRef = useRef<AdminFormRef>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: (data: AdminFormValues) =>
      userService.createUser({
        ...data,
        email: data.email || null,
      }),
    onSuccess: (res: CreateUserResponse) => {
      setNewPassword(res?.data?.password || '')
      setModalOpen(true)
    },
    onError: () => toast.error('新增失败'),
  })

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
    navigate('/dashboard/admins')
  }

  const handleModalCancel = () => {
    setModalOpen(false)
  }

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
      <Modal
        open={modalOpen}
        title="新增成功"
        description={
          <Box display="flex" alignItems="center" gap={2}>
            <span>初始密码：{newPassword}</span>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCopy}
              aria-label="复制密码"
              tabIndex={0}
            >
              复制
            </Button>
          </Box>
        }
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        confirmText="确定"
        cancelText="关闭"
      />
    </>
  )
}

export default CreateAdmin
