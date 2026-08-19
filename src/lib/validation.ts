export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim()
  if (!trimmed) return 'Email là bắt buộc'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Email không hợp lệ'
  if (trimmed.length > 150) return 'Email tối đa 150 ký tự'
  return undefined
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Mật khẩu là bắt buộc'
  if (password.length < 6) return 'Mật khẩu tối thiểu 6 ký tự'
  if (password.length > 100) return 'Mật khẩu tối đa 100 ký tự'
  return undefined
}

export function validateFullName(fullName: string): string | undefined {
  const trimmed = fullName.trim()
  if (!trimmed) return 'Họ tên là bắt buộc'
  if (trimmed.length > 150) return 'Họ tên tối đa 150 ký tự'
  return undefined
}

export function validateConfirmPassword(password: string, confirm: string): string | undefined {
  if (password && confirm !== password) return 'Mật khẩu xác nhận không khớp'
  return undefined
}
