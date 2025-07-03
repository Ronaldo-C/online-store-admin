import Menu from '@/pages/Menu'
import { Stack } from '@mui/material'
import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <Stack
      height="100vh"
      width="100vw"
      overflow="auto"
      maxWidth="100vw"
      direction="row"
      sx={{
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
        '::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Menu />
      <Stack flex={1}>
        <Outlet />
      </Stack>
    </Stack>
  )
}
