import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { AUTH_EXPIRED_EVENT } from '@/api/client'
import { ROUTES } from '@/constants/routes'

export default function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    function redirectToLogin() {
      if (location.pathname !== ROUTES.login) {
        navigate(ROUTES.login, { replace: true })
      }
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, redirectToLogin)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, redirectToLogin)
  }, [location.pathname, navigate])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
