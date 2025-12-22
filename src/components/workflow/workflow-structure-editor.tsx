import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import type { Phase, WorkflowStep } from '@/lib/types';
import { PhaseEditorDialog } from './phase-editor-dialog';
import { StepEditorDialog } from './step-editor-dialog';

interface WorkflowStructureEditorProps {
  phases: Phase[];
  onChange: (phases: Phase[]) => void;
  disabled?: boolean;
}

export function WorkflowStructureEditor({ phases, onChange, disabled }: WorkflowStructureEditorProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(-1);
  const [isPhaseDialogOpen, setIsPhaseDialogOpen] = useState(false);
  const [phaseDialogMode, setPhaseDialogMode] = useState<'add' | 'edit'>('add');

  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [selectedStepIndices, setSelectedStepIndices] = useState<{ phaseIndex: number; stepIndex: number }>({ phaseIndex: -1, stepIndex: -1 });
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [stepDialogMode, setStepDialogMode] = useState<'add' | 'edit'>('add');

  // State to track collapsed phases (all phases start expanded by default)
  const [collapsedPhases, setCollapsedPhases] = useState<Record<string, boolean>>({});



  // Phase operations
  const handleAddPhase = () => {
    setSelectedPhase(null);
    setPhaseDialogMode('add');
    setIsPhaseDialogOpen(true);
  };

  const handleEditPhase = (phase: Phase, index: number) => {
    setSelectedPhase(phase);
    setSelectedPhaseIndex(index);
    setPhaseDialogMode('edit');
    setIsPhaseDialogOpen(true);
  };

  const handleSavePhase = (phase: Phase) => {
    if (phaseDialogMode === 'add') {
      onChange([...phases, phase]);
    } else {
      const updatedPhases = [...phases];
      updatedPhases[selectedPhaseIndex] = phase;
      onChange(updatedPhases);
    }
  };

  const handleDeletePhase = (index: number) => {
    if (phases.length === 1) {
      alert('Cannot delete the last phase. A workflow must have at least one phase.');
      return;
    }
    if (confirm('Are you sure you want to delete this phase? All steps within it will be deleted.')) {
      const updatedPhases = phases.filter((_, i) => i !== index);
      onChange(updatedPhases);
    }
  };

  const handleMovePhase = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === phases.length - 1) return;

    const updatedPhases = [...phases];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updatedPhases[index], updatedPhases[targetIndex]] = [updatedPhases[targetIndex], updatedPhases[index]];
    onChange(updatedPhases);
  };

  // Step operations
  const handleAddStep = (phaseIndex: number) => {
    setSelectedStep(null);
    setSelectedStepIndices({ phaseIndex, stepIndex: -1 });
    setStepDialogMode('add');
    setIsStepDialogOpen(true);
  };

  const handleEditStep = (phaseIndex: number, step: WorkflowStep, stepIndex: number) => {
    setSelectedStep(step);
    setSelectedStepIndices({ phaseIndex, stepIndex });
    setStepDialogMode('edit');
    setIsStepDialogOpen(true);
  };

  const handleSaveStep = (step: WorkflowStep) => {
    const updatedPhases = [...phases];
    const phase = { ...updatedPhases[selectedStepIndices.phaseIndex] };

    if (stepDialogMode === 'add') {
      phase.steps = [...phase.steps, step];
    } else {
      phase.steps = [...phase.steps];
      phase.steps[selectedStepIndices.stepIndex] = step;
    }

    updatedPhases[selectedStepIndices.phaseIndex] = phase;
    onChange(updatedPhases);
  };

  const handleDeleteStep = (phaseIndex: number, stepIndex: number) => {
    const phase = phases[phaseIndex];
    if (phase.steps.length === 1) {
      alert('Cannot delete the last step. A phase must have at least one step.');
      return;
    }

    if (confirm('Are you sure you want to delete this step?')) {
      const updatedPhases = [...phases];
      const updatedPhase = { ...updatedPhases[phaseIndex] };
      updatedPhase.steps = updatedPhase.steps.filter((_, i) => i !== stepIndex);
      updatedPhases[phaseIndex] = updatedPhase;
      onChange(updatedPhases);
    }
  };

  const handleMoveStep = (phaseIndex: number, stepIndex: number, direction: 'up' | 'down') => {
    const phase = phases[phaseIndex];
    if (direction === 'up' && stepIndex === 0) return;
    if (direction === 'down' && stepIndex === phase.steps.length - 1) return;

    const updatedPhases = [...phases];
    const updatedPhase = { ...updatedPhases[phaseIndex] };
    const updatedSteps = [...updatedPhase.steps];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    [updatedSteps[stepIndex], updatedSteps[targetIndex]] = [updatedSteps[targetIndex], updatedSteps[stepIndex]];
    updatedPhase.steps = updatedSteps;
    updatedPhases[phaseIndex] = updatedPhase;
    onChange(updatedPhases);
  };

  // Toggle phase collapsed state
  const togglePhaseCollapsed = (phaseId: string) => {
    setCollapsedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };



  // Function to expand all phases
  const expandAllPhases = () => {
    const allExpanded: Record<string, boolean> = {};
    phases.forEach(phase => {
      allExpanded[phase.id] = false; // false means not collapsed (expanded)
    });
    setCollapsedPhases(allExpanded);
  };

  // Function to collapse all phases
  const collapseAllPhases = () => {
    const allCollapsed: Record<string, boolean> = {};
    phases.forEach(phase => {
      allCollapsed[phase.id] = true; // true means collapsed
    });
    setCollapsedPhases(allCollapsed);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Workflow Structure</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={collapseAllPhases}
            disabled={disabled}
          >
            Collapse All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={expandAllPhases}
            disabled={disabled}
          >
            Expand All
          </Button>
          <Button size="sm" onClick={handleAddPhase} disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Add Phase
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {phases.map((phase, phaseIndex) => {
          const isCollapsed = !!collapsedPhases[phase.id];

          return (
            <Card key={phase.id} style={{ borderLeftColor: phase.color, borderLeftWidth: '4px' }}>
              <CardHeader
                className="cursor-pointer p-4"
                onClick={() => togglePhaseCollapsed(phase.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 mr-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePhaseCollapsed(phase.id);
                        }}
                      >
                        {isCollapsed ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      {phase.title}
                      <span className="text-sm font-normal text-muted-foreground">({phase.titleEn})</span>
                    </CardTitle>
                    {phase.description && (
                      <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMovePhase(phaseIndex, 'up');
                      }}
                      disabled={disabled || phaseIndex === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMovePhase(phaseIndex, 'down');
                      }}
                      disabled={disabled || phaseIndex === phases.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPhase(phase, phaseIndex);
                      }}
                      disabled={disabled}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhase(phaseIndex);
                      }}
                      disabled={disabled || phases.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {!isCollapsed && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Steps ({phase.steps.length})</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddStep(phaseIndex);
                        }}
                        disabled={disabled}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Step
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {phase.steps.map((step, stepIndex) => (
                        <div
                          key={step.id}
                          className="flex items-start justify-between p-3 border rounded-lg bg-muted/50"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm flex items-center gap-2">
                              {step.title}
                              {step.taskId && (
                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Task</span>
                              )}
                            </div>
                            {step.description && (
                              <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              Type: <span className="font-medium">{step.type}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStep(phaseIndex, stepIndex, 'up');
                              }}
                              disabled={disabled || stepIndex === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStep(phaseIndex, stepIndex, 'down');
                              }}
                              disabled={disabled || stepIndex === phase.steps.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStep(phaseIndex, step, stepIndex);
                              }}
                              disabled={disabled}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStep(phaseIndex, stepIndex);
                              }}
                              disabled={disabled || phase.steps.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>



      {/* Phase Editor Dialog */}
      <PhaseEditorDialog
        open={isPhaseDialogOpen}
        onOpenChange={setIsPhaseDialogOpen}
        phase={selectedPhase}
        onSave={handleSavePhase}
        title={phaseDialogMode === 'add' ? 'Add Phase' : 'Edit Phase'}
      />

      {/* Step Editor Dialog */}
      <StepEditorDialog
        open={isStepDialogOpen}
        onOpenChange={setIsStepDialogOpen}
        step={selectedStep}
        onSave={handleSaveStep}
        title={stepDialogMode === 'add' ? 'Add Step' : 'Edit Step'}
      />


    </div>
  );
}
