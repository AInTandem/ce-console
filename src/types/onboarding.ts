// src/types/onboarding.ts

/**
 * Onboarding 步驟
 */
export enum OnboardingStep {
  NOT_STARTED = 0,
  CREATE_ADMIN = 1,
  GENERATE_JWT = 2,
  SET_SYSTEM_NAME = 3,
  CONFIRM = 4,
  COMPLETED = 5
}

/**
 * Onboarding 狀態
 */
export interface OnboardingStatus {
  completed: boolean;
  currentStep: OnboardingStep;
  startedAt?: string;
  completedAt?: string;
}

/**
 * 建立管理者帳號請求
 */
export interface CreateAdminRequest {
  username: string;
  password: string;
}

/**
 * JWT 金鑰響應
 */
export interface JwtSecretsResponse {
  jwtSecret: string;
  refreshTokenSecret: string;
}

/**
 * 系統名稱請求
 */
export interface SetSystemNameRequest {
  systemName: string;
}

/**
 * 應用配置摘要 (用於確認頁面)
 */
export interface AppConfigSummary {
  systemName: string;
  username: string;
  jwtSecret: string;
  refreshTokenSecret: string;
}
