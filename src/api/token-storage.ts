import type { AuthTokens } from '@/types/api'
import { STORAGE_KEYS } from '@/constants/storage-keys'

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(STORAGE_KEYS.accessToken),

  set({ accessToken }: AuthTokens) {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken)
  },

  clear() {
    localStorage.removeItem(STORAGE_KEYS.accessToken)
  },
}
