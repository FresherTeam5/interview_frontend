import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCw, ServerCrash } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import QuestionFilterBar from '@/features/question-bank/components/question-filter-bar'
import QuestionTable from '@/features/question-bank/components/question-table'
import QuestionPagination from '@/features/question-bank/components/question-pagination'
import QuestionFormDialog from '@/features/question-bank/components/question-form-dialog'
import QuestionDeleteDialog from '@/features/question-bank/components/question-delete-dialog'
import QuestionVersionConflictDialog from '@/features/question-bank/components/question-version-conflict-dialog'
import { hasActiveFilters } from '@/features/question-bank/filter-utils'
import { useQuestions } from '@/hooks/use-questions'
import { getQuestion } from '@/api/question'
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeactivateQuestion,
} from '@/hooks/use-question-mutations'
import { normalizeError } from '@/api/api-error'
import { DEFAULT_PAGE_SIZE } from '@/constants/question'
import type {
  Question,
  QuestionFilter,
  CreateQuestionPayload,
  UpdateQuestionPayload,
} from '@/types/question'

type DialogState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; questionId: number }
  | { type: 'delete'; question: Question }

export default function QuestionListPage() {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [filter, setFilter] = useState<QuestionFilter>({})
  const [dialog, setDialog] = useState<DialogState>({ type: 'closed' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [conflictQuestionId, setConflictQuestionId] = useState<number | null>(null)
  const [reactivatingId, setReactivatingId] = useState<number | null>(null)

  const { data, isLoading, isFetching, isError, error, refetch } = useQuestions(page, size, filter)
  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()
  const deactivateMutation = useDeactivateQuestion()
  // Mutation riêng để trạng thái pending của form không bị lẫn với thao tác trên bảng.
  const reactivateMutation = useUpdateQuestion()

  const filtersApplied = hasActiveFilters(filter)

  const handleFilterChange = useCallback((next: QuestionFilter) => {
    setFilter(next)
    setPage(0)
  }, [])

  const handleClearFilters = useCallback(() => handleFilterChange({}), [handleFilterChange])

  function handleSizeChange(newSize: number) {
    setSize(newSize)
    setPage(0)
  }

  function openCreate() {
    setFieldErrors({})
    setDialog({ type: 'create' })
  }

  function handleEdit(question: Question) {
    setFieldErrors({})
    setDialog({ type: 'edit', questionId: question.id })
  }

  /** Bản ghi dùng optimistic locking nên phải lấy version mới nhất trước khi PUT. */
  async function handleReactivate(question: Question) {
    setReactivatingId(question.id)
    try {
      const fresh = await getQuestion(question.id)

      await reactivateMutation.mutateAsync({
        id: question.id,
        payload: {
          contentVi: fresh.contentVi,
          contentEn: fresh.contentEn,
          techStackIds: fresh.techStacks.map((item) => item.id),
          technologyIds: fresh.technologies.map((item) => item.id),
          level: fresh.level,
          questionType: fresh.questionType,
          difficulty: fresh.difficulty,
          companyRef: fresh.companyRef,
          active: true,
          version: fresh.version,
        },
      })
      toast.success('Đã kích hoạt lại câu hỏi.')
    } catch (err) {
      const apiError = normalizeError(err)
      toast.error(
        apiError.code === 'QUESTION_VERSION_CONFLICT'
          ? 'Câu hỏi đã được cập nhật bởi người khác. Vui lòng thử lại.'
          : apiError.message,
      )
    } finally {
      setReactivatingId(null)
    }
  }

  function handleFormSubmit(payload: CreateQuestionPayload | UpdateQuestionPayload) {
    setFieldErrors({})

    if (dialog.type === 'create') {
      createMutation.mutate(payload as CreateQuestionPayload, {
        onSuccess: () => {
          toast.success('Tạo câu hỏi thành công!')
          setDialog({ type: 'closed' })
        },
        onError: (err) => {
          const apiError = normalizeError(err)
          if (apiError.fieldErrors) setFieldErrors(apiError.fieldErrors)
          else toast.error(apiError.message)
        },
      })
      return
    }

    if (dialog.type === 'edit') {
      const questionId = dialog.questionId
      updateMutation.mutate(
        { id: questionId, payload: payload as UpdateQuestionPayload },
        {
          onSuccess: () => {
            toast.success('Cập nhật câu hỏi thành công!')
            setDialog({ type: 'closed' })
          },
          onError: (err) => {
            const apiError = normalizeError(err)
            if (apiError.code === 'QUESTION_VERSION_CONFLICT') {
              // Cache còn giữ version cũ, không xóa thì mở lại form vẫn xung đột.
              queryClient.invalidateQueries({ queryKey: ['question', questionId] })
              setConflictQuestionId(questionId)
              setDialog({ type: 'closed' })
            } else if (apiError.fieldErrors) {
              setFieldErrors(apiError.fieldErrors)
            } else {
              toast.error(apiError.message)
            }
          },
        },
      )
    }
  }

  function handleConfirmDeactivate() {
    if (dialog.type !== 'delete') return

    deactivateMutation.mutate(dialog.question.id, {
      onSuccess: () => {
        toast.success('Đã vô hiệu hóa câu hỏi.')
        setDialog({ type: 'closed' })
      },
      onError: (err) => toast.error(normalizeError(err).message),
    })
  }

  function handleConflictReload() {
    const questionId = conflictQuestionId
    setConflictQuestionId(null)
    if (questionId !== null) {
      setFieldErrors({})
      setDialog({ type: 'edit', questionId })
    }
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Ngân hàng câu hỏi</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý câu hỏi phỏng vấn cho hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={isFetching}
            onClick={() => refetch()}
            aria-label="Tải lại danh sách"
          >
            <RefreshCw data-icon="inline-start" className={isFetching ? 'animate-spin' : undefined} />
            Tải lại
          </Button>
          <Button onClick={openCreate}>
            <Plus data-icon="inline-start" />
            Thêm câu hỏi
          </Button>
        </div>
      </div>

      <QuestionFilterBar filter={filter} onChange={handleFilterChange} />

      {isError ? (
        <Empty className="rounded-lg border border-destructive/30 bg-destructive/5">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
              <ServerCrash />
            </EmptyMedia>
            <EmptyTitle>Không tải được danh sách câu hỏi</EmptyTitle>
            <EmptyDescription>{normalizeError(error).message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw data-icon="inline-start" />
              Thử lại
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <QuestionTable
            questions={data?.content ?? []}
            isLoading={isLoading}
            hasActiveFilters={filtersApplied}
            pendingId={reactivatingId}
            skeletonRows={Math.min(size, 5)}
            onEdit={handleEdit}
            onDeactivate={(question) => setDialog({ type: 'delete', question })}
            onReactivate={handleReactivate}
            onClearFilters={handleClearFilters}
            onCreate={openCreate}
          />

          {data && data.totalElements > 0 && (
            <QuestionPagination
              page={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              size={data.size}
              first={data.first}
              last={data.last}
              onPageChange={setPage}
              onSizeChange={handleSizeChange}
            />
          )}
        </>
      )}

      <QuestionFormDialog
        mode={dialog.type === 'edit' ? 'edit' : 'create'}
        editId={dialog.type === 'edit' ? dialog.questionId : null}
        open={dialog.type === 'create' || dialog.type === 'edit'}
        fieldErrors={fieldErrors}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setDialog({ type: 'closed' })}
      />

      <QuestionDeleteDialog
        question={dialog.type === 'delete' ? dialog.question : null}
        open={dialog.type === 'delete'}
        isDeleting={deactivateMutation.isPending}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setDialog({ type: 'closed' })}
      />

      <QuestionVersionConflictDialog
        open={conflictQuestionId !== null}
        onReload={handleConflictReload}
        onCancel={() => setConflictQuestionId(null)}
      />
    </div>
  )
}
