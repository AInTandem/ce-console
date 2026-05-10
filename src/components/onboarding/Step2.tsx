import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Key } from 'lucide-react';

interface Step2Props {
  onConfirm: () => void;
  isLoading?: boolean;
  error?: string;
}

export function Step2({ onConfirm, isLoading = false, error }: Step2Props) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="size-5" />
          生成 JWT 金鑰
        </CardTitle>
        <CardDescription>
          系統將自動生成安全的 JWT 金鑰
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Key className="size-4" />
              JWT 金鑰資訊
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 自動生成 256 位元安全金鑰</li>
              <li>• 包含存取權杖金鑰 (JWT Secret)</li>
              <li>• 包含重新整理權杖金鑰 (Refresh Token Secret)</li>
              <li>• 使用加密安全隨機數生成器</li>
            </ul>
          </div>
        </div>

        <Alert>
          <Info className="size-4" />
          <AlertTitle>重要資訊</AlertTitle>
          <AlertDescription className="text-sm">
            這些金鑰將安全地儲存在系統配置檔案中。請確保系統配置檔案受到適當的保護，避免未授權的存取。
            <br /><br />
            <strong>注意：</strong>金鑰一旦生成，請妥善保管配置檔案。
          </AlertDescription>
        </Alert>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={onConfirm} className="flex-1" disabled={isLoading}>
            {isLoading ? '生成中...' : '生成金鑰並繼續'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
