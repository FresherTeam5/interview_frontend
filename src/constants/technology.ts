import type { TechnologyType } from '@/types/technology'

export const TECHNOLOGY_TYPE_LABELS: Record<TechnologyType, string> = {
  LANGUAGE: 'Ngôn ngữ',
  FRAMEWORK: 'Framework',
  DATABASE: 'Cơ sở dữ liệu',
  CLOUD: 'Cloud',
  PLATFORM: 'Nền tảng',
  TOOL: 'Công cụ',
}

export const TECHNOLOGY_TYPE_ORDER: TechnologyType[] = [
  'LANGUAGE',
  'FRAMEWORK',
  'DATABASE',
  'CLOUD',
  'PLATFORM',
  'TOOL',
]
