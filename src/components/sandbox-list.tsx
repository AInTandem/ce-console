import { useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { SandboxCard } from '@/components/sandbox-card';
import { SearchBar } from '@/components/sandbox/search-bar';
import { EmptyState } from '@/components/sandbox/empty-state';
import { LoadingSkeleton } from '@/components/sandbox/loading-skeleton';
import { HierarchyView } from '@/components/sandbox/hierarchy-view';
import { Button } from '@/components/ui/button';
import type { Sandbox } from '@/lib/types';
import { useAllSandboxDataQuery, useStartSandboxMutation, useStopSandboxMutation } from '@/services/sandbox-query-hooks';
import { useSandboxNavigationStore } from '@/stores/sandbox-navigation-store';
import { getExternalResourceUrl } from '@/lib/config';

export function SandboxList() {
  const { data, isLoading, isError, refetch } = useAllSandboxDataQuery();
  const startSandboxMutation = useStartSandboxMutation();
  const stopSandboxMutation = useStopSandboxMutation();

  // Zustand store for navigation state
  const {
    viewMode,
    searchQuery,
    setViewMode,
    setSearchQuery
  } = useSandboxNavigationStore();

  // Extract data from query result
  const {
    sandboxes = [],
    organizations = [],
    workspaces = [],
    projects = []
  } = data || {};

  const handleStart = async (id: string) => {
    try {
      await startSandboxMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
      // TODO: Show error toast
    }
  };

  const handleStop = async (id: string) => {
    try {
      await stopSandboxMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
      // TODO: Show error toast
    }
  };
  const handleEnterShell = (id: string, _projectName: string) => {
    void window.open(`/sandbox/${id}?tab=shell`, '_blank');
  };

  const handleEnterDocs = (id: string, _projectName: string) => {
    void window.open(`/sandbox/${id}?tab=docs`, '_blank');
  };

  const handleEnterTasks = (id: string, _projectName: string) => {
    void window.open(`/sandbox/${id}?tab=tasks`, '_blank');
  }

  const handleOpenSource = (projectId: string, _folderPath: string) => {
    // Find project, workspace, and organization to construct the correct path
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const workspace = workspaces.find(w => w.id === project.workspaceId);
    if (!workspace) return;

    const organization = organizations.find(o => o.id === workspace.organizationId);
    if (!organization) return;

    // Construct the path inside code-server container
    // Code-server only has access to /base-root (KAI_BASE_ROOT mount)
    // Path structure: /base-root/org/workspace/project
    const relativePath = `${organization.folderPath}/${workspace.folderPath}/${project.folderPath}`;
    const codeServerPath = `/base-root/${relativePath}`;

    // Open in new tab
    const codeServerUrl = getExternalResourceUrl(`/code-server/?folder=${encodeURIComponent(codeServerPath)}`);
    window.open(codeServerUrl, '_blank');
  };

  const filteredSandboxes = useMemo(() => {
    return sandboxes.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sandboxes, searchQuery]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">Failed to load sandbox data</div>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
          placeholder="Search organizations, workspaces, projects, or sandboxes..."
        />
        <div className="flex gap-2 ml-4">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'hierarchy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('hierarchy')}
          >
            <List className="w-4 h-4 mr-2" />
            Hierarchy
          </Button>
        </div>
      </div>

      {filteredSandboxes.length === 0 && !isLoading ? (
        <EmptyState
          title="No sandboxes found"
          description="Create a project in the AI Base page and add a sandbox to get started."
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSandboxes.map((sandbox: Sandbox) => {
            const project = projects.find(p => p.id === sandbox.projectId);
            const workspace = project ? workspaces.find(w => w.id === project.workspaceId) : undefined;
            const organization = workspace ? organizations.find(o => o.id === workspace.organizationId) : undefined;

            return (
              <SandboxCard
                key={sandbox.id}
                sandbox={sandbox}
                organization={organization}
                workspace={workspace}
                project={project}
                onStart={() => { void handleStart(sandbox.id); }}
                onStop={() => { void handleStop(sandbox.id); }}
                onEnterShell={handleEnterShell}
                onEnterDocs={handleEnterDocs}
                onEnterTasks={handleEnterTasks}
                onOpenSource={handleOpenSource}
              />
            );
          })}
        </div>
      ) : (
        <HierarchyView
          data={{ organizations, workspaces, projects, sandboxes }}
          onStart={(id: string) => { void handleStart(id); }}
          onStop={(id: string) => { void handleStop(id); }}
          onEnterShell={handleEnterShell}
          onEnterDocs={handleEnterDocs}
          onEnterTasks={handleEnterTasks}
          searchQuery={searchQuery}
        />
      )}
    </>
  );
}
