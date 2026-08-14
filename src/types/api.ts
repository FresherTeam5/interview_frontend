export interface ApiError {
  status: number
  code: string
  message: string
  fieldErrors?: Record<string, string[]>
}

export interface ApiErrorResponse {
  code?: string
  message?: string
  errors?: Record<string, string[]>
}

export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

