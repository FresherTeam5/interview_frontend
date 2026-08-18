import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <p className="text-sm font-mono text-muted-foreground">HTTP 404</p>
      <h1 className="text-2xl font-semibold">Không tìm thấy trang</h1>
      <p className="text-muted-foreground">Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.</p>
      <Link to="/" className="mt-2 text-sm font-medium text-primary hover:underline">
        Về trang chủ
      </Link>
    </div>
  )
}
