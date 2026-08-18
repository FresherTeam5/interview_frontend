import { api } from '@/api/client'
import type { PageResponse } from '@/types/api'
import type {
  Question,
  QuestionFilter,
  CreateQuestionPayload,
  UpdateQuestionPayload,
} from '@/types/question'

export async function getQuestions(
  page = 0,
  size = 20,
  filter?: QuestionFilter,
): Promise<PageResponse<Question>> {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('size', String(size))

  if (filter) {
    if (filter.keyword?.trim()) params.set('keyword', filter.keyword.trim())
    if (filter.active !== undefined) params.set('active', String(filter.active))
    if (filter.unclassified !== undefined) params.set('unclassified', String(filter.unclassified))
    
    filter.techStackIds?.forEach(id => params.append('techStackIds', String(id)))
    filter.technologyIds?.forEach(id => params.append('technologyIds', String(id)))
    filter.levels?.forEach(level => params.append('levels', level))
    filter.questionTypes?.forEach(type => params.append('questionTypes', type))
    filter.difficulties?.forEach(diff => params.append('difficulties', diff))
  }

  const { data } = await api.get<PageResponse<Question>>('/admin/questions', { params })
  return data
}

export async function getQuestion(id: number): Promise<Question> {
  const { data } = await api.get<Question>(`/admin/questions/${id}`)
  return data
}

export async function createQuestion(payload: CreateQuestionPayload): Promise<Question> {
  const { data } = await api.post<Question>('/admin/questions', payload)
  return data
}

export async function updateQuestion(id: number, payload: UpdateQuestionPayload): Promise<Question> {
  const { data } = await api.put<Question>(`/admin/questions/${id}`, payload)
  return data
}

export async function deactivateQuestion(id: number): Promise<void> {
  await api.delete(`/admin/questions/${id}`)
}
