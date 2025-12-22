import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderSelectionDialog } from './folder-selection-dialog';
import { FolderOpen } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormField {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  enableFolderSelection?: boolean;
  type?: 'input' | 'select';
  selectOptions?: SelectOption[];
}

interface FolderSelectionConfig {
  apiEndpoint: string;
  title: string;
  description: string;
}

interface SimpleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: FormField[];
  onSubmit: () => void;
  submitLabel?: string;
  trigger?: React.ReactNode;
  folderSelectionConfig?: FolderSelectionConfig;
}

export function SimpleFormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSubmit,
  submitLabel = 'Add',
  trigger,
  folderSelectionConfig,
}: SimpleFormDialogProps) {
  const [showFolderSelection, setShowFolderSelection] = useState(false);
  const [activeFolderField, setActiveFolderField] = useState<FormField | null>(null);

  const handleFolderSelect = (folderName: string) => {
    if (activeFolderField) {
      activeFolderField.onChange(folderName);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.id} className="text-right">
                  {field.label}
                </Label>
                {field.type === 'select' && field.selectOptions ? (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={field.placeholder || 'Select...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.selectOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.enableFolderSelection && folderSelectionConfig ? (
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="flex-1"
                      placeholder={field.placeholder}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setActiveFolderField(field);
                        setShowFolderSelection(true);
                      }}
                      title="Select existing folder"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Input
                    id={field.id}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="col-span-3"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={onSubmit}>{submitLabel}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {folderSelectionConfig && (
        <FolderSelectionDialog
          open={showFolderSelection}
          onOpenChange={setShowFolderSelection}
          title={folderSelectionConfig.title}
          description={folderSelectionConfig.description}
          apiEndpoint={folderSelectionConfig.apiEndpoint}
          onSelect={handleFolderSelect}
        />
      )}
    </>
  );
}
