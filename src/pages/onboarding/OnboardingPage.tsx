import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStep } from '@/types/onboarding';
import {
  getOnboardingStatus,
  createAdminAccount,
  generateJwtSecrets,
  setSystemName,
  completeOnboarding
} from '@/lib/api/onboarding';
import { Step1 } from '@/components/onboarding/Step1';
import { Step2 } from '@/components/onboarding/Step2';
import { Step3 } from '@/components/onboarding/Step3';
import { StepSummary } from '@/components/onboarding/StepSummary';

interface OnboardingPageProps {}

export function OnboardingPage({}: OnboardingPageProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.CREATE_ADMIN);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    username: '',
    systemName: ''
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoading(true);
        const status = await getOnboardingStatus();

        if (status.completed) {
          // Already completed, redirect to login
          navigate('/login', { replace: true });
          return;
        }

        // Set current step from API response
        if (status.currentStep !== undefined) {
          setCurrentStep(status.currentStep);
        }
      } catch (err) {
        setError('無法載入 onboarding 狀態');
        console.error('Failed to check onboarding status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [navigate]);

  const handleStep1Submit = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await createAdminAccount({ username, password });

      // Update form data
      setFormData(prev => ({ ...prev, username }));

      // Move to next step
      setCurrentStep(OnboardingStep.GENERATE_JWT);
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立管理員帳號失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await generateJwtSecrets();
      // JWT secrets are hidden (returned as ********), we don't need to store them

      // Move to next step
      setCurrentStep(OnboardingStep.SET_SYSTEM_NAME);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成 JWT 金鑰失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (systemName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await setSystemName({ systemName });

      // Update form data
      setFormData(prev => ({ ...prev, systemName }));

      // Move to confirmation step
      setCurrentStep(OnboardingStep.CONFIRM);
    } catch (err) {
      setError(err instanceof Error ? err.message : '設定系統名稱失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await completeOnboarding();

      // Redirect to login page after completion
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '完成 onboarding 失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Allow going back to previous step
    switch (currentStep) {
      case OnboardingStep.GENERATE_JWT:
        setCurrentStep(OnboardingStep.CREATE_ADMIN);
        break;
      case OnboardingStep.SET_SYSTEM_NAME:
        setCurrentStep(OnboardingStep.GENERATE_JWT);
        break;
      case OnboardingStep.CONFIRM:
        setCurrentStep(OnboardingStep.SET_SYSTEM_NAME);
        break;
      default:
        break;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.CREATE_ADMIN:
        return (
          <Step1
            onSubmit={handleStep1Submit}
            isLoading={isLoading}
            error={error || undefined}
          />
        );
      case OnboardingStep.GENERATE_JWT:
        return (
          <Step2
            onConfirm={handleStep2Submit}
            isLoading={isLoading}
            error={error || undefined}
          />
        );
      case OnboardingStep.SET_SYSTEM_NAME:
        return (
          <Step3
            onSubmit={handleStep3Submit}
            onBack={handleBack}
            isLoading={isLoading}
            error={error || undefined}
          />
        );
      case OnboardingStep.CONFIRM:
        return (
          <StepSummary
            adminUsername={formData.username}
            systemName={formData.systemName}
            onConfirm={handleConfirm}
            isLoading={isLoading}
            error={error || undefined}
          />
        );
      default:
        return null;
    }
  };

  const getStepLabel = (step: OnboardingStep): string => {
    switch (step) {
      case OnboardingStep.CREATE_ADMIN:
        return 'Admin Account';
      case OnboardingStep.GENERATE_JWT:
        return 'Security';
      case OnboardingStep.SET_SYSTEM_NAME:
        return 'System Name';
      case OnboardingStep.CONFIRM:
        return 'Review';
      default:
        return '';
    }
  };

  const getStepNumber = (step: OnboardingStep): number => {
    switch (step) {
      case OnboardingStep.CREATE_ADMIN:
        return 1;
      case OnboardingStep.GENERATE_JWT:
        return 2;
      case OnboardingStep.SET_SYSTEM_NAME:
        return 3;
      case OnboardingStep.CONFIRM:
        return 4;
      default:
        return 0;
    }
  };

  if (isLoading && currentStep === OnboardingStep.NOT_STARTED) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {/* Progress Indicator */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex items-center justify-between">
          {[OnboardingStep.CREATE_ADMIN, OnboardingStep.GENERATE_JWT, OnboardingStep.SET_SYSTEM_NAME, OnboardingStep.CONFIRM].map((step, index) => (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    getStepNumber(currentStep) > index
                      ? 'bg-primary text-primary-foreground'
                      : getStepNumber(currentStep) === index + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {getStepNumber(currentStep) > index + 1 ? '✓' : index + 1}
                </div>
                <span className="text-xs mt-2 text-center">{getStepLabel(step)}</span>
              </div>

              {/* Connector Line */}
              {index < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    getStepNumber(currentStep) > index + 1 ? 'bg-primary' : 'bg-muted'
                  }`}
                  style={{ maxWidth: '100px' }}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-md">
        {renderStep()}
      </div>
    </div>
  );
}

export default OnboardingPage;
