import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AIBasePage } from '@/pages/ai-base-page';
import { SandboxesPage } from '@/pages/sandboxes-page';
import { SandboxPage } from '@/pages/sandbox-page';
import { ShellPage } from '@/pages/shell-page';
import { DocsPage } from '@/pages/docs-page';
import { WorkflowPage } from '@/pages/workflow-page';
import { WorkflowsPage } from '@/pages/workflows-page';
import { WorkflowEditorPage } from '@/pages/workflow-editor-page';
import ContextPage from '@/pages/context-page';
import SettingsPage from '@/pages/settings-page';
import { MainLayout } from '@/components/layout/main-layout';
import { Toaster } from '@/components/ui/sonner';
import { LoginPage } from '@/pages/auth/LoginPage';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { AInTandemProvider } from '@aintandem/sdk-react';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { getOnboardingStatus } from '@/lib/api/onboarding';
import { useEffect, useState } from 'react';

// Build API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Custom hook to check onboarding status and redirect if needed
 */
function useOnboardingCheck() {
  const [isChecking, setIsChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // Skip check if already on onboarding or login page
        if (location.pathname === '/onboarding' || location.pathname === '/login') {
          setIsChecking(false);
          return;
        }

        const status = await getOnboardingStatus();

        if (!status.completed) {
          setNeedsOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        // On error, assume onboarding is needed to be safe
        setNeedsOnboarding(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkOnboarding();
  }, [location.pathname]);

  return { isChecking, needsOnboarding };
}

/**
 * Inner app component that has access to router context
 */
function AppContent() {
  const { isChecking, needsOnboarding } = useOnboardingCheck();

  // Show loading state while checking onboarding status
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  // Redirect to onboarding if needed
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute children={<MainLayout />} />}>
        <Route path="/" element={<AIBasePage />} />
        <Route path="/sandboxes" element={<SandboxesPage />} />
        <Route path="/workflows" element={<WorkflowsPage />} />
        <Route path="/workflow/new" element={<WorkflowEditorPage />} />
        <Route path="/workflow/:id/edit" element={<WorkflowEditorPage />} />
        <Route path="/context" element={<ContextPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      {/* Full-width pages without MainLayout container - also protected */}
      <Route path="/sandbox/:id" element={
        <PrivateRoute children={<SandboxPage />} />
      } />
      <Route path="/project/:projectId/workflow" element={
        <PrivateRoute children={<WorkflowPage />} />
      } />
      {/* Keep old routes for backward compatibility - also protected */}
      <Route element={<PrivateRoute children={<MainLayout />} />}>
        <Route path="/shell/:id" element={<ShellPage />} />
        <Route path="/docs/:id" element={<DocsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AInTandemProvider
      config={{
        baseURL: API_BASE_URL || window.location.origin,
      }}
      onAuthSuccess={(user) => {
        console.log('[AInTandemProvider] Auth success:', user);
      }}
      onAuthError={(error) => {
        console.error('[AInTandemProvider] Auth error:', error);
      }}
    >
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </AInTandemProvider>
  );
}

export default App;
