import { Box, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import useCustomNavigate from '@/hooks/useCustomNavigate'

interface FooterProps {
  onCancel?: () => void
  onSave: () => void
  saveLoading?: boolean
  cancelText?: string
  saveText?: string
}

const Footer = ({
  onCancel,
  onSave,
  saveLoading = false,
  cancelText = '取消',
  saveText = '保存',
}: FooterProps) => {
  const navigate = useCustomNavigate()
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate(-1)
    }
  }
  return (
    <Box position="fixed" bottom={32} right={32} display="flex" gap={2} zIndex={1300}>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleCancel}
        aria-label={cancelText}
        tabIndex={0}
      >
        {cancelText}
      </Button>
      <LoadingButton
        loading={saveLoading}
        variant="contained"
        color="primary"
        onClick={onSave}
        aria-label={saveText}
        tabIndex={0}
      >
        {saveLoading ? '保存中...' : saveText}
      </LoadingButton>
    </Box>
  )
}

export default Footer
