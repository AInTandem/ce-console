import { useAIBaseQueryState } from '@/hooks/use-ai-base-query-state';
import { Button } from '@/components/ui/button';
import { CreateOrganizationDialog } from '@/components/ai-base/create-organization-dialog';
import { DeleteProjectDialog } from '@/components/ai-base/delete-project-dialog';
import { MoveProjectDialog } from '@/components/ai-base/move-project-dialog';
import { SimpleDeleteDialog } from '@/components/ai-base/simple-delete-dialog';
import { SimpleFormDialog } from '@/components/ai-base/simple-form-dialog';
import { TreeView } from '@/components/ai-base/views/tree-view';
import { ListView } from '@/components/ai-base/views/list-view';
import { GridView } from '@/components/ai-base/views/grid-view';
import { HierarchyView } from '@/components/ai-base/views/hierarchy-view';
import { ProjectCentricView } from '@/components/ai-base/views/project-centric/project-centric-view';
import { OrganizationCentricView } from '@/components/ai-base/views/organization-centric/organization-centric-view';
import { WorkflowCentricView } from '@/components/ai-base/views/workflow-centric/workflow-centric-view';
import { ViewSelector } from '@/components/ai-base/view-selector';
import { useAIBaseUIStore } from '@/stores/ai-base-ui-store';

export function AIBasePage() {
  const [state, actions] = useAIBaseQueryState();
  
  // Destructure state
  const {
    organizations,
    workspaces,
    projects,
    workflows,
    selectedOrganization,
    selectedWorkspace,
    selectedProject,
    viewMode,
    expandedOrganizations,
    expandedWorkspaces,
    isDeleteLocked,
  } = state;

  // Destructure actions
  const {
    handleSelectOrganization,
    handleSelectWorkspace,
    handleSelectProject,
    handleSetViewMode,
    handleSetIsDeleteLocked,
    handleCreateOrganization,
    handleCreateWorkspace,
    handleCreateProject,
    handleCreateSandbox,
    handleDestroySandbox,
    handleRecreateSandbox,
    handleDeleteOrganization,
    handleDeleteWorkspace,
    handleDeleteProject,
    handleMoveProject,
    handleChangeWorkflow,
    toggleOrganizationExpansion,
    toggleWorkspaceExpansion,
  } = actions;

  // Use Zustand store for UI state
  const {
    isOrgDialogOpen,
    isWorkspaceDialogOpen,
    isProjectDialogOpen,
    isDeleteDialogOpen,
    isMoveDialogOpen,
    isDeleteOrgDialogOpen,
    isDeleteWorkspaceDialogOpen,
    isChangeWorkflowDialogOpen,
    newOrgName,
    newOrgFolderPath,
    newWorkspaceName,
    newWorkspacePath,
    newProjectName,
    newProjectPath,
    selectedWorkflowId,
    projectToDelete,
    deleteFolder,
    deleteConfirmation,
    projectToMove,
    targetWorkspaceId,
    orgToDelete,
    workspaceToDelete,
    projectToChangeWorkflow,
    setIsOrgDialogOpen,
    setIsWorkspaceDialogOpen,
    setIsProjectDialogOpen,
    setIsDeleteDialogOpen,
    setIsMoveDialogOpen,
    setIsDeleteOrgDialogOpen,
    setIsDeleteWorkspaceDialogOpen,
    setIsChangeWorkflowDialogOpen,
    setNewOrgName,
    setNewOrgFolderPath,
    setNewWorkspaceName,
    setNewWorkspacePath,
    setNewProjectName,
    setNewProjectPath,
    setSelectedWorkflowId,
    setProjectToDelete,
    setDeleteFolder,
    setDeleteConfirmation,
    setProjectToMove,
    setTargetWorkspaceId,
    setOrgToDelete,
    setWorkspaceToDelete,
    setProjectToChangeWorkflow,
  } = useAIBaseUIStore();

  const openDeleteDialog = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteFolder(false);
    setDeleteConfirmation('');
    setIsDeleteDialogOpen(true);
  };

  const openMoveDialog = (projectId: string) => {
    setProjectToMove(projectId);
    setTargetWorkspaceId('');
    setIsMoveDialogOpen(true);
  };

  const openDeleteOrgDialog = (orgId: string) => {
    setOrgToDelete(orgId);
    setIsDeleteOrgDialogOpen(true);
  };

  const openDeleteWorkspaceDialog = (workspaceId: string) => {
    setWorkspaceToDelete(workspaceId);
    setIsDeleteWorkspaceDialogOpen(true);
  };

  const openChangeWorkflowDialog = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setProjectToChangeWorkflow(projectId);
    // Convert null to 'none', undefined to 'none', and actual IDs to themselves
    const workflowId = project?.workflowId;
    setSelectedWorkflowId(workflowId ?? 'none');
    setIsChangeWorkflowDialogOpen(true);
  };

  // Render the main content based on view mode
  const renderMainContent = () => {
    switch (viewMode) {
    case 'project-centric':
      return (
        <ProjectCentricView
          projects={projects}
          workflows={workflows}
          isDeleteLocked={isDeleteLocked}
          onCreateSandbox={handleCreateSandbox}
          onDestroySandbox={handleDestroySandbox}
          onRecreateSandbox={handleRecreateSandbox}
          onMove={openMoveDialog}
          onDelete={openDeleteDialog}
          onChangeWorkflow={openChangeWorkflowDialog}
          onProjectSelect={handleSelectProject}
        />
      );
    case 'org-centric':
      return (
        <OrganizationCentricView
          organizations={organizations}
          workspaces={workspaces}
          projects={projects}
          workflows={workflows}
          isDeleteLocked={isDeleteLocked}
          onCreateSandbox={handleCreateSandbox}
          onDestroySandbox={handleDestroySandbox}
          onRecreateSandbox={handleRecreateSandbox}
          onDeleteOrganization={handleDeleteOrganization}
          onDeleteWorkspace={handleDeleteWorkspace}
          onDeleteProject={handleDeleteProject}
          onMoveProject={handleMoveProject}
          onOrganizationSelect={handleSelectOrganization}
          onWorkspaceSelect={handleSelectWorkspace}
          onProjectSelect={handleSelectProject}
        />
      );
    case 'workflow-centric':
      return (
        <WorkflowCentricView
          workflows={workflows}
          projects={projects}
          onCreateWorkflow={() => {}}
          onDeleteWorkflow={() => {}}
          onChangeWorkflowStatus={() => {}}
          onExportWorkflow={() => {}}
          onWorkflowSelect={() => {}}
        />
      );
    case 'list':
      return (
        <ListView
          projects={projects}
          workflows={workflows}
          selectedProject={selectedProject}
          isDeleteLocked={isDeleteLocked}
          onCreateSandbox={handleCreateSandbox}
          onDestroySandbox={handleDestroySandbox}
          onRecreateSandbox={handleRecreateSandbox}
          onMove={openMoveDialog}
          onDelete={openDeleteDialog}
          onChangeWorkflow={openChangeWorkflowDialog}
          onProjectSelect={handleSelectProject}
        />
      );
    case 'grid':
      return (
        <GridView
          organizations={organizations}
          selectedOrganization={selectedOrganization}
          isDeleteLocked={isDeleteLocked}
          onOrganizationSelect={handleSelectOrganization}
          onDeleteOrg={openDeleteOrgDialog}
          onSetViewMode={handleSetViewMode}
        />
      );
    case 'tree':
      return (
        <TreeView
          organizations={organizations}
          workspaces={workspaces}
          projects={projects}
          selectedOrganization={selectedOrganization}
          selectedWorkspace={selectedWorkspace}
          selectedProject={selectedProject}
          expandedOrganizations={expandedOrganizations}
          expandedWorkspaces={expandedWorkspaces}
          onOrganizationSelect={handleSelectOrganization}
          onWorkspaceSelect={handleSelectWorkspace}
          onProjectSelect={handleSelectProject}
          onOrganizationToggle={toggleOrganizationExpansion}
          onWorkspaceToggle={toggleWorkspaceExpansion}
        />
      );
    case 'hierarchy':
    default:
      return (
        <HierarchyView
          organizations={organizations}
          workspaces={workspaces}
          projects={projects}
          selectedOrganization={selectedOrganization}
          selectedWorkspace={selectedWorkspace}
          selectedProject={selectedProject}
          workflows={workflows}
          selectedWorkflowId={selectedWorkflowId}
          isDeleteLocked={isDeleteLocked}
          newWorkspaceName={newWorkspaceName}
          newWorkspacePath={newWorkspacePath}
          newProjectName={newProjectName}
          newProjectPath={newProjectPath}
          isWorkspaceDialogOpen={isWorkspaceDialogOpen}
          isProjectDialogOpen={isProjectDialogOpen}
          onOrganizationSelect={handleSelectOrganization}
          onWorkspaceSelect={handleSelectWorkspace}
          onProjectSelect={handleSelectProject}
          onCreateWorkspace={() => { 
            if (selectedOrganization) {
              void handleCreateWorkspace(selectedOrganization, newWorkspaceName, newWorkspacePath);
            }
          }}
          onCreateProject={() => { 
            if (selectedWorkspace) {
              void handleCreateProject(selectedWorkspace, newProjectName, newProjectPath, selectedWorkflowId || undefined);
            }
          }}
          onWorkspaceDialogChange={setIsWorkspaceDialogOpen}
          onProjectDialogChange={setIsProjectDialogOpen}
          onNewWorkspaceNameChange={setNewWorkspaceName}
          onNewWorkspacePathChange={setNewWorkspacePath}
          onNewProjectNameChange={setNewProjectName}
          onNewProjectPathChange={setNewProjectPath}
          onDeleteOrg={openDeleteOrgDialog}
          onDeleteWorkspace={openDeleteWorkspaceDialog}
          onCreateSandbox={handleCreateSandbox}
          onDestroySandbox={handleDestroySandbox}
          onRecreateSandbox={handleRecreateSandbox}
          onMove={openMoveDialog}
          onDelete={openDeleteDialog}
          onChangeWorkflow={openChangeWorkflowDialog}
          onWorkflowIdChange={setSelectedWorkflowId}
        />
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Base</h1>
        <div className="flex gap-2">
          <ViewSelector
            currentViewMode={viewMode}
            onViewModeChange={handleSetViewMode}
            isDeleteLocked={isDeleteLocked}
            onLockChange={handleSetIsDeleteLocked}
          />
          <CreateOrganizationDialog
            open={isOrgDialogOpen}
            onOpenChange={setIsOrgDialogOpen}
            name={newOrgName}
            folderPath={newOrgFolderPath}
            onNameChange={setNewOrgName}
            onFolderPathChange={setNewOrgFolderPath}
            onCreate={async () => { 
              try {
                await handleCreateOrganization(newOrgName, newOrgFolderPath);
                // Close the dialog after successful organization creation
                setIsOrgDialogOpen(false);
                setNewOrgName('');
                setNewOrgFolderPath('');
              } catch (error) {
                console.error('Error creating organization:', error);
                // Keep dialog open on error to allow retry
              }
            }}
            trigger={<Button>Create Organization</Button>}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {renderMainContent()}
      </div>

      {/* Delete Project Dialog */}
      <DeleteProjectDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        deleteFolder={deleteFolder}
        onDeleteFolderChange={setDeleteFolder}
        confirmation={deleteConfirmation}
        onConfirmationChange={setDeleteConfirmation}
        onConfirm={() => { 
          if (projectToDelete) {
            void handleDeleteProject(projectToDelete, deleteFolder);
          }
        }}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setProjectToDelete(null);
          setDeleteFolder(false);
          setDeleteConfirmation('');
        }}
      />

      {/* Move Project Dialog */}
      <MoveProjectDialog
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        workspaces={workspaces}
        currentWorkspaceId={selectedWorkspace || ''}
        targetWorkspaceId={targetWorkspaceId}
        onTargetWorkspaceChange={setTargetWorkspaceId}
        onMove={() => { 
          if (projectToMove && targetWorkspaceId) {
            void handleMoveProject(projectToMove, targetWorkspaceId);
          }
        }}
        onCancel={() => {
          setIsMoveDialogOpen(false);
          setProjectToMove(null);
          setTargetWorkspaceId('');
        }}
      />

      {/* Delete Organization Dialog */}
      <SimpleDeleteDialog
        open={isDeleteOrgDialogOpen}
        onOpenChange={setIsDeleteOrgDialogOpen}
        title="Delete Organization"
        description='Are you sure you want to delete this organization? An organization can only be deleted if it contains only the "default" workspace with no projects.'
        onConfirm={() => { 
          if (orgToDelete) {
            void handleDeleteOrganization(orgToDelete);
          }
        }}
        onCancel={() => {
          setIsDeleteOrgDialogOpen(false);
          setOrgToDelete(null);
        }}
      />

      {/* Delete Workspace Dialog */}
      <SimpleDeleteDialog
        open={isDeleteWorkspaceDialogOpen}
        onOpenChange={setIsDeleteWorkspaceDialogOpen}
        title="Delete Workspace"
        description="Are you sure you want to delete this workspace? A workspace can only be deleted if it contains no projects."
        onConfirm={() => { 
          if (workspaceToDelete) {
            void handleDeleteWorkspace(workspaceToDelete);
          }
        }}
        onCancel={() => {
          setIsDeleteWorkspaceDialogOpen(false);
          setWorkspaceToDelete(null);
        }}
      />

      {/* Change Workflow Dialog */}
      <SimpleFormDialog
        open={isChangeWorkflowDialogOpen}
        onOpenChange={setIsChangeWorkflowDialogOpen}
        title="Change Workflow"
        description="Select a published workflow to bind to this project, or choose 'None' to unbind."
        fields={[
          {
            id: 'change-workflow',
            label: 'Workflow',
            value: selectedWorkflowId || 'none', // Use 'none' as value when no workflow is selected
            onChange: (value) => setSelectedWorkflowId(value === 'none' ? '' : value),
            type: 'select',
            placeholder: 'Select workflow',
            selectOptions: [
              { value: 'none', label: 'None' },
              ...workflows.map(w => ({ value: w.id, label: w.name })),
            ],
          },
        ]}
        onSubmit={async () => { 
          if (projectToChangeWorkflow) {
            try {
              await handleChangeWorkflow(projectToChangeWorkflow, selectedWorkflowId || null);
              // Close the dialog after successful workflow change
              setIsChangeWorkflowDialogOpen(false);
              setProjectToChangeWorkflow(null);
            } catch (error) {
              console.error('Error changing workflow:', error);
              // Keep dialog open on error to allow retry
            }
          }
        }}
        submitLabel="Change"
      />
    </div>
  );
}
