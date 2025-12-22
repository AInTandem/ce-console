/**
 * PhaseCard - Displays a single phase with expandable steps
 */

import React from 'react';
import { Phase } from '@/lib/workflow/types';
import { Project } from '@/lib/types';
import StepCard from './StepCard';
import './PhaseCard.css';

export interface PhaseCardProps {
  phase: Phase;
  isExpanded: boolean;
  selectedStepId: string | null;
  onPhaseClick: () => void;
  onStepClick: (stepId: string) => void;
  projectId?: string; // Required for task execution
  project?: Project; // Full project object for the workflow step executor
}

const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  isExpanded,
  selectedStepId,
  onPhaseClick,
  onStepClick,
  project
}) => {
  return (
    <div
      className={`phase-card ${isExpanded ? 'expanded' : ''}`}
      style={{ backgroundColor: phase.color }}
    >
      <div className="phase-header" onClick={onPhaseClick}>
        <div className="phase-title-wrapper">
          <h2 className="phase-title-zh">{phase.title}</h2>
          <h3 className="phase-title-en">{phase.titleEn}</h3>
        </div>
        <div className="phase-expand-icon">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>

      {isExpanded && (
        <div className="phase-content">
          <p className="phase-description">{phase.description}</p>

          <div className="steps-container">
            {phase.steps.map(step => (
              <StepCard
                key={step.id}
                step={step}
                isSelected={selectedStepId === step.id}
                onClick={() => onStepClick(step.id)}
                project={project}
                phaseTitle={phase.title}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseCard;
