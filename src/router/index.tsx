import Layout from '@/components/Layouts'
import AuthLayout from '@/components/Layouts/AuthLayout'
import DashboardPage from '@/pages/Dashboard'
import LoginPage from '@/pages/Login'
import { createBrowserRouter } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/auth',
    Component: Layout,
    children: [{ path: 'login', Component: LoginPage }],
  },
  {
    path: '/dashboard',
    Component: AuthLayout,
    children: [{ path: 'dashboard', Component: DashboardPage }],
  },
  {
    path: '*',
    Component: LoginPage,
  },
])

export default router
