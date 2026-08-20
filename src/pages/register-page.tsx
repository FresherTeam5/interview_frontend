import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { SignupForm } from '@/features/auth/components/signup-form'
import type { SignupFieldErrors } from '@/features/auth/components/signup-form'
import { useAuth } from '@/hooks/use-auth'
import { isApiError } from '@/api/api-error'
import { ROUTES } from '@/constants/routes'
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '@/lib/validation'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loginWithGoogle } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({})

  function validate(formData: FormData): boolean {
    const errors: SignupFieldErrors = {}
    const fullName = (formData.get('fullName') as string) ?? ''
    const email = (formData.get('email') as string) ?? ''
    const password = (formData.get('password') as string) ?? ''
    const confirmPassword = (formData.get('confirmPassword') as string) ?? ''

    const fullNameErr = validateFullName(fullName)
    if (fullNameErr) errors.fullName = fullNameErr

    const emailErr = validateEmail(email)
    if (emailErr) errors.email = emailErr

    const passwordErr = validatePassword(password)
    if (passwordErr) errors.password = passwordErr

    const confirmErr = validateConfirmPassword(password, confirmPassword)
    if (confirmErr) errors.confirmPassword = confirmErr

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

  async function handleGoogleLogin(idToken: string) {
    setError('')
    setIsLoading(true)

    try {
      await loginWithGoogle(idToken)
      toast.success('Đăng ký Google thành công!')
      navigate(ROUTES.home, { replace: true })
    } catch (err) {
      if (isApiError(err)) setError(err.message)
      else setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleGoogleError() {
    setError('Không thể đăng ký với Google. Vui lòng thử lại.')
  }

  return (
    <SignupForm
      onSubmitForm={handleSubmit}
      isLoading={isLoading}
      error={error}
      fieldErrors={fieldErrors}
      onFieldChange={handleFieldChange}
      onGoogleLogin={handleGoogleLogin}
      onGoogleError={handleGoogleError}
    />
  )
}
