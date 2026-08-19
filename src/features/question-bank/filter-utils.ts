import {
  LEVEL_LABELS,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
} from '@/constants/question'
import type {
  QuestionFilter,
  QuestionLevel,
  QuestionType,
  QuestionDifficulty,
  TechStackOption,
} from '@/types/question'
import type { TechnologyOption } from '@/types/technology'

export type ArrayFilterKey =
  | 'techStackIds'
  | 'technologyIds'
  | 'levels'
  | 'questionTypes'
  | 'difficulties'

const ARRAY_FILTER_KEYS: ArrayFilterKey[] = [
  'techStackIds',
  'technologyIds',
  'levels',
  'questionTypes',
  'difficulties',
]

export interface FilterChip {
  key: string
  group: string
  label: string
  /** Bộ lọc sau khi gỡ đúng giá trị của chip này. */
  next: QuestionFilter
}

function arrayOf(filter: QuestionFilter, key: ArrayFilterKey): (string | number)[] {
  return (filter[key] as (string | number)[] | undefined) ?? []
}

/** Gán lại nguyên mảng cho một tiêu chí; mảng rỗng được bỏ hẳn khỏi query. */
export function setArrayFilter(
  filter: QuestionFilter,
  key: ArrayFilterKey,
  values: (string | number)[],
): QuestionFilter {
  return { ...filter, [key]: values.length > 0 ? values : undefined }
}

export function countActiveFilters(filter: QuestionFilter): number {
  return (
    (filter.keyword ? 1 : 0) +
    (filter.active !== undefined ? 1 : 0) +
    (filter.unclassified ? 1 : 0) +
    ARRAY_FILTER_KEYS.reduce((total, key) => total + arrayOf(filter, key).length, 0)
  )
}

export function hasActiveFilters(filter: QuestionFilter): boolean {
  return countActiveFilters(filter) > 0
}

interface ChipLookups {
  techStacks: TechStackOption[]
  technologies: TechnologyOption[]
}

/**
 * Các tiêu chí nằm ẩn trong popover được trả ra dạng chip để người dùng
 * thấy ngay mình đang lọc gì. Từ khóa và trạng thái đã có ô nhập riêng nên bỏ qua.
 */
export function buildFilterChips(
  filter: QuestionFilter,
  { techStacks, technologies }: ChipLookups,
): FilterChip[] {
  const chips: FilterChip[] = []

  if (filter.unclassified) {
    chips.push({
      key: 'unclassified',
      group: 'Tech Stack',
      label: 'Chưa phân loại',
      next: { ...filter, unclassified: undefined },
    })
  }

  const resolvers: Record<
    ArrayFilterKey,
    { group: string; label: (value: string | number) => string }
  > = {
    techStackIds: {
      group: 'Tech Stack',
      label: (value) => techStacks.find((item) => item.id === value)?.nameVi ?? `#${value}`,
    },
    technologyIds: {
      group: 'Công nghệ',
      label: (value) => technologies.find((item) => item.id === value)?.nameVi ?? `#${value}`,
    },
    levels: { group: 'Cấp độ', label: (value) => LEVEL_LABELS[value as QuestionLevel] },
    questionTypes: {
      group: 'Loại câu hỏi',
      label: (value) => QUESTION_TYPE_LABELS[value as QuestionType],
    },
    difficulties: {
      group: 'Độ khó',
      label: (value) => DIFFICULTY_LABELS[value as QuestionDifficulty],
    },
  }

  ARRAY_FILTER_KEYS.forEach((key) => {
    const { group, label } = resolvers[key]
    const values = arrayOf(filter, key)
    values.forEach((value) => {
      chips.push({
        key: `${key}:${value}`,
        group,
        label: label(value),
        next: setArrayFilter(
          filter,
          key,
          values.filter((item) => item !== value),
        ),
      })
    })
  })

  return chips
}
