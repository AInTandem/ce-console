import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, User, Key, Settings } from 'lucide-react';

interface StepSummaryProps {
  adminUsername: string;
  systemName: string;
  onConfirm: () => void;
  isLoading?: boolean;
  error?: string;
}

export function StepSummary({
  adminUsername,
  systemName,
  onConfirm,
  isLoading = false,
  error
}: StepSummaryProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="size-5" />
          確認並完成設定
        </CardTitle>
        <CardDescription>
          請確認您的設定資訊無誤
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="size-4" />
              管理員帳號
            </div>
            <div className="pl-6">
              <div className="text-sm">用戶名：</div>
              <div className="text-lg font-semibold">{adminUsername}</div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Key className="size-4" />
              JWT 金鑰
            </div>
            <div className="pl-6">
              <div className="text-sm">狀態：</div>
              <div className="text-lg font-semibold">已自動生成</div>
              <div className="text-xs text-muted-foreground mt-1">
                包含 256 位元 JWT Secret 和 Refresh Token Secret
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Settings className="size-4" />
              系統設定
            </div>
            <div className="pl-6">
              <div className="text-sm">系統名稱：</div>
              <div className="text-lg font-semibold">{systemName}</div>
            </div>
          </div>
        </div>

        <Alert>
          <CheckCircle2 className="size-4" />
          <AlertTitle>完成後的變更</AlertTitle>
          <AlertDescription className="text-sm">
            完成設定後，您將能夠：
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>使用管理員帳號登入系統</li>
              <li>存取完整的系統功能</li>
              <li>管理其他使用者和權限</li>
            </ul>
            <br />
            <strong>注意：</strong>這些設定可以透過系統管理介面在之後進行修改。
          </AlertDescription>
        </Alert>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={onConfirm} className="flex-1" disabled={isLoading}>
            {isLoading ? '處理中...' : '完成設定'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
