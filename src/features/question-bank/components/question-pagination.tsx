import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import CommonSelect from '@/components/common-select'
import { PAGE_SIZE_OPTIONS } from '@/constants/question'
import { cn } from '@/lib/utils'

interface QuestionPaginationProps {
  /** Chỉ số trang từ backend, bắt đầu từ 0. */
  page: number
  totalPages: number
  totalElements: number
  size: number
  first: boolean
  last: boolean
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

const SIBLING_COUNT = 1

/** Dãy số trang rút gọn quanh trang hiện tại, dùng chỉ số 1-based để hiển thị. */
function buildPageItems(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const start = Math.max(2, current - SIBLING_COUNT)
  const end = Math.min(total - 1, current + SIBLING_COUNT)

  const items: (number | 'ellipsis')[] = [1]
  if (start > 2) items.push('ellipsis')
  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) items.push(pageNumber)
  if (end < total - 1) items.push('ellipsis')
  items.push(total)

  return items
}

export default function QuestionPagination({
  page,
  totalPages,
  totalElements,
  size,
  first,
  last,
  onPageChange,
  onSizeChange,
}: QuestionPaginationProps) {
  const currentPage = page + 1
  const rangeStart = totalElements === 0 ? 0 : page * size + 1
  const rangeEnd = Math.min(totalElements, (page + 1) * size)

  function goTo(target: number) {
    if (target !== page && target >= 0 && target < totalPages) onPageChange(target)
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Hiển thị{' '}
        <span className="font-medium text-foreground tabular-nums">
          {rangeStart}–{rangeEnd}
        </span>{' '}
        trong <span className="font-medium text-foreground tabular-nums">{totalElements}</span>{' '}
        câu hỏi
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap text-muted-foreground">Số dòng</span>
          <CommonSelect
            className="h-8 w-[72px]"
            value={String(size)}
            onValueChange={(value) => onSizeChange(Number(value))}
            options={PAGE_SIZE_OPTIONS.map((option) => ({
              value: String(option),
              label: String(option),
            }))}
          />
        </div>

        {totalPages > 1 && (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Trước"
                  aria-disabled={first}
                  tabIndex={first ? -1 : undefined}
                  className={cn(first && 'pointer-events-none opacity-50')}
                  onClick={(event) => {
                    event.preventDefault()
                    goTo(page - 1)
                  }}
                />
              </PaginationItem>

              {buildPageItems(currentPage, totalPages).map((item, index) => (
                <PaginationItem key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
                  {item === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={item === currentPage}
                      aria-label={`Trang ${item}`}
                      onClick={(event) => {
                        event.preventDefault()
                        goTo(item - 1)
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Sau"
                  aria-disabled={last}
                  tabIndex={last ? -1 : undefined}
                  className={cn(last && 'pointer-events-none opacity-50')}
                  onClick={(event) => {
                    event.preventDefault()
                    goTo(page + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
