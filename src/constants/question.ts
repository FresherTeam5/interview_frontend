import type { QuestionLevel, QuestionType, QuestionDifficulty } from '@/types/question'

export const LEVEL_LABELS: Record<QuestionLevel, string> = {
  FRESHER: 'Fresher',
  JUNIOR: 'Junior',
  MID: 'Middle',
  SENIOR: 'Senior',
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  BEHAVIORAL: 'Hành vi',
  TECHNICAL: 'Kỹ thuật',
  CASE_STUDY: 'Tình huống',
}

export const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  EASY: 'Dễ',
  MEDIUM: 'Trung bình',
  HARD: 'Khó',
}

export const QUESTION_LEVELS: QuestionLevel[] = ['FRESHER', 'JUNIOR', 'MID', 'SENIOR']
export const QUESTION_TYPES: QuestionType[] = ['BEHAVIORAL', 'TECHNICAL', 'CASE_STUDY']
export const QUESTION_DIFFICULTIES: QuestionDifficulty[] = ['EASY', 'MEDIUM', 'HARD']

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
export const DEFAULT_PAGE_SIZE = 20

export const CREATE_QUESTION_DEFAULTS = {
  contentVi: '',
  contentEn: '',
  techStackIds: [] as number[],
  technologyIds: [] as number[],
  level: 'JUNIOR' as QuestionLevel,
  questionType: 'TECHNICAL' as QuestionType,
  difficulty: 'MEDIUM' as QuestionDifficulty,
  companyRef: '',
  active: true,
}

export const COMPANY_REF_MAX_LENGTH = 150

export const ACTIVE_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'true', label: 'Đang hoạt động' },
  { value: 'false', label: 'Đã vô hiệu' },
] as const

export const SEARCH_DEBOUNCE_MS = 400
