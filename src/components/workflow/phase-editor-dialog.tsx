import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Phase } from '@/lib/types';

interface PhaseEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase: Phase | null;
  onSave: (phase: Phase) => void;
  title: string;
}

export function PhaseEditorDialog({ open, onOpenChange, phase, onSave, title }: PhaseEditorDialogProps) {
  const [phaseTitle, setPhaseTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#E3F2FD');

  useEffect(() => {
    if (phase) {
      setPhaseTitle(phase.title);
      setTitleEn(phase.titleEn);
      setDescription(phase.description);
      setColor(phase.color);
    } else {
      setPhaseTitle('');
      setTitleEn('');
      setDescription('');
      setColor('#E3F2FD');
    }
  }, [phase, open]);

  const handleSave = () => {
    if (!phaseTitle.trim() || !titleEn.trim()) {
      alert('Please enter both title and English title');
      return;
    }

    const updatedPhase: Phase = {
      id: phase?.id || `phase-${Date.now()}`,
      title: phaseTitle,
      titleEn: titleEn,
      description: description,
      color: color,
      steps: phase?.steps || [],
    };

    onSave(updatedPhase);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure the phase properties. Each phase represents a major stage in the workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="phase-title">Title (Chinese) *</Label>
            <Input
              id="phase-title"
              value={phaseTitle}
              onChange={(e) => setPhaseTitle(e.target.value)}
              placeholder="例如：快速原型"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phase-title-en">Title (English) *</Label>
            <Input
              id="phase-title-en"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g., Rapid Prototyping"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phase-description">Description</Label>
            <Textarea
              id="phase-description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this phase..."
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phase-color">Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="phase-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#E3F2FD"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This color will be used to highlight the phase in the workflow visualization
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Phase</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
