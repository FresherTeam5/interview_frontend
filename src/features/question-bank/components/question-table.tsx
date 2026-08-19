import { FileQuestion, Pencil, Power, PowerOff, SearchX, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import QuestionStatusBadge from '@/features/question-bank/components/question-status-badge'
import {
  LEVEL_LABELS,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
} from '@/constants/question'
import type { Question, QuestionDifficulty } from '@/types/question'

interface QuestionTableProps {
  questions: Question[]
  isLoading?: boolean
  hasActiveFilters?: boolean
  /** Câu hỏi đang chờ đổi trạng thái, dùng để khóa thao tác trên đúng dòng đó. */
  pendingId?: number | null
  skeletonRows?: number
  onEdit: (question: Question) => void
  onDeactivate: (question: Question) => void
  onReactivate: (question: Question) => void
  onClearFilters: () => void
  onCreate: () => void
}

const COLUMN_COUNT = 10

const DIFFICULTY_VARIANT: Record<QuestionDifficulty, 'secondary' | 'default' | 'destructive'> = {
  EASY: 'secondary',
  MEDIUM: 'default',
  HARD: 'destructive',
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** Hiển thị tối đa `limit` thẻ, phần còn lại gộp vào "+N" kèm tooltip liệt kê đủ. */
function TagCell({ items, limit }: { items: { id: number; nameVi: string }[]; limit: number }) {
  if (items.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }

  const visible = items.slice(0, limit)
  const hidden = items.slice(limit)

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((item) => (
        <Badge key={item.id} variant="secondary" className="font-normal">
          {item.nameVi}
        </Badge>
      ))}
      {hidden.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="cursor-default font-normal">
              +{hidden.length}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{hidden.map((item) => item.nameVi).join(', ')}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

function SkeletonRows({ rows }: { rows: number }) {
  return Array.from({ length: rows }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: COLUMN_COUNT }).map((__, cell) => (
        <TableCell key={cell}>
          <Skeleton className="h-4 w-full min-w-8" />
        </TableCell>
      ))}
    </TableRow>
  ))
}

export default function QuestionTable({
  questions,
  isLoading,
  hasActiveFilters,
  pendingId,
  skeletonRows = 5,
  onEdit,
  onDeactivate,
  onReactivate,
  onClearFilters,
  onCreate,
}: QuestionTableProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-14">ID</TableHead>
              <TableHead className="min-w-64">Nội dung</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Công nghệ</TableHead>
              <TableHead>Cấp độ</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Độ khó</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Cập nhật</TableHead>
              <TableHead className="w-24 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonRows rows={skeletonRows} />
            ) : questions.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLUMN_COUNT} className="p-0">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        {hasActiveFilters ? <SearchX /> : <FileQuestion />}
                      </EmptyMedia>
                      <EmptyTitle>
                        {hasActiveFilters ? 'Không có kết quả' : 'Chưa có câu hỏi nào'}
                      </EmptyTitle>
                      <EmptyDescription>
                        {hasActiveFilters
                          ? 'Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại. Thử nới lỏng điều kiện lọc.'
                          : 'Bắt đầu bằng cách thêm câu hỏi đầu tiên vào ngân hàng câu hỏi.'}
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      {hasActiveFilters ? (
                        <Button variant="outline" onClick={onClearFilters}>
                          <X data-icon="inline-start" />
                          Xóa bộ lọc
                        </Button>
                      ) : (
                        <Button onClick={onCreate}>Thêm câu hỏi</Button>
                      )}
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => {
                const isPending = pendingId === question.id

                return (
                  <TableRow
                    key={question.id}
                    className={question.active ? undefined : 'opacity-60'}
                  >
                    <TableCell className="align-top font-mono text-muted-foreground">
                      {question.id}
                    </TableCell>
                    <TableCell className="align-top">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="line-clamp-2 max-w-80 cursor-default text-sm whitespace-normal">
                            {question.contentVi}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-sm">
                          {question.contentVi}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="align-top">
                      <TagCell items={question.techStacks ?? []} limit={2} />
                    </TableCell>
                    <TableCell className="align-top">
                      <TagCell items={question.technologies ?? []} limit={2} />
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant="outline">{LEVEL_LABELS[question.level]}</Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant="outline">
                        {QUESTION_TYPE_LABELS[question.questionType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant={DIFFICULTY_VARIANT[question.difficulty]}>
                        {DIFFICULTY_LABELS[question.difficulty]}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <QuestionStatusBadge active={question.active} />
                    </TableCell>
                    <TableCell className="align-top text-sm text-muted-foreground">
                      {formatDate(question.updatedAt)}
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              disabled={isPending}
                              onClick={() => onEdit(question)}
                              aria-label={`Chỉnh sửa câu hỏi ${question.id}`}
                            >
                              <Pencil />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Chỉnh sửa</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              disabled={isPending}
                              className={
                                question.active
                                  ? 'text-destructive hover:text-destructive'
                                  : 'text-success hover:text-success'
                              }
                              onClick={() =>
                                question.active
                                  ? onDeactivate(question)
                                  : onReactivate(question)
                              }
                              aria-label={
                                question.active
                                  ? `Vô hiệu hóa câu hỏi ${question.id}`
                                  : `Kích hoạt lại câu hỏi ${question.id}`
                              }
                            >
                              {isPending ? (
                                <Spinner />
                              ) : question.active ? (
                                <PowerOff />
                              ) : (
                                <Power />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {question.active ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
