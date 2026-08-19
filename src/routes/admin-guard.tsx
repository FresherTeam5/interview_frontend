import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import ForbiddenPage from '@/pages/forbidden-page'

export default function AdminGuard() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (user?.role !== ROLES.EVENT_ADMIN) {
    return <ForbiddenPage />
  }

  return <Outlet />
}
