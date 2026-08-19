import { Loader2 } from 'lucide-react'
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
import type { Question } from '@/types/question'

interface QuestionDeleteDialogProps {
  question: Question | null
  open: boolean
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function QuestionDeleteDialog({
  question,
  open,
  isDeleting,
  onConfirm,
  onCancel,
}: QuestionDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Vô hiệu hóa câu hỏi</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              Bạn có chắc muốn vô hiệu hóa câu hỏi <strong>#{question?.id}</strong>?
            </span>
            {question && (
              <span className="block rounded-md bg-muted px-3 py-2 text-sm text-foreground line-clamp-3">
                {question.contentVi}
              </span>
            )}
            <span className="block text-xs">
              Câu hỏi sẽ không còn được sử dụng cho các phiên phỏng vấn mới.
              Dữ liệu không bị xóa vĩnh viễn và có thể được kích hoạt lại.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Vô hiệu hóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
