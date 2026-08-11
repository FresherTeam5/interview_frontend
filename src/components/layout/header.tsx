import { Link, NavLink } from 'react-router'
import ModeToggle from '@/components/mode-toggle'
import { ROUTES } from '@/constants/routes'

const navItems = [
  { to: ROUTES.home, label: 'Trang chủ', end: true },
  { to: ROUTES.about, label: 'Giới thiệu', end: false },
]

export default function Header() {
  return (
    <header className="border-b">
      <nav className="mx-auto max-w-5xl flex items-center gap-6 px-4 h-14">
        <Link to={ROUTES.home} className="font-semibold">
          basefrontend
        </Link>
        <ul className="flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}
