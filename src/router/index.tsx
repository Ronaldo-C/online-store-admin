import Layout from '@/components/Layouts'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoginPage from '@/pages/Login'
import AccountPage from '@/pages/Account'
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
    children: [{ path: 'account', Component: AccountPage }],
  },
  {
    path: '*',
    Component: LoginPage,
  },
])

export default router
