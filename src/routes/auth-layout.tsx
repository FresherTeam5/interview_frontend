import { Outlet } from 'react-router'
import ModeToggle from '@/components/mode-toggle'

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Branding panel — ẩn trên mobile */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground">
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />

        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-foreground/5 blur-2xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-foreground/5 blur-3xl" />

        {/* logo được vẽ bằng thẻ svg  */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              {/* Ngôi sao cách điệu */}
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              {/* Dấu checkmark lồng bên trong thể hiện sự thành công */}
              <path d="M9 12l2 2 4-4" />
            </svg>
            MockInterview
          </div>
        </div>

        {/* tagline */}
        <div className="relative z-10 space-y-4">
          <blockquote className="space-y-2">
            <p className="text-xl font-medium leading-relaxed">
              &ldquo;Luyện phỏng vấn thực chiến, tự tin chinh phục mọi cơ hội nghề nghiệp.&rdquo;
            </p>
            <footer className="text-sm text-primary-foreground/70">
              Nền tảng phỏng vấn thử thông minh
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Form area */}
      <div className="relative flex flex-col">
        {/* mode toggle — góc trên phải */}
        <div className="absolute right-4 top-4 z-10">
          <ModeToggle />
        </div>

        {/*noi dung form */}
        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Content của các trang con sẽ được render ở đây */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
