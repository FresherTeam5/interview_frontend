import { RefreshCw } from 'lucide-react'
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

interface QuestionVersionConflictDialogProps {
  open: boolean
  onReload: () => void
  onCancel: () => void
}

export default function QuestionVersionConflictDialog({
  open,
  onReload,
  onCancel,
}: QuestionVersionConflictDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <RefreshCw />
          </AlertDialogMedia>
          <AlertDialogTitle>Xung đột phiên bản</AlertDialogTitle>
          <AlertDialogDescription>
            Câu hỏi đã được người khác cập nhật trong lúc bạn chỉnh sửa. Tải lại dữ liệu
            mới nhất rồi áp dụng lại thay đổi của bạn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Để sau</AlertDialogCancel>
          <AlertDialogAction onClick={onReload}>Tải lại dữ liệu</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
