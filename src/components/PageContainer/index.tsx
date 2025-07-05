import { Box, SxProps } from '@mui/material'

export default function PageContainer({
  children,
  sx,
}: {
  children: React.ReactNode
  sx?: SxProps
}) {
  return (
    <Box
      sx={{ background: '#f3f4f6', height: 'calc(100vh - 70px)', overflow: 'auto', p: 3, ...sx }}
    >
      {children}
    </Box>
  )
}
