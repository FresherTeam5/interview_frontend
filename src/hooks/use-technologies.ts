import { useQuery } from '@tanstack/react-query'
import { getTechnologies } from '@/api/technology'
import type { TechnologyType } from '@/types/technology'

export function useTechnologies(activeOnly = true, type?: TechnologyType) {
  return useQuery({
    queryKey: ['technology-options', { activeOnly, type }],
    queryFn: () => getTechnologies(activeOnly, type),
    staleTime: 5 * 60 * 1000,
  })
}
