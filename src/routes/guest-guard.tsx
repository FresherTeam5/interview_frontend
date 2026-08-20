import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/constants/routes'
import { Spinner } from '@/components/ui/spinner'

/**
 * Chỉ cho phép user chưa đăng nhập truy cập.
 * Nếu đã đăng nhập → redirect về trang chủ.
 */
export default function GuestGuard() {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <Outlet />
}
