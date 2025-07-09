import { useRef } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import toast from 'react-hot-toast'

export type ImageObject = {
  id: string
  data: string
  file?: File
}

type ImageProps = {
  value?: ImageObject[]
  onChange?: (images: ImageObject[]) => void
  multiple?: boolean
  label?: string
  disabled?: boolean
}

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const ImageUploader = ({
  value = [],
  onChange,
  multiple = false,
  label = '上传图片',
  disabled = false,
}: ImageProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const replaceIndexRef = useRef<number | null>(null)

  const handleUploadClick = () => {
    replaceIndexRef.current = null
    inputRef.current?.click()
  }

  const handleReplaceClick = (idx: number) => {
    replaceIndexRef.current = idx
    inputRef.current?.click()
  }

  const handleDelete = (idx: number) => {
    const newImages = value.filter((_, i) => i !== idx)
    onChange?.(newImages)
  }

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    try {
      if (replaceIndexRef.current !== null) {
        // 替换
        const file = files[0]
        const data = await readFileAsDataURL(file)
        const newImages = [...value]
        newImages[replaceIndexRef.current] = {
          id: `${new Date().getTime()}-${file.name}`,
          data,
          file,
        }
        onChange?.(newImages)
      } else {
        // 新增
        const fileList = Array.from(files)
        const newImages = await Promise.all(
          fileList.map(async file => ({
            id: `${new Date().getTime()}-${file.name}`,
            data: await readFileAsDataURL(file),
            file,
          }))
        )
        onChange?.(multiple ? [...value, ...newImages] : [newImages[0]])
      }
    } catch {
      toast.error('图片处理失败')
    } finally {
      e.target.value = '' // 允许重复上传同一文件
      replaceIndexRef.current = null
    }
  }

  return (
    <Box>
      {label && <Typography mb={1}>{label}</Typography>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleFilesChange}
        tabIndex={-1}
        aria-label="图片上传"
        disabled={disabled}
      />
      <Box display="flex" gap={2} flexWrap="wrap">
        {value.length === 0 && (
          <Button
            variant="outlined"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={handleUploadClick}
            aria-label="上传图片"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleUploadClick()}
            disabled={disabled}
          >
            {label}
          </Button>
        )}
        {value.map((img, idx) => (
          <Box
            key={img.id}
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <img
              src={img.data}
              alt={`已上传图片${idx + 1}`}
              style={{
                width: 120,
                height: 120,
                objectFit: 'cover',
                borderRadius: 8,
                border: '1px solid #eee',
              }}
            />
            <Box mt={1} display="flex" gap={1}>
              <IconButton
                aria-label="删除图片"
                tabIndex={0}
                onClick={() => handleDelete(idx)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleDelete(idx)}
                size="small"
                disabled={disabled}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="重新上传"
                tabIndex={0}
                onClick={() => handleReplaceClick(idx)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleReplaceClick(idx)}
                size="small"
                disabled={disabled}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        {multiple && value.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={handleUploadClick}
            aria-label="继续上传图片"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleUploadClick()}
            disabled={disabled}
          >
            继续上传
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default ImageUploader
