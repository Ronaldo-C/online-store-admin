import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import Layout from '../layouts/Layout';
import AuthLayout from '../layouts/AuthLayout';
import Demo from '../pages/Demo';
// Auth
import LoginPage from '@/pages/Auth/Login';

// Dashboard
// Product
import ProductsPage from '@/pages/Dashboard/Product/Products';
import ProductSKUListPage from '@/pages/Dashboard/Product/Products/SkuList';
import ProductCreatePage from '@/pages/Dashboard/Product/Products/Create';
import ProductEditPage from '@/pages/Dashboard/Product/Products/Edit';
import CategoriesPage from '@/pages/Dashboard/Product/Categories';
import CategoryReOrderPage from '@/pages/Dashboard/Product/Categories/ReOrder';
import SubCategoryReOrderPage from '@/pages/Dashboard/Product/Categories/SubReOrder';
import CategoryProductManagePage from '@/pages/Dashboard/Product/Categories/ProductManage';
import BrandsPage from '@/pages/Dashboard/Product/Brands';
import BrandReOrderPage from '@/pages/Dashboard/Product/Brands/ReOrder';
import BrandCreatePage from '@/pages/Dashboard/Product/Brands/Create';
import BrandEditPage from '@/pages/Dashboard/Product/Brands/Edit';
import BrandProductManagePage from '@/pages/Dashboard/Product/Brands/ProductManage';
// Order
import OrdersPage from '@/pages/Dashboard/Order/Orders';
import OrderViewPage from '@/pages/Dashboard/Order/Orders/View';
import OrderBatchLogisticsPage from '@/pages/Dashboard/Order/Orders/BatchLogistics';

import OrderAfterSalePage from '@/pages/Dashboard/Order/AfterSale';
import AfterSaleViewPage from '@/pages/Dashboard/Order/AfterSale/View';
import AfterSaleEditPage from '@/pages/Dashboard/Order/AfterSale/Edit';
// Member
import MembersPage from '@/pages/Dashboard/Member/Members';
import MemberGradesPage from '@/pages/Dashboard/Member/MemberGrades';
// Promotion
import PromotionCouponsPage from '@/pages/Dashboard/Promotion/Coupons';
import CouponCreatePage from '@/pages/Dashboard/Promotion/Coupons/Create';
import CouponEditPage from '@/pages/Dashboard/Promotion/Coupons/Edit';

import PromotionShoppingPointPage from '@/pages/Dashboard/Promotion/ShoppingPoint';
// Store
import NavigationSettingPage from '@/pages/Dashboard/Store/Navigation';
import HeaderCatalogCreatePage from '@/pages/Dashboard/Store/Navigation/Create';
import HeaderCatalogEditPage from '@/pages/Dashboard/Store/Navigation/Edit';
import HeaderCatalogReorder from '@/pages/Dashboard/Store/Navigation/Reorder';
import FooterCatalogSettingPage from '@/pages/Dashboard/Store/FooterCatalog';
import FooterCatalogCreatePage from '@/pages/Dashboard/Store/FooterCatalog/Create';
import FooterCatalogEditPage from '@/pages/Dashboard/Store/FooterCatalog/Edit';
import FooterCatalogReorder from '@/pages/Dashboard/Store/FooterCatalog/Reorder';
import PageSettingPage from '@/pages/Dashboard/Store/Page';
// Cart
import PaymentSettingPage from '@/pages/Dashboard/Cart/Payment';
import DeliverySettingPage from '@/pages/Dashboard/Cart/Delivery';
import InvoiceSettingPage from '@/pages/Dashboard/Cart/Invoice';
// Group
import AdminPage from '@/pages/Dashboard/Group/Admin';
import PermissionPage from '@/pages/Dashboard/Group/Permission';
// Account
import AccountPage from '@/pages/Dashboard/Account';
import useLocale from '@/hooks/useLocale';
import DeliveryCreatePage from '@/pages/Dashboard/Cart/Delivery/Create';
import DeliveryReorder from '@/pages/Dashboard/Cart/Delivery/Reorder';
import DeliveryEditPage from '@/pages/Dashboard/Cart/Delivery/Edit';
import PaymentReorder from '@/pages/Dashboard/Cart/Payment/Reorder';
import MemberGradesCreate from '@/pages/Dashboard/Member/MemberGrades/Create';
import MemberGradesEdit from '@/pages/Dashboard/Member/MemberGrades/Edit';
import EditMember from '@/pages/Dashboard/Member/Members/Edit/EditMember';
import CreatePage from '@/pages/Dashboard/Store/Page/Create';
import EditPage from '@/pages/Dashboard/Store/Page/Edit';
import MetaSettingPage from '@/pages/Dashboard/Store/Meta';
import AdSettingPage from '@/pages/Dashboard/Store/Ad';
import AdCreatePage from '@/pages/Dashboard/Store/Ad/Create';
import AdEditPage from '@/pages/Dashboard/Store/Ad/Edit';
import SuperscriptPage from '@/pages/Dashboard/Product/Superscripts';
import SuperscriptCreate from '@/pages/Dashboard/Product/Superscripts/Create';
import SuperscriptEdit from '@/pages/Dashboard/Product/Superscripts/Edit';
import SuperscriptProductManagePage from '@/pages/Dashboard/Product/Superscripts/ProductManage';
import NewPage from '@/pages/Dashboard/Store/News';
import NewCreate from '@/pages/Dashboard/Store/News/Create';
import NewEdit from '@/pages/Dashboard/Store/News/Edit';
import OfflineStorePage from '@/pages/Dashboard/Store/OfflineStore';
import OfflineStoreCreate from '@/pages/Dashboard/Store/OfflineStore/Create';
import OfflineStoreEdit from '@/pages/Dashboard/Store/OfflineStore/Edit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ path: 'demo', element: <Demo /> }],
  },
  {
    path: '/auth',
    element: <Layout />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },
  {
    path: '/dashboard',
    element: <AuthLayout />,
    children: [
      {
        path: 'product',
        element: <Outlet />,
        children: [
          {
            path: 'products',
            children: [
              { path: '', element: <ProductsPage /> },
              { path: 'sku', element: <ProductSKUListPage /> },
              { path: 'create', element: <ProductCreatePage /> },
              { path: 'edit/:id', element: <ProductEditPage /> },
            ],
          },
          {
            path: 'categories',
            children: [
              { path: '', element: <CategoriesPage /> },
              { path: 'reorder', element: <CategoryReOrderPage /> },
              { path: 'sub-reorder/:id', element: <SubCategoryReOrderPage /> },
              { path: 'manage-product/:id', element: <CategoryProductManagePage /> },
            ],
          },
          {
            path: 'brands',
            children: [
              { path: '', element: <BrandsPage /> },
              { path: 'create', element: <BrandCreatePage /> },
              { path: 'edit/:id', element: <BrandEditPage /> },
              { path: 'reorder', element: <BrandReOrderPage /> },
              { path: 'manage-product/:id', element: <BrandProductManagePage /> },
            ],
          },
          {
            path: 'superscript',
            children: [
              { path: '', element: <SuperscriptPage /> },
              { path: 'create', element: <SuperscriptCreate /> },
              { path: 'edit/:id', element: <SuperscriptEdit /> },
              { path: 'manage-product/:id', element: <SuperscriptProductManagePage /> },
            ],
          },
        ],
      },
      {
        path: 'orders',
        element: <Outlet />,
        children: [
          {
            path: 'orders',
            children: [
              { path: '', element: <OrdersPage /> },
              { path: 'view/:id', element: <OrderViewPage /> },
              { path: 'logistics-batch/:id', element: <OrderBatchLogisticsPage /> },
            ],
          },
          {
            path: 'after-sale',
            children: [
              { path: '', element: <OrderAfterSalePage /> },
              { path: 'view/:id', element: <AfterSaleViewPage /> },
              { path: 'edit/:id', element: <AfterSaleEditPage /> },
            ],
          },
        ],
      },
      {
        path: 'member',
        element: <Outlet />,
        children: [
          {
            path: 'members',
            children: [
              {
                path: '',
                element: <MembersPage />,
              },
              {
                path: 'edit/:id',
                element: <EditMember />,
              },
            ],
          },
          {
            path: 'grade',
            children: [
              {
                path: '',
                element: <MemberGradesPage />,
              },
              {
                path: 'create',
                element: <MemberGradesCreate />,
              },
              {
                path: 'edit/:id',
                element: <MemberGradesEdit />,
              },
            ],
          },
        ],
      },
      {
        path: 'promotions',
        element: <Outlet />,
        children: [
          {
            path: 'coupons',
            children: [
              { path: '', element: <PromotionCouponsPage /> },
              { path: 'create', element: <CouponCreatePage /> },
              { path: 'edit/:id', element: <CouponEditPage /> },
            ],
          },
          { path: 'shopping-point', element: <PromotionShoppingPointPage /> },
        ],
      },
      {
        path: 'store-setting',
        element: <Outlet />,
        children: [
          {
            path: 'meta',
            children: [{ path: '', element: <MetaSettingPage /> }],
          },
          {
            path: 'footer-catalog',
            children: [
              { path: '', element: <FooterCatalogSettingPage /> },
              { path: 'create/:level/:id?', element: <FooterCatalogCreatePage /> },
              { path: 'edit/:level/:id', element: <FooterCatalogEditPage /> },
              { path: 'reorder/:level/:id?', element: <FooterCatalogReorder /> },
            ],
          },
          {
            path: 'navigation',
            children: [
              { path: '', element: <NavigationSettingPage /> },
              { path: 'create/:level/:id?', element: <HeaderCatalogCreatePage /> },
              { path: 'edit/:level/:id', element: <HeaderCatalogEditPage /> },
              { path: 'reorder/:level/:id?', element: <HeaderCatalogReorder /> },
            ],
          },
          {
            path: 'page',
            children: [
              {
                path: '',
                element: <PageSettingPage />,
              },
              {
                path: 'create',
                element: <CreatePage />,
              },
              {
                path: 'edit/:id',
                element: <EditPage />,
              },
            ],
          },
          {
            path: 'ad',
            children: [
              {
                path: '',
                element: <AdSettingPage />,
              },
              {
                path: 'create',
                element: <AdCreatePage />,
              },
              {
                path: 'edit/:id',
                element: <AdEditPage />,
              },
            ],
          },
          {
            path: 'news',
            children: [
              {
                path: '',
                element: <NewPage />,
              },
              {
                path: 'create',
                element: <NewCreate />,
              },
              {
                path: 'edit/:id',
                element: <NewEdit />,
              },
            ],
          },
          {
            path: 'offline-store',
            children: [
              {
                path: '',
                element: <OfflineStorePage />,
              },
              {
                path: 'create',
                element: <OfflineStoreCreate />,
              },
              {
                path: 'edit/:id',
                element: <OfflineStoreEdit />,
              },
            ],
          },
        ],
      },
      {
        path: 'cart-setting',
        element: <Outlet />,
        children: [
          {
            path: 'payment',
            children: [
              {
                path: '',
                element: <PaymentSettingPage />,
              },
              {
                path: 'reorder',
                element: <PaymentReorder />,
              },
            ],
          },
          {
            path: 'delivery',
            children: [
              {
                path: '',
                element: <DeliverySettingPage />,
              },
              {
                path: 'create',
                element: <DeliveryCreatePage />,
              },
              {
                path: 'reorder',
                element: <DeliveryReorder />,
              },
              {
                path: 'edit/:id',
                element: <DeliveryEditPage />,
              },
            ],
          },
          { path: 'invoice', element: <InvoiceSettingPage /> },
        ],
      },
      {
        path: 'group',
        element: <Outlet />,
        children: [
          { path: 'admin', element: <AdminPage /> },
          { path: 'permission', element: <PermissionPage /> },
        ],
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
    ],
  },
  {
    path: '*',
    element: <AuthLayout is404 />,
  },
]);

export default function Router() {
  useLocale();
  return <RouterProvider router={router} />;
}
