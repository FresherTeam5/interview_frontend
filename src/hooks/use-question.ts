import { useQuery } from '@tanstack/react-query'
import { getQuestion } from '@/api/question'

export function useQuestion(id: number | null) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => getQuestion(id!),
    enabled: id !== null,
  })
}
