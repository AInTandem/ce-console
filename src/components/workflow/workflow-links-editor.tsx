import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import type { WorkflowLink } from '@/lib/types';

interface WorkflowLinkFormProps {
  workflowLink: WorkflowLink | null;
  onSave: (workflowLink: WorkflowLink) => void;
  onCancel: () => void;
}

function WorkflowLinkForm({ workflowLink, onSave, onCancel }: WorkflowLinkFormProps) {
  const [name, setName] = useState(workflowLink?.name || '');
  const [path, setPath] = useState(workflowLink?.path || '');
  const [description, setDescription] = useState(workflowLink?.description || '');
  const [phase, setPhase] = useState(workflowLink?.phase || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !path.trim()) {
      alert('Name and path are required');
      return;
    }

    const newWorkflowLink: WorkflowLink = {
      name: name.trim(),
      path: path.trim(),
      description: description.trim(),
      phase: phase.trim(),
      id: workflowLink?.id, // Preserve ID if editing existing
    };

    onSave(newWorkflowLink);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded-lg bg-muted/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workflow name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phase</label>
          <Input
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            placeholder="Phase name"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Path *</label>
        <Input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="Path to workflow file"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Workflow description"
          rows={2}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button type="submit" size="sm">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </form>
  );
}

interface WorkflowLinksEditorProps {
  workflowLinks: WorkflowLink[];
  onChange: (workflowLinks: WorkflowLink[]) => void;
}

export function WorkflowLinksEditor({ workflowLinks, onChange }: WorkflowLinksEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    const updated = [...workflowLinks];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleSave = (workflowLink: WorkflowLink) => {
    if (editingIndex !== null) {
      // Update existing workflow link
      const updated = [...workflowLinks];
      updated[editingIndex] = workflowLink;
      onChange(updated);
    } else {
      // Add new workflow link
      onChange([...workflowLinks, workflowLink]);
    }
    
    // Reset state
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Associated Workflows</h4>
        <Button size="sm" variant="outline" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add Workflow
        </Button>
      </div>

      {isAdding && (
        <WorkflowLinkForm 
          workflowLink={null} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      )}

      {workflowLinks.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No workflows associated with this step</p>
      ) : (
        <div className="space-y-3">
          {workflowLinks.map((workflowLink, index) => (
            <Card key={index} className="border">
              {editingIndex === index ? (
                <WorkflowLinkForm 
                  workflowLink={workflowLink} 
                  onSave={handleSave} 
                  onCancel={handleCancel} 
                />
              ) : (
                <>
                  <CardHeader className="p-3 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {workflowLink.name}
                          {workflowLink.phase && (
                            <Badge variant="secondary" className="text-xs">
                              {workflowLink.phase}
                            </Badge>
                          )}
                        </CardTitle>
                        {workflowLink.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {workflowLink.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <div className="text-xs text-muted-foreground break-all">
                      Path: {workflowLink.path}
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}