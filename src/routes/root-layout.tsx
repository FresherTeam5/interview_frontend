import { Link, NavLink, Outlet } from 'react-router'

const navItems = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/about', label: 'Giới thiệu', end: false },
]

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <nav className="mx-auto max-w-5xl flex items-center gap-6 px-4 h-14">
          <Link to="/" className="font-semibold">
            basefrontend
          </Link>
          <ul className="flex items-center gap-4 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? 'text-brand-500 font-medium' : 'text-slate-600 hover:text-slate-900'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-4 text-sm text-slate-500">
          © {new Date().getFullYear()} basefrontend
        </div>
      </footer>
    </div>
  )
}
