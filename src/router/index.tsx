import Layout from '@/components/Layouts'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoginPage from '@/pages/Login'
import AccountPage from '@/pages/Account'
import AccountEdit from '@/pages/Account/AccountEdit'
import AccountPassword from '@/pages/Account/AccountPassword'
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
    children: [
      { path: 'account', Component: AccountPage },
      { path: 'account/edit', Component: AccountEdit },
      { path: 'account/password', Component: AccountPassword },
    ],
  },
  {
    path: '*',
    Component: LoginPage,
  },
])

export default router
