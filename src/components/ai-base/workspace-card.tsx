import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Workspace } from '@/lib/types';

interface WorkspaceCardProps {
  workspace: Workspace;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  showDelete?: boolean;
}

export function WorkspaceCard({ workspace, isSelected, onSelect, onDelete, showDelete = true }: WorkspaceCardProps) {
  return (
    <Card className={`${isSelected ? 'border-primary' : ''}`}>
      <CardHeader className="p-4 cursor-pointer" onClick={() => onSelect(workspace.id)}>
        <CardTitle className="text-sm">{workspace.name}</CardTitle>
        <CardDescription className="text-xs">{workspace.folderPath}</CardDescription>
      </CardHeader>
      {showDelete && (
        <CardFooter className="p-2 pt-0">
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(workspace.id);
            }}
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
