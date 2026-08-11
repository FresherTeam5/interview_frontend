import { createBrowserRouter } from 'react-router'
import RootLayout from '@/routes/root-layout'
import RouteErrorBoundary from '@/routes/route-error-boundary'
import HomePage from '@/pages/home-page'
import AboutPage from '@/pages/about-page'
import NotFoundPage from '@/pages/not-found-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
