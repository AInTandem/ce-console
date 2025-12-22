import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkflowCentricState {
  // View mode for workflow-centric view
  viewMode: 'lifecycle' | 'list';
  
  // Search and filter state
  searchQuery: string;
  statusFilter: 'all' | 'published' | 'draft' | 'archived';
  phaseFilter: 'all' | 'rapid-prototyping' | 'automated-qa' | 'continuous-optimization';
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'status';
  sortOrder: 'asc' | 'desc';
  
  // Selection state (specific to workflow-centric view)
  selectedWorkflowId: string | null;
  selectedPhaseId: string | null;
  
  // Expansion state for lifecycle view
  expandedWorkflows: Record<string, boolean>;
  expandedPhases: Record<string, boolean>;

  // Actions to update state
  setViewMode: (mode: 'lifecycle' | 'list') => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'all' | 'published' | 'draft' | 'archived') => void;
  setPhaseFilter: (filter: 'all' | 'rapid-prototyping' | 'automated-qa' | 'continuous-optimization') => void;
  setSortBy: (sortBy: 'name' | 'createdAt' | 'updatedAt' | 'status') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setSelectedWorkflowId: (workflowId: string | null) => void;
  setSelectedPhaseId: (phaseId: string | null) => void;
  toggleWorkflowExpansion: (workflowId: string) => void;
  togglePhaseExpansion: (phaseId: string) => void;
  clearFilters: () => void;
  resetSelection: () => void;
}

export const useWorkflowCentricStore = create<WorkflowCentricState>()(
  persist(
    (set) => ({
      viewMode: 'lifecycle',
      searchQuery: '',
      statusFilter: 'all',
      phaseFilter: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      selectedWorkflowId: null,
      selectedPhaseId: null,
      expandedWorkflows: {},
      expandedPhases: {},

      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (filter) => set({ statusFilter: filter }),
      setPhaseFilter: (filter) => set({ phaseFilter: filter }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      setSelectedWorkflowId: (workflowId) => set({ selectedWorkflowId: workflowId }),
      setSelectedPhaseId: (phaseId) => set({ selectedPhaseId: phaseId }),
      toggleWorkflowExpansion: (workflowId) => 
        set((state) => ({
          expandedWorkflows: {
            ...state.expandedWorkflows,
            [workflowId]: !state.expandedWorkflows[workflowId],
          },
        })),
      togglePhaseExpansion: (phaseId) => 
        set((state) => ({
          expandedPhases: {
            ...state.expandedPhases,
            [phaseId]: !state.expandedPhases[phaseId],
          },
        })),
      clearFilters: () => 
        set({ 
          searchQuery: '', 
          statusFilter: 'all', 
          phaseFilter: 'all' 
        }),
      resetSelection: () => 
        set({ 
          selectedWorkflowId: null, 
          selectedPhaseId: null 
        }),
    }),
    {
      name: 'kai-workflow-centric-storage',
      partialize: (state) => ({ 
        viewMode: state.viewMode,
        searchQuery: state.searchQuery,
        statusFilter: state.statusFilter,
        phaseFilter: state.phaseFilter,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        expandedWorkflows: state.expandedWorkflows,
        expandedPhases: state.expandedPhases,
      }),
    }
  )
);