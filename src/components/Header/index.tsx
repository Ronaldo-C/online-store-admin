import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  isBack?: boolean
  children?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ title, isBack = false, children }) => {
  const navigate = useNavigate()
  const handleBack = () => navigate(-1)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        px: 3,
        py: 2,
        borderBottom: '1px solid #e5e6eb',
        background: '#fff',
      }}
    >
      <Box display="flex" alignItems="center">
        {isBack && (
          <IconButton
            onClick={handleBack}
            aria-label="返回"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') handleBack()
            }}
            edge="start"
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6" fontWeight={700} color="text.primary">
          {title}
        </Typography>
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}

export default Header
