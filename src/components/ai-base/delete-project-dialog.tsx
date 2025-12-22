import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deleteFolder: boolean;
  onDeleteFolderChange: (checked: boolean) => void;
  confirmation: string;
  onConfirmationChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  deleteFolder,
  onDeleteFolderChange,
  confirmation,
  onConfirmationChange,
  onConfirm,
  onCancel,
}: DeleteProjectDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the project and its associated sandbox. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="delete-folder"
              checked={deleteFolder}
              onCheckedChange={(checked) => {
                onDeleteFolderChange(checked === true);
                if (!checked) onConfirmationChange('');
              }}
            />
            <Label htmlFor="delete-folder" className="text-sm font-normal cursor-pointer">
              Also delete the project folder from filesystem
            </Label>
          </div>
          {deleteFolder && (
            <div className="space-y-2">
              <Label htmlFor="confirm-delete" className="text-sm text-red-600">
                Type <strong>DELETE</strong> to confirm folder deletion
              </Label>
              <Input
                id="confirm-delete"
                value={confirmation}
                onChange={(e) => onConfirmationChange(e.target.value)}
                placeholder="DELETE"
                className="border-red-300"
              />
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
