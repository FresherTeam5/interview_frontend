import { useState } from 'react'
import { Link } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from '@/constants/routes'

export interface SignupFieldErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

interface SignupFormProps extends React.ComponentProps<typeof Card> {
  onSubmitForm?: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading?: boolean
  error?: string
  fieldErrors?: SignupFieldErrors
  onFieldChange?: (field: keyof SignupFieldErrors) => void
}

export function SignupForm({
  onSubmitForm,
  isLoading = false,
  error,
  fieldErrors = {},
  onFieldChange,
  ...props
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Tạo tài khoản</CardTitle>
        <CardDescription>
          Điền thông tin bên dưới để bắt đầu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmitForm}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <FieldGroup>
            {/* Full Name */}
            <Field data-invalid={!!fieldErrors.fullName}>
              <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
              <Input
                id="name"
                name="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                required
                disabled={isLoading}
                aria-invalid={!!fieldErrors.fullName}
                onChange={() => onFieldChange?.('fullName')}
              />
              <FieldError>{fieldErrors.fullName}</FieldError>
            </Field>

            {/* Email */}
            <Field data-invalid={!!fieldErrors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                required
                disabled={isLoading}
                aria-invalid={!!fieldErrors.email}
                onChange={() => onFieldChange?.('email')}
              />
              <FieldError>{fieldErrors.email}</FieldError>
            </Field>

            {/* Password */}
            <Field data-invalid={!!fieldErrors.password}>
              <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors.password}
                  onChange={() => onFieldChange?.('password')}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>Tối thiểu 6 ký tự.</FieldDescription>
              <FieldError>{fieldErrors.password}</FieldError>
            </Field>

            {/* Confirm Password */}
            <Field data-invalid={!!fieldErrors.confirmPassword}>
              <FieldLabel htmlFor="confirm-password">Xác nhận mật khẩu</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  onChange={() => onFieldChange?.('confirmPassword')}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirm ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{fieldErrors.confirmPassword}</FieldError>
            </Field>

            {/* Actions */}
            <Field>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Spinner />}
                Tạo tài khoản
              </Button>
            </Field>
            <FieldSeparator>Hoặc tiếp tục với</FieldSeparator>
            <Field>
              <Button variant="outline" type="button" className="w-full">
                Đăng ký với Google
              </Button>
              <FieldDescription className="text-center">
                Đã có tài khoản?{' '}
                <Link
                  to={ROUTES.login}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Đăng nhập
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
