import { useQuery } from '@tanstack/react-query'
import { getQuestions } from '@/api/question'
import type { QuestionFilter } from '@/types/question'

export function useQuestions(page = 0, size = 20, filter: QuestionFilter = {}) {
  return useQuery({
    queryKey: ['questions', { page, size, ...filter }],
    queryFn: () => getQuestions(page, size, filter),
  })
}
