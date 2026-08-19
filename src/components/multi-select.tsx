import { useMemo, useState } from 'react'
import { ChevronsUpDown, ListFilter, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

export interface MultiSelectOption<TValue extends string | number = string> {
  value: TValue
  label: string
  /** Nhóm hiển thị trong danh sách, sắp xếp theo `groupOrder`. */
  group?: string
  /** Ghi chú ngắn phía sau nhãn, ví dụ "đã vô hiệu". */
  note?: string
  /** Từ khóa phụ để tìm kiếm (mã code, tên tiếng Anh...). */
  keywords?: string[]
  disabled?: boolean
}

interface MultiSelectProps<TValue extends string | number> {
  options: MultiSelectOption<TValue>[]
  value: TValue[]
  onChange: (value: TValue[]) => void
  /**
   * `field` — ô chọn chiếm trọn chiều ngang dùng trong form.
   * `facet` — nút lọc gọn dùng trên thanh bộ lọc.
   */
  variant?: 'field' | 'facet'
  /** Nhãn luôn hiển thị trên trigger của biến thể `facet`. */
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  groupOrder?: string[]
  /** Số nhãn hiển thị trực tiếp trên trigger trước khi gộp thành "+N". */
  maxVisible?: number
  disabled?: boolean
  loading?: boolean
  invalid?: boolean
  id?: string
  className?: string
  contentClassName?: string
}

const TRIGGER_CLASS = {
  field: 'h-auto min-h-9 w-full justify-between gap-2 px-3 py-1.5 font-normal',
  facet: 'h-9 border-dashed',
} as const

export default function MultiSelect<TValue extends string | number>({
  options,
  value,
  onChange,
  variant = 'field',
  label,
  placeholder = 'Chọn...',
  searchPlaceholder = 'Tìm kiếm...',
  emptyText = 'Không có kết quả.',
  groupOrder,
  maxVisible = 3,
  disabled,
  loading,
  invalid,
  id,
  className,
  contentClassName,
}: MultiSelectProps<TValue>) {
  const [open, setOpen] = useState(false)

  const selectedSet = useMemo(() => new Set<TValue>(value), [value])
  const selectedOptions = useMemo(
    () => options.filter((option) => selectedSet.has(option.value)),
    [options, selectedSet],
  )

  // Giữ nguyên thứ tự nhóm do người gọi quy định, nhóm lạ đẩy xuống cuối.
  const groups = useMemo(() => {
    const map = new Map<string, MultiSelectOption<TValue>[]>()
    options.forEach((option) => {
      const key = option.group ?? ''
      const bucket = map.get(key)
      if (bucket) bucket.push(option)
      else map.set(key, [option])
    })

    if (!groupOrder) return [...map.entries()]

    return [...map.entries()].sort(
      ([a], [b]) =>
        (groupOrder.indexOf(a) === -1 ? groupOrder.length : groupOrder.indexOf(a)) -
        (groupOrder.indexOf(b) === -1 ? groupOrder.length : groupOrder.indexOf(b)),
    )
  }, [options, groupOrder])

  function toggle(optionValue: TValue) {
    onChange(
      selectedSet.has(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    )
  }

  const visible = selectedOptions.slice(0, maxVisible)
  const hiddenCount = selectedOptions.length - visible.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          disabled={disabled}
          className={cn(TRIGGER_CLASS[variant], className)}
        >
          {variant === 'facet' ? (
            <>
              <ListFilter data-icon="inline-start" />
              <span>{label}</span>
              {/* Tên các mục đã chọn hiển thị ở hàng chip bên ngoài nên đây chỉ cần số lượng. */}
              {selectedOptions.length > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-1 h-4" />
                  <Badge variant="secondary">{selectedOptions.length}</Badge>
                </>
              )}
            </>
          ) : (
            <>
              {selectedOptions.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <span className="flex flex-wrap items-center gap-1">
                  {visible.map((option) => (
                    <Badge key={option.value} variant="secondary" className="font-normal">
                      {option.label}
                    </Badge>
                  ))}
                  {hiddenCount > 0 && (
                    <Badge variant="outline" className="font-normal">
                      +{hiddenCount}
                    </Badge>
                  )}
                </span>
              )}
              <ChevronsUpDown className="ml-auto shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cn('w-(--radix-popover-trigger-width) min-w-64 p-0', contentClassName)}
      >
        <Command loop>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Spinner />
                Đang tải...
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                {groups.map(([group, groupOptions]) => (
                  <CommandGroup key={group} heading={group || undefined}>
                    {groupOptions.map((option) => {
                      const selected = selectedSet.has(option.value)
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          keywords={option.keywords}
                          data-checked={selected}
                          // Không cho bỏ chọn ngầm mục đã chọn khi option bị vô hiệu
                          disabled={option.disabled && !selected}
                          onSelect={() => toggle(option.value)}
                        >
                          <span className="truncate">{option.label}</span>
                          {option.note && (
                            <span className="text-xs text-muted-foreground">
                              ({option.note})
                            </span>
                          )}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>

          {selectedOptions.length > 0 && (
            <>
              <CommandSeparator />
              <div className="p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => onChange([])}
                >
                  <X data-icon="inline-start" />
                  Bỏ chọn tất cả ({selectedOptions.length})
                </Button>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
