import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import type { WorkflowStep } from '@/lib/types';
import { useDrag, useDrop } from 'react-dnd';

// Define item types for drag and drop
const ItemTypes = {
  PHASE: 'phase',
  STEP: 'step',
};

interface DragItem {
  id: string;
  type: string;
  phaseId?: string;
  index?: number;
}

interface StepNodeData {
  step: WorkflowStep;
  onEdit: () => void;
  onDelete: () => void;
  phaseId: string;
  onMoveStep: (phaseId: string, fromIndex: number, toIndex: number) => void;
  index: number;
  phaseIndex: number;
}

// Custom Step Node component
export const StepNode: React.FC<{ data: StepNodeData }> = ({ data }) => {
  const { step, onEdit, onDelete } = data;

  // Get a visual indicator based on step type
  const getStepTypeIcon = () => {
    switch (step.type) {
    case 'process':
      return '⚙️';  // Gear for process
    case 'milestone':
      return '🏁';  // Checkered flag for milestone
    case 'decision':
      return '❓';  // Question mark for decision
    case 'documentation':
      return '📄';  // Document for documentation
    default:
      return '📝';  // Pencil for default
    }
  };

  // Determine if the step has executable task properties
  const isExecutableTask = step.hasExecutableTask || step.qwenCodePrompt || step.taskFile;

  // Get visual style based on step type (for human-in-loop indicators)
  const getStepVisualStyle = () => {
    if (step.type === 'decision') {
      // Decision steps require human input, highlight them
      return 'border-2 border-orange-400 bg-orange-50';
    } else if (step.type === 'process' && !isExecutableTask) {
      // Manual process steps also require human input
      return 'border-2 border-amber-300';
    }
    return '';
  };

  // Determine if the step has linked workflows
  const hasLinkedWorkflows = step.workflows && step.workflows.length > 0;

  return (
    <div>
      <Handle type="target" position={Position.Top} id="step-input" />
      <Card className={`w-48 shadow-md ${isExecutableTask ? 'border-2 border-blue-300' : ''} ${getStepVisualStyle()}`}>
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1 mr-2">
              <GripVertical 
                className="h-3 w-3 text-muted-foreground cursor-grab drag-handle" 
                onMouseDown={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <div className="font-medium text-sm flex items-center gap-1">
                  <span>{getStepTypeIcon()}</span>
                  {step.title}
                  {isExecutableTask && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full" title="Executable Task">⚡</span>
                  )}
                  {hasLinkedWorkflows && (
                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full" title="Linked Workflows">🔗</span>
                  )}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{step.description}</div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  Type: <span className="font-medium">{step.type}</span>
                  {isExecutableTask && (
                    <span className="ml-1 font-medium text-blue-600">(Task)</span>
                  )}
                </div>

                {/* Show task-specific information when it's an executable task */}
                {isExecutableTask && (
                  <div className="mt-1 text-xs">
                    {step.qwenCodePrompt && (
                      <div className="truncate text-blue-500" title={step.qwenCodePrompt}>
                        Prompt: {step.qwenCodePrompt.substring(0, 30)}...
                      </div>
                    )}
                    {step.taskFile && (
                      <div className="text-blue-400" title={`Task file: ${step.taskFile}`}>
                        File: {step.taskFile}
                      </div>
                    )}
                    {/* Show artifact indicator for executable tasks */}
                    <div className="text-xs text-purple-600 flex items-center">
                      <span className="mr-1">📦</span> Generates artifacts
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 ml-2">
              <Button size="sm" variant="ghost" onClick={onEdit} disabled={false}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onDelete} disabled={false}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} id="step-output" />
    </div>
  );
};

// Drag source wrapper for StepNode
const StepNodeWrapper: React.FC<{ 
  data: StepNodeData, 
  index: number 
}> = ({ data, index }) => {
  const { step, phaseId } = data;
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.STEP,
    item: { id: step.id, type: ItemTypes.STEP, phaseId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [step.id, phaseId, index]);

  return (
    <div 
      ref={(node) => {
        if (node) {
          drag(node);
        }
      }}
      className={isDragging ? 'opacity-50' : 'opacity-100'} 
      style={{ pointerEvents: 'all' }}
    >
      <StepNode data={data} />
    </div>
  );
};

// Drop target wrapper for StepNode
const StepNodeDropWrapper: React.FC<{ 
  data: StepNodeData, 
  index: number,
  phaseIndex: number,
  moveStep: (phaseId: string, fromIndex: number, toIndex: number) => void
}> = ({ data, index, phaseIndex: _phaseIndex, moveStep }) => {
  const { phaseId } = data;
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.STEP,
    drop: (item: DragItem) => {
      // Only allow reordering within the same phase
      if (item.index !== undefined && item.phaseId === phaseId && item.index !== index) {
        moveStep(phaseId, item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [phaseId, index, moveStep]);

  return (
    <div 
      ref={(node) => {
        if (node) {
          drop(node);
        }
      }}
      className={isOver ? 'bg-accent/20 rounded-lg p-1' : ''}
    >
      <StepNodeWrapper data={data} index={index} />
    </div>
  );
};

// Step node with drag-and-drop functionality
export const StepNodeWithDnD: React.FC<NodeProps<StepNodeData>> = (props) => {
  const { data } = props;
  return (
    <StepNodeDropWrapper 
      data={data} 
      index={data.index} 
      phaseIndex={data.phaseIndex}
      moveStep={data.onMoveStep} 
    />
  );
};