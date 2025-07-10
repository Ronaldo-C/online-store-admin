import Layout from '@/components/Layouts'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoginPage from '@/pages/Login'
import AccountPage from '@/pages/Account'
import AccountEdit from '@/pages/Account/AccountEdit'
import AccountPassword from '@/pages/Account/AccountPassword'
import { createBrowserRouter } from 'react-router'
import Admins from '@/pages/Admins'
import CreateAdmin from '@/pages/Admins/Create'
import EditAdmin from '@/pages/Admins/Edit'
import ProductCategories from '@/pages/ProductCategories'
import CreateProductCategory from '@/pages/ProductCategories/Create'
import EditProductCategory from '@/pages/ProductCategories/Edit'
import Product from '@/pages/Product'
import CreateProduct from '@/pages/Product/Create'
import EditProduct from '@/pages/Product/Edit'
import SeoMetas from '@/pages/SeoMetas'

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
      { path: 'admins', Component: Admins },
      { path: 'admins/create', Component: CreateAdmin },
      { path: 'admins/edit/:id', Component: EditAdmin },
      { path: 'product-categories', Component: ProductCategories },
      { path: 'product-categories/create', Component: CreateProductCategory },
      { path: 'product-categories/edit/:id', Component: EditProductCategory },
      { path: 'products', Component: Product },
      { path: 'products/create', Component: CreateProduct },
      { path: 'products/edit/:id', Component: EditProduct },
      { path: 'seo-metas', Component: SeoMetas },
    ],
  },
  {
    path: '*',
    Component: LoginPage,
  },
])

export default router
