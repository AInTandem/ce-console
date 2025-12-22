import type { ApiError, Sandbox, DirectoryListing, Organization, Workspace, Project } from './types';
import * as workflowsApi from './api/workflows';
import { buildApiUrl } from './config';
import { authenticatedFetch } from '@/lib/utils/authenticated-fetch';
import { handleUnauthorized } from '@/lib/utils/authenticated-fetch';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok && response.status !== 204) {
    // Handle authentication errors specifically
    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      // Return a dummy value since the redirect will happen
      return null as T;
    }

    const errorData: ApiError = await response.json() as ApiError;
    throw new Error(errorData.message || 'API call failed');
  }
  if (response.status === 204) {
    return null as T; // Handle No Content response
  }
  return response.json() as Promise<T>;
}

export async function apiCall<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Build URL based on configuration (proxy mode or direct mode)
  const url = buildApiUrl(path);
  const response = await authenticatedFetch(url, options);
  return handleResponse<T>(response);
}

export const api = {
  // Sandbox APIs (formerly Container APIs)
  getSandboxes: async (): Promise<Sandbox[]> => {
    return apiCall<Sandbox[]>('/api/flexy', { method: 'GET' });
  },

  createSandbox: async (name: string, folderMapping?: string, projectId?: string, aiConfig?: any): Promise<Sandbox> => {
    return apiCall<Sandbox>('/api/flexy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, folderMapping, projectId, aiConfig }),
    });
  },

  startSandbox: async (id: string): Promise<void> => {
    return apiCall<void>(`/api/flexy/${id}/start`, { method: 'POST' });
  },

  stopSandbox: async (id: string): Promise<void> => {
    return apiCall<void>(`/api/flexy/${id}/stop`, { method: 'POST' });
  },

  deleteSandbox: async (id: string): Promise<void> => {
    return apiCall<void>(`/api/flexy/${id}`, { method: 'DELETE' });
  },

  browseDirectories: async (path: string | null): Promise<DirectoryListing> => {
    return apiCall<DirectoryListing>('/api/host/directories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPath: path }),
    });
  },

  // Organization APIs
  getOrganizations: async (): Promise<Organization[]> => {
    return apiCall<Organization[]>('/api/organizations', { method: 'GET' });
  },

  getOrganization: async (id: string): Promise<Organization> => {
    return apiCall<Organization>(`/api/organizations/${id}`, { method: 'GET' });
  },

  createOrganization: async (name: string, folderPath: string): Promise<Organization> => {
    return apiCall<Organization>('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, folderPath }),
    });
  },

  updateOrganization: async (id: string, data: Partial<Pick<Organization, 'name' | 'folderPath'>>): Promise<Organization> => {
    return apiCall<Organization>(`/api/organizations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  deleteOrganization: async (id: string): Promise<void> => {
    return apiCall<void>(`/api/organizations/${id}`, { method: 'DELETE' });
  },

  // Workspace APIs
  getWorkspaces: async (organizationId?: string): Promise<Workspace[]> => {
    const url = organizationId ? `/api/organizations/${organizationId}/workspaces` : '/api/workspaces';
    return apiCall<Workspace[]>(url, { method: 'GET' });
  },

  getWorkspace: async (id: string): Promise<Workspace> => {
    return apiCall<Workspace>(`/api/workspaces/${id}`, { method: 'GET' });
  },

  createWorkspace: async (organizationId: string, name: string, folderPath: string): Promise<Workspace> => {
    return apiCall<Workspace>(`/api/organizations/${organizationId}/workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, folderPath }),
    });
  },

  updateWorkspace: async (id: string, data: Partial<Pick<Workspace, 'name' | 'folderPath'>>): Promise<Workspace> => {
    return apiCall<Workspace>(`/api/workspaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    return apiCall<void>(`/api/workspaces/${id}`, { method: 'DELETE' });
  },

  // Project APIs
  getProjects: async (workspaceId?: string): Promise<Project[]> => {
    const url = workspaceId ? `/api/workspaces/${workspaceId}/projects` : '/api/projects';
    return apiCall<Project[]>(url, { method: 'GET' });
  },

  getProject: async (id: string): Promise<Project> => {
    return apiCall<Project>(`/api/projects/${id}`, { method: 'GET' });
  },

  createProject: async (workspaceId: string, name: string, folderPath: string): Promise<Project> => {
    return apiCall<Project>(`/api/workspaces/${workspaceId}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, folderPath }),
    });
  },

  updateProject: async (id: string, data: Partial<Omit<Project, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>>): Promise<Project> => {
    return apiCall<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  deleteProject: async (id: string, deleteFolder: boolean = false): Promise<void> => {
    const query = deleteFolder ? '?deleteFolder=true' : '';
    return apiCall<void>(`/api/projects/${id}${query}`, { method: 'DELETE' });
  },

  moveProject: async (id: string, newWorkspaceId: string): Promise<Project> => {
    return apiCall<Project>(`/api/projects/${id}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newWorkspaceId }),
    });
  },

  // Workflow APIs
  listWorkflows: workflowsApi.listWorkflows,
  getWorkflow: workflowsApi.getWorkflow,
  createWorkflow: workflowsApi.createWorkflow,
  updateWorkflow: workflowsApi.updateWorkflow,
  deleteWorkflow: workflowsApi.deleteWorkflow,
  changeWorkflowStatus: workflowsApi.changeWorkflowStatus,
  cloneWorkflow: workflowsApi.cloneWorkflow,
  listWorkflowVersions: workflowsApi.listWorkflowVersions,
  getWorkflowVersion: workflowsApi.getWorkflowVersion,
  exportWorkflowJson: workflowsApi.exportWorkflowJson,
  importWorkflowJson: workflowsApi.importWorkflowJson,
};
