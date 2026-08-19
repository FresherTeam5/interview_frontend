import { useEffect, useRef, useState } from 'react'
import { FolderX, SearchIcon, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import CommonSelect from '@/components/common-select'
import MultiSelect from '@/components/multi-select'
import { setArrayFilter, buildFilterChips, countActiveFilters } from '@/features/question-bank/filter-utils'
import { useTechStacks } from '@/hooks/use-tech-stacks'
import { useTechnologies } from '@/hooks/use-technologies'
import {
  LEVEL_LABELS,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
  QUESTION_LEVELS,
  QUESTION_TYPES,
  QUESTION_DIFFICULTIES,
  ACTIVE_STATUS_OPTIONS,
  SEARCH_DEBOUNCE_MS,
} from '@/constants/question'
import { TECHNOLOGY_TYPE_LABELS, TECHNOLOGY_TYPE_ORDER } from '@/constants/technology'
import type { QuestionFilter } from '@/types/question'

interface QuestionFilterBarProps {
  filter: QuestionFilter
  onChange: (filter: QuestionFilter) => void
}

export default function QuestionFilterBar({ filter, onChange }: QuestionFilterBarProps) {
  const { data: techStacks = [], isLoading: techStacksLoading } = useTechStacks()
  const { data: technologies = [], isLoading: technologiesLoading } = useTechnologies(true)

  const [keyword, setKeyword] = useState(filter.keyword ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function cancelPendingSearch() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
  }

  useEffect(() => cancelPendingSearch, [])

  function handleKeywordChange(value: string) {
    setKeyword(value)
    cancelPendingSearch()

    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim()
      if (trimmed !== (filter.keyword ?? '')) {
        onChange({ ...filter, keyword: trimmed || undefined })
      }
    }, SEARCH_DEBOUNCE_MS)
  }

  function handleClearKeyword() {
    cancelPendingSearch()
    setKeyword('')
    if (filter.keyword) onChange({ ...filter, keyword: undefined })
  }

  function handleActiveChange(value: string) {
    onChange({ ...filter, active: value === 'all' ? undefined : value === 'true' })
  }

  function handleUnclassifiedToggle() {
    const next = !filter.unclassified
    onChange({
      ...filter,
      unclassified: next || undefined,
      // Hai tiêu chí này loại trừ nhau: đã "chưa phân loại" thì không lọc theo stack cụ thể.
      techStackIds: next ? undefined : filter.techStackIds,
    })
  }

  function handleClearAll() {
    cancelPendingSearch()
    setKeyword('')
    onChange({})
  }

  const chips = buildFilterChips(filter, { techStacks, technologies })
  const activeCount = countActiveFilters(filter)

  return (
    <div className="space-y-3 rounded-lg border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="min-w-56 max-w-sm flex-1">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="question-search"
            placeholder="Tìm theo nội dung câu hỏi..."
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
          />
          {keyword && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Xóa từ khóa"
                onClick={handleClearKeyword}
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <CommonSelect
          id="filter-status"
          className="h-9 w-[150px]"
          placeholder="Trạng thái"
          value={filter.active !== undefined ? String(filter.active) : 'all'}
          onValueChange={handleActiveChange}
          options={[...ACTIVE_STATUS_OPTIONS]}
        />

        <Separator orientation="vertical" className="mx-1 h-6 max-sm:hidden" />

        <MultiSelect
          variant="facet"
          label="Tech Stack"
          disabled={filter.unclassified}
          loading={techStacksLoading}
          searchPlaceholder="Tìm tech stack..."
          emptyText="Không có tech stack nào."
          options={techStacks.map((item) => ({
            value: item.id,
            label: item.nameVi,
            keywords: [item.code, item.nameEn],
          }))}
          value={filter.techStackIds ?? []}
          onChange={(values) => onChange(setArrayFilter(filter, 'techStackIds', values))}
        />

        <MultiSelect
          variant="facet"
          label="Công nghệ"
          loading={technologiesLoading}
          searchPlaceholder="Tìm công nghệ..."
          emptyText="Không có công nghệ nào."
          groupOrder={TECHNOLOGY_TYPE_ORDER.map((type) => TECHNOLOGY_TYPE_LABELS[type])}
          options={technologies.map((item) => ({
            value: item.id,
            label: item.nameVi,
            group: TECHNOLOGY_TYPE_LABELS[item.type],
            keywords: [item.code, item.nameEn],
          }))}
          value={filter.technologyIds ?? []}
          onChange={(values) => onChange(setArrayFilter(filter, 'technologyIds', values))}
        />

        <MultiSelect
          variant="facet"
          label="Cấp độ"
          options={QUESTION_LEVELS.map((level) => ({ value: level, label: LEVEL_LABELS[level] }))}
          value={filter.levels ?? []}
          onChange={(values) => onChange(setArrayFilter(filter, 'levels', values))}
        />

        <MultiSelect
          variant="facet"
          label="Loại"
          options={QUESTION_TYPES.map((type) => ({
            value: type,
            label: QUESTION_TYPE_LABELS[type],
          }))}
          value={filter.questionTypes ?? []}
          onChange={(values) => onChange(setArrayFilter(filter, 'questionTypes', values))}
        />

        <MultiSelect
          variant="facet"
          label="Độ khó"
          options={QUESTION_DIFFICULTIES.map((difficulty) => ({
            value: difficulty,
            label: DIFFICULTY_LABELS[difficulty],
          }))}
          value={filter.difficulties ?? []}
          onChange={(values) => onChange(setArrayFilter(filter, 'difficulties', values))}
        />

        <Button
          variant={filter.unclassified ? 'secondary' : 'outline'}
          className={filter.unclassified ? undefined : 'border-dashed'}
          aria-pressed={filter.unclassified ?? false}
          onClick={handleUnclassifiedToggle}
        >
          <FolderX data-icon="inline-start" />
          Chưa phân loại
        </Button>

        {activeCount > 0 && (
          <Button variant="ghost" className="ml-auto" onClick={handleClearAll}>
            <X data-icon="inline-start" />
            Xóa lọc ({activeCount})
          </Button>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t pt-3">
          {chips.map((chip) => (
            <Badge key={chip.key} variant="secondary" className="gap-1 pr-1 font-normal">
              <span className="text-muted-foreground">{chip.group}:</span>
              {chip.label}
              <button
                type="button"
                aria-label={`Bỏ lọc ${chip.group}: ${chip.label}`}
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                onClick={() => onChange(chip.next)}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
