import { ChevronRight, ChevronDown, FolderOpen, Folder, FileCode } from 'lucide-react';
import type { Organization, Workspace, Project } from '@/lib/types';

interface ExtendedProject extends Project {
  organizationId?: string;
  organizationName?: string;
  workspaceName?: string;
}

interface TreeViewProps {
  organizations: Organization[];
  workspaces: Workspace[];
  projects: ExtendedProject[];
  selectedOrganization: string | null;
  selectedWorkspace: string | null;
  selectedProject: string | null;
  expandedOrganizations: Record<string, boolean>;
  expandedWorkspaces: Record<string, boolean>;
  onOrganizationSelect: (orgId: string) => void;
  onWorkspaceSelect: (wsId: string) => void;
  onProjectSelect: (projectId: string) => void;
  onOrganizationToggle: (orgId: string) => void;
  onWorkspaceToggle: (wsId: string) => void;
}

export function TreeView({
  organizations,
  workspaces,
  projects,
  selectedOrganization,
  selectedWorkspace,
  selectedProject,
  expandedOrganizations,
  expandedWorkspaces,
  onOrganizationSelect,
  onWorkspaceSelect,
  onProjectSelect,
  onOrganizationToggle,
  onWorkspaceToggle,
}: TreeViewProps) {
  return (
    <div className="col-span-12">
      <h2 className="text-xl font-semibold mb-4">Organization Hierarchy</h2>
      <div className="space-y-2">
        {organizations.map(org => {
          const orgWorkspaces = workspaces.filter(ws => ws.organizationId === org.id);
          const isOrgExpanded = expandedOrganizations[org.id] || false;

          return (
            <div key={org.id} className="border rounded-lg p-3">
              <div 
                className={`flex items-center gap-2 cursor-pointer ${selectedOrganization === org.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                onClick={() => onOrganizationSelect(org.id)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent click
                    onOrganizationToggle(org.id);
                  }}
                  className="hover:bg-gray-100 rounded p-1"
                >
                  {isOrgExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {isOrgExpanded ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-blue-500" />}
                <span className="font-semibold">{org.name}</span>
                <span className="text-xs text-gray-500">({org.folderPath})</span>
              </div>

              {isOrgExpanded && (
                <div className="ml-6 mt-2 space-y-2">
                  {orgWorkspaces.map(workspace => {
                    const wsProjects = projects.filter(p => p.workspaceId === workspace.id);
                    const isWsExpanded = expandedWorkspaces[workspace.id] || false;

                    return (
                      <div key={workspace.id} className="border-l-2 border-gray-200 pl-3">
                        <div 
                          className={`flex items-center gap-2 cursor-pointer ${selectedWorkspace === workspace.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering parent click
                            onWorkspaceSelect(workspace.id);
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering parent click
                              onWorkspaceToggle(workspace.id);
                            }}
                            className="hover:bg-gray-100 rounded p-1"
                          >
                            {isWsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                          {isWsExpanded ? <FolderOpen className="w-3 h-3 text-green-500" /> : <Folder className="w-3 h-3 text-green-500" />}
                          <span className="text-sm font-medium">{workspace.name}</span>
                          <span className="text-xs text-gray-500">({workspace.folderPath})</span>
                        </div>

                        {isWsExpanded && (
                          <div className="ml-6 mt-2 space-y-2">
                            {wsProjects.map(proj => (
                              <div 
                                key={proj.id} 
                                className={`flex items-center gap-2 p-2 rounded ${selectedProject === proj.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent triggering parent click
                                  onProjectSelect(proj.id);
                                }}
                              >
                                <FileCode className="w-3 h-3 text-purple-500" />
                                <span className="text-sm">{proj.name}</span>
                                <span className="text-xs text-gray-500">({proj.folderPath})</span>
                                {proj.sandboxId && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                                )}
                                {proj.workflowId && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Workflow</span>
                                )}
                              </div>
                            ))}
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
    </div>
  );
}