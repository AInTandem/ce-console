import type { Organization } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface GridViewProps {
  organizations: Organization[];
  selectedOrganization: string | null;
  isDeleteLocked: boolean;
  onOrganizationSelect: (orgId: string) => void;
  onDeleteOrg: (orgId: string) => void;
  onSetViewMode: (mode: 'hierarchy' | 'grid' | 'list' | 'tree') => void;
}

export function GridView({
  organizations,
  selectedOrganization,
  isDeleteLocked,
  onOrganizationSelect,
  onDeleteOrg,
  onSetViewMode,
}: GridViewProps) {
  return (
    <div className="col-span-12">
      <h2 className="text-xl font-semibold mb-4">Organizations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {organizations.map(org => (
          <div key={org.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{org.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{org.folderPath}</p>
            <div className="flex justify-between">
              <Button
                size="sm"
                variant={selectedOrganization === org.id ? 'default' : 'outline'}
                onClick={() => {
                  onOrganizationSelect(org.id);
                  onSetViewMode('hierarchy'); // Switch to hierarchy view when selecting an organization
                }}
              >
                {selectedOrganization === org.id ? 'Selected' : 'Select'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeleteOrg(org.id)}
                disabled={isDeleteLocked}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}