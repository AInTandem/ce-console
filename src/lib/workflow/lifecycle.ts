/**
 * AI Team Workflows Lifecycle Data
 * Based on project-lifecycle.png and workflows/ structure
 */

import { LifecycleData } from './types';

export const lifecycleData: LifecycleData = {
  phases: [
    {
      id: 'rapid-prototyping',
      title: '快速原型',
      titleEn: 'Rapid Prototyping',
      description: 'Requirements gathering, design, and initial implementation with quick feedback loops',
      color: '#E3F2FD',
      steps: [
        {
          id: 'trigger',
          title: '啟動需求',
          description: 'Start with requirements and initial planning',
          type: 'milestone',
          workflows: [
            {
              name: 'Plan Project Development',
              path: 'workflows/01-planning/plan-how-to-develop-this-project.md',
              description: 'General project planning workflow',
              phase: '01-planning'
            },
            {
              name: 'Plan Firebase Project',
              path: 'workflows/01-planning/plan-how-to-develop-this-firebase-project.md',
              description: 'Firebase-specific project planning',
              phase: '01-planning'
            }
          ]
        },
        {
          id: 'requirements',
          title: '開發功能',
          description: 'Define requirements and user stories',
          type: 'process',
          workflows: [
            {
              name: 'Write User Stories',
              path: 'workflows/01-planning/write-user-stories-based-on-srs-and-sfs.md',
              description: 'Create user stories from SRS and SFS',
              phase: '01-planning'
            },
            {
              name: 'Write UX Requirements',
              path: 'workflows/02-design/write-ux-requirements-based-on-user-stories.md',
              description: 'Define UX requirements based on user stories',
              phase: '02-design'
            },
            {
              name: 'Define Acceptance Criteria',
              path: 'workflows/01-planning/define-acceptance-criteria-and-metrics.md',
              description: 'Set acceptance criteria and metrics',
              phase: '01-planning'
            }
          ]
        },
        {
          id: 'design',
          title: '發行 (初版)',
          description: 'Design API contracts and UX patterns',
          type: 'process',
          workflows: [
            {
              name: 'Design Backend API Contract',
              path: 'workflows/02-design/design-backend-api-contract.md',
              description: 'Define OpenAPI specifications',
              phase: '02-design'
            },
            {
              name: 'Write User Flows',
              path: 'workflows/02-design/write-user-flows-based-on-ux-requirements.md',
              description: 'Create user flows from requirements',
              phase: '02-design'
            },
            {
              name: 'Design UX Patterns',
              path: 'workflows/02-design/design-ux-patterns-based-on-user-flows.md',
              description: 'Define UX patterns',
              phase: '02-design'
            }
          ]
        },
        {
          id: 'preview',
          title: '預覽伺服器',
          description: 'Set up preview environment and initial development',
          type: 'process',
          workflows: [
            {
              name: 'Create Frontend Startup Project',
              path: 'workflows/03-development/create-abh-frontend-startup-project.md',
              description: 'Bootstrap frontend with Vite + React',
              phase: '03-development'
            },
            {
              name: 'Deploy Backend Locally',
              path: 'workflows/05-deployment/deploy-backend-locally.md',
              description: 'Set up local backend environment',
              phase: '05-deployment'
            }
          ]
        },
        {
          id: 'dogfooding',
          title: '內部試用',
          description: 'Internal testing and feedback',
          type: 'decision',
          workflows: [
            {
              name: 'Dogfooding Checklist',
              path: 'workflows/06-validation/dogfooding-checklist.md',
              description: 'Internal testing checklist',
              phase: '06-validation'
            }
          ]
        },
        {
          id: 'acceptance-criteria',
          title: '提出改進項目 | 提報錯誤',
          description: 'Document issues and improvement items',
          type: 'documentation',
          workflows: [
            {
              name: 'Define Acceptance Criteria',
              path: 'workflows/01-planning/define-acceptance-criteria-and-metrics.md',
              description: 'Refine acceptance criteria based on feedback',
              phase: '01-planning'
            }
          ]
        },
        {
          id: 'ready-for-qa',
          title: '符合需求',
          description: 'Ready for QA phase',
          type: 'milestone',
          workflows: [
            {
              name: 'Definition of Ready',
              path: 'governance/definition-of-ready.md',
              description: 'Check DoR criteria',
              phase: 'governance'
            }
          ]
        }
      ]
    },
    {
      id: 'automated-qa',
      title: '建立自動化QA',
      titleEn: 'Build Automated QA',
      description: 'Establish comprehensive automated testing and quality assurance',
      color: '#E8F5E9',
      steps: [
        {
          id: 'qa-version',
          title: '定版',
          description: 'Lock version for QA',
          type: 'milestone',
          workflows: [
            {
              name: 'Release and Versioning',
              path: 'workflows/07-release/release-and-versioning.md',
              description: 'Version management',
              phase: '07-release'
            }
          ]
        },
        {
          id: 'qa-cicd',
          title: '撰寫自動QA程式 (CI/CD)',
          description: 'Set up CI/CD pipelines',
          type: 'process',
          workflows: [
            {
              name: 'Write Backend Unit Tests',
              path: 'workflows/04-testing/write-backend-api-unit-tests.md',
              description: 'White-box testing with coverage',
              phase: '04-testing'
            },
            {
              name: 'Write Backend E2E Tests',
              path: 'workflows/04-testing/write-backend-e2e-tests.md',
              description: 'Plan E2E test scenarios',
              phase: '04-testing'
            },
            {
              name: 'Contract Tests',
              path: 'workflows/04-testing/consumer-provider-contract-tests.md',
              description: 'Consumer-provider contract testing',
              phase: '04-testing'
            }
          ]
        },
        {
          id: 'qa-version-run',
          title: '發行版本',
          description: 'Package and deploy for testing',
          type: 'process',
          workflows: [
            {
              name: 'Package Backend',
              path: 'workflows/05-deployment/package-and-run-backend.md',
              description: 'Build and package backend',
              phase: '05-deployment'
            },
            {
              name: 'Package Frontend',
              path: 'workflows/05-deployment/package-and-run-frontend.md',
              description: 'Build and package frontend',
              phase: '05-deployment'
            }
          ]
        },
        {
          id: 'qa-preview',
          title: '預覽伺服器',
          description: 'Deploy to preview environment',
          type: 'process',
          workflows: [
            {
              name: 'Expose OpenAPI Runtime',
              path: 'workflows/05-deployment/expose-openapi-runtime.md',
              description: 'Make runtime API available',
              phase: '05-deployment'
            }
          ]
        },
        {
          id: 'qa-automated',
          title: '自動化 QA',
          description: 'Run automated test suites',
          type: 'process',
          workflows: [
            {
              name: 'Test Backend E2E Integration',
              path: 'workflows/04-testing/test-backend-e2e-integration.md',
              description: 'Execute E2E tests',
              phase: '04-testing'
            },
            {
              name: 'Check Backend API',
              path: 'workflows/06-validation/check-the-backend-api.md',
              description: 'Validate backend against specs',
              phase: '06-validation'
            },
            {
              name: 'Check Frontend App',
              path: 'workflows/06-validation/check-the-frontend-app.md',
              description: 'Validate frontend functionality',
              phase: '06-validation'
            }
          ]
        },
        {
          id: 'qa-official-version',
          title: '晉升正式版',
          description: 'Promote to production candidate',
          type: 'milestone',
          workflows: [
            {
              name: 'Definition of Done',
              path: 'governance/definition-of-done.md',
              description: 'Verify DoD criteria',
              phase: 'governance'
            }
          ]
        },
        {
          id: 'qa-production',
          title: '正式伺服器',
          description: 'Deploy to production',
          type: 'process',
          workflows: [
            {
              name: 'Canary Release',
              path: 'workflows/07-release/canary-release-and-rollback.md',
              description: 'Staged rollout strategy',
              phase: '07-release'
            }
          ]
        }
      ]
    },
    {
      id: 'continuous-optimization',
      title: '持續優化',
      titleEn: 'Continuous Optimization',
      description: 'Ongoing improvements, monitoring, and feature development',
      color: '#FFF3E0',
      steps: [
        {
          id: 'feature-updates',
          title: '開發功能 / 更正錯誤',
          description: 'Develop new features and fix bugs',
          type: 'process',
          workflows: [
            {
              name: 'Code Frontend Project',
              path: 'workflows/03-development/code-frontend-project.md',
              description: 'Frontend development',
              phase: '03-development'
            },
            {
              name: 'Code Backend Project',
              path: 'workflows/03-development/code-backend-project.md',
              description: 'Backend development',
              phase: '03-development'
            },
            {
              name: 'Code Project',
              path: 'workflows/03-development/code-project.md',
              description: 'Full-stack development',
              phase: '03-development'
            }
          ]
        },
        {
          id: 'opt-cicd',
          title: '撰寫自動QA程式 (CI/CD)',
          description: 'Maintain and improve CI/CD',
          type: 'process',
          workflows: [
            {
              name: 'Performance Benchmark',
              path: 'workflows/04-testing/performance-benchmark-and-visual-regression.md',
              description: 'Performance and visual testing',
              phase: '04-testing'
            },
            {
              name: 'Security Audit',
              path: 'workflows/04-testing/security-audit-and-dependency-vulnerability-scan.md',
              description: 'Security and dependency scanning',
              phase: '04-testing'
            }
          ]
        },
        {
          id: 'opt-version',
          title: '發行版本',
          description: 'Release new version',
          type: 'process',
          workflows: [
            {
              name: 'Release and Versioning',
              path: 'workflows/07-release/release-and-versioning.md',
              description: 'Version management',
              phase: '07-release'
            }
          ]
        },
        {
          id: 'opt-preview',
          title: '預覽伺服器',
          description: 'Preview environment deployment',
          type: 'process',
          workflows: [
            {
              name: 'Integrate Backend API',
              path: 'workflows/06-validation/integrate-backend-api.md',
              description: 'API integration testing',
              phase: '06-validation'
            }
          ]
        },
        {
          id: 'opt-automated',
          title: '自動化 QA',
          description: 'Run automated tests',
          type: 'process',
          workflows: [
            {
              name: 'Check Backend API',
              path: 'workflows/06-validation/check-the-backend-api.md',
              description: 'Backend validation',
              phase: '06-validation'
            },
            {
              name: 'Check Frontend App',
              path: 'workflows/06-validation/check-the-frontend-app.md',
              description: 'Frontend validation',
              phase: '06-validation'
            }
          ]
        },
        {
          id: 'opt-dogfooding',
          title: '內部試用',
          description: 'Internal testing of new features',
          type: 'decision',
          workflows: [
            {
              name: 'Dogfooding Checklist',
              path: 'workflows/06-validation/dogfooding-checklist.md',
              description: 'Internal testing',
              phase: '06-validation'
            }
          ]
        },
        {
          id: 'opt-official-version',
          title: '晉升正式版',
          description: 'Promote to production',
          type: 'milestone',
          workflows: [
            {
              name: 'Post-Release Monitoring',
              path: 'workflows/07-release/post-release-monitoring-and-bug-triage.md',
              description: 'Monitor and triage issues',
              phase: '07-release'
            }
          ]
        },
        {
          id: 'opt-production',
          title: '正式伺服器',
          description: 'Production deployment',
          type: 'process',
          workflows: [
            {
              name: 'Canary Release',
              path: 'workflows/07-release/canary-release-and-rollback.md',
              description: 'Gradual rollout',
              phase: '07-release'
            }
          ]
        }
      ]
    }
  ],
  transitions: [
    { from: 'rapid-prototyping', to: 'automated-qa', type: 'forward' },
    { from: 'automated-qa', to: 'continuous-optimization', type: 'forward', label: '用戶試用' },
    { from: 'continuous-optimization', to: 'rapid-prototyping', type: 'feedback', label: 'Feedback Loop' },
    { from: 'automated-qa', to: 'rapid-prototyping', type: 'feedback', label: 'QA Feedback' }
  ]
};
