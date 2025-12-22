import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { WorkflowStep } from '@/lib/types';

interface StepEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: WorkflowStep | null;
  onSave: (step: WorkflowStep) => void;
  title: string;
}

export function StepEditorDialog({ open, onOpenChange, step, onSave, title }: StepEditorDialogProps) {
  const [stepTitle, setStepTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'process' | 'milestone' | 'decision' | 'documentation'>('process');
  const [hasExecutableTask, setHasExecutableTask] = useState(false);
  const [qwenCodePrompt, setQwenCodePrompt] = useState('');
  const [taskFile, setTaskFile] = useState('');

  useEffect(() => {
    if (step) {
      setStepTitle(step.title);
      setDescription(step.description);
      setType(step.type as 'process' | 'milestone' | 'decision' | 'documentation');
      // Set the hasExecutableTask flag based on whether step has task properties
      setHasExecutableTask(!!step.qwenCodePrompt || !!step.taskFile);
      setQwenCodePrompt(step.qwenCodePrompt || '');
      setTaskFile(step.taskFile || '');
    } else {
      setStepTitle('');
      setDescription('');
      setType('process');
      setHasExecutableTask(false);
      setQwenCodePrompt('');
      setTaskFile('');
    }
  }, [step, open]);

  const handleSave = () => {
    if (!stepTitle.trim()) {
      alert('Please enter a step title');
      return;
    }

    const updatedStep: WorkflowStep = {
      id: step?.id || `step-${Date.now()}`,
      title: stepTitle,
      description: description,
      type: type,
      // Include task fields directly in the step
      hasExecutableTask,
      qwenCodePrompt: hasExecutableTask ? qwenCodePrompt.trim() : undefined,
      taskFile: taskFile.trim() || undefined,
    };

    onSave(updatedStep);
    onOpenChange(false);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure the step properties. Each step represents a specific task or action within a phase.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="step-title">Title *</Label>
            <Input
              id="step-title"
              value={stepTitle}
              onChange={(e) => setStepTitle(e.target.value)}
              placeholder="e.g., Create initial prototype"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="step-description">Description</Label>
            <Textarea
              id="step-description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Describe what needs to be done in this step..."
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="step-type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as 'process' | 'milestone' | 'decision' | 'documentation')}>
              <SelectTrigger id="step-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="process">Process</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the type of step that best describes this task
            </p>
          </div>

          {/* Executable Task Configuration */}
          <div className="grid gap-4 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-executable-task"
                checked={hasExecutableTask}
                onCheckedChange={(checked) => setHasExecutableTask(!!checked)}
              />
              <Label htmlFor="has-executable-task" className="text-base">
                Has Executable Task
              </Label>
            </div>

            {hasExecutableTask && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="qwen-code-prompt">Qwen Code Prompt</Label>
                  <Textarea
                    id="qwen-code-prompt"
                    value={qwenCodePrompt}
                    onChange={(e) => setQwenCodePrompt(e.target.value)}
                    placeholder="Enter the Qwen Code CLI prompt to execute for this step..."
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    The prompt that will be sent to Qwen Code CLI when this step is executed
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
              </>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Step</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
