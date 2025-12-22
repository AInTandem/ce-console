import { ChevronRight, ChevronDown, FolderOpen, Folder, FileCode, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import type { Organization, Workspace, Project, Workflow } from '@/lib/types';
import { useOrganizationCentricStore } from '@/stores/organization-centric-store';

interface TreeNodeProps {
  organizations: Organization[];
  workspaces: Workspace[];
  projects: Project[];
  workflows: Workflow[];
  isDeleteLocked: boolean;
  selectedOrganizationId: string | null;
  selectedWorkspaceId: string | null;
  selectedProjectId: string | null;
  onCreateWorkspace: (organizationId: string, name: string, folderPath: string) => void;
  onCreateProject: (workspaceId: string, name: string, folderPath: string, workflowId?: string) => void;
  onCreateSandbox: (projectId: string) => void;
  onDestroySandbox: (sandboxId: string) => void;
  onRecreateSandbox: (projectId: string, sandboxId: string) => void;
  onDeleteOrganization: (orgId: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onDeleteProject: (projectId: string, deleteFolder?: boolean) => void;
  onMoveProject: (projectId: string, targetWorkspaceId: string) => void;
  onChangeWorkflow: (projectId: string, workflowId: string | null) => void;
  onOrganizationSelect: (orgId: string) => void;
  onWorkspaceSelect: (wsId: string) => void;
  onProjectSelect: (projectId: string) => void;
  onOrganizationToggle: (orgId: string) => void;
  onWorkspaceToggle: (wsId: string) => void;
}

export function OrganizationTreeView({
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
  onOrganizationToggle,
  onWorkspaceToggle,
}: TreeNodeProps) {
  const { 
    expandedOrganizations, 
    expandedWorkspaces,
    toggleOrganizationExpansion,
    toggleWorkspaceExpansion
  } = useOrganizationCentricStore();

  if (organizations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No organizations found</h3>
        <p className="text-gray-500">Create your first organization to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {organizations.map(org => {
        const orgWorkspaces = workspaces.filter(ws => ws.organizationId === org.id);
        const isOrgExpanded = expandedOrganizations[org.id] || false;

        return (
          <div key={org.id} className="border rounded-lg p-3">
            <div 
              className={`flex items-center gap-2 cursor-pointer ${selectedOrganizationId === org.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
              onClick={() => onOrganizationSelect(org.id)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOrganizationToggle(org.id);
                  toggleOrganizationExpansion(org.id);
                }}
                className="hover:bg-gray-100 rounded p-1"
              >
                {isOrgExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isOrgExpanded ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-blue-500" />}
              <span className="font-semibold">{org.name}</span>
              <span className="text-xs text-gray-500">({org.folderPath})</span>
              
              <div className="ml-auto flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Open create workspace dialog
                  }}
                >
                  Add Workspace
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteOrganization(org.id);
                  }}
                  disabled={isDeleteLocked}
                >
                  Delete
                </Button>
              </div>
            </div>

            {isOrgExpanded && (
              <div className="ml-6 mt-2 space-y-2">
                {orgWorkspaces.map(workspace => {
                  const wsProjects = projects.filter(p => p.workspaceId === workspace.id);
                  const isWsExpanded = expandedWorkspaces[workspace.id] || false;

                  return (
                    <div key={workspace.id} className="border-l-2 border-gray-200 pl-3">
                      <div 
                        className={`flex items-center gap-2 cursor-pointer ${selectedWorkspaceId === workspace.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onWorkspaceSelect(workspace.id);
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onWorkspaceToggle(workspace.id);
                            toggleWorkspaceExpansion(workspace.id);
                          }}
                          className="hover:bg-gray-100 rounded p-1"
                        >
                          {isWsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {isWsExpanded ? <FolderOpen className="w-3 h-3 text-green-500" /> : <Folder className="w-3 h-3 text-green-500" />}
                        <span className="text-sm font-medium">{workspace.name}</span>
                        <span className="text-xs text-gray-500">({workspace.folderPath})</span>
                        
                        <div className="ml-auto flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Open create project dialog
                            }}
                          >
                            Add Project
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteWorkspace(workspace.id);
                            }}
                            disabled={isDeleteLocked}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      {isWsExpanded && (
                        <div className="ml-6 mt-2 space-y-2">
                          {wsProjects.map(project => {
                            const isProjectExpanded = selectedProjectId === project.id;
                            const workflow = project.workflowId 
                              ? workflows.find(w => w.id === project.workflowId)
                              : null;

                            return (
                              <div 
                                key={project.id} 
                                className={`border-l-2 border-gray-200 pl-3 ${isProjectExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                              >
                                <div 
                                  className="flex items-center gap-2 p-2 rounded cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onProjectSelect(project.id);
                                  }}
                                >
                                  <FileCode className="w-3 h-3 text-purple-500" />
                                  <span className="text-sm">{project.name}</span>
                                  <span className="text-xs text-gray-500">({project.folderPath})</span>
                                  
                                  {project.sandboxId && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                                  )}
                                  {workflow && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      {workflow.name}
                                    </span>
                                  )}
                                  
                                  <div className="ml-auto flex gap-1">
                                    {!project.sandboxId ? (
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onCreateSandbox(project.id);
                                        }}
                                      >
                                        Create Sandbox
                                      </Button>
                                    ) : (
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onDestroySandbox(project.sandboxId!);
                                          }}
                                        >
                                          Destroy
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onRecreateSandbox(project.id, project.sandboxId!);
                                          }}
                                        >
                                          Recreate
                                        </Button>
                                      </div>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Open move project dialog
                                        onMoveProject(project.id, workspace.id);
                                      }}
                                    >
                                      Move
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteProject(project.id);
                                      }}
                                      disabled={isDeleteLocked}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                                
                                {isProjectExpanded && project.sandboxId && (
                                  <div className="ml-6 mt-2 mb-2 p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                      <Box className="w-3 h-3 text-orange-500" />
                                      <span className="text-sm font-medium">Sandbox Controls</span>
                                      <StatusBadge status="running" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}