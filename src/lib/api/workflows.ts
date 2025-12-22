/**
 * Workflows API Client
 * Functions for managing workflows (CRUD, version management, status changes)
 */

import type { Workflow, WorkflowVersion, WorkflowDefinition } from '../types';
import { buildApiUrl } from '../config';
import { authenticatedFetch } from '@/lib/utils/authenticated-fetch';

/**
 * List all workflows with optional status filter
 */
export async function listWorkflows(status?: 'published' | 'draft' | 'archived'): Promise<Workflow[]> {
  const path = status ? `/api/workflows?status=${status}` : '/api/workflows';
  const response = await authenticatedFetch(buildApiUrl(path));

  if (!response.ok) {
    throw new Error(`Failed to list workflows: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get specific workflow by ID
 */
export async function getWorkflow(id: string): Promise<Workflow> {
  const response = await authenticatedFetch(buildApiUrl(`/api/workflows/${id}`));

  if (!response.ok) {
    throw new Error(`Failed to get workflow: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create new workflow (starts as Draft)
 */
export async function createWorkflow(
  name: string,
  description: string,
  definition: WorkflowDefinition
): Promise<Workflow> {
  const response = await authenticatedFetch(buildApiUrl('/api/workflows'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, definition }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to create workflow: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update workflow
 * If workflow is Published, creates a new version automatically
 */
export async function updateWorkflow(
  id: string,
  updates: {
    name?: string;
    description?: string;
    definition?: WorkflowDefinition;
    changeDescription?: string;
  }
): Promise<Workflow> {
  const response = await authenticatedFetch(buildApiUrl(`/api/workflows/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to update workflow: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete workflow
 * Cannot delete templates or workflows in use by projects
 */
export async function deleteWorkflow(id: string): Promise<void> {
  const response = await authenticatedFetch(buildApiUrl(`/api/workflows/${id}`), {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to delete workflow: ${response.statusText}`);
  }
}

/**
 * Change workflow status (Publish, Archive, back to Draft)
 */
export async function changeWorkflowStatus(
  id: string,
  status: 'published' | 'draft' | 'archived'
): Promise<Workflow> {
  const response = await authenticatedFetch(buildApiUrl(`/api/workflows/${id}/status`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to change workflow status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Clone workflow for customization
 */
export async function cloneWorkflow(
  sourceId: string,
  newName: string,
  newDescription?: string
): Promise<Workflow> {
  const response = await authenticatedFetch(buildApiUrl(`/api/workflows/${sourceId}/clone`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, description: newDescription }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to clone workflow: ${response.statusText}`);
  }

  return response.json();
}

/**
 * List all versions for a workflow
 */
export async function listWorkflowVersions(workflowId: string): Promise<WorkflowVersion[]> {
  const response = await authenticatedFetch(buildApiUrl(`/api/workflows/${workflowId}/versions`));

  if (!response.ok) {
    throw new Error(`Failed to list workflow versions: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get specific workflow version by ID
 */
export async function getWorkflowVersion(versionId: string): Promise<WorkflowVersion> {
  const response = await authenticatedFetch(buildApiUrl(`/api/workflows/versions/${versionId}`));

  if (!response.ok) {
    throw new Error(`Failed to get workflow version: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get status badge variant for UI
 */
export function getStatusBadgeVariant(status: 'published' | 'draft' | 'archived'): 'default' | 'secondary' | 'outline' {
  const variants = {
    published: 'default' as const,
    draft: 'secondary' as const,
    archived: 'outline' as const,
  };
  return variants[status];
}

/**
 * Get status display name
 */
export function getStatusDisplayName(status: 'published' | 'draft' | 'archived'): string {
  const names = {
    published: 'Published',
    draft: 'Draft',
    archived: 'Archived',
  };
  return names[status];
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: 'published' | 'draft' | 'archived'): string {
  const colors = {
    published: 'text-green-600',
    draft: 'text-yellow-600',
    archived: 'text-gray-600',
  };
  return colors[status];
}

/**
 * Export a workflow as JSON string
 */
export function exportWorkflowJson(workflow: Workflow): string {
  // Create a simplified representation of the workflow for export
  // Exclude fields that are specific to the current system instance
  const exportData = {
    name: workflow.name,
    description: workflow.description,
    definition: workflow.definition,
    createdAt: workflow.createdAt,
    updatedAt: workflow.updatedAt,
    // Don't export system-specific fields like id, status, currentVersion, isTemplate
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import a workflow from JSON string
 */
export async function importWorkflowJson(
  jsonStr: string,
  name: string,
  description: string
): Promise<Workflow> {
  const importData = JSON.parse(jsonStr);

  // Validate that the JSON has the required structure
  if (!importData.definition) {
    throw new Error('Invalid workflow format: missing definition');
  }

  // Create workflow with the provided name and description, but use the definition from the imported data
  const response = await authenticatedFetch(buildApiUrl('/api/workflows'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, definition: importData.definition }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to import workflow: ${response.statusText}`);
  }

  return response.json();
}