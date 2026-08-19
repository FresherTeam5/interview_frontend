import { useState, useCallback } from 'react'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import QuestionFilterBar from '@/features/question-bank/components/question-filter-bar'
import QuestionTable from '@/features/question-bank/components/question-table'
import QuestionPagination from '@/features/question-bank/components/question-pagination'
import QuestionFormDialog from '@/features/question-bank/components/question-form-dialog'
import QuestionDeleteDialog from '@/features/question-bank/components/question-delete-dialog'
import QuestionVersionConflictDialog from '@/features/question-bank/components/question-version-conflict-dialog'
import { useQuestions } from '@/hooks/use-questions'
import { getQuestion } from '@/api/question'
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeactivateQuestion,
} from '@/hooks/use-question-mutations'
import { normalizeError, isApiError } from '@/api/api-error'
import { DEFAULT_PAGE_SIZE } from '@/constants/question'
import type { Question, QuestionFilter, CreateQuestionPayload, UpdateQuestionPayload } from '@/types/question'

type DialogState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; questionId: number }
  | { type: 'delete'; question: Question }

export default function QuestionListPage() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [filter, setFilter] = useState<QuestionFilter>({})
  const [dialog, setDialog] = useState<DialogState>({ type: 'closed' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [conflictOpen, setConflictOpen] = useState(false)
  const [conflictQuestionId, setConflictQuestionId] = useState<number | null>(null)

  const { data, isLoading, isError, error, refetch } = useQuestions(page, size, filter)
  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()
  const deactivateMutation = useDeactivateQuestion()

  const hasActiveFilters =
    !!filter.keyword ||
    filter.active !== undefined ||
    (filter.techStackIds && filter.techStackIds.length > 0) ||
    filter.unclassified !== undefined ||
    (filter.technologyIds && filter.technologyIds.length > 0) ||
    (filter.levels && filter.levels.length > 0) ||
    (filter.questionTypes && filter.questionTypes.length > 0) ||
    (filter.difficulties && filter.difficulties.length > 0)

  const handleFilterChange = useCallback((newFilter: QuestionFilter) => {
    setFilter(newFilter)
    setPage(0)
  }, [])

  function handleSizeChange(newSize: number) {
    setSize(newSize)
    setPage(0)
  }

  function handleEdit(question: Question) {
    setFieldErrors({})
    setDialog({ type: 'edit', questionId: question.id })
  }

  function handleDeactivate(question: Question) {
    setDialog({ type: 'delete', question })
  }

  async function handleReactivate(question: Question) {
    try {
      // GET latest version first, then PUT with active=true
      const fresh = await getQuestion(question.id)

      await updateMutation.mutateAsync({
        id: question.id,
        payload: {
          contentVi: fresh.contentVi,
          contentEn: fresh.contentEn,
          techStackIds: fresh.techStacks.map(t => t.id),
          technologyIds: fresh.technologies.map(t => t.id),
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
      const apiErr = normalizeError(err)
      if (apiErr.code === 'QUESTION_VERSION_CONFLICT') {
        toast.error('Câu hỏi đã được cập nhật bởi người khác. Vui lòng thử lại.')
      } else {
        toast.error(apiErr.message)
      }
    }
  }

  function handleFormSubmit(
    payload: CreateQuestionPayload | UpdateQuestionPayload,
  ) {
    setFieldErrors({})

    if (dialog.type === 'create') {
      createMutation.mutate(payload as CreateQuestionPayload, {
        onSuccess: () => {
          toast.success('Tạo câu hỏi thành công!')
          setDialog({ type: 'closed' })
        },
        onError: (err) => {
          const apiErr = normalizeError(err)
          if (apiErr.fieldErrors) {
            setFieldErrors(apiErr.fieldErrors)
          } else {
            toast.error(apiErr.message)
          }
        },
      })
    } else if (dialog.type === 'edit') {
      const updatePayload = payload as unknown as UpdateQuestionPayload
      updateMutation.mutate(
        { id: dialog.questionId, payload: updatePayload },
        {
          onSuccess: () => {
            toast.success('Cập nhật câu hỏi thành công!')
            setDialog({ type: 'closed' })
          },
          onError: (err) => {
            const apiErr = normalizeError(err)
            if (apiErr.code === 'QUESTION_VERSION_CONFLICT') {
              setConflictQuestionId(dialog.questionId)
              setConflictOpen(true)
            } else if (apiErr.fieldErrors) {
              setFieldErrors(apiErr.fieldErrors)
            } else {
              toast.error(apiErr.message)
            }
          },
        },
      )
    }
  }

  async function handleConfirmDeactivate() {
    if (dialog.type !== 'delete') return

    deactivateMutation.mutate(dialog.question.id, {
      onSuccess: () => {
        toast.success('Đã vô hiệu hóa câu hỏi.')
        setDialog({ type: 'closed' })
      },
      onError: (err) => {
        const apiErr = normalizeError(err)
        toast.error(apiErr.message)
      },
    })
  }

  function handleConflictReload() {
    setConflictOpen(false)
    // Re-open edit dialog to refetch latest data
    if (conflictQuestionId !== null) {
      setFieldErrors({})
      setDialog({ type: 'edit', questionId: conflictQuestionId })
    }
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ngân hàng câu hỏi</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý câu hỏi phỏng vấn cho hệ thống
          </p>
        </div>
        <Button onClick={() => { setFieldErrors({}); setDialog({ type: 'create' }) }}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm câu hỏi
        </Button>
      </div>

      {/* Filter bar */}
      <QuestionFilterBar filter={filter} onChange={handleFilterChange} />

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Không tải được danh sách câu hỏi</p>
            <p className="text-sm text-muted-foreground">
              {isApiError(error) ? error.message : 'Đã có lỗi xảy ra.'}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        </div>
      )}

      {/* Table */}
      {!isError && (
        <>
          <QuestionTable
            questions={data?.content ?? []}
            isLoading={isLoading}
            hasActiveFilters={hasActiveFilters}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivate}
          />

          {data && (
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

      {/* Create/Edit Dialog */}
      <QuestionFormDialog
        mode={dialog.type === 'edit' ? 'edit' : 'create'}
        editId={dialog.type === 'edit' ? dialog.questionId : null}
        open={dialog.type === 'create' || dialog.type === 'edit'}
        fieldErrors={fieldErrors}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setDialog({ type: 'closed' })}
      />

      {/* Delete Dialog */}
      <QuestionDeleteDialog
        question={dialog.type === 'delete' ? dialog.question : null}
        open={dialog.type === 'delete'}
        isDeleting={deactivateMutation.isPending}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setDialog({ type: 'closed' })}
      />

      {/* Version Conflict Dialog */}
      <QuestionVersionConflictDialog
        open={conflictOpen}
        onReload={handleConflictReload}
        onCancel={() => setConflictOpen(false)}
      />
    </div>
  )
}
