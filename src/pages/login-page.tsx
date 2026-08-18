import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { LoginForm } from '@/features/auth/components/login-form'
import { useAuth } from '@/hooks/use-auth'
import { isApiError } from '@/api/api-error'
import { ROUTES } from '@/constants/routes'
import { validateEmail, validatePassword } from '@/lib/validation'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  function validate(formData: FormData): boolean {
    const errors: { email?: string; password?: string } = {}
    const email = (formData.get('email') as string) ?? ''
    const password = (formData.get('password') as string) ?? ''

    const emailErr = validateEmail(email)
    if (emailErr) errors.email = emailErr

    const passwordErr = validatePassword(password)
    if (passwordErr) errors.password = passwordErr

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleFieldChange(field: 'email' | 'password') {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    if (!validate(formData)) return

    const email = (formData.get('email') as string).trim()
    const password = formData.get('password') as string

    setIsLoading(true)

    try {
      await login({ email, password })
      toast.success('Đăng nhập thành công!')
      navigate(ROUTES.home, { replace: true })
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message)
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          onSubmitForm={handleSubmit}
          isLoading={isLoading}
          error={error}
          fieldErrors={fieldErrors}
          onFieldChange={handleFieldChange}
        />
      </div>
    </div>
  )
}
