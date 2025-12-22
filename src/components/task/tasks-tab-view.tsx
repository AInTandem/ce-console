import { useState } from 'react';
import { QuickTaskLauncher } from './quick-task-launcher';
import { EnhancedTaskHistory } from './enhanced-task-history';
import { AdvancedTaskDialog } from './advanced-task-dialog';
import { TaskDetailViewer } from './task-detail-viewer';
import type { TaskExecution } from '@/lib/types';

interface TasksTabViewProps {
  projectId: string;
}

export function TasksTabView({ projectId }: TasksTabViewProps) {
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskExecution | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskStarted = () => {
    // Trigger a refresh of the task history
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskClick = (task: TaskExecution) => {
    setSelectedTask(task);
  };

  const handleTaskDetailClose = () => {
    setSelectedTask(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Quick Task Launcher */}
      <QuickTaskLauncher
        projectId={projectId}
        onTaskStarted={handleTaskStarted}
        onAdvancedClick={() => setShowAdvancedDialog(true)}
      />

      {/* Task History */}
      <EnhancedTaskHistory
        key={refreshTrigger} // Force re-render on task started
        projectId={projectId}
        onTaskClick={handleTaskClick}
      />

      {/* Advanced Task Dialog */}
      <AdvancedTaskDialog
        open={showAdvancedDialog}
        onOpenChange={setShowAdvancedDialog}
        projectId={projectId}
        onTaskStarted={handleTaskStarted}
      />

      {/* Task Detail Viewer */}
      <TaskDetailViewer
        open={!!selectedTask}
        onOpenChange={(open) => {
          if (!open) handleTaskDetailClose();
        }}
        task={selectedTask}
        projectId={projectId}
        onTaskRerun={handleTaskStarted}
      />
    </div>
  );
}
