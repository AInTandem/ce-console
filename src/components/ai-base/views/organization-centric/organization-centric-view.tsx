import { useMemo } from 'react';
import { useOrganizationCentricStore } from '@/stores/organization-centric-store';
import { OrganizationTreeView } from './organization-tree-view';
import { OrganizationFlatView } from './organization-flat-view';
import type { Organization, Workspace, Project, Workflow } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/sandbox/search-bar';
import { 
  GitBranch,
  List,
  X,
} from 'lucide-react';

interface OrganizationCentricViewProps {
  organizations: Organization[];
  workspaces: Workspace[];
  projects: Project[];
  workflows: Workflow[];
  isDeleteLocked: boolean;
  onCreateSandbox: (projectId: string) => void;
  onDestroySandbox: (sandboxId: string) => void;
  onRecreateSandbox: (projectId: string, sandboxId: string) => void;
  onDeleteOrganization: (orgId: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onDeleteProject: (projectId: string, deleteFolder?: boolean) => void;
  onMoveProject: (projectId: string, targetWorkspaceId: string) => void;
  onOrganizationSelect: (orgId: string) => void;
  onWorkspaceSelect: (wsId: string) => void;
  onProjectSelect: (projectId: string) => void;
}

export function OrganizationCentricView({
  organizations,
  workspaces,
  projects,
  workflows,
  isDeleteLocked,
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
}: OrganizationCentricViewProps) {
  const { 
    viewMode, 
    searchQuery, 
    selectedOrganizationId,
    selectedWorkspaceId,
    selectedProjectId,
    setViewMode,
    setSearchQuery,
    setSelectedOrganizationId,
    setSelectedWorkspaceId,
    setSelectedProjectId,
    resetSelection
  } = useOrganizationCentricStore();

  const filteredOrganizations = useMemo(() => {
    if (!searchQuery) return organizations;
    
    const query = searchQuery.toLowerCase();
    return organizations.filter(org => 
      org.name.toLowerCase().includes(query) ||
      org.folderPath.toLowerCase().includes(query)
    );
  }, [organizations, searchQuery]);

  const filteredWorkspaces = useMemo(() => {
    let result = workspaces;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ws => 
        ws.name.toLowerCase().includes(query) ||
        ws.folderPath.toLowerCase().includes(query)
      );
    }
    
    if (selectedOrganizationId) {
      result = result.filter(ws => ws.organizationId === selectedOrganizationId);
    }
    
    return result;
  }, [workspaces, searchQuery, selectedOrganizationId]);

  const filteredProjects = useMemo(() => {
    let result = projects;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.folderPath.toLowerCase().includes(query)
      );
    }
    
    if (selectedWorkspaceId) {
      result = result.filter(project => project.workspaceId === selectedWorkspaceId);
    } else if (selectedOrganizationId) {
      const orgWorkspaces = workspaces.filter(ws => ws.organizationId === selectedOrganizationId);
      const workspaceIds = orgWorkspaces.map(ws => ws.id);
      result = result.filter(project => workspaceIds.includes(project.workspaceId));
    }
    
    return result;
  }, [projects, searchQuery, selectedWorkspaceId, selectedOrganizationId, workspaces]);

  return (
    <div className="col-span-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Organizations</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-md overflow-hidden border">
            <Button
              variant={viewMode === 'tree' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none border-0"
              onClick={() => setViewMode('tree')}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Tree
            </Button>
            <Button
              variant={viewMode === 'flat' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none border-0 border-l"
              onClick={() => setViewMode('flat')}
            >
              <List className="w-4 h-4 mr-2" />
              Flat
            </Button>
          </div>
          
          {/* Create Organization Button */}
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search organizations, workspaces, or projects..."
        />
      </div>
      
      {searchQuery && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
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
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm h-8"
          >
            Clear all
          </Button>
        </div>
      )}
      
      {/* View Content */}
      {viewMode === 'tree' ? (
        <OrganizationTreeView
          organizations={filteredOrganizations}
          workspaces={filteredWorkspaces}
          projects={filteredProjects}
          workflows={workflows}
          isDeleteLocked={isDeleteLocked}
          selectedOrganizationId={selectedOrganizationId}
          selectedWorkspaceId={selectedWorkspaceId}
          selectedProjectId={selectedProjectId}
          onCreateWorkspace={() => {}} // Placeholder function
          onCreateProject={() => {}} // Placeholder function
          onCreateSandbox={onCreateSandbox}
          onDestroySandbox={onDestroySandbox}
          onRecreateSandbox={onRecreateSandbox}
          onDeleteOrganization={onDeleteOrganization}
          onDeleteWorkspace={onDeleteWorkspace}
          onDeleteProject={onDeleteProject}
          onMoveProject={onMoveProject}
          onChangeWorkflow={() => {}} // Placeholder function
          onOrganizationSelect={onOrganizationSelect}
          onWorkspaceSelect={onWorkspaceSelect}
          onProjectSelect={onProjectSelect}
          onOrganizationToggle={(orgId) => {
            if (selectedOrganizationId === orgId) {
              resetSelection();
            } else {
              setSelectedOrganizationId(orgId);
            }
          }}
          onWorkspaceToggle={(wsId) => {
            if (selectedWorkspaceId === wsId) {
              setSelectedWorkspaceId(null);
              setSelectedProjectId(null);
            } else {
              setSelectedWorkspaceId(wsId);
            }
          }}
        />
      ) : (
        <OrganizationFlatView
          organizations={filteredOrganizations}
          workspaces={filteredWorkspaces}
          projects={filteredProjects}
          workflows={workflows}
          isDeleteLocked={isDeleteLocked}
          selectedOrganizationId={selectedOrganizationId}
          selectedWorkspaceId={selectedWorkspaceId}
          selectedProjectId={selectedProjectId}
          onCreateSandbox={onCreateSandbox}
          onDestroySandbox={onDestroySandbox}
          onRecreateSandbox={onRecreateSandbox}
          onDeleteOrganization={onDeleteOrganization}
          onDeleteWorkspace={onDeleteWorkspace}
          onDeleteProject={onDeleteProject}
          onMoveProject={onMoveProject}
          onOrganizationSelect={onOrganizationSelect}
          onWorkspaceSelect={onWorkspaceSelect}
          onProjectSelect={onProjectSelect}
        />
      )}
    </div>
  );
}