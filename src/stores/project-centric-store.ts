import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProjectCentricState {
  // View mode for project-centric view
  viewMode: 'grid' | 'list';
  
  // Search and filter state
  searchQuery: string;
  workflowFilter: 'all' | 'rapid-prototyping' | 'automated-qa' | 'continuous-optimization' | 'none';
  statusFilter: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'createdAt' | 'workflowPhase';
  sortOrder: 'asc' | 'desc';
  
  // Selection state (specific to project-centric view)
  selectedProjectId: string | null;
  
  // Expansion state for list view
  expandedProjects: Record<string, boolean>;

  // Actions to update state
  setViewMode: (mode: 'grid' | 'list') => void;
  setSearchQuery: (query: string) => void;
  setWorkflowFilter: (filter: 'all' | 'rapid-prototyping' | 'automated-qa' | 'continuous-optimization' | 'none') => void;
  setStatusFilter: (filter: 'all' | 'active' | 'inactive') => void;
  setSortBy: (sortBy: 'name' | 'createdAt' | 'workflowPhase') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setSelectedProjectId: (projectId: string | null) => void;
  toggleProjectExpansion: (projectId: string) => void;
  clearFilters: () => void;
}

export const useProjectCentricStore = create<ProjectCentricState>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      searchQuery: '',
      workflowFilter: 'all',
      statusFilter: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      selectedProjectId: null,
      expandedProjects: {},

      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setWorkflowFilter: (filter) => set({ workflowFilter: filter }),
      setStatusFilter: (filter) => set({ statusFilter: filter }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
      toggleProjectExpansion: (projectId) => 
        set((state) => ({
          expandedProjects: {
            ...state.expandedProjects,
            [projectId]: !state.expandedProjects[projectId],
          },
        })),
      clearFilters: () => 
        set({ 
          searchQuery: '', 
          workflowFilter: 'all', 
          statusFilter: 'all' 
        }),
    }),
    {
      name: 'kai-project-centric-storage',
      partialize: (state) => ({ 
        viewMode: state.viewMode,
        searchQuery: state.searchQuery,
        workflowFilter: state.workflowFilter,
        statusFilter: state.statusFilter,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        expandedProjects: state.expandedProjects,
      }),
    }
  )
);