import { ChevronRight, ChevronDown, FolderOpen, Folder, FileCode, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { PortForwardDialog } from '@/components/port-forward-dialog';
import type { Organization, Workspace, Project, Sandbox } from '@/lib/types';
import { useSandboxNavigationStore } from '@/stores/sandbox-navigation-store';
import { useState } from 'react';

interface HierarchyNode {
  organizations: Organization[];
  workspaces: Workspace[];
  projects: Project[];
  sandboxes: Sandbox[];
}

interface HierarchyViewProps {
  data: HierarchyNode;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onEnterShell: (id: string, projectName: string) => void;
  onEnterDocs: (id: string, projectName: string) => void;
  onEnterTasks: (id: string, projectName: string) => void;
  searchQuery?: string;
}

export function HierarchyView({
  data,
  onStart,
  onStop,
  onEnterShell,
  onEnterDocs,
  onEnterTasks,
  searchQuery = ''
}: HierarchyViewProps) {
  // Use Zustand store for expansion state
  const {
    expandedOrganizations,
    expandedWorkspaces,
    expandedProjects,
    toggleOrganizationExpansion,
    toggleWorkspaceExpansion,
    toggleProjectExpansion
  } = useSandboxNavigationStore();
  
  // State for PortForwardDialog
  const [portDialogSandboxId, setPortDialogSandboxId] = useState<string | null>(null);
  const [portDialogSandboxName, setPortDialogSandboxName] = useState<string>('');
  const [portDialogProjectName, setPortDialogProjectName] = useState<string>('');
  const [isPortDialogOpen, setIsPortDialogOpen] = useState(false);

  // Convert record objects to Sets for compatibility with existing code
  const expandedOrgsSet = new Set(Object.keys(expandedOrganizations).filter(key => expandedOrganizations[key]));
  const expandedWorkspacesSet = new Set(Object.keys(expandedWorkspaces).filter(key => expandedWorkspaces[key]));
  const expandedProjectsSet = new Set(Object.keys(expandedProjects).filter(key => expandedProjects[key]));

  const toggleOrg = (id: string) => {
    toggleOrganizationExpansion(id);
  };

  const toggleWorkspace = (id: string) => {
    toggleWorkspaceExpansion(id);
  };

  const toggleProject = (id: string) => {
    toggleProjectExpansion(id);
  };

  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const handlePortForward = (sandboxId: string, sandboxName: string, projectName: string) => {
    setPortDialogSandboxId(sandboxId);
    setPortDialogSandboxName(sandboxName);
    setPortDialogProjectName(projectName);
    setIsPortDialogOpen(true);
  };

  const handlePortForwardSubmit = (port: number, routingType: 'path' | 'subdomain' = 'subdomain') => {
    if (portDialogSandboxId) {
      // Open port forwarding URL in a new tab based on routing type
      let url: string;
      if (routingType === 'subdomain') {
        url = `http://${portDialogSandboxName}.${port}.ainkai.127-0-0-1.sslip.io`;
      } else {
        url = `/flexy/${portDialogSandboxId}/port/${port}/`;
      }
      window.open(url, '_blank');
    }
    setIsPortDialogOpen(false);
  };

  // Filter data based on search
  const filteredData = {
    organizations: data.organizations.filter(org => {
      if (matchesSearch(org.name)) return true;
      // Check if any child matches
      const orgWorkspaces = data.workspaces.filter(ws => ws.organizationId === org.id);
      return orgWorkspaces.some(ws => {
        if (matchesSearch(ws.name)) return true;
        const wsProjects = data.projects.filter(p => p.workspaceId === ws.id);
        return wsProjects.some(p => {
          if (matchesSearch(p.name)) return true;
          const projectSandboxes = data.sandboxes.filter(s => s.projectId === p.id);
          return projectSandboxes.some(s => matchesSearch(s.name));
        });
      });
    }),
    workspaces: data.workspaces,
    projects: data.projects,
    sandboxes: data.sandboxes
  };

  return (
    <div className="space-y-2">
      {filteredData.organizations.map(org => {
        const orgWorkspaces = filteredData.workspaces.filter(ws => ws.organizationId === org.id);
        const isOrgExpanded = expandedOrgsSet.has(org.id);

        return (
          <div key={org.id} className="border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleOrg(org.id)}
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
                  const wsProjects = filteredData.projects.filter(p => p.workspaceId === workspace.id);
                  const isWsExpanded = expandedWorkspacesSet.has(workspace.id);

                  return (
                    <div key={workspace.id} className="border-l-2 border-gray-200 pl-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleWorkspace(workspace.id)}
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
                          {wsProjects.map(project => {
                            const projectSandboxes = filteredData.sandboxes.filter(s => s.projectId === project.id);
                            const isProjectExpanded = expandedProjectsSet.has(project.id);

                            return (
                              <div key={project.id} className="border-l-2 border-gray-200 pl-3">
                                <div className="flex items-center gap-2">
                                  {projectSandboxes.length > 0 && (
                                    <button
                                      onClick={() => toggleProject(project.id)}
                                      className="hover:bg-gray-100 rounded p-1"
                                    >
                                      {isProjectExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    </button>
                                  )}
                                  <FileCode className="w-3 h-3 text-purple-500" />
                                  <span className="text-sm">{project.name}</span>
                                  <span className="text-xs text-gray-500">({project.folderPath})</span>
                                  {projectSandboxes.length === 0 && (
                                    <span className="text-xs text-gray-400 italic">no sandbox</span>
                                  )}
                                </div>

                                {isProjectExpanded && projectSandboxes.length > 0 && (
                                  <div className="ml-6 mt-2 space-y-2">
                                    {projectSandboxes.map(sandbox => {
                                      const isRunning = sandbox.status === 'running';
                                      const nameParts = sandbox.name.split('-');
                                      const projectName = nameParts.length > 2 ? nameParts.slice(2).join('-') : sandbox.name;

                                      return (
                                        <div key={sandbox.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                          <Box className="w-3 h-3 text-orange-500" />
                                          <span className="text-sm flex-1">{projectName}</span>
                                          <StatusBadge status={sandbox.status} />
                                          <div className="flex gap-1">
                                            {isRunning ? (
                                              <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => onStop(sandbox.id)}
                                                className="h-7 text-xs px-2"
                                              >
                                                Stop
                                              </Button>
                                            ) : (
                                              <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => onStart(sandbox.id)}
                                                className="h-7 text-xs px-2"
                                              >
                                                Start
                                              </Button>
                                            )}
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => onEnterShell(sandbox.id, projectName)}
                                              disabled={!isRunning}
                                              className="h-7 text-xs px-2"
                                            >
                                              Shell
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => onEnterDocs(sandbox.id, projectName)}
                                              disabled={!isRunning}
                                              className="h-7 text-xs px-2"
                                            >
                                              Docs
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => onEnterTasks(sandbox.id, projectName)}
                                              disabled={!isRunning}
                                              className="h-7 text-xs px-2"
                                            >
                                              Tasks
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handlePortForward(sandbox.id, sandbox.name, projectName)}
                                              disabled={!isRunning}
                                              className="h-7 text-xs px-2"
                                            >
                                              Port
                                            </Button>
                                          </div>
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
            )}
          </div>
        );
      })}
      
      {/* Port Forward Dialog */}
      <PortForwardDialog
        isOpen={isPortDialogOpen}
        onClose={() => setIsPortDialogOpen(false)}
        onForward={handlePortForwardSubmit}
        sandboxId={portDialogSandboxId || ''}
        sandboxName={portDialogSandboxName || ''}
        projectName={portDialogProjectName}
      />
    </div>
  );
}
