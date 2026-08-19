import { Pencil, Power, PowerOff } from 'lucide-react'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import QuestionStatusBadge from '@/features/question-bank/components/question-status-badge'
import {
  LEVEL_LABELS,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
} from '@/constants/question'
import type { Question } from '@/types/question'

interface QuestionTableProps {
  questions: Question[]
  isLoading?: boolean
  hasActiveFilters?: boolean
  onEdit: (question: Question) => void
  onDeactivate: (question: Question) => void
  onReactivate: (question: Question) => void
}

const DIFFICULTY_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
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

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
    </TableRow>
  ))
}

export default function QuestionTable({
  questions,
  isLoading,
  hasActiveFilters,
  onEdit,
  onDeactivate,
  onReactivate,
}: QuestionTableProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead className="min-w-[250px]">Nội dung</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Công nghệ</TableHead>
              <TableHead>Cấp độ</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Độ khó</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Cập nhật</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonRows />
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  {hasActiveFilters
                    ? 'Không tìm thấy câu hỏi phù hợp với bộ lọc.'
                    : 'Chưa có câu hỏi nào.'}
                </TableCell>
              </TableRow>
            ) : (
              questions.map((q) => (
                <TableRow key={q.id} className={!q.active ? 'opacity-60' : undefined}>
                  <TableCell className="font-mono text-muted-foreground">{q.id}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="line-clamp-2 max-w-[300px] cursor-default text-sm">
                          {q.contentVi}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-sm">
                        <p className="text-sm">{q.contentVi}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-wrap gap-1">
                      {q.techStacks && q.techStacks.length > 0 ? (
                        <>
                          {q.techStacks.slice(0, 2).map((ts) => (
                            <Badge key={ts.id} variant="secondary" className="whitespace-nowrap font-normal">
                              {ts.nameVi}
                            </Badge>
                          ))}
                          {q.techStacks.length > 2 && (
                            <Badge variant="secondary" className="whitespace-nowrap font-normal">
                              +{q.techStacks.length - 2}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-wrap gap-1">
                      {q.technologies && q.technologies.length > 0 ? (
                        <>
                          {q.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech.id} variant="secondary" className="whitespace-nowrap font-normal">
                              {tech.nameVi}
                            </Badge>
                          ))}
                          {q.technologies.length > 3 && (
                            <Badge variant="secondary" className="whitespace-nowrap font-normal">
                              +{q.technologies.length - 3}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{LEVEL_LABELS[q.level]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{QUESTION_TYPE_LABELS[q.questionType]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={DIFFICULTY_VARIANT[q.difficulty] ?? 'outline'}>
                      {DIFFICULTY_LABELS[q.difficulty]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <QuestionStatusBadge active={q.active} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(q.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit(q)}
                            aria-label="Chỉnh sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Chỉnh sửa</TooltipContent>
                      </Tooltip>

                      {q.active ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => onDeactivate(q)}
                              aria-label="Vô hiệu hóa"
                            >
                              <PowerOff className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Vô hiệu hóa</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-success hover:text-success"
                              onClick={() => onReactivate(q)}
                              aria-label="Kích hoạt lại"
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Kích hoạt lại</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
