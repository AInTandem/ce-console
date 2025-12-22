import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, GripVertical, Plus } from 'lucide-react';
import type { Phase } from '@/lib/types';
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

// Define custom node types for phases and steps
export interface PhaseNodeData {
  phase: Phase;
  onEdit: () => void;
  onDelete: () => void;
  onAddStep: () => void;
  onMovePhase: (fromIndex: number, toIndex: number) => void;
  index: number;
}

// Custom Phase Node component
export const PhaseNode: React.FC<{ data: PhaseNodeData }> = ({ data }) => {
  const { phase, onEdit, onDelete, onAddStep } = data;

  return (
    <div>
      <Handle type="target" position={Position.Left} id="phase-input" />
      <Handle type="target" position={Position.Top} id="phase-input-feedback" style={{ top: '0%', left: '33%' }} />
      <Handle type="target" position={Position.Top} id="phase-input-loop" style={{ top: '0%', left: '66%' }} />
      <Card
        className="w-64 shadow-lg"
        style={{ borderLeft: `4px solid ${phase.color}` }}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1 mr-2">
              <GripVertical 
                className="h-3 w-3 text-muted-foreground cursor-grab drag-handle" 
                onMouseDown={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <CardTitle className="text-sm">{phase.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{phase.titleEn}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={onEdit} disabled={false}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onDelete} disabled={false}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">{phase.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs">Steps: {phase.steps.length}</span>
            <Button size="sm" variant="outline" onClick={onAddStep} disabled={false}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Right} id="phase-output-forward" />
      <Handle type="source" position={Position.Bottom} id="phase-output-step" />
      <Handle type="source" position={Position.Top} id="phase-output-feedback" style={{ top: '0%', left: '25%' }} />
      <Handle type="source" position={Position.Top} id="phase-output-loop" style={{ top: '0%', left: '75%' }} />
    </div>
  );
};

// Drag source wrapper for PhaseNode
const PhaseNodeWrapper: React.FC<{ 
  data: PhaseNodeData, 
  index: number 
}> = ({ data, index }) => {
  const { phase, onMovePhase: _onMovePhase } = data;
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PHASE,
    item: { id: phase.id, type: ItemTypes.PHASE, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [phase.id, index]);

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
      <PhaseNode data={data} />
    </div>
  );
};

// Drop target wrapper for PhaseNode
const PhaseNodeDropWrapper: React.FC<{ 
  data: PhaseNodeData, 
  index: number,
  movePhase: (fromIndex: number, toIndex: number) => void
}> = ({ data, index, movePhase }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PHASE,
    drop: (item: DragItem) => {
      if (item.index !== undefined && item.index !== index) {
        movePhase(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [index, movePhase]);

  return (
    <div 
      ref={(node) => {
        if (node) {
          drop(node);
        }
      }}
      className={isOver ? 'bg-accent/20 rounded-lg p-1' : ''}
    >
      <PhaseNodeWrapper data={data} index={index} />
    </div>
  );
};

// Phase node with drag-and-drop functionality
export const PhaseNodeWithDnD: React.FC<NodeProps<PhaseNodeData>> = (props) => {
  const { data } = props;
  return (
    <PhaseNodeDropWrapper 
      data={data} 
      index={data.index} 
      movePhase={data.onMovePhase} 
    />
  );
};