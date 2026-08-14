import { useContext } from 'react'
import { AuthContext } from '@/contexts/auth-context-def'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth phải được dùng trong AuthProvider')
  }
  return ctx
}
