import { useState } from 'react';
import { GitGraph, Circle, Play, FileEdit, Copy, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Workflow } from '@/lib/types';

interface WorkflowLifecycleViewProps {
  workflows: Workflow[];
  workflowStats: Record<string, { usageCount: number; lastUsed?: string }>;
  selectedWorkflowId: string | null;
  onWorkflowSelect: (workflowId: string) => void;
  onWorkflowEdit: (workflowId: string) => void;
  onWorkflowClone: (workflowId: string) => void;
  onWorkflowDelete: (workflowId: string) => void;
  onWorkflowStatusChange: (workflowId: string, status: 'published' | 'draft' | 'archived') => void;
  onWorkflowExport: (workflowId: string) => void;
}

export function WorkflowLifecycleView({
  workflows,
  workflowStats,
  selectedWorkflowId,
  onWorkflowSelect,
  onWorkflowEdit,
  onWorkflowClone,
  onWorkflowDelete,
  onWorkflowStatusChange,
  onWorkflowExport,
}: WorkflowLifecycleViewProps) {
  const [deletingWorkflowId, setDeletingWorkflowId] = useState<string | null>(null);

  if (workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <GitGraph className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No workflows found</h3>
        <p className="text-gray-500">Create your first workflow to get started</p>
      </div>
    );
  }

  // Group workflows by status for lifecycle view
  const workflowsByStatus = {
    published: workflows.filter(w => w.status === 'published'),
    draft: workflows.filter(w => w.status === 'draft'),
    archived: workflows.filter(w => w.status === 'archived'),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'published': return 'bg-green-500';
    case 'draft': return 'bg-yellow-500';
    case 'archived': return 'bg-gray-500';
    default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
    case 'published': return 'Published';
    case 'draft': return 'Draft';
    case 'archived': return 'Archived';
    default: return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Published Workflows */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Circle className="w-4 h-4 text-green-500 mr-2" />
            Published Workflows
            <Badge className="ml-2" variant="secondary">
              {workflowsByStatus.published.length}
            </Badge>
          </h3>
        </div>
        
        {workflowsByStatus.published.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No published workflows yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowsByStatus.published.map(workflow => {
              const stats = workflowStats[workflow.id] || { usageCount: 0 };
              const isSelected = selectedWorkflowId === workflow.id;
              
              return (
                <div 
                  key={workflow.id} 
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => onWorkflowSelect(workflow.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{workflow.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{workflow.description}</p>
                    </div>
                    <Badge className={getStatusColor(workflow.status)}>
                      {getStatusText(workflow.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>v{workflow.currentVersion || 1}</span>
                    <span>{stats.usageCount} projects</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      onWorkflowEdit(workflow.id);
                    }}>
                      <FileEdit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      onWorkflowClone(workflow.id);
                    }}>
                      <Copy className="w-3 h-3 mr-1" />
                      Clone
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      onWorkflowExport(workflow.id);
                    }}>
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingWorkflowId(deletingWorkflowId === workflow.id ? null : workflow.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                  
                  {deletingWorkflowId === workflow.id && (
                    <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                      <p className="text-sm text-red-800 mb-2">
                        Are you sure you want to delete this workflow? This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => onWorkflowDelete(workflow.id)}
                        >
                          Confirm Delete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setDeletingWorkflowId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Draft Workflows */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Circle className="w-4 h-4 text-yellow-500 mr-2" />
            Draft Workflows
            <Badge className="ml-2" variant="secondary">
              {workflowsByStatus.draft.length}
            </Badge>
          </h3>
        </div>
        
        {workflowsByStatus.draft.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No draft workflows yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowsByStatus.draft.map(workflow => {
              const stats = workflowStats[workflow.id] || { usageCount: 0 };
              const isSelected = selectedWorkflowId === workflow.id;
              
              return (
                <div 
                  key={workflow.id} 
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => onWorkflowSelect(workflow.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{workflow.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{workflow.description}</p>
                    </div>
                    <Badge className={getStatusColor(workflow.status)}>
                      {getStatusText(workflow.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>v{workflow.currentVersion || 1}</span>
                    <span>{stats.usageCount} projects</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      onWorkflowEdit(workflow.id);
                    }}>
                      <FileEdit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      onWorkflowClone(workflow.id);
                    }}>
                      <Copy className="w-3 h-3 mr-1" />
                      Clone
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        onWorkflowStatusChange(workflow.id, 'published');
                      }}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Publish
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Archived Workflows */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Circle className="w-4 h-4 text-gray-500 mr-2" />
            Archived Workflows
            <Badge className="ml-2" variant="secondary">
              {workflowsByStatus.archived.length}
            </Badge>
          </h3>
        </div>
        
        {workflowsByStatus.archived.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No archived workflows yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowsByStatus.archived.map(workflow => {
              const stats = workflowStats[workflow.id] || { usageCount: 0 };
              const isSelected = selectedWorkflowId === workflow.id;
              
              return (
                <div 
                  key={workflow.id} 
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => onWorkflowSelect(workflow.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{workflow.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{workflow.description}</p>
                    </div>
                    <Badge className={getStatusColor(workflow.status)}>
                      {getStatusText(workflow.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>v{workflow.currentVersion || 1}</span>
                    <span>{stats.usageCount} projects</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      onWorkflowClone(workflow.id);
                    }}>
                      <Copy className="w-3 h-3 mr-1" />
                      Clone
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        onWorkflowStatusChange(workflow.id, 'published');
                      }}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Unarchive
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}