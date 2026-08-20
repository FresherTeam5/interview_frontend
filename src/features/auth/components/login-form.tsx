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
import GoogleLoginButton from '@/components/google-login-button'
import { ROUTES } from '@/constants/routes'

export interface LoginFieldErrors {
  email?: string
  password?: string
}

interface LoginFormProps extends React.ComponentProps<typeof Card> {
  onSubmitForm?: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading?: boolean
  error?: string
  fieldErrors?: LoginFieldErrors
  onFieldChange?: (field: keyof LoginFieldErrors) => void
  onGoogleLogin?: (credential: string) => void | Promise<void>
  onGoogleError?: () => void
}

export function LoginForm({
  onSubmitForm,
  isLoading = false,
  error,
  fieldErrors = {},
  onFieldChange,
  onGoogleLogin,
  onGoogleError,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu để truy cập tài khoản
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
            <Field data-invalid={!!fieldErrors.password}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
              <FieldError>{fieldErrors.password}</FieldError>
            </Field>
            <Field>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Spinner />}
                Đăng nhập
              </Button>
            </Field>
            <FieldSeparator>Hoặc tiếp tục với</FieldSeparator>
            <Field>
              <GoogleLoginButton
                label="Đăng nhập với Google"
                onCredential={(credential) => onGoogleLogin?.(credential)}
                onError={onGoogleError}
                disabled={isLoading}
              />
              <FieldDescription className="text-center">
                Chưa có tài khoản?{' '}
                <Link
                  to={ROUTES.register}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Đăng ký
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
