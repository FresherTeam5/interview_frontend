import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { isApiError } from '@/api/api-error'
import { ROUTES } from '@/constants/routes'


export default function RouteErrorBoundary() {
  const error = useRouteError()

  let status: number | undefined
  let title = 'Đã có lỗi xảy ra'
  let message = 'Vui lòng thử lại hoặc quay về trang chủ.'

  if (isRouteErrorResponse(error)) {
    status = error.status
    title = `${error.status} ${error.statusText}`
    if (typeof error.data === 'string' && error.data) message = error.data
  } else if (isApiError(error)) {
    status = error.status || undefined
    message = error.message
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4 text-center">
      {status ? <p className="text-sm font-mono text-muted-foreground">HTTP {status}</p> : null}
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground max-w-prose">{message}</p>
      <Link
        to={ROUTES.home}
        className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Về trang chủ
      </Link>
    </div>
  )
}
