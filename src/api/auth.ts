import { api } from '@/api/client'
import { tokenStorage } from '@/api/token-storage'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', data, { skipAuth: true })
  tokenStorage.set(res.data)
  return res.data
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', data, { skipAuth: true })
  tokenStorage.set(res.data)
  return res.data
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout')
  tokenStorage.clear()
}
