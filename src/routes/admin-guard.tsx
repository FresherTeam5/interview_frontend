import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import ForbiddenPage from '@/pages/forbidden-page'
import { Spinner } from '@/components/ui/spinner'

export default function AdminGuard() {
  const { user, isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (user?.role !== ROLES.ADMIN) {
    return <ForbiddenPage />
  }

  return <Outlet />
}
