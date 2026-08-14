import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/constants/routes'

/**
 * Chỉ cho phép user chưa đăng nhập truy cập.
 * Nếu đã đăng nhập → redirect về trang chủ.
 */
export default function GuestGuard() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <Outlet />
}
