import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Workspace } from '@/lib/types';

interface MoveProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaces: Workspace[];
  currentWorkspaceId: string;
  targetWorkspaceId: string;
  onTargetWorkspaceChange: (id: string) => void;
  onMove: () => void;
  onCancel: () => void;
}

export function MoveProjectDialog({
  open,
  onOpenChange,
  workspaces,
  currentWorkspaceId,
  targetWorkspaceId,
  onTargetWorkspaceChange,
  onMove,
  onCancel,
}: MoveProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Project</DialogTitle>
          <DialogDescription>
            Select a workspace to move this project to. The project&apos;s sandbox will be deleted and must be recreated.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="target-workspace">Target Workspace</Label>
          <select
            id="target-workspace"
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
            value={targetWorkspaceId}
            onChange={(e) => onTargetWorkspaceChange(e.target.value)}
          >
            <option value="">Select a workspace...</option>
            {workspaces
              .filter(ws => ws.id !== currentWorkspaceId)
              .map(ws => (
                <option key={ws.id} value={ws.id}>
                  {ws.name} ({ws.folderPath})
                </option>
              ))}
          </select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onMove} disabled={!targetWorkspaceId}>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
