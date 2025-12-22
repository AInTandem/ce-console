/**
 * Workflow Visualizer Type Definitions
 */

// Task Definition Types
export interface Task {
  id: string;
  title: string;
  description: string;
  qwenCodePrompt: string;
  taskFile?: string; // Path to task definition file (migrated from workflowLinks)
  parameters?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: 'process' | 'milestone' | 'decision' | 'documentation';
  // Integrated task fields (new structure)
  hasExecutableTask?: boolean;
  qwenCodePrompt?: string;
  taskFile?: string;
  // Legacy fields for compatibility
  taskId?: string;
  workflows?: WorkflowLink[];
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface WorkflowLink {
  name: string;
  path: string;
  description: string;
  phase: string;
}

export interface Phase {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  steps: WorkflowStep[];
  color: string;
  icon?: string;
}

export interface LifecycleData {
  phases: Phase[];
  transitions: PhaseTransition[];
}

export interface PhaseTransition {
  from: string;
  to: string;
  label?: string;
  type: 'forward' | 'feedback' | 'loop';
}

export interface NavigationState {
  currentPhase: string | null;
  currentStep: string | null;
  selectedWorkflow: WorkflowLink | null;
}
