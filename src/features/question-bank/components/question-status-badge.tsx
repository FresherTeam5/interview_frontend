import { cn } from '@/lib/utils'

interface QuestionStatusBadgeProps {
  active: boolean
  className?: string
}

export default function QuestionStatusBadge({ active, className }: QuestionStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        active
          ? 'bg-success/10 text-success'
          : 'bg-muted text-muted-foreground',
        className,
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          active ? 'bg-success' : 'bg-muted-foreground/50',
        )}
      />
      {active ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
    </span>
  )
}
