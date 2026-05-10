import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface Step3Props {
  onSubmit: (systemName: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function Step3({ onSubmit, isLoading = false, error }: Step3Props) {
  const [systemName, setSystemName] = useState('AInTandem');
  const [validationError, setValidationError] = useState('');

  const validateSystemName = (name: string): string => {
    if (name.length < 1 || name.length > 100) {
      return '系統名稱必須在 1 到 100 個字元之間';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const nameError = validateSystemName(systemName);
    if (nameError) {
      setValidationError(nameError);
      return;
    }

    onSubmit(systemName);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="size-5" />
          設定系統名稱
        </CardTitle>
        <CardDescription>
          為您的系統設定一個易於識別的名稱
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="systemName">系統名稱</Label>
            <Input
              id="systemName"
              type="text"
              placeholder="輸入系統名稱"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              1-100 個字元，此名稱將顯示在系統各處，包括網頁標題、通知訊息等
            </p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="text-sm font-medium mb-2">系統名稱顯示位置：</div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• 網頁瀏覽器標題列</li>
              <li>• 系統通知和訊息</li>
              <li>• 使用者介面標題</li>
              <li>• 日誌和系統記錄</li>
            </ul>
          </div>

          {(validationError || error) && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {validationError || error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '處理中...' : '繼續'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
