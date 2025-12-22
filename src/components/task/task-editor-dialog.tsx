import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
// Create a separate type for task definition vs execution record
interface TaskDefinition {
  id: string;
  title: string;
  description: string;
  qwenCodePrompt: string;
  taskFile?: string; // Path to task definition file
  parameters?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface TaskEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskDefinition | null;
  onSave: (task: TaskDefinition) => void;
  title: string;
}

export function TaskEditorDialog({ open, onOpenChange, task, onSave, title }: TaskEditorDialogProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [qwenCodePrompt, setQwenCodePrompt] = useState('');
  const [taskFile, setTaskFile] = useState('');

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setDescription(task.description);
      setQwenCodePrompt(task.qwenCodePrompt);
      setTaskFile(task.taskFile || '');
    } else {
      setTaskTitle('');
      setDescription('');
      setQwenCodePrompt('');
      setTaskFile('');
    }
  }, [task, open]);

  const handleSave = () => {
    if (!taskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    if (!qwenCodePrompt.trim()) {
      alert('Please enter a Qwen Code prompt');
      return;
    }

    const updatedTask: TaskDefinition = {
      id: task?.id || `task-${Date.now()}`,
      title: taskTitle,
      description: description,
      qwenCodePrompt: qwenCodePrompt.trim(),
      taskFile: taskFile.trim() || undefined,
      parameters: task?.parameters || {},
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedTask);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure the task properties. Each task contains a Qwen Code CLI prompt and optional workflow file path.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g., Generate React component"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Describe what this task does..."
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="qwen-code-prompt">Qwen Code Prompt *</Label>
            <Textarea
              id="qwen-code-prompt"
              value={qwenCodePrompt}
              onChange={(e) => setQwenCodePrompt(e.target.value)}
              placeholder="Enter the Qwen Code CLI prompt to execute for this task..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This prompt will be sent to Qwen Code CLI when this task is executed
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-file">Task Definition File</Label>
            <Input
              id="task-file"
              value={taskFile}
              onChange={(e) => setTaskFile(e.target.value)}
              placeholder="e.g., tasks/01-development/generate-component.md"
            />
            <p className="text-xs text-muted-foreground">
              Path to the task definition file (optional)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}