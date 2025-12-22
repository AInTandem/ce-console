import { useMemo } from 'react';
import { useWorkflowCentricStore } from '@/stores/workflow-centric-store';
import { WorkflowLifecycleView } from './workflow-lifecycle-view';
import { WorkflowListView } from './workflow-list-view';
import type { Workflow, Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/sandbox/search-bar';
import { 
  GitGraph,
  List,
  X,
  Plus,
  Upload
} from 'lucide-react';

interface WorkflowCentricViewProps {
  workflows: Workflow[];
  projects: Project[];
  onCreateWorkflow: (name: string, description: string) => void;
  onDeleteWorkflow: (id: string) => void;
  onChangeWorkflowStatus: (id: string, status: 'published' | 'draft' | 'archived') => void;
  onExportWorkflow: (id: string) => void;
  onWorkflowSelect: (workflowId: string) => void;
}

export function WorkflowCentricView({
  workflows,
  projects,
  onCreateWorkflow,
  onDeleteWorkflow,
  onChangeWorkflowStatus,
  onExportWorkflow,
  onWorkflowSelect,
}: WorkflowCentricViewProps) {
  const { 
    viewMode, 
    searchQuery, 
    statusFilter,
    sortBy,
    sortOrder,
    selectedWorkflowId,
    setViewMode,
    setSearchQuery,
    setStatusFilter,
    clearFilters
  } = useWorkflowCentricStore();

  // Filter workflows based on search query and status filter
  const filteredWorkflows = useMemo(() => {
    let result = [...workflows];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(workflow => 
        workflow.name.toLowerCase().includes(query) ||
        workflow.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(workflow => workflow.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [workflows, projects, searchQuery, statusFilter, sortBy, sortOrder]);

  // Calculate usage statistics
  const workflowStats = useMemo(() => {
    const stats: Record<string, { usageCount: number; lastUsed?: string }> = {};
    
    workflows.forEach(workflow => {
      const workflowProjects = projects.filter(p => p.workflowId === workflow.id);
      const usageCount = workflowProjects.length;
      
      // Find the most recent project creation date as "last used"
      const lastUsed = workflowProjects.length > 0 
        ? workflowProjects.reduce((latest, project) => {
          return new Date(project.createdAt) > new Date(latest) 
            ? project.createdAt 
            : latest;
        }, workflowProjects[0].createdAt)
        : undefined;
      
      stats[workflow.id] = { usageCount, lastUsed };
    });
    
    return stats;
  }, [workflows, projects]);

  return (
    <div className="col-span-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Workflows</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-md overflow-hidden border">
            <Button
              variant={viewMode === 'lifecycle' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none border-0"
              onClick={() => setViewMode('lifecycle')}
            >
              <GitGraph className="w-4 h-4 mr-2" />
              Lifecycle
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none border-0 border-l"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
          
          {/* Action Buttons */}
          <Button 
            size="sm"
            onClick={() => {
              // For now, we'll just trigger the creation process on the parent component
              // since we don't have a workflow editor dialog component
              onCreateWorkflow('New Workflow', '');
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
          
          <Button size="sm" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search workflows by name or description..."
        />
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm font-medium text-gray-700">Status:</span>
        
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'published' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('published')}
        >
          Published
        </Button>
        <Button
          variant={statusFilter === 'draft' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('draft')}
        >
          Draft
        </Button>
        <Button
          variant={statusFilter === 'archived' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('archived')}
        >
          Archived
        </Button>
        
        {/* Active Filters */}
        {(searchQuery || statusFilter !== 'all') && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            {searchQuery && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span>Search: "{searchQuery}"</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {statusFilter !== 'all' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <span>Status: {statusFilter}</span>
                <button 
                  onClick={() => setStatusFilter('all')}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-sm h-8"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
      
      {/* View Content */}
      {viewMode === 'lifecycle' ? (
        <WorkflowLifecycleView
          workflows={filteredWorkflows}
          workflowStats={workflowStats}
          selectedWorkflowId={selectedWorkflowId}
          onWorkflowSelect={onWorkflowSelect}
          onWorkflowEdit={(id) => {
            // TODO: Open workflow editor
            console.log('Edit workflow', id);
          }}
          onWorkflowClone={(id) => {
            // TODO: Open clone dialog
            console.log('Clone workflow', id);
          }}
          onWorkflowDelete={onDeleteWorkflow}
          onWorkflowStatusChange={onChangeWorkflowStatus}
          onWorkflowExport={onExportWorkflow}
        />
      ) : (
        <WorkflowListView
          workflows={filteredWorkflows}
          workflowStats={workflowStats}
          selectedWorkflowId={selectedWorkflowId}
          onWorkflowSelect={onWorkflowSelect}
          onWorkflowEdit={(id) => {
            // TODO: Open workflow editor
            console.log('Edit workflow', id);
          }}
          onWorkflowClone={(id) => {
            // TODO: Open clone dialog
            console.log('Clone workflow', id);
          }}
          onWorkflowDelete={onDeleteWorkflow}
          onWorkflowStatusChange={onChangeWorkflowStatus}
          onWorkflowExport={onExportWorkflow}
        />
      )}
    </div>
  );
}