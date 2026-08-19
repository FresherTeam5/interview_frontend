import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createQuestion, updateQuestion, deactivateQuestion } from '@/api/question'
import type { CreateQuestionPayload, UpdateQuestionPayload } from '@/types/question'

export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateQuestionPayload) => createQuestion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    },
  })
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateQuestionPayload }) =>
      updateQuestion(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['question', variables.id] })
    },
  })
}

export function useDeactivateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deactivateQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    },
  })
}
