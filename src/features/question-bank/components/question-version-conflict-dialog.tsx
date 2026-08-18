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
    <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xung đột phiên bản</AlertDialogTitle>
          <AlertDialogDescription>
            Câu hỏi đã được người khác cập nhật trong lúc bạn chỉnh sửa.
            Vui lòng tải dữ liệu mới nhất và kiểm tra lại thay đổi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onReload}>
            Tải lại dữ liệu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
