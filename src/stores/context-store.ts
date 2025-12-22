/**
 * Context Store
 * Zustand state management for context/memory system
 */

import { create } from 'zustand';
import type {
  Memory,
  CreateMemoryInput,
  UpdateMemoryInput,
  MemorySearchOptions,
  MemoryFilters,
  MemoryStats,
  MemoryScope,
} from '../types/context';
import * as contextApi from '../lib/context-api';

interface ContextState {
  // Data
  memories: Memory[];
  searchResults: Memory[];
  selectedMemory: Memory | null;
  stats: MemoryStats | null;

  // UI State
  filters: MemoryFilters;
  isLoading: boolean;
  error: string | null;

  // Search state
  searchQuery: string;
  isSearching: boolean;

  // Current scope
  currentScope: { type: MemoryScope; id: string } | null;

  // Actions - Memory CRUD
  createMemory: (input: CreateMemoryInput) => Promise<Memory>;
  updateMemory: (id: string, updates: UpdateMemoryInput) => Promise<Memory>;
  deleteMemory: (id: string) => Promise<void>;
  selectMemory: (memory: Memory | null) => void;

  // Actions - Fetching
  fetchMemories: (scope?: { type: MemoryScope; id: string }, options?: { memory_type?: string; tags?: string[]; limit?: number; include_inherited?: boolean }) => Promise<void>;
  fetchHierarchicalMemories: (scope: { type: MemoryScope; id: string }) => Promise<void>;
  searchMemories: (options: MemorySearchOptions) => Promise<void>;
  fetchMemoryStats: (scope?: { type: MemoryScope; id: string }) => Promise<void>;

  // Actions - Filters
  setFilters: (filters: Partial<MemoryFilters>) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  setCurrentScope: (scope: { type: MemoryScope; id: string } | null) => void;

  // Actions - Utility
  clearError: () => void;
  reset: () => void;
}

const initialFilters: MemoryFilters = {
  types: [],
  tags: [],
  visibility: [],
  searchQuery: '',
};

export const useContextStore = create<ContextState>((set, get) => ({
  // Initial state
  memories: [],
  searchResults: [],
  selectedMemory: null,
  stats: null,

  filters: initialFilters,
  isLoading: false,
  error: null,

  searchQuery: '',
  isSearching: false,

  currentScope: null,

  // Memory CRUD
  createMemory: async (input: CreateMemoryInput) => {
    set({ isLoading: true, error: null });
    try {
      const memory = await contextApi.createMemory(input);
      set((state) => ({
        memories: [memory, ...state.memories],
        isLoading: false,
      }));
      return memory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create memory';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateMemory: async (id: string, updates: UpdateMemoryInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedMemory = await contextApi.updateMemory(id, updates);
      set((state) => ({
        memories: state.memories.map((m) => (m.id === id ? updatedMemory : m)),
        selectedMemory: state.selectedMemory?.id === id ? updatedMemory : state.selectedMemory,
        isLoading: false,
      }));
      return updatedMemory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update memory';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteMemory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await contextApi.deleteMemory(id);
      set((state) => ({
        memories: state.memories.filter((m) => m.id !== id),
        selectedMemory: state.selectedMemory?.id === id ? null : state.selectedMemory,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete memory';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  selectMemory: (memory: Memory | null) => {
    set({ selectedMemory: memory });
  },

  // Fetching
  fetchMemories: async (scope, options) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, currentScope } = get();
      const effectiveScope = scope || currentScope;

      if (!effectiveScope) {
        // Context-manager requires scope - don't fetch without it
        set({ memories: [], isLoading: false });
        return;
      }

      // Merge filters into options
      const mergedOptions = {
        memory_type: filters.types.length > 0 ? filters.types[0] : options?.memory_type,
        tags: filters.tags.length > 0 ? filters.tags : options?.tags,
        limit: options?.limit,
        include_inherited: options?.include_inherited !== false,
      };

      const response = await contextApi.getMemoriesForScope(
        effectiveScope.type,
        effectiveScope.id,
        mergedOptions
      );

      // Response can be either GetMemoriesResponse or SearchMemoriesResponse
      const memories = 'memories' in response ? response.memories : response.results;
      set({ memories, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch memories';
      set({ error: errorMessage, isLoading: false, memories: [] });
    }
  },

  fetchHierarchicalMemories: async (scope) => {
    set({ isLoading: true, error: null });
    try {
      const response = await contextApi.getHierarchicalContext(
        scope.type,
        scope.id
      );

      // Response contains hierarchical structure, extract memories
      set({ memories: response.memories || [], isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hierarchical memories';
      set({ error: errorMessage, isLoading: false, memories: [] });
    }
  },

  searchMemories: async (options) => {
    set({ isSearching: true, error: null, searchQuery: options.query });
    try {
      const { filters } = get();

      // Merge filters into options
      const mergedOptions: MemorySearchOptions = {
        ...options,
        memory_type: filters.types.length > 0 ? filters.types[0] : options.memory_type,
        include_inherited: options.include_inherited !== false,
      };

      const response = await contextApi.searchMemories(mergedOptions);
      set({ searchResults: response.results, isSearching: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      set({ error: errorMessage, isSearching: false, searchResults: [] });
    }
  },

  fetchMemoryStats: async (scope) => {
    try {
      const stats = await contextApi.getMemoryStats(scope);
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch memory stats:', error);
    }
  },

  // Filters
  setFilters: (newFilters: Partial<MemoryFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setCurrentScope: (scope: { type: MemoryScope; id: string } | null) => {
    set({ currentScope: scope });
  },

  // Utility
  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      memories: [],
      searchResults: [],
      selectedMemory: null,
      stats: null,
      filters: initialFilters,
      isLoading: false,
      error: null,
      searchQuery: '',
      isSearching: false,
      currentScope: null,
    });
  },
}));
