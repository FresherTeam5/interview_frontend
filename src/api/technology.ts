import { api } from '@/api/client'
import type { TechnologyOption, TechnologyType } from '@/types/technology'

export async function getTechnologies(
  activeOnly = true,
  type?: TechnologyType,
): Promise<TechnologyOption[]> {
  const params = new URLSearchParams()
  params.set('activeOnly', String(activeOnly))
  if (type) {
    params.set('type', type)
  }
  const { data } = await api.get<TechnologyOption[]>('/admin/technologies', { params })
  return data
}
