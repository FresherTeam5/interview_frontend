import type { AuthTokens } from '@/types/api'

const ACCESS_TOKEN_KEY = 'auth.accessToken'

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),

  set({ accessToken }: AuthTokens) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  },
}
