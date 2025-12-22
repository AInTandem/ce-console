import { useMemo } from 'react';
import type { Organization, Workspace, Project, Workflow } from '@/lib/types';

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Memoized search and filter functions
export function useSearchAndFilterMemoized<T>(
  items: T[],
  searchQuery: string,
  filterFunction: (items: T[], query: string) => T[],
  dependencies: readonly any[]
): T[] {
  return useMemo(() => {
    if (!searchQuery) return items;
    return filterFunction(items, searchQuery);
  }, [items, searchQuery, filterFunction, ...dependencies]);
}

// Memoized sort function
export function useSortMemoized<T>(
  items: T[],
  sortFunction: (items: T[], sortBy: string, sortOrder: 'asc' | 'desc') => T[],
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  dependencies: readonly any[]
): T[] {
  return useMemo(() => {
    return sortFunction(items, sortBy, sortOrder);
  }, [items, sortFunction, sortBy, sortOrder, ...dependencies]);
}

// Efficient organization structure builder
export function buildOrganizationStructure(
  organizations: Organization[],
  workspaces: Workspace[],
  projects: Project[]
): (Organization & { 
  workspaces: (Workspace & { 
    projects: Project[] 
  })[] 
})[] {
  return organizations.map(org => ({
    ...org,
    workspaces: workspaces
      .filter(ws => ws.organizationId === org.id)
      .map(ws => ({
        ...ws,
        projects: projects.filter(p => p.workspaceId === ws.id)
      }))
  }));
}

// Efficient project structure with workflow info
export function buildProjectStructure(
  projects: Project[],
  workflows: Workflow[]
): (Project & { 
  workflowName?: string; 
  workflowStatus?: string;
  workflowPhase?: string;
})[] {
  return projects.map(project => {
    const workflowId = project.workflowId;
    if (!workflowId) {
      return { ...project };
    }
    
    const workflow = workflows.find(w => w.id === workflowId);
    return {
      ...project,
      workflowName: workflow?.name,
      workflowStatus: workflow?.status,
      workflowPhase: project.workflowState?.currentPhaseId
    };
  });
}

// Efficient workflow structure with phase info
export function buildWorkflowStructure(
  workflows: Workflow[],
  projects: Project[]
): (Workflow & { 
  projectCount: number;
  projects: Project[];
})[] {
  return workflows.map(workflow => {
    const relatedProjects = projects.filter(p => p.workflowId === workflow.id);
    return {
      ...workflow,
      projectCount: relatedProjects.length,
      projects: relatedProjects
    };
  });
}

// Virtual scrolling data preparation
export interface VirtualizedItem {
  id: string;
  type: 'organization' | 'workspace' | 'project' | 'workflow';
  data: any;
  depth?: number;
  isExpanded?: boolean;
}

export function prepareVirtualizedData(
  organizations: Organization[],
  workspaces: Workspace[],
  projects: Project[],
  expandedOrganizations: Record<string, boolean>,
  expandedWorkspaces: Record<string, boolean>
): VirtualizedItem[] {
  const items: VirtualizedItem[] = [];
  
  for (const org of organizations) {
    items.push({
      id: org.id,
      type: 'organization',
      data: org,
      isExpanded: !!expandedOrganizations[org.id]
    });
    
    if (expandedOrganizations[org.id]) {
      const orgWorkspaces = workspaces.filter(ws => ws.organizationId === org.id);
      for (const ws of orgWorkspaces) {
        items.push({
          id: ws.id,
          type: 'workspace',
          data: ws,
          depth: 1,
          isExpanded: !!expandedWorkspaces[ws.id]
        });
        
        if (expandedWorkspaces[ws.id]) {
          const wsProjects = projects.filter(p => p.workspaceId === ws.id);
          for (const project of wsProjects) {
            items.push({
              id: project.id,
              type: 'project',
              data: project,
              depth: 2
            });
          }
        }
      }
    }
  }
  
  return items;
}

// Efficient data retrieval with caching
export class DataCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void { // Default 5 minutes
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }
  
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance
export const globalDataCache = new DataCache();

// Memoized data fetching hooks
export function useCachedOrganizations(
  allOrganizations: Organization[],
  searchQuery: string,
  sortBy: 'name' | 'createdAt' | 'projectCount',
  sortOrder: 'asc' | 'desc'
): Organization[] {
  const cacheKey = `orgs-${searchQuery}-${sortBy}-${sortOrder}`;
  const cached = globalDataCache.get<Organization[]>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  // In a real implementation, we would apply search and sort
  // For now, just store the unprocessed data
  globalDataCache.set(cacheKey, allOrganizations, 30000); // 30 seconds TTL
  
  return allOrganizations;
}