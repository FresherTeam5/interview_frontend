import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import QuestionForm from '@/features/question-bank/components/question-form'
import type { QuestionFormValues } from '@/features/question-bank/components/question-form'
import { useQuestion } from '@/hooks/use-question'
import type { CreateQuestionPayload, UpdateQuestionPayload, Question } from '@/types/question'

interface QuestionFormDialogProps {
  mode: 'create' | 'edit'
  editId: number | null
  open: boolean
  fieldErrors?: Record<string, string>
  isSubmitting: boolean
  onSubmit: (payload: CreateQuestionPayload | UpdateQuestionPayload) => void
  onClose: () => void
}

function emptyToNull(value: string): string | null {
  const normalized = value.trim()
  return normalized.length === 0 ? null : normalized
}

function normalizePayload(values: QuestionFormValues) {
  return {
    contentVi: values.contentVi.trim(),
    contentEn: emptyToNull(values.contentEn),
    techStackIds: values.techStackIds,
    technologyIds: values.technologyIds,
    level: values.level,
    questionType: values.questionType,
    difficulty: values.difficulty,
    companyRef: emptyToNull(values.companyRef),
    active: values.active,
    ...(values.version !== undefined ? { version: values.version } : {}),
  }
}

function mapQuestionToForm(q: Question): QuestionFormValues {
  return {
    contentVi: q.contentVi,
    contentEn: q.contentEn ?? '',
    techStackIds: q.techStacks.map((item) => item.id),
    technologyIds: q.technologies.map((item) => item.id),
    level: q.level,
    questionType: q.questionType,
    difficulty: q.difficulty,
    companyRef: q.companyRef ?? '',
    active: q.active,
    version: q.version,
  }
}

export default function QuestionFormDialog({
  mode,
  editId,
  open,
  fieldErrors,
  isSubmitting,
  onSubmit,
  onClose,
}: QuestionFormDialogProps) {
  const { data: question, isLoading: questionLoading } = useQuestion(
    mode === 'edit' ? editId : null,
  )

  const title = mode === 'create' ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'

  function handleFormSubmit(values: QuestionFormValues) {
    const payload = normalizePayload(values)
    onSubmit(payload as CreateQuestionPayload | UpdateQuestionPayload)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {mode === 'edit' && questionLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        ) : (
          <QuestionForm
            key={mode === 'edit' ? `edit-${editId}` : 'create'}
            mode={mode}
            initialValues={
              mode === 'edit' && question ? mapQuestionToForm(question) : undefined
            }
            initialTechStacks={
              mode === 'edit' && question ? question.techStacks : undefined
            }
            initialTechnologies={
              mode === 'edit' && question ? question.technologies : undefined
            }
            fieldErrors={fieldErrors}
            isSubmitting={isSubmitting}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
