import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkflowStructureEditor } from '@/components/workflow/workflow-structure-editor';
import { VisualWorkflowEditor } from '@/components/workflow/visual-workflow-editor';
import type { Phase, PhaseTransition } from '@/lib/types';

interface WorkflowEditorViewProps {
  phases: Phase[];
  transitions: PhaseTransition[];
  onChange: (phases: Phase[]) => void;
  disabled?: boolean;
}

export function WorkflowEditorView({ phases, transitions, onChange, disabled }: WorkflowEditorViewProps) {
  return (
    <Tabs defaultValue="visual" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="visual">Visual View</TabsTrigger>
        <TabsTrigger value="detailed">Detailed View</TabsTrigger>
      </TabsList>

      <TabsContent value="visual" className="mt-4">
        <VisualWorkflowEditor
          phases={phases}
          transitions={transitions || []}
          onChange={onChange}
          disabled={disabled}
        />
      </TabsContent>

      <TabsContent value="detailed" className="mt-4">
        <WorkflowStructureEditor
          phases={phases}
          onChange={onChange}
          disabled={disabled}
        />
      </TabsContent>
    </Tabs>
  );
}