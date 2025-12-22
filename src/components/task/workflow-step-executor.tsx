import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TaskExecutionDialog } from './task-execution-dialog';
import { getStatusDisplayName, getStatusBadgeVariant } from '@/lib/api/workflow';
import type { Project, WorkflowStep } from '@/lib/types';

interface WorkflowStepExecutorProps {
  project: Project;
  step: WorkflowStep;
  phaseTitle: string;
  onStatusChange?: (stepId: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

export function WorkflowStepExecutor({ 
  project, 
  step, 
  phaseTitle, 
  onStatusChange 
}: WorkflowStepExecutorProps) {
  const [currentStatus, setCurrentStatus] = useState<'pending' | 'in-progress' | 'completed'>(
    project.workflowState?.stepStatuses?.[step.id] || 'pending'
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (project.workflowState?.stepStatuses?.[step.id]) {
      setCurrentStatus(project.workflowState.stepStatuses[step.id]);
    }
  }, [project, step.id]);

  const handleTaskStarted = () => {
    setCurrentStatus('in-progress');
    if (onStatusChange) {
      onStatusChange(step.id, 'in-progress');
    }
    setIsDialogOpen(false);
  };

  const getStatusColor = () => {
    switch (currentStatus) {
    case 'completed': return 'text-green-600';
    case 'in-progress': return 'text-blue-600';
    default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{step.title}</h4>
          <Badge variant={getStatusBadgeVariant(currentStatus)} className={getStatusColor()}>
            {getStatusDisplayName(currentStatus)}
          </Badge>
          {(step.hasExecutableTask || step.taskId) && (
            <Badge variant="secondary" className="text-xs">Qwen Code Task</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{step.description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Phase: <span className="font-medium">{phaseTitle}</span>
        </p>
      </div>
      <div className="flex gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              disabled={currentStatus === 'in-progress'}
              onClick={(e) => {
                if (currentStatus === 'in-progress') {
                  e.preventDefault();
                }
              }}
            >
              {currentStatus === 'in-progress' ? 'Running...' : 'Execute'}
            </Button>
          </DialogTrigger>
          <TaskExecutionDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            projectId={project.id}
            stepId={step.id}
            stepTitle={step.title}
            stepDescription={step.description}

            onTaskStarted={handleTaskStarted}
          />
        </Dialog>
      </div>
    </div>
  );
}