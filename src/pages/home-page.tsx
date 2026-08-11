import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Trang chủ</h1>

      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>shadcn/ui đã sẵn sàng</CardTitle>
          <CardDescription>Card, Input, Label, Button và Sonner đang hoạt động.</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm">
              Bỏ qua
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-2">
          <Label htmlFor="demo-email">Email</Label>
          <Input id="demo-email" type="email" placeholder="ban@vidu.com" />
        </CardContent>

        <CardFooter>
          <Button onClick={() => toast.success('Toast hoạt động!')}>Thử toast</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
