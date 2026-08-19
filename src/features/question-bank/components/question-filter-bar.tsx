import { useState, useRef, useMemo } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import CommonSelect from '@/components/common-select'
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
import type { QuestionFilter, QuestionLevel, QuestionType, QuestionDifficulty } from '@/types/question'

interface QuestionFilterBarProps {
  filter: QuestionFilter
  onChange: (filter: QuestionFilter) => void
}

function MultiSelectSubMenu({
  title,
  options,
  selectedValues,
  onChange,
  searchable = false,
}: {
  title: string
  options: { value: string; label: string }[]
  selectedValues: string[]
  onChange: (value: string, checked: boolean) => void
  searchable?: boolean
}) {
  const [search, setSearch] = useState('')
  
  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return options
    const lower = search.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(lower))
  }, [options, search, searchable])

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {title}
        {selectedValues.length > 0 && (
          <Badge variant="secondary" className="ml-auto rounded-sm px-1 font-normal text-xs h-4 flex items-center justify-center">
            {selectedValues.length}
          </Badge>
        )}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-[220px]">
        {searchable && (
          <div className="p-2">
            <Input 
              placeholder="Tìm kiếm..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()} // Prevent closing on space
              className="h-8"
            />
          </div>
        )}
        <div className="max-h-[300px] overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <p className="p-2 text-sm text-muted-foreground text-center">Không tìm thấy.</p>
          ) : (
            filteredOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => onChange(option.value, checked)}
                onSelect={(e) => e.preventDefault()} // Keep open on select
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </div>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

export default function QuestionFilterBar({ filter, onChange }: QuestionFilterBarProps) {
  const { data: techStacks = [] } = useTechStacks()
  const { data: technologies = [] } = useTechnologies(true)

  const [keyword, setKeyword] = useState(filter.keyword ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleKeywordChange(value: string) {
    setKeyword(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim()
      if (trimmed !== (filter.keyword ?? '')) {
        onChange({ ...filter, keyword: trimmed || undefined })
      }
    }, SEARCH_DEBOUNCE_MS)
  }

  function toggleArrayFilter<T extends string | number>(
    key: 'techStackIds' | 'technologyIds' | 'levels' | 'questionTypes' | 'difficulties',
    value: T,
    checked: boolean
  ) {
    const current = (filter[key] as T[]) ?? []
    let next: T[]
    if (checked) {
      next = [...current, value]
    } else {
      next = current.filter((v) => v !== value)
    }
    
    onChange({
      ...filter,
      [key]: next.length > 0 ? next : undefined,
      // If we are filtering by specific tech stacks, we shouldn't be searching for "unclassified"
      ...(key === 'techStackIds' && next.length > 0 ? { unclassified: undefined } : {})
    })
  }

  function handleUnclassifiedChange(checked: boolean) {
    onChange({
      ...filter,
      unclassified: checked ? true : undefined,
      techStackIds: checked ? undefined : filter.techStackIds,
    })
  }

  function handleActiveChange(value: string) {
    const next = { ...filter }
    if (value === 'all') {
      delete next.active
    } else {
      next.active = value === 'true'
    }
    onChange(next)
  }

  function handleClearAll() {
    setKeyword('')
    onChange({})
  }

  const hasFilters =
    !!filter.keyword ||
    filter.active !== undefined ||
    (filter.techStackIds && filter.techStackIds.length > 0) ||
    filter.unclassified !== undefined ||
    (filter.technologyIds && filter.technologyIds.length > 0) ||
    (filter.levels && filter.levels.length > 0) ||
    (filter.questionTypes && filter.questionTypes.length > 0) ||
    (filter.difficulties && filter.difficulties.length > 0)

  // Count active sub-filters
  const activeFilterCount = 
    (filter.techStackIds?.length ?? 0) +
    (filter.unclassified ? 1 : 0) +
    (filter.technologyIds?.length ?? 0) +
    (filter.levels?.length ?? 0) +
    (filter.questionTypes?.length ?? 0) +
    (filter.difficulties?.length ?? 0)

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Keyword search */}
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="question-search"
            placeholder="Tìm kiếm theo nội dung..."
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Active status */}
        <CommonSelect
          id="filter-status"
          className="w-[150px] h-9"
          placeholder="Trạng thái"
          value={filter.active !== undefined ? String(filter.active) : 'all'}
          onValueChange={handleActiveChange}
          options={[...ACTIVE_STATUS_OPTIONS]}
        />

        {/* Main Filter Dropdown */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-dashed h-9">
              <Filter className="mr-2 h-4 w-4" />
              Lọc dữ liệu
              {activeFilterCount > 0 && (
                <>
                  <span className="mx-2 h-4 w-[1px] bg-border" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {activeFilterCount}
                  </Badge>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuLabel>Thuộc tính câu hỏi</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Tech Stack Sub-menu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Tech Stack
                {((filter.techStackIds?.length ?? 0) > 0 || filter.unclassified) && (
                  <Badge variant="secondary" className="ml-auto rounded-sm px-1 font-normal text-xs h-4 flex items-center justify-center">
                    {filter.unclassified ? '1' : filter.techStackIds?.length}
                  </Badge>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-[220px]">
                <DropdownMenuCheckboxItem
                  checked={!!filter.unclassified}
                  onCheckedChange={handleUnclassifiedChange}
                  onSelect={(e) => e.preventDefault()}
                >
                  Chưa phân loại
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Tech Stacks</DropdownMenuLabel>
                <div className="max-h-[250px] overflow-y-auto">
                  {techStacks.map((ts) => (
                    <DropdownMenuCheckboxItem
                      key={ts.id}
                      checked={filter.techStackIds?.includes(ts.id) ?? false}
                      onCheckedChange={(checked) => toggleArrayFilter('techStackIds', ts.id, checked)}
                      onSelect={(e) => e.preventDefault()}
                      disabled={filter.unclassified}
                    >
                      {ts.nameVi}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Technology Sub-menu */}
            <MultiSelectSubMenu
              title="Công nghệ"
              searchable
              options={technologies.map(t => ({ value: String(t.id), label: t.nameVi }))}
              selectedValues={filter.technologyIds?.map(String) ?? []}
              onChange={(val, checked) => toggleArrayFilter('technologyIds', Number(val), checked)}
            />

            {/* Level Sub-menu */}
            <MultiSelectSubMenu
              title="Cấp độ"
              options={QUESTION_LEVELS.map(l => ({ value: l, label: LEVEL_LABELS[l] }))}
              selectedValues={filter.levels ?? []}
              onChange={(val, checked) => toggleArrayFilter('levels', val as QuestionLevel, checked)}
            />

            {/* Question Type Sub-menu */}
            <MultiSelectSubMenu
              title="Loại câu hỏi"
              options={QUESTION_TYPES.map(t => ({ value: t, label: QUESTION_TYPE_LABELS[t] }))}
              selectedValues={filter.questionTypes ?? []}
              onChange={(val, checked) => toggleArrayFilter('questionTypes', val as QuestionType, checked)}
            />

            {/* Difficulty Sub-menu */}
            <MultiSelectSubMenu
              title="Độ khó"
              options={QUESTION_DIFFICULTIES.map(d => ({ value: d, label: DIFFICULTY_LABELS[d] }))}
              selectedValues={filter.difficulties ?? []}
              onChange={(val, checked) => toggleArrayFilter('difficulties', val as QuestionDifficulty, checked)}
            />

          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear all */}
        {hasFilters && (
          <Button
            variant="ghost"
            className="h-9 px-3 text-muted-foreground"
            onClick={handleClearAll}
          >
            <X className="mr-2 h-4 w-4" />
            Xóa lọc
          </Button>
        )}
      </div>
    </TooltipProvider>
  )
}
