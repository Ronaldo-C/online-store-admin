import { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

export type ModalProps = {
  open: boolean
  title: string
  description: string | ReactNode
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const Modal = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = '确认',
  cancelText = '取消',
  loading = false,
}: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <DialogTitle id="modal-title">{title}</DialogTitle>
      <DialogContent id="modal-description">{description}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} aria-label="取消" tabIndex={0} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          aria-label="确认"
          tabIndex={0}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? '处理中...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Modal
