import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { Building2, Folder, FileText } from 'lucide-react';
import type { Organization, Workspace, Project, Workflow } from '@/lib/types';

// Define the flattened entity type
type FlattenedEntity = 
  | { 
      id: string; 
      type: 'organization'; 
      name: string; 
      folderPath: string; 
      parentId: null; 
      createdAt: string; 
    }
  | { 
      id: string; 
      type: 'workspace'; 
      name: string; 
      folderPath: string; 
      parentId: string; 
      createdAt: string; 
      organizationName: string | undefined; 
    }
  | { 
      id: string; 
      type: 'project'; 
      name: string; 
      folderPath: string; 
      parentId: string; 
      createdAt: string; 
      workspaceName: string | undefined; 
      organizationName: string | undefined; 
      sandboxId: string | undefined; 
      workflowId: string | undefined; 
    };

interface OrganizationFlatViewProps {
  organizations: Organization[];
  workspaces: Workspace[];
  projects: Project[];
  workflows: Workflow[];
  isDeleteLocked: boolean;
  selectedOrganizationId: string | null;
  selectedWorkspaceId: string | null;
  selectedProjectId: string | null;
  onCreateSandbox: (projectId: string) => void;
  onDestroySandbox: (sandboxId: string) => void;
  onRecreateSandbox: (projectId: string, sandboxId: string) => void;
  onDeleteOrganization: (orgId: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onDeleteProject: (projectId: string, deleteFolder2?: boolean) => void;
  onMoveProject: (projectId: string, targetWorkspaceId: string) => void;
  onOrganizationSelect: (orgId: string) => void;
  onWorkspaceSelect: (wsId: string) => void;
  onProjectSelect: (projectId: string) => void;
}

export function OrganizationFlatView({
  organizations,
  workspaces,
  projects,
  workflows,
  isDeleteLocked,
  selectedOrganizationId,
  selectedWorkspaceId,
  selectedProjectId,
  onCreateSandbox,
  onDestroySandbox,
  onRecreateSandbox,
  onDeleteOrganization,
  onDeleteWorkspace,
  onDeleteProject,
  onMoveProject,
  onOrganizationSelect,
  onWorkspaceSelect,
  onProjectSelect,
}: OrganizationFlatViewProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Combine all entities into a flat list for display
  const flattenedEntities: FlattenedEntity[] = [
    ...(organizations.map(org => ({
      id: org.id,
      type: 'organization' as const,
      name: org.name,
      folderPath: org.folderPath,
      parentId: null,
      createdAt: org.createdAt,
    })) as FlattenedEntity[]),
    ...(workspaces.map(ws => ({
      id: ws.id,
      type: 'workspace' as const,
      name: ws.name,
      folderPath: ws.folderPath,
      parentId: ws.organizationId,
      createdAt: ws.createdAt,
      organizationName: organizations.find(org => org.id === ws.organizationId)?.name,
    })) as FlattenedEntity[]),
    ...(projects.map(project => ({
      id: project.id,
      type: 'project' as const,
      name: project.name,
      folderPath: project.folderPath,
      parentId: project.workspaceId,
      createdAt: project.createdAt,
      workspaceName: workspaces.find(ws => ws.id === project.workspaceId)?.name,
      organizationName: organizations.find(org => 
        workspaces.find(ws => ws.id === project.workspaceId)?.organizationId === org.id
      )?.name,
      sandboxId: project.sandboxId,
      workflowId: project.workflowId,
    })) as FlattenedEntity[]),
  ];

  const sortedEntities = [...flattenedEntities];
  if (sortConfig !== null) {
    const currentSortConfig = sortConfig; // Capture the non-null value
    sortedEntities.sort((a, b) => {
      const aValue = a[currentSortConfig.key as keyof typeof a];
      const bValue = b[currentSortConfig.key as keyof typeof b];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return currentSortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return currentSortConfig.direction === 'asc' ? 1 : -1;
      
      if (aValue < bValue) {
        return currentSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return currentSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const getWorkflowName = (workflowId: string | undefined) => {
    if (!workflowId) return 'None';
    const workflow = workflows.find(w => w.id === workflowId);
    return workflow?.name || 'Unknown';
  };

  if (flattenedEntities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No entities found</h3>
        <p className="text-gray-500">Create your first organization to get started</p>
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
                Name
                {sortConfig?.key === 'name' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
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
          {sortedEntities.map((entity: FlattenedEntity) => {
            const isSelected = 
              (entity.type === 'organization' && entity.id === selectedOrganizationId) ||
              (entity.type === 'workspace' && entity.id === selectedWorkspaceId) ||
              (entity.type === 'project' && entity.id === selectedProjectId);

            return (
              <tr 
                key={entity.id} 
                className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {entity.type === 'organization' && <Building2 className="w-5 h-5 text-blue-500 mr-2" />}
                    {entity.type === 'workspace' && <Folder className="w-5 h-5 text-green-500 mr-2" />}
                    {entity.type === 'project' && <FileText className="w-5 h-5 text-purple-500 mr-2" />}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entity.name}</div>
                      <div className="text-sm text-gray-500">{entity.folderPath}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {entity.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {'organizationName' in entity ? entity.organizationName || '-' : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {'workspaceName' in entity ? entity.workspaceName || '-' : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entity.type === 'project' ? getWorkflowName((entity as any).workflowId) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entity.type === 'project' && (entity as any).sandboxId ? (
                    <StatusBadge status="running" />
                  ) : entity.type === 'project' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No Sandbox
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-1">
                    {entity.type === 'organization' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onOrganizationSelect(entity.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteOrganization(entity.id)}
                          disabled={isDeleteLocked}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {entity.type === 'workspace' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onWorkspaceSelect(entity.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteWorkspace(entity.id)}
                          disabled={isDeleteLocked}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {entity.type === 'project' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onProjectSelect(entity.id)}
                        >
                          View
                        </Button>
                        {!((entity as any).sandboxId) ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onCreateSandbox(entity.id)}
                          >
                            Create Sandbox
                          </Button>
                        ) : (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onDestroySandbox((entity as any).sandboxId!)}
                            >
                              Destroy
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRecreateSandbox(entity.id, (entity as any).sandboxId!)}
                            >
                              Recreate
                            </Button>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Find parent workspace ID
                            const parentWorkspaceId = (entity as any).parentId;
                            onMoveProject(entity.id, parentWorkspaceId);
                          }}
                        >
                          Move
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteProject(entity.id)}
                          disabled={isDeleteLocked}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}