import type { UserRole } from '@/constants/roles'

export interface ApiError {
  status: number
  code: string
  message: string
  fieldErrors?: Record<string, string>
}

export interface ApiErrorResponse {
  code?: string
  message?: string
  fieldErrors?: Record<string, string>
}

export interface CurrentUser {
  id: number
  fullName: string
  email: string
  avatarUrl: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}
