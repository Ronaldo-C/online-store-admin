import React from 'react'
import { Box, Typography } from '@mui/material'

interface HeaderProps {
  title: string
  children?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ title, children }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 48,
      px: 3,
      py: 2,
      borderBottom: '1px solid #e5e6eb',
      background: '#fff',
    }}
  >
    <Typography variant="h6" fontWeight={700} color="text.primary">
      {title}
    </Typography>
    <Box>{children}</Box>
  </Box>
)

export default Header
