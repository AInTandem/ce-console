import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Organization } from '@/lib/types';

interface OrganizationCardProps {
  organization: Organization;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  showDelete?: boolean;
}

export function OrganizationCard({ organization, isSelected, onSelect, onDelete, showDelete = true }: OrganizationCardProps) {
  return (
    <Card className={`${isSelected ? 'border-primary' : ''}`}>
      <CardHeader className="p-4 cursor-pointer" onClick={() => onSelect(organization.id)}>
        <CardTitle className="text-sm">{organization.name}</CardTitle>
        <CardDescription className="text-xs truncate">{organization.folderPath}</CardDescription>
      </CardHeader>
      {showDelete && (
        <CardFooter className="p-2 pt-0">
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(organization.id);
            }}
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
