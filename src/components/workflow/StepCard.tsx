/**
 * StepCard - Displays a single workflow step with associated workflows
 */

import React from 'react';
import { WorkflowStep } from '@/lib/workflow/types';
import { WorkflowStepExecutor } from '@/components/task/workflow-step-executor';
import { Project } from '@/lib/types';
import './StepCard.css';

export interface StepCardProps {
  step: WorkflowStep;
  isSelected: boolean;
  onClick: () => void;
  project?: Project; // Full project object for the workflow step executor
  phaseTitle?: string; // Title of the parent phase
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  isSelected,
  onClick,
  project,
  phaseTitle
}) => {
  const getStepIcon = (type: WorkflowStep['type']) => {
    switch (type) {
    case 'milestone':
      return '🎯';
    case 'decision':
      return '🔴';
    case 'documentation':
      return '🟠';
    case 'process':
    default:
      return '🟢';
    }
  };

  const getStepColor = (type: WorkflowStep['type']) => {
    switch (type) {
    case 'milestone':
      return '#4caf50';
    case 'decision':
      return '#ffcdd2';
    case 'documentation':
      return '#ffe0b2';
    case 'process':
    default:
      return '#b3e5fc';
    }
  };

  return (
    <div
      className={`step-card ${isSelected ? 'selected' : ''} step-${step.type}`}
      style={{ borderLeftColor: getStepColor(step.type) }}
    >
      <div className="step-header" onClick={onClick}>
        <span className="step-icon">{getStepIcon(step.type)}</span>
        <h4 className="step-title">{step.title}</h4>
        {(step.hasExecutableTask || step.taskId) && (
          <span className="task-badge">Task</span>
        )}
      </div>

      {isSelected && (
        <div className="step-content">
          <p className="step-description">{step.description}</p>

          {(step.hasExecutableTask || step.taskId) && project && (
            <div className="task-execution-section mt-2">
              <WorkflowStepExecutor 
                project={project}
                step={step}
                phaseTitle={phaseTitle || ''}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepCard;
