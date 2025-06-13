import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const NotFound = lazy(() => import('@/pages/not-found'));

// Pages
const DashboardPage = lazy(() => import('@/pages/dashboard')); // '/'
const OrderPage = lazy(() => import('@/pages/orders'));
// const OrderDetailPage = lazy(() => import('@/pages/orders/OrderDetailPage'));
const FormPage = lazy(() => import('@/pages/form'));

// New pages from navItems
const SuppliersPage = lazy(() => import('@/pages/suppliers/index'));
const ClientsPage = lazy(() => import('@/pages/clients'));
const NetworkPage = lazy(() => import('@/pages/network'));
const AboutPage = lazy(() => import('@/pages/about'));

function PrivateRouteLayout() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );
}

export default function AppRouter() {
  const routes = useRoutes([
    {
      path: '/',
      element: <PrivateRouteLayout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'order', element: <OrderPage /> },
        // { path: 'order/details', element: <OrderDetailPage /> },
        { path: 'form', element: <FormPage /> },
        { path: 'suppliers', element: <SuppliersPage /> },
        { path: 'clients', element: <ClientsPage /> },
        { path: 'network', element: <NetworkPage /> },
        { path: 'about', element: <AboutPage /> }
      ]
    },
    {
      path: '/login',
      element: (
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <SignInPage />
        </Suspense>
      )
    },
    {
      path: '/404',
      element: (
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <NotFound />
        </Suspense>
      )
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ]);

  return routes;
}
