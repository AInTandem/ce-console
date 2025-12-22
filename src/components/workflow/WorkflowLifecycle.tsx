/**
 * WorkflowLifecycle - Main component for displaying the AI Team Workflows lifecycle
 */

import React, { useState } from 'react';
import { NavigationState, Phase, PhaseTransition } from '@/lib/workflow/types';
import type { Workflow } from '@/lib/types';
import { lifecycleData } from '@/lib/workflow/lifecycle';
import PhaseCard from './PhaseCard';
import WorkflowPanel from './WorkflowPanel';
import './WorkflowLifecycle.css';

export interface WorkflowLifecycleProps {
  /** Base URL for workflow documentation (optional) */
  baseUrl?: string;
  /** Workflow definition to use (optional - defaults to default lifecycle) */
  workflowDefinition?: Workflow | null;
  /** Custom theme colors */
  theme?: {
    primary?: string;
    secondary?: string;
    background?: string;
  };
  /** Compact mode for smaller screens */
  compact?: boolean;
  /** Project object for workflow step execution */
  project?: any; // Project object will be passed down to PhaseCard and StepCard
}

const WorkflowLifecycle: React.FC<WorkflowLifecycleProps> = ({
  baseUrl = '',
  workflowDefinition,
  theme = {},
  compact = false,
  project
}) => {
  const [navigation, setNavigation] = useState<NavigationState>({
    currentPhase: null,
    currentStep: null,
    selectedWorkflow: null
  });

  const handlePhaseClick = (phaseId: string) => {
    setNavigation(prev => ({
      ...prev,
      currentPhase: prev.currentPhase === phaseId ? null : phaseId,
      currentStep: null,
      selectedWorkflow: null
    }));
  };

  const handleStepClick = (phaseId: string, stepId: string) => {
    setNavigation(prev => ({
      ...prev,
      currentPhase: phaseId,
      currentStep: prev.currentStep === stepId ? null : stepId
    }));
  };



  const handleClosePanel = () => {
    setNavigation(prev => ({
      ...prev,
      selectedWorkflow: null
    }));
  };

  // Use the provided workflow definition or fall back to default lifecycle
  const workflowToUse = workflowDefinition || { definition: lifecycleData };
  const phasesToUse = workflowToUse.definition?.phases || lifecycleData.phases;
  const transitionsToUse = workflowToUse.definition?.transitions || lifecycleData.transitions;

  return (
    <div
      className={`workflow-lifecycle ${compact ? 'compact' : ''}`}
      style={{
        '--theme-primary': theme.primary || '#1976d2',
        '--theme-secondary': theme.secondary || '#dc004e',
        '--theme-background': theme.background || '#f5f5f5',
      } as React.CSSProperties}
    >
      <header className="lifecycle-header">
        <h1>{workflowDefinition ? workflowDefinition.name : 'AI Team Workflows Lifecycle'}</h1>
        <p>Click on any phase to explore workflows and documentation</p>
      </header>

      <div className="lifecycle-content">
        <div className="phases-container">
          {phasesToUse.map((phase: Phase, index: number) => (
            <React.Fragment key={phase.id}>
              <PhaseCard
                phase={phase}
                isExpanded={navigation.currentPhase === phase.id}
                selectedStepId={navigation.currentStep}
                onPhaseClick={() => handlePhaseClick(phase.id)}
                onStepClick={(stepId) => handleStepClick(phase.id, stepId)}
                project={project}
              />

              {index < phasesToUse.length - 1 && (
                <div className="phase-transition">
                  <div className="transition-arrow">→</div>
                  {transitionsToUse
                    .filter(t => t.from === phase.id)
                    .map((transition: PhaseTransition) => (
                      <div key={`${transition.from}-${transition.to}`} className="transition-label">
                        {transition.label}
                      </div>
                    ))
                  }
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="feedback-loops">
          {transitionsToUse
            .filter(t => t.type === 'feedback' || t.type === 'loop')
            .map((transition: PhaseTransition) => (
              <div
                key={`${transition.from}-${transition.to}`}
                className={`feedback-arrow feedback-${transition.type}`}
              >
                <span>{transition.label}</span>
              </div>
            ))
          }
        </div>
      </div>

      {navigation.selectedWorkflow && (
        <WorkflowPanel
          workflow={navigation.selectedWorkflow}
          baseUrl={baseUrl}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
};

export { WorkflowLifecycle };
export default WorkflowLifecycle;
