import { Stack } from '@mui/material'
import { Outlet } from 'react-router'
import useAuth from '@/hooks/useAuth'

export default function Layout() {
  useAuth()
  return (
    <Stack height="100vh" width="100vw" overflow="auto" maxWidth="100vw">
      <Outlet />
    </Stack>
  )
}
