import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { SignupForm } from '@/features/auth/signup-form'
import type { SignupFieldErrors } from '@/features/auth/signup-form'
import { useAuth } from '@/hooks/use-auth'
import { isApiError } from '@/api/api-error'
import { ROUTES } from '@/constants/routes'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({})

  function validate(formData: FormData): boolean {
    const errors: SignupFieldErrors = {}
    const fullName = (formData.get('fullName') as string) ?? ''
    const password = (formData.get('password') as string) ?? ''
    const confirmPassword = (formData.get('confirmPassword') as string) ?? ''

    if (!fullName.trim()) {
      errors.fullName = 'Họ tên là bắt buộc'
    } else if (fullName.trim().length > 150) {
      errors.fullName = 'Họ tên tối đa 150 ký tự'
    }

    if (!password) {
      errors.password = 'Mật khẩu là bắt buộc'
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu tối thiểu 6 ký tự'
    }

    if (password && confirmPassword !== password) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleFieldChange(field: keyof SignupFieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    if (!validate(formData)) return

    const fullName = (formData.get('fullName') as string).trim()
    const email = (formData.get('email') as string).trim()
    const password = formData.get('password') as string

    setIsLoading(true)
    try {
      await register({ fullName, email, password })
      toast.success('Tạo tài khoản thành công!')
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
    <SignupForm
      onSubmitForm={handleSubmit}
      isLoading={isLoading}
      error={error}
      fieldErrors={fieldErrors}
      onFieldChange={handleFieldChange}
    />
  )
}
