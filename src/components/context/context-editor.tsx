/**
 * Context Editor Component
 * Dialog for creating/editing memories
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { X, Plus } from 'lucide-react';
import type { Memory, CreateMemoryInput, MemoryScope, MemoryVisibility } from '../../types/context';
import { MEMORY_TYPE_INFO, MEMORY_VISIBILITY_INFO } from '../../types/context';
import { useContextStore } from '../../stores/context-store';
import { getMemoryContent, getMemoryType, getMemoryScope, getMemoryScopeId } from '../../lib/memory-adapters';

interface ContextEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memory?: Memory | null;
  defaultScope?: { type: MemoryScope; id: string };
}

export function ContextEditor({ open, onOpenChange, memory, defaultScope }: ContextEditorProps) {
  const { createMemory, updateMemory } = useContextStore();

  const [formData, setFormData] = useState({
    content: '',
    memory_type: 'specification',
    scope: (defaultScope?.type || 'project') as MemoryScope,
    scope_id: defaultScope?.id || '',
    visibility: 'workspace' as MemoryVisibility,
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load memory data if editing
  useEffect(() => {
    if (memory) {
      setFormData({
        content: getMemoryContent(memory),
        memory_type: getMemoryType(memory),
        scope: getMemoryScope(memory) as MemoryScope,
        scope_id: getMemoryScopeId(memory),
        visibility: memory.metadata.visibility || 'workspace',
        tags: memory.metadata.tags || [],
      });
    } else if (defaultScope) {
      setFormData((prev) => ({
        ...prev,
        scope: defaultScope.type,
        scope_id: defaultScope.id,
      }));
    }
  }, [memory, defaultScope]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.content.trim()) {
      alert('Content is required');
      return;
    }
    if (!formData.scope_id) {
      alert('Cannot create memory without a scope.\n\nTo create a memory, please navigate to a specific project, workspace, or organization page and create the memory from there.\n\nFor now, memories can be created:\n• From project pages\n• Via CoSpec AI document sync');
      return;
    }

    setIsSubmitting(true);

    try {
      const input: CreateMemoryInput = {
        content: formData.content,
        memory_type: formData.memory_type,
        scope: formData.scope,
        scope_id: formData.scope_id,
        visibility: formData.visibility,
        tags: formData.tags,
        source: {
          type: 'manual',
        },
      };

      if (memory) {
        await updateMemory(memory.id, {
          content: formData.content,
        });
      } else {
        await createMemory(input);
      }

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save memory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      content: '',
      memory_type: 'specification',
      scope: (defaultScope?.type || 'project') as MemoryScope,
      scope_id: defaultScope?.id || '',
      visibility: 'workspace',
      tags: [],
    });
    setTagInput('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{memory ? 'Edit Memory' : 'Create New Memory'}</DialogTitle>
          <DialogDescription>
            {memory ? 'Update the memory content and metadata.' : 'Add contextual knowledge to the system.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Memory Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Memory Type</Label>
            <Select
              value={formData.memory_type}
              onValueChange={(value: string) => setFormData((prev) => ({ ...prev, memory_type: value }))}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MEMORY_TYPE_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {MEMORY_TYPE_INFO[formData.memory_type]?.description || ''}
            </p>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value: MemoryVisibility) => setFormData((prev) => ({ ...prev, visibility: value }))}
            >
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MEMORY_VISIBILITY_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {MEMORY_VISIBILITY_INFO[formData.visibility || 'workspace']?.description}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              required
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Enter the memory content..."
              className="min-h-[200px]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag..."
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : memory ? 'Update Memory' : 'Create Memory'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
