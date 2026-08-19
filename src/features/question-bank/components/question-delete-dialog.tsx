import { PowerOff } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
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
    <AlertDialog open={open} onOpenChange={(next) => !next && !isDeleting && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <PowerOff />
          </AlertDialogMedia>
          <AlertDialogTitle>Vô hiệu hóa câu hỏi #{question?.id}</AlertDialogTitle>
          <AlertDialogDescription>
            Câu hỏi sẽ không còn được dùng cho các phiên phỏng vấn mới. Dữ liệu không bị
            xóa vĩnh viễn và có thể kích hoạt lại bất cứ lúc nào.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {question && (
          <p className="line-clamp-3 rounded-md bg-muted px-3 py-2 text-sm text-foreground">
            {question.contentVi}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={(event) => {
              // Giữ dialog mở tới khi mutation xong để hiển thị trạng thái đang xử lý.
              event.preventDefault()
              onConfirm()
            }}
          >
            {isDeleting && <Spinner data-icon="inline-start" />}
            Vô hiệu hóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
