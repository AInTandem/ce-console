import type { Workflow } from '@/lib/types';
import { ProjectCard } from '@/components/ai-base/project-card';

import type { Project } from '@/lib/types';

interface ExtendedProject extends Project {
  organizationId?: string;
  organizationName?: string;
  workspaceName?: string;
  workflowId?: string | null; // Make workflowId explicitly nullable
}

interface ListViewProps {
  projects: ExtendedProject[];
  workflows: Workflow[];
  selectedProject: string | null;
  isDeleteLocked: boolean;
  onCreateSandbox: (projectId: string) => void;
  onDestroySandbox: (sandboxId: string) => void;
  onRecreateSandbox: (projectId: string, sandboxId: string) => void;
  onMove: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onChangeWorkflow: (projectId: string) => void;
  onProjectSelect: (projectId: string) => void;
}

export function ListView({
  projects,
  workflows,
  selectedProject,
  isDeleteLocked,
  onCreateSandbox,
  onDestroySandbox,
  onRecreateSandbox,
  onMove,
  onDelete,
  onChangeWorkflow,
  onProjectSelect,
}: ListViewProps) {
  const getWorkflowName = (workflowId: string | null | undefined): string | undefined => {
    if (!workflowId) return undefined;
    return workflows.find(w => w.id === workflowId)?.name;
  };

  return (
    <div className="col-span-12">
      <h2 className="text-xl font-semibold mb-4">All Projects</h2>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Project</th>
              <th className="text-left p-3">Workspace</th>
              <th className="text-left p-3">Organization</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(proj => (
              <tr key={proj.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="font-medium">{proj.name}</div>
                  <div className="text-sm text-gray-500">{proj.folderPath}</div>
                </td>
                <td className="p-3">{proj.workspaceName}</td>
                <td className="p-3">{proj.organizationName}</td>
                <td className="p-3">
                  {proj.sandboxId ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No Sandbox
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <ProjectCard
                    project={proj}
                    workflowName={getWorkflowName(proj.workflowId)}
                    onCreateSandbox={() => { void onCreateSandbox(proj.id); }}
                    onDestroySandbox={proj.sandboxId ? () => { void onDestroySandbox(proj.sandboxId!); } : () => {}}
                    onRecreateSandbox={proj.sandboxId ? () => { void onRecreateSandbox(proj.id, proj.sandboxId!); } : () => {}}
                    onMove={proj.workspaceId ? () => onMove(proj.id) : () => {}}
                    onDelete={() => onDelete(proj.id)}
                    onChangeWorkflow={() => onChangeWorkflow(proj.id)}
                    showDelete={!isDeleteLocked}
                    isCompact={true} // Use compact view in table
                    isSelected={selectedProject === proj.id}
                    onClick={() => onProjectSelect(proj.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}