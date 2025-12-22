/**
 * WorkflowPanel - Side panel displaying workflow details and documentation link
 */

import React from 'react';
import { WorkflowLink } from '@/lib/workflow/types';
import './WorkflowPanel.css';

export interface WorkflowPanelProps {
  workflow: WorkflowLink;
  baseUrl?: string;
  onClose: () => void;
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({
  workflow,
  baseUrl = '',
  onClose
}) => {
  const fullPath = baseUrl ? `${baseUrl}/${workflow.path}` : workflow.path;
  const githubPath = fullPath.replace(/^workflows\//, '');

  return (
    <div className="workflow-panel-overlay" onClick={onClose}>
      <div className="workflow-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>{workflow.name}</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="panel-content">
          <div className="workflow-meta">
            <span className="meta-label">Phase:</span>
            <span className="phase-badge">{workflow.phase}</span>
          </div>

          <div className="workflow-description">
            <h3>Description</h3>
            <p>{workflow.description}</p>
          </div>

          <div className="workflow-actions">
            <a
              href={fullPath}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button primary"
            >
              📄 View Documentation
            </a>

            {baseUrl && (
              <a
                href={`${baseUrl}/blob/main/${githubPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button secondary"
              >
                🔗 View on GitHub
              </a>
            )}
          </div>

          <div className="workflow-path">
            <h4>File Path</h4>
            <code>{workflow.path}</code>
          </div>

          <div className="related-info">
            <h4>Related Resources</h4>
            <ul>
              <li>
                <a href={`${baseUrl}/governance/definition-of-ready.md`} target="_blank" rel="noopener noreferrer">
                  Definition of Ready (DoR)
                </a>
              </li>
              <li>
                <a href={`${baseUrl}/governance/definition-of-done.md`} target="_blank" rel="noopener noreferrer">
                  Definition of Done (DoD)
                </a>
              </li>
              <li>
                <a href={`${baseUrl}/docs/README.md`} target="_blank" rel="noopener noreferrer">
                  Documentation Index
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPanel;
