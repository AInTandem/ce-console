# AInTandem Console

This is the console for the AInTandem sandbox orchestration platform, built with React, TypeScript, and Vite.

## Development

To run the application in development mode:

```bash
pnpm install
pnpm dev
```

The console will be available at `http://localhost:5173` and will proxy API requests to the backend at `http://localhost:9900`.

## Environment Variables

This project uses Vite's environment variable system. Environment variables should be prefixed with `VITE_` to be exposed to the client-side code.

### Available Environment Variables

- `VITE_USE_MOCK_API`: Controls whether to use mock API in development mode.
  - Default: `true` when in development mode
  - Set to `false` to disable mock API and use the real backend API
  - Example: `VITE_USE_MOCK_API=false pnpm dev`

## Mock API

The application includes a mock API for development purposes using MSW (Mock Service Worker). This allows the console to work without a running backend. The mock API contains sample data for:

- Containers
- Organizations
- Workspaces
- Projects
- Workflows

To enable the mock API in development mode, ensure `VITE_USE_MOCK_API` is set to `true` (or is not set at all, since it defaults to true in development).

Example usage:
```bash
# Use mock API (default in development)
pnpm dev

# Use real backend API
VITE_USE_MOCK_API=false pnpm dev
```

## Architecture

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand stores
- **API Mocking**: MSW (Mock Service Worker)
- **Environment Configuration**: Vite's env system

## Onboarding

The application includes an onboarding wizard for first-time setup:

### Flow

When accessing the application for the first time:

1. The application checks onboarding status via `/api/onboarding/status`
2. If not completed, redirects to `/onboarding` route
3. User completes 4-step wizard:
   - **Step 1**: Create admin account (username + password with complexity requirements)
   - **Step 2**: Generate JWT secrets (automatic, 256-bit keys)
   - **Step 3**: Set system name
   - **Step 4**: Review and confirm
4. After completion, redirects to `/login` page

### Validation Rules

- **Username**: 3-50 characters, alphanumeric only
- **Password**: 8+ characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character (!@#$%^&*)
- **System Name**: 1-100 characters

### Components

- `OnboardingPage` - Main wizard page with progress indicator
- `Step1` - Admin account creation form
- `Step2` - JWT secrets generation info display
- `Step3` - System name setting form with back navigation
- `StepSummary` - Review and confirmation screen

### API Client

The onboarding API is located in `src/lib/api/onboarding.ts`:
- `getOnboardingStatus()` - Fetch current status
- `createAdminAccount(data)` - Create admin account
- `generateJwtSecrets()` - Generate JWT secrets
- `setSystemName(data)` - Set system name
- `completeOnboarding()` - Complete onboarding process