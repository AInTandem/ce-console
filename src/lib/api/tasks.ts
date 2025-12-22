/**
 * Task API Client
 * Functions for managing and executing tasks in project sandboxes
 */

import type { TaskExecution, TaskFilter, TaskHistoryResponse } from '../types';
import { buildApiUrl } from '../config';
import { authenticatedFetch } from '@/lib/utils/authenticated-fetch';

interface TaskExecutionRequest {
  additionalInput?: string;
  parameters?: Record<string, any>;
}

interface AdhocTaskRequest {
  title: string;
  description?: string;
  prompt: string;
  parameters?: Record<string, any>;
  contextMemoryIds?: string[];
}

interface ExecuteWorkflowStepResponse {
  taskId: string;
  message: string;
  stepId: string;
}

interface ExecuteTaskResponse {
  taskId: string;
  message: string;
}

/**
 * Execute a workflow step as a task in the project sandbox
 */
export async function executeWorkflowStep(
  projectId: string,
  stepId: string,
  request: TaskExecutionRequest
): Promise<ExecuteWorkflowStepResponse> {
  const response = await authenticatedFetch(buildApiUrl(`/api/projects/${projectId}/workflow/steps/${stepId}/execute`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to execute workflow step: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Execute an ad-hoc (single-use) task
 */
export async function executeAdhocTask(
  projectId: string,
  request: AdhocTaskRequest
): Promise<ExecuteTaskResponse> {
  const response = await authenticatedFetch(buildApiUrl(`/api/projects/${projectId}/tasks/adhoc`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to execute ad-hoc task: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get task history for a project with optional filters
 */
export async function getProjectTasks(
  projectId: string,
  filters?: TaskFilter
): Promise<TaskHistoryResponse> {
  const params = new URLSearchParams();

  if (filters?.status && filters.status.length > 0) {
    filters.status.forEach(s => params.append('status', s));
  }
  if (filters?.type) {
    params.append('type', filters.type);
  }
  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.limit !== undefined) {
    params.append('limit', String(filters.limit));
  }
  if (filters?.offset !== undefined) {
    params.append('offset', String(filters.offset));
  }

  const queryString = params.toString();
  const path = `/api/projects/${projectId}/tasks${queryString ? `?${queryString}` : ''}`;

  const response = await authenticatedFetch(buildApiUrl(path));

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to get project tasks: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get specific task details
 */
export async function getTaskDetails(projectId: string, taskId: string): Promise<TaskExecution> {
  const response = await authenticatedFetch(buildApiUrl(`/api/projects/${projectId}/tasks/${taskId}`));

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to get task details: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Re-run a task (create a new task with the same prompt)
 */
export async function rerunTask(projectId: string, taskId: string): Promise<ExecuteTaskResponse> {
  // First, get the task details
  const task = await getTaskDetails(projectId, taskId);

  if (task.isAdhoc) {
    // Re-run as ad-hoc task
    return executeAdhocTask(projectId, {
      title: task.title || 'Re-run task',
      description: task.description,
      prompt: task.prompt,
      parameters: task.parameters,
    });
  } else {
    // Re-run as workflow step
    return executeWorkflowStep(projectId, task.stepId, {
      additionalInput: task.prompt,
      parameters: task.parameters,
    });
  }
}

/**
 * Set task limit for a project's sandbox
 */
export async function setTaskLimit(projectId: string, limit: number): Promise<any> {
  const response = await authenticatedFetch(buildApiUrl(`/api/projects/${projectId}/task-limits`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ limit }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to set task limit: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get queue status for a project's sandbox
 */
export async function getQueueStatus(projectId: string): Promise<any> {
  const response = await authenticatedFetch(buildApiUrl(`/api/projects/${projectId}/task-queue-status`));

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to get queue status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Cancel a queued task
 */
export async function cancelTask(projectId: string, taskId: string): Promise<any> {
  const response = await authenticatedFetch(buildApiUrl(`/api/projects/${projectId}/tasks/${taskId}/cancel`), {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to cancel task: ${response.statusText}`);
  }

  return response.json();
}