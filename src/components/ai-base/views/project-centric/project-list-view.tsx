import { useState } from 'react';
import { ChevronDown, ChevronRight, FileCode } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import type { ExtendedProject, Workflow } from '@/lib/types';
import { useProjectCentricStore } from '@/stores/project-centric-store';

interface ProjectListViewProps {
  projects: ExtendedProject[];
  workflows: Workflow[];
  onCreateSandbox: (projectId: string) => void;
  onDestroySandbox: (sandboxId: string) => void;
  onProjectSelect: (projectId: string) => void;
}

export function ProjectListView({
  projects,
  workflows,
  onCreateSandbox,
  onDestroySandbox,
  onProjectSelect,
}: ProjectListViewProps) {
  const { expandedProjects, toggleProjectExpansion } = useProjectCentricStore();
  const [sortConfig, setSortConfig] = useState<{ key: keyof ExtendedProject; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof ExtendedProject) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProjects = [...projects];
  if (sortConfig !== null) {
    sortedProjects.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      if (valueA !== null && valueA !== undefined && valueB !== null && valueB !== undefined) {
        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  const getWorkflowName = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.workflowId) return 'None';
    const workflow = workflows.find(w => w.id === project.workflowId);
    return workflow?.name || 'Unknown';
  };

  const getWorkflowPhase = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.workflowState || !project.workflowState.currentPhaseId) return 'Not started';
    
    // Map phase IDs to display names
    const phaseMap: Record<string, string> = {
      'rapid-prototyping': 'Rapid Prototyping',
      'automated-qa': 'Automated QA',
      'continuous-optimization': 'Continuous Optimization'
    };
    
    return phaseMap[project.workflowState.currentPhaseId] || project.workflowState.currentPhaseId;
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
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
                Project
                {sortConfig?.key === 'name' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button 
                className="flex items-center hover:text-gray-700"
                onClick={() => handleSort('organizationName')}
              >
                Organization
                {sortConfig?.key === 'organizationName' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button 
                className="flex items-center hover:text-gray-700"
                onClick={() => handleSort('workspaceName')}
              >
                Workspace
                {sortConfig?.key === 'workspaceName' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Workflow
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedProjects.map(project => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <button
                    onClick={() => toggleProjectExpansion(project.id)}
                    className="mr-2 p-1 rounded hover:bg-gray-200"
                  >
                    {expandedProjects[project.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <FileCode className="w-5 h-5 text-purple-500 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.folderPath}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{project.organizationName || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{project.workspaceName || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{getWorkflowName(project.id)}</div>
                <div className="text-xs text-gray-500">{getWorkflowPhase(project.id)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {project.sandboxId ? (
                  <StatusBadge status="running" />
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    No Sandbox
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onProjectSelect(project.id)}
                  >
                    View
                  </Button>
                  {!project.sandboxId ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onCreateSandbox(project.id)}
                    >
                      Create Sandbox
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDestroySandbox(project.sandboxId!)}
                    >
                      Destroy
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}