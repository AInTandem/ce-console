import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ViewSelectorProps {
  currentViewMode: 'hierarchy' | 'grid' | 'list' | 'tree' | 'project-centric' | 'org-centric' | 'workflow-centric';
  onViewModeChange: (mode: 'hierarchy' | 'grid' | 'list' | 'tree' | 'project-centric' | 'org-centric' | 'workflow-centric') => void;
  isDeleteLocked: boolean;
  onLockChange: (locked: boolean) => void;
}

export function ViewSelector({ 
  currentViewMode, 
  onViewModeChange, 
  isDeleteLocked, 
  onLockChange 
}: ViewSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select value={currentViewMode} onValueChange={(value: 'hierarchy' | 'grid' | 'list' | 'tree' | 'project-centric' | 'org-centric' | 'workflow-centric') => onViewModeChange(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="View Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hierarchy">Hierarchical View</SelectItem>
          <SelectItem value="grid">Grid View</SelectItem>
          <SelectItem value="list">List View</SelectItem>
          <SelectItem value="tree">Tree View</SelectItem>
          <SelectItem value="project-centric">Project-Centric</SelectItem>
          <SelectItem value="org-centric">Org-Centric</SelectItem>
          <SelectItem value="workflow-centric">Workflow-Centric</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant={isDeleteLocked ? 'outline' : 'destructive'}
        size="sm"
        onClick={() => onLockChange(!isDeleteLocked)}
      >
        {isDeleteLocked ? '🔒 Lock Delete' : '🔓 Unlock Delete'}
      </Button>
    </div>
  );
}

