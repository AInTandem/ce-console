import { ProjectCard } from '@/components/ai-base/project-card';
import type { ExtendedProject, Workflow } from '@/lib/types';

interface ProjectGridViewProps {
  projects: ExtendedProject[];
  workflows: Workflow[];
  isDeleteLocked: boolean;
  onCreateSandbox: (projectId: string) => void;
  onDestroySandbox: (sandboxId: string) => void;
  onRecreateSandbox: (projectId: string, sandboxId: string) => void;
  onMove: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onChangeWorkflow: (projectId: string) => void;
  onProjectSelect: (projectId: string) => void;
}

export function ProjectGridView({
  projects,
  workflows,
  isDeleteLocked,
  onCreateSandbox,
  onDestroySandbox,
  onRecreateSandbox,
  onMove,
  onDelete,
  onChangeWorkflow,
  onProjectSelect,
}: ProjectGridViewProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          workflowName={workflows.find(w => w.id === project.workflowId)?.name}
          onCreateSandbox={onCreateSandbox}
          onDestroySandbox={onDestroySandbox}
          onRecreateSandbox={onRecreateSandbox}
          onMove={onMove}
          onDelete={onDelete}
          onChangeWorkflow={onChangeWorkflow}
          showDelete={!isDeleteLocked}
          isCompact={false}
          onClick={() => onProjectSelect(project.id)}
        />
      ))}
    </div>
  );
}