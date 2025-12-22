import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { 
  Sandbox, 
  Organization, 
  Workspace, 
  Project 
} from '@/lib/types';

// Query keys for sandbox data
const SANDBOX_KEYS = {
  all: ['sandboxes'] as const,
  lists: () => [...SANDBOX_KEYS.all, 'list'] as const,
  list: () => [...SANDBOX_KEYS.lists()] as const,
  details: () => [...SANDBOX_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SANDBOX_KEYS.details(), id] as const,
};

// Query keys for organization data
const ORGANIZATION_KEYS = {
  all: ['organizations'] as const,
  lists: () => [...ORGANIZATION_KEYS.all, 'list'] as const,
  list: () => [...ORGANIZATION_KEYS.lists()] as const,
  details: () => [...ORGANIZATION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ORGANIZATION_KEYS.details(), id] as const,
};

// Query keys for workspace data
const WORKSPACE_KEYS = {
  all: ['workspaces'] as const,
  lists: () => [...WORKSPACE_KEYS.all, 'list'] as const,
  list: () => [...WORKSPACE_KEYS.lists()] as const,
  details: () => [...WORKSPACE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...WORKSPACE_KEYS.details(), id] as const,
};

// Query keys for project data
const PROJECT_KEYS = {
  all: ['projects'] as const,
  lists: () => [...PROJECT_KEYS.all, 'list'] as const,
  list: () => [...PROJECT_KEYS.lists()] as const,
  details: () => [...PROJECT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROJECT_KEYS.details(), id] as const,
};

// Sandbox Queries
export const useSandboxesQuery = () => {
  return useQuery<Sandbox[]>({
    queryKey: SANDBOX_KEYS.list(),
    queryFn: () => api.getSandboxes(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSandboxQuery = (id: string) => {
  return useQuery<Sandbox>({
    queryKey: SANDBOX_KEYS.detail(id),
    queryFn: async () => {
      const sandboxes = await api.getSandboxes();
      const sandbox = sandboxes.find(s => s.id === id);
      if (!sandbox) {
        throw new Error('Sandbox not found');
      }
      return sandbox;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Organization Queries
export const useOrganizationsQuery = () => {
  return useQuery<Organization[]>({
    queryKey: ORGANIZATION_KEYS.list(),
    queryFn: () => api.getOrganizations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrganizationQuery = (id: string) => {
  return useQuery<Organization>({
    queryKey: ORGANIZATION_KEYS.detail(id),
    queryFn: () => api.getOrganization(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Workspace Queries
export const useWorkspacesQuery = () => {
  return useQuery<Workspace[]>({
    queryKey: WORKSPACE_KEYS.list(),
    queryFn: () => api.getWorkspaces(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkspaceQuery = (id: string) => {
  return useQuery<Workspace>({
    queryKey: WORKSPACE_KEYS.detail(id),
    queryFn: () => api.getWorkspace(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Project Queries
export const useProjectsQuery = () => {
  return useQuery<Project[]>({
    queryKey: PROJECT_KEYS.list(),
    queryFn: () => api.getProjects(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProjectQuery = (id: string) => {
  return useQuery<Project>({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => api.getProject(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Combined Queries
export const useAllSandboxDataQuery = () => {
  return useQuery<{
    sandboxes: Sandbox[];
    organizations: Organization[];
    workspaces: Workspace[];
    projects: Project[];
  }>({
    queryKey: ['all-sandbox-data'],
    queryFn: async () => {
      const [sandboxes, organizations, workspaces, projects] = await Promise.all([
        api.getSandboxes(),
        api.getOrganizations(),
        api.getWorkspaces(),
        api.getProjects(),
      ]);
      
      return { sandboxes, organizations, workspaces, projects };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutations
export const useStartSandboxMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.startSandbox(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SANDBOX_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: ['all-sandbox-data'] });
    },
  });
};

export const useStopSandboxMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.stopSandbox(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SANDBOX_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: ['all-sandbox-data'] });
    },
  });
};

export const useDeleteSandboxMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteSandbox(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SANDBOX_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: ['all-sandbox-data'] });
    },
  });
};

export const useCreateSandboxMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, folderMapping, projectId }: { name?: string; folderMapping?: string; projectId?: string }) => 
      api.createSandbox(name || '', folderMapping, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SANDBOX_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: ['all-sandbox-data'] });
    },
  });
};