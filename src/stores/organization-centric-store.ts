import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrganizationCentricState {
  // View mode for organization-centric view
  viewMode: 'tree' | 'flat';
  
  // Search and filter state
  searchQuery: string;
  sortBy: 'name' | 'createdAt' | 'projectCount';
  sortOrder: 'asc' | 'desc';
  
  // Selection state (specific to organization-centric view)
  selectedOrganizationId: string | null;
  selectedWorkspaceId: string | null;
  selectedProjectId: string | null;
  
  // Expansion state for tree view
  expandedOrganizations: Record<string, boolean>;
  expandedWorkspaces: Record<string, boolean>;

  // Actions to update state
  setViewMode: (mode: 'tree' | 'flat') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'name' | 'createdAt' | 'projectCount') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setSelectedOrganizationId: (orgId: string | null) => void;
  setSelectedWorkspaceId: (wsId: string | null) => void;
  setSelectedProjectId: (projectId: string | null) => void;
  toggleOrganizationExpansion: (orgId: string) => void;
  toggleWorkspaceExpansion: (wsId: string) => void;
  clearFilters: () => void;
  resetSelection: () => void;
}

export const useOrganizationCentricStore = create<OrganizationCentricState>()(
  persist(
    (set) => ({
      viewMode: 'tree',
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
      selectedOrganizationId: null,
      selectedWorkspaceId: null,
      selectedProjectId: null,
      expandedOrganizations: {},
      expandedWorkspaces: {},

      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      setSelectedOrganizationId: (orgId) => set({ selectedOrganizationId: orgId }),
      setSelectedWorkspaceId: (wsId) => set({ selectedWorkspaceId: wsId }),
      setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
      toggleOrganizationExpansion: (orgId) => 
        set((state) => ({
          expandedOrganizations: {
            ...state.expandedOrganizations,
            [orgId]: !state.expandedOrganizations[orgId],
          },
        })),
      toggleWorkspaceExpansion: (wsId) => 
        set((state) => ({
          expandedWorkspaces: {
            ...state.expandedWorkspaces,
            [wsId]: !state.expandedWorkspaces[wsId],
          },
        })),
      clearFilters: () => 
        set({ 
          searchQuery: '' 
        }),
      resetSelection: () => 
        set({ 
          selectedOrganizationId: null, 
          selectedWorkspaceId: null, 
          selectedProjectId: null 
        }),
    }),
    {
      name: 'kai-organization-centric-storage',
      partialize: (state) => ({ 
        viewMode: state.viewMode,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        expandedOrganizations: state.expandedOrganizations,
        expandedWorkspaces: state.expandedWorkspaces,
      }),
    }
  )
);