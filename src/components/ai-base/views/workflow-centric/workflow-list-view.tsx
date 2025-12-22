import { useState } from 'react';
import { 
  Play, 
  FileEdit, 
  Copy, 
  Download, 
  Trash2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Workflow } from '@/lib/types';

interface WorkflowListViewProps {
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

export function WorkflowListView({
  workflows,
  workflowStats,
  selectedWorkflowId,
  onWorkflowSelect,
  onWorkflowEdit,
  onWorkflowClone,
  onWorkflowDelete,
  onWorkflowStatusChange,
  onWorkflowExport,
}: WorkflowListViewProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Workflow; direction: 'asc' | 'desc' } | null>(null);
  const [deletingWorkflowId, setDeletingWorkflowId] = useState<string | null>(null);

  const handleSort = (key: keyof Workflow) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedWorkflows = [...workflows];
  if (sortConfig !== null) {
    sortedWorkflows.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
    case 'published': return <Badge variant="default">Published</Badge>;
    case 'draft': return <Badge variant="secondary">Draft</Badge>;
    case 'archived': return <Badge variant="outline">Archived</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No workflows found</h3>
        <p className="text-gray-500">Create your first workflow to get started</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button 
                className="flex items-center hover:text-gray-700"
                onClick={() => handleSort('name')}
              >
                Workflow
                {sortConfig?.key === 'name' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </span>
                )}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button 
                className="flex items-center hover:text-gray-700"
                onClick={() => handleSort('status')}
              >
                Status
                {sortConfig?.key === 'status' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </span>
                )}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Version
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Used
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedWorkflows.map(workflow => {
            const stats = workflowStats[workflow.id] || { usageCount: 0, lastUsed: undefined };
            const isSelected = selectedWorkflowId === workflow.id;
            const isDeleting = deletingWorkflowId === workflow.id;

            return (
              <tr 
                key={workflow.id} 
                className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div 
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                        onClick={() => onWorkflowSelect(workflow.id)}
                      >
                        {workflow.name}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">{workflow.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(workflow.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  v{workflow.currentVersion || 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats.usageCount} projects
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats.lastUsed ? new Date(stats.lastUsed).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-1">
                    {workflow.status === 'published' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onWorkflowEdit(workflow.id)}
                        >
                          <FileEdit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onWorkflowClone(workflow.id)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Clone
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onWorkflowExport(workflow.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeletingWorkflowId(
                            deletingWorkflowId === workflow.id ? null : workflow.id
                          )}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}
                    
                    {workflow.status === 'draft' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onWorkflowEdit(workflow.id)}
                        >
                          <FileEdit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onWorkflowStatusChange(workflow.id, 'published')}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Publish
                        </Button>
                      </>
                    )}
                    
                    {workflow.status === 'archived' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onWorkflowClone(workflow.id)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Clone
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onWorkflowStatusChange(workflow.id, 'published')}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Unarchive
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {isDeleting && (
                    <div className="mt-2 p-3 bg-red-50 rounded border border-red-200">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}