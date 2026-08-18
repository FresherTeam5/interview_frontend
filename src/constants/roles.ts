export const ROLES = {
  EVENT_ADMIN: 'EVENT_ADMIN',
  PARTICIPANT: 'PARTICIPANT',
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]
