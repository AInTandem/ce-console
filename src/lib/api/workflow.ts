/**
 * Workflow State API Client
 * Functions for managing project workflow states
 */

import type { WorkflowState, Project } from '../types';
import { buildApiUrl } from '../config';
import { authenticatedFetch } from '@/lib/utils/authenticated-fetch';

/**
 * Get workflow state for a project
 * Returns default state if not set
 */
export async function getWorkflowState(projectId: string): Promise<WorkflowState> {
  const response = await authenticatedFetch(buildApiUrl(`/api/projects/${projectId}/workflow`));
  if (!response.ok) {
    throw new Error(`Failed to get workflow state: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Update entire workflow state for a project
 */
export async function updateWorkflowState(
  projectId: string,
  workflowState: Partial<WorkflowState>
): Promise<Project> {
  const response = await authenticatedFetch(buildApiUrl(`/api/projects/${projectId}/workflow`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowState),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to update workflow state: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a single step status
 */
export async function updateStepStatus(
  projectId: string,
  stepId: string,
  status: 'pending' | 'in-progress' | 'completed'
): Promise<WorkflowState> {
  const response = await authenticatedFetch(buildApiUrl(`/api/projects/${projectId}/workflow/step/${stepId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to update step status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Move to next phase
 */
export async function moveToNextPhase(
  projectId: string,
  nextPhaseId: 'rapid-prototyping' | 'automated-qa' | 'continuous-optimization'
): Promise<Project> {
  const currentState = await getWorkflowState(projectId);

  return updateWorkflowState(projectId, {
    currentPhaseId: nextPhaseId,
    currentStepId: null, // Reset step when changing phase
    stepStatuses: currentState.stepStatuses, // Preserve existing statuses
  });
}

/**
 * Initialize workflow state with default values
 */
export async function initializeWorkflowState(projectId: string): Promise<Project> {
  return updateWorkflowState(projectId, {
    currentPhaseId: 'rapid-prototyping',
    currentStepId: null,
    stepStatuses: {},
  });
}

/**
 * Calculate progress percentage for current phase
 */
export function calculatePhaseProgress(
  workflowState: WorkflowState,
  phaseStepIds: string[]
): number {
  const phaseStatuses = phaseStepIds.map(id => workflowState.stepStatuses[id] || 'pending');
  const completed = phaseStatuses.filter(s => s === 'completed').length;
  return phaseStepIds.length > 0 ? Math.round((completed / phaseStepIds.length) * 100) : 0;
}

/**
 * Calculate overall progress across all phases
 */
export function calculateOverallProgress(
  workflowState: WorkflowState
): number {
  const allStatuses = Object.values(workflowState.stepStatuses);
  if (allStatuses.length === 0) return 0;

  const completed = allStatuses.filter(s => s === 'completed').length;
  return Math.round((completed / allStatuses.length) * 100);
}

/**
 * Get display name for phase
 */
export function getPhaseDisplayName(
  phaseId: string
): string {
  const phases: Record<string, string> = {
    'rapid-prototyping': '🚀 快速原型',
    'automated-qa': '🤖 自動化QA',
    'continuous-optimization': '📈 持續優化',
  };
  return phases[phaseId] || phaseId;
}

/**
 * Get display name for step status
 */
export function getStatusDisplayName(
  status: 'pending' | 'in-progress' | 'completed'
): string {
  const statuses: Record<string, string> = {
    'pending': '待處理',
    'in-progress': '進行中',
    'completed': '已完成',
  };
  return statuses[status] || status;
}

/**
 * Get status badge variant
 */
export function getStatusBadgeVariant(
  status: 'pending' | 'in-progress' | 'completed'
): 'secondary' | 'default' | 'outline' {
  const variants: Record<string, 'secondary' | 'default' | 'outline'> = {
    'pending': 'secondary',
    'in-progress': 'default',
    'completed': 'outline',
  };
  return variants[status] || 'secondary';
}

