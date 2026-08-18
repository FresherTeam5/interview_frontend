import { useQuery } from '@tanstack/react-query'
import { getTechStacks } from '@/api/tech-stack'

export function useTechStacks() {
  return useQuery({
    queryKey: ['tech-stacks', { activeOnly: true }],
    queryFn: () => getTechStacks(true),
    staleTime: 5 * 60 * 1000,
  })
}
