import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SandboxNavigationState {
  // View mode
  viewMode: 'grid' | 'hierarchy';
  
  // Expansion states for hierarchy view
  expandedOrganizations: Record<string, boolean>;
  expandedWorkspaces: Record<string, boolean>;
  expandedProjects: Record<string, boolean>;
  
  // Search state
  searchQuery: string;

  // Actions to update state
  setViewMode: (mode: 'grid' | 'hierarchy') => void;
  toggleOrganizationExpansion: (orgId: string) => void;
  toggleWorkspaceExpansion: (wsId: string) => void;
  toggleProjectExpansion: (projectId: string) => void;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
}

export const useSandboxNavigationStore = create<SandboxNavigationState>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      expandedOrganizations: {},
      expandedWorkspaces: {},
      expandedProjects: {},
      searchQuery: '',

      setViewMode: (mode) => 
        set({ viewMode: mode }),

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

      toggleProjectExpansion: (projectId) => 
        set((state) => ({
          expandedProjects: {
            ...state.expandedProjects,
            [projectId]: !state.expandedProjects[projectId],
          },
        })),

      setSearchQuery: (query) => 
        set({ searchQuery: query }),

      clearSearchQuery: () => 
        set({ searchQuery: '' }),
    }),
    {
      name: 'kai-sandbox-navigation-storage', // unique name
      partialize: (state) => ({ 
        viewMode: state.viewMode,
        expandedOrganizations: state.expandedOrganizations,
        expandedWorkspaces: state.expandedWorkspaces,
        expandedProjects: state.expandedProjects,
        searchQuery: state.searchQuery,
      }), // only persist specific fields
    }
  )
);