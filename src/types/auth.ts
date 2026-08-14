
export interface AuthUser {
  userId: number
  email: string
  role: string
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<AuthResponse>
  register: (data: RegisterRequest) => Promise<AuthResponse>
  logout: () => Promise<void>
}

export interface AuthTokens {
  accessToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  userId: number
  email: string
  role: 'EVENT_ADMIN' | 'PARTICIPANT'
}