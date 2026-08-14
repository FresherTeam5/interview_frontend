import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { loginUser, logoutUser, registerUser } from '@/api/auth'
import { tokenStorage } from '@/api/token-storage'
import { AUTH_EXPIRED_EVENT } from '@/api/client'
import { AuthContext } from '@/contexts/auth-context-def'
import type { AuthUser, LoginRequest, RegisterRequest } from '@/types/auth'

const USER_STORAGE_KEY = 'auth.user'

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function storeUser(user: AuthUser) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // khôi phục user từ localStorage nếu có token
    const token = tokenStorage.getAccessToken()
    if (!token) return null
    return loadStoredUser()
  })

  // lắng nghe sự kiện auth:expired từ api client
  useEffect(() => {
    function handleExpired() {
      setUser(null)
      clearStoredUser()
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired)
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    const res = await loginUser(data)
    const authUser: AuthUser = { userId: res.userId, email: res.email, role: res.role }
    setUser(authUser)
    storeUser(authUser)
    return res
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await registerUser(data)
    const authUser: AuthUser = { userId: res.userId, email: res.email, role: res.role }
    setUser(authUser)
    storeUser(authUser)
    return res
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } finally {
      setUser(null)
      clearStoredUser()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
