import { api } from '@/api/client'
import type { TechStackOption } from '@/types/question'

export async function getTechStacks(activeOnly = true): Promise<TechStackOption[]> {
  const { data } = await api.get<TechStackOption[]>('/admin/tech-stacks', {
    params: { activeOnly },
  })
  return data
}
