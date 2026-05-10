import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface Step1Props {
  onSubmit: (username: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function Step1({ onSubmit, isLoading = false, error }: Step1Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validatePassword = (pwd: string): string => {
    if (pwd.length < 8) {
      return '密碼至少需要 8 個字元';
    }
    if (!/[A-Z]/.test(pwd)) {
      return '密碼必須包含至少一個大寫字母';
    }
    if (!/[a-z]/.test(pwd)) {
      return '密碼必須包含至少一個小寫字母';
    }
    if (!/[0-9]/.test(pwd)) {
      return '密碼必須包含至少一個數字';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return '密碼必須包含至少一個特殊字元';
    }
    return '';
  };

  const validateUsername = (name: string): string => {
    if (name.length < 3 || name.length > 50) {
      return '用戶名必須在 3 到 50 個字元之間';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      return '用戶名只能包含字母、數字、底線和連字元';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const usernameError = validateUsername(username);
    if (usernameError) {
      setValidationError(usernameError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('兩次輸入的密碼不一致');
      return;
    }

    onSubmit(username, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>建立管理員帳號</CardTitle>
        <CardDescription>
          請建立您的管理員帳號以開始使用系統
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用戶名</Label>
            <Input
              id="username"
              type="text"
              placeholder="輸入用戶名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              3-50 個字元，僅限字母、數字、底線和連字元
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密碼</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              至少 8 個字元，包含大小寫字母、數字和特殊字元
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">確認密碼</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="再次輸入密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
