import { api } from '@/api/client'
import type { TechStackSummary } from '@/types/question'

export async function getTechStacks(activeOnly = true): Promise<TechStackSummary[]> {
  const { data } = await api.get<TechStackSummary[]>('/admin/tech-stacks', {
    params: { activeOnly },
  })
  return data
}
