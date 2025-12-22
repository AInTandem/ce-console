/**
 * Context Browser Component
 * List and filter memories with search
 */

import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Plus, RefreshCw, List, TreePine, Upload } from 'lucide-react';
import { MemoryCard } from './memory-card';
import { ContextEditor } from './context-editor';
import { ContextHierarchyView } from './context-hierarchy-view';
import { FileImportDialog } from './file-import-dialog';
import { SyncStatusIndicator } from './sync-status-indicator';

import { useContextStore } from '../../stores/context-store';
import type { Memory, MemoryScope } from '../../types/context';

interface ContextBrowserProps {
  scope?: { type: MemoryScope; id: string };
  hierarchyIds?: {
    organizationId?: string;
    workspaceId?: string;
    projectId?: string;
  };
  memoryTypes?: string[]; // Optional types to filter by
}

export function ContextBrowser({ scope, hierarchyIds, memoryTypes }: ContextBrowserProps) {
  const {
    memories,
    searchResults,
    filters,
    isLoading,
    searchQuery,
    isSearching,
    fetchMemories,
    searchMemories,
    setFilters,
    deleteMemory,
    selectMemory,
  } = useContextStore();

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'flat' | 'hierarchical'>('flat');
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Update filters and fetch when memoryTypes prop changes, but only if different
  useEffect(() => {
    // Compare new memoryTypes with current filters to avoid unnecessary updates
    const currentTypes = filters.types || [];
    if (memoryTypes) {
      // Check if arrays are different (comparing length and content)
      if (currentTypes.length !== memoryTypes.length || 
          !currentTypes.every((val, idx) => val === memoryTypes[idx])) {
        console.log('ContextBrowser: Switching to category:', memoryTypes);
        // Update filters and then fetch memories with new filters
        setFilters({ types: memoryTypes });
        
        // Fetch with the new scope and hierarchy IDs (filters will be used automatically)
        if (scope) {
          fetchMemories(scope, {
            include_inherited: true,
            ...hierarchyIds,
          });
        } else {
          fetchMemories();
        }
      }
    } else if (currentTypes.length > 0) {
      // If memoryTypes is undefined/null but filters has types, clear filters and refetch
      console.log('ContextBrowser: Switching to "All Memories" category');
      setFilters({ types: [] });

      if (scope) {
        fetchMemories(scope, {
          include_inherited: true,
          ...hierarchyIds,
        });
      } else {
        fetchMemories();
      }
    }
  }, [memoryTypes, setFilters, fetchMemories, scope, hierarchyIds]);

  // Fetch memories on mount and when scope changes (for initial load and scope changes)
  useEffect(() => {
    // Only fetch if we have a scope (required by context-manager API)
    if (scope) {
      fetchMemories(scope, {
        include_inherited: true,
        ...hierarchyIds,
      });
    }
    // If no scope provided, don't fetch - wait for parent to provide scope
  }, [scope?.type, scope?.id, memoryTypes]); // Only run when scope changes

  const handleSearch = () => {
    if (localSearchQuery.trim() && scope) {
      searchMemories({
        query: localSearchQuery,
        scope: scope.type,
        scope_id: scope.id,
        include_inherited: true,
      });
    } else {
      fetchMemories(scope, { include_inherited: true, ...hierarchyIds });
    }
  };

  const handleRefresh = () => {
    setLocalSearchQuery('');
    fetchMemories(scope, { include_inherited: true, ...hierarchyIds });
  };



  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    selectMemory(memory);
    setEditorOpen(true);
  };

  const handleDelete = async (memory: Memory) => {
    if (deleteConfirm === memory.id) {
      try {
        await deleteMemory(memory.id);
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete memory:', error);
      }
    } else {
      setDeleteConfirm(memory.id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleCreateNew = () => {
    setEditingMemory(null);
    selectMemory(null);
    setEditorOpen(true);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'flat' ? 'hierarchical' : 'flat');
  };

  const displayMemories = searchQuery ? searchResults : memories;

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* View Mode Toggle */}
          <Button 
            variant={viewMode === 'hierarchical' ? 'default' : 'outline'} 
            size="sm"
            onClick={toggleViewMode}
          >
            {viewMode === 'hierarchical' ? <TreePine className="h-4 w-4 mr-2" /> : <List className="h-4 w-4 mr-2" />}
            {viewMode === 'hierarchical' ? 'Hierarchical' : 'Flat'} View
          </Button>
          
          {/* Search Button */}
          <Button onClick={handleSearch} disabled={isSearching} className="whitespace-nowrap">
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="flex gap-2">
          {scope && <SyncStatusIndicator scope={scope} />}
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          {scope && (
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          )}
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Memory
          </Button>
        </div>
      </div>



      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {displayMemories.length} {displayMemories.length === 1 ? 'memory' : 'memories'}
          {filters.types.length > 0 && ' (filtered)'}
        </span>
        {searchQuery && <span>Search results for: "{searchQuery}"</span>}
      </div>

      {/* Memory List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading memories...</div>
      ) : viewMode === 'hierarchical' ? (        <ContextHierarchyView defaultScope={scope} />      ) : displayMemories.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-muted-foreground">No memories found</p>
          <Button variant="outline" onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Memory
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {displayMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onEdit={handleEdit}
              onDelete={(m) => handleDelete(m)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg">
          Click delete again to confirm
        </div>
      )}

      {/* Editor Dialog */}
      <ContextEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        memory={editingMemory}
        defaultScope={scope}
      />

      {/* File Import Dialog */}
      <FileImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        defaultScope={scope}
        onImportComplete={() => {
          // Refresh memories after import
          if (scope) {
            fetchMemories(scope, { include_inherited: true });
          }
        }}
      />
    </div>
  );
}
