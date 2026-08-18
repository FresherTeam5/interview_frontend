export type QuestionLevel =
  | 'FRESHER'
  | 'JUNIOR'
  | 'MID'
  | 'SENIOR'

export type QuestionType =
  | 'BEHAVIORAL'
  | 'TECHNICAL'
  | 'CASE_STUDY'

export type QuestionDifficulty =
  | 'EASY'
  | 'MEDIUM'
  | 'HARD'

export interface QuestionFilter {
  keyword?: string
  active?: boolean
  techStackIds?: number[]
  unclassified?: boolean
  technologyIds?: number[]
  levels?: QuestionLevel[]
  questionTypes?: QuestionType[]
  difficulties?: QuestionDifficulty[]
  page?: number
  size?: number
}

export interface TechStackOption {
  id: number
  code: string
  nameVi: string
  nameEn: string
  active: boolean
}

import type { TechnologyOption } from '@/types/technology'

export interface Question {
  id: number
  contentVi: string
  contentEn: string | null
  techStacks: TechStackOption[]
  technologies: TechnologyOption[]
  level: QuestionLevel
  questionType: QuestionType
  difficulty: QuestionDifficulty
  companyRef: string | null
  createdById: number | null
  active: boolean
  version: number
  createdAt: string
  updatedAt: string
}

export interface CreateQuestionPayload {
  contentVi: string
  contentEn: string | null
  techStackIds: number[]
  technologyIds: number[]
  level: QuestionLevel
  questionType: QuestionType
  difficulty: QuestionDifficulty
  companyRef: string | null
  active: boolean
}

export interface UpdateQuestionPayload extends CreateQuestionPayload {
  version: number
}

