import { Outlet } from 'react-router'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
