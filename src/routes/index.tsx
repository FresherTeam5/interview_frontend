import { createBrowserRouter } from 'react-router'
import RootLayout from '@/routes/root-layout'
import AuthLayout from '@/routes/auth-layout'
import GuestGuard from '@/routes/guest-guard'
import AdminGuard from '@/routes/admin-guard'
import RouteErrorBoundary from '@/routes/route-error-boundary'
import HomePage from '@/pages/home-page'
import AboutPage from '@/pages/about-page'
import LoginPage from '@/pages/login-page'
import RegisterPage from '@/pages/register-page'
import NotFoundPage from '@/pages/not-found-page'
import QuestionListPage from '@/pages/admin/question-list-page'
import { ROUTES } from '@/constants/routes'

export const router = createBrowserRouter([
  // Auth routes — layout riêng, không header/footer
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.register, element: <RegisterPage /> },
        ],
      },
    ],
  },
  // Admin routes — cần quyền ADMIN
  {
    element: <AdminGuard />,
    children: [
      {
        path: '/admin',
        element: <RootLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: 'questions', element: <QuestionListPage /> },
        ],
      },
    ],
  },
  // App routes — giữ nguyên RootLayout
  {
    path: ROUTES.home,
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
