import { Link } from 'react-router'
import { ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <ShieldX className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-bold tracking-tight">
        Không có quyền truy cập
      </h1>
      <p className="max-w-md text-muted-foreground">
        Tài khoản của bạn không có quyền truy cập trang này.
        Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
      </p>
      <Button asChild variant="outline">
        <Link to={ROUTES.home}>Quay về trang chủ</Link>
      </Button>
    </div>
  )
}
