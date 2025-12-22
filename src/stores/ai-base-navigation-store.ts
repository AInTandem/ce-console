import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AIBaseNavigationState {
  selectedOrganization: string | null;
  selectedWorkspace: string | null;
  selectedProject: string | null;
  viewMode: 'hierarchy' | 'grid' | 'list' | 'tree' | 'project-centric' | 'org-centric' | 'workflow-centric';
  expandedOrganizations: Record<string, boolean>;
  expandedWorkspaces: Record<string, boolean>;
  isDeleteLocked: boolean;

  // Actions to update state
  setSelectedOrganization: (orgId: string | null) => void;
  setSelectedWorkspace: (wsId: string | null) => void;
  setSelectedProject: (projectId: string | null) => void;
  setViewMode: (mode: 'hierarchy' | 'grid' | 'list' | 'tree' | 'project-centric' | 'org-centric' | 'workflow-centric') => void;
  toggleOrganizationExpansion: (orgId: string) => void;
  toggleWorkspaceExpansion: (wsId: string) => void;
  setIsDeleteLocked: (locked: boolean) => void;
  resetWorkspaceAndProject: () => void;
  resetProject: () => void;
}

// Create a separate store for UI state (dialogs and forms)
export const useAIBaseNavigationStore = create<AIBaseNavigationState>()(
  persist(
    (set) => ({
      selectedOrganization: null,
      selectedWorkspace: null,
      selectedProject: null,
      viewMode: 'hierarchy',
      expandedOrganizations: {},
      expandedWorkspaces: {},
      isDeleteLocked: true,

      setSelectedOrganization: (orgId) => 
        set((state) => ({
          selectedOrganization: orgId,
          // Reset workspace and project when organization changes
          selectedWorkspace: orgId !== state.selectedOrganization ? null : state.selectedWorkspace,
          selectedProject: orgId !== state.selectedOrganization ? null : state.selectedProject,
        })),

      setSelectedWorkspace: (wsId) => 
        set((state) => ({
          selectedWorkspace: wsId,
          // Reset project when workspace changes
          selectedProject: wsId !== state.selectedWorkspace ? null : state.selectedProject,
        })),

      setSelectedProject: (projectId) => 
        set({ selectedProject: projectId }),

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

      setIsDeleteLocked: (locked) => 
        set({ isDeleteLocked: locked }),

      resetWorkspaceAndProject: () => 
        set({ selectedWorkspace: null, selectedProject: null }),

      resetProject: () => 
        set({ selectedProject: null }),
    }),
    {
      name: 'kai-ai-base-navigation-storage', // unique name
      partialize: (state) => ({ 
        selectedOrganization: state.selectedOrganization,
        selectedWorkspace: state.selectedWorkspace,
        selectedProject: state.selectedProject,
        viewMode: state.viewMode,
        expandedOrganizations: state.expandedOrganizations,
        expandedWorkspaces: state.expandedWorkspaces,
        isDeleteLocked: state.isDeleteLocked,
      }), // only persist specific fields
    }
  )
);