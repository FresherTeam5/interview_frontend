import { useState } from 'react'
import { Link } from 'react-router'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from '@/constants/routes'

export interface LoginFieldErrors {
  email?: string
  password?: string
}

interface LoginFormProps extends React.ComponentProps<"div"> {
  onSubmitForm?: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading?: boolean
  error?: string
  fieldErrors?: LoginFieldErrors
  onFieldChange?: (field: keyof LoginFieldErrors) => void
}

export function LoginForm({
  className,
  onSubmitForm,
  isLoading = false,
  error,
  fieldErrors = {},
  onFieldChange,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu để truy cập tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitForm}>
            {error && (
              <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors.email}
                  onChange={() => onFieldChange?.('email')}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-destructive">{fieldErrors.email}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                  <span
                    className="ml-auto inline-block text-sm text-muted-foreground/50 cursor-not-allowed"
                    title="Tính năng sắp ra mắt"
                  >
                    Quên mật khẩu?
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    className="pr-10"
                    aria-invalid={!!fieldErrors.password}
                    onChange={() => onFieldChange?.('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-sm text-destructive">{fieldErrors.password}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đăng nhập
                </Button>
                <Button variant="outline" type="button" className="w-full" disabled title="Tính năng sắp ra mắt">
                  Đăng nhập với Google
                </Button>
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
    </div>
  )
}
