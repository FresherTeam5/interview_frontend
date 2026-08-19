import { useCallback, useState } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import QuestionForm from '@/features/question-bank/components/question-form'
import type { QuestionFormValues } from '@/features/question-bank/components/question-form'
import { useQuestion } from '@/hooks/use-question'
import { normalizeError } from '@/api/api-error'
import type { CreateQuestionPayload, UpdateQuestionPayload, Question } from '@/types/question'

const FORM_ID = 'question-form'

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

function mapQuestionToForm(question: Question): QuestionFormValues {
  return {
    contentVi: question.contentVi,
    contentEn: question.contentEn ?? '',
    techStackIds: question.techStacks.map((item) => item.id),
    technologyIds: question.technologies.map((item) => item.id),
    level: question.level,
    questionType: question.questionType,
    difficulty: question.difficulty,
    companyRef: question.companyRef ?? '',
    active: question.active,
    version: question.version,
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
  const isEdit = mode === 'edit'
  const {
    data: question,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuestion(isEdit ? editId : null)

  const [isDirty, setIsDirty] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)

  const handleDirtyChange = useCallback((dirty: boolean) => setIsDirty(dirty), [])

  // Form bị unmount khi dialog đóng nên cờ dirty phải được dọn cho lần mở sau.
  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    setIsDirty(false)
  }

  function requestClose() {
    if (isSubmitting) return
    if (isDirty) {
      setDiscardOpen(true)
      return
    }
    onClose()
  }

  function confirmDiscard() {
    setDiscardOpen(false)
    setIsDirty(false)
    onClose()
  }

  const isFormReady = !isEdit || (!isLoading && !isError && !!question)

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !next && requestClose()}>
        <DialogContent
          className="max-h-[calc(100vh-4rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 p-0 sm:max-w-2xl"
          onInteractOutside={(event) => isSubmitting && event.preventDefault()}
        >
          <DialogHeader className="border-b px-6 py-4 pr-14">
            <DialogTitle>{isEdit ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? `Cập nhật nội dung và phân loại của câu hỏi #${editId}.`
                : 'Điền thông tin để thêm câu hỏi vào ngân hàng câu hỏi.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea>
            <div className="px-6 py-5">
              {isEdit && isLoading && (
                <div className="space-y-5">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              )}

              {isEdit && isError && (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <AlertCircle className="size-8 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    {normalizeError(error).message}
                  </p>
                  <Button variant="outline" onClick={() => refetch()}>
                    <RefreshCw data-icon="inline-start" />
                    Thử lại
                  </Button>
                </div>
              )}

              {isFormReady && (
                <QuestionForm
                  key={isEdit ? `edit-${editId}` : 'create'}
                  formId={FORM_ID}
                  initialValues={question && isEdit ? mapQuestionToForm(question) : undefined}
                  initialTechStacks={isEdit ? question?.techStacks : undefined}
                  initialTechnologies={isEdit ? question?.technologies : undefined}
                  fieldErrors={fieldErrors}
                  isSubmitting={isSubmitting}
                  onDirtyChange={handleDirtyChange}
                  onSubmit={(values) =>
                    onSubmit(normalizePayload(values) as CreateQuestionPayload | UpdateQuestionPayload)
                  }
                />
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={requestClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting || !isFormReady}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {isEdit ? 'Lưu thay đổi' : 'Tạo câu hỏi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bỏ các thay đổi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có thay đổi chưa được lưu. Đóng biểu mẫu sẽ làm mất những thay đổi này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDiscard}>
              Bỏ thay đổi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
