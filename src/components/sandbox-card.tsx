import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { PortForwardDialog } from '@/components/port-forward-dialog';
import type { Sandbox, Organization, Workspace, Project } from '@/lib/types';

interface SandboxCardProps {
  sandbox: Sandbox;
  organization?: Organization;
  workspace?: Workspace;
  project?: Project;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onEnterShell: (id: string, projectName: string) => void;
  onEnterDocs: (id: string, projectName: string) => void;
  onEnterTasks: (id: string, projectName: string) => void;
  onOpenSource?: (projectId: string, folderPath: string) => void;
}

export function SandboxCard({ sandbox, organization, workspace, project, onStart, onStop, onEnterShell, onEnterDocs, onEnterTasks, onOpenSource }: SandboxCardProps) {
  const [isPortDialogOpen, setIsPortDialogOpen] = useState(false);
  const isRunning = sandbox.status === 'running';

  // Use project name if available, otherwise parse from sandbox name
  const projectName = project?.name || (sandbox.name.split('-').length > 2 ? sandbox.name.split('-').slice(2).join('-') : sandbox.name);
  const shortId = sandbox.name.split('-')[1] || sandbox.id.substring(0, 8);

  const handleOpenSource = () => {
    if (sandbox.projectId && sandbox.folderMapping && onOpenSource) {
      // Extract the host path from folderMapping (format: hostPath:containerPath)
      const folderPath = sandbox.folderMapping.split(':')[0];
      onOpenSource(sandbox.projectId, folderPath);
    }
  };

  const handlePortForward = (port: number, routingType: 'path' | 'subdomain' = 'subdomain') => {
    // Open port forwarding URL in a new tab based on routing type
    let url: string;
    if (routingType === 'subdomain') {
      url = `http://${sandbox.name}.${port}.ainkai.127-0-0-1.sslip.io`;
    } else {
      url = `/flexy/${sandbox.id}/port/${port}/`;
    }
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{projectName}</CardTitle>
        <CardDescription className="text-sm">
          {organization && workspace ? (
            <span>{organization.name} / {workspace.name}</span>
          ) : (
            <span>ID: {shortId}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={sandbox.status} />
            <p className="text-xs text-muted-foreground">
              {new Date(sandbox.createdAt).toLocaleString()}
            </p>
          </div>
          {project && (
            <p className="text-xs text-muted-foreground">
              Path: {project.folderPath}
            </p>
          )}
          {sandbox.portMapping && (
            <p className="text-xs text-muted-foreground">
              Ports: {sandbox.portMapping}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex flex-wrap gap-2">
          {isRunning ? (
            <Button variant="secondary" size="sm" onClick={() => onStop(sandbox.id)}>
              Stop
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => onStart(sandbox.id)}>
              Start
            </Button>
          )}
          {sandbox.projectId && onOpenSource && (
            <Button variant="outline" size="sm" onClick={handleOpenSource} disabled={!isRunning}>
              Source
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onEnterShell(sandbox.id, projectName)} disabled={!isRunning}>
            Shell
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEnterDocs(sandbox.id, projectName)} disabled={!isRunning}>
            Docs
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEnterTasks(sandbox.id, projectName)} disabled={!isRunning}>
            Tasks
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsPortDialogOpen(true)} disabled={!isRunning}>
            Port
          </Button>
        </div>
      </CardFooter>

      <PortForwardDialog
        isOpen={isPortDialogOpen}
        onClose={() => setIsPortDialogOpen(false)}
        onForward={handlePortForward}
        sandboxId={sandbox.id}
        sandboxName={sandbox.name}
        projectName={projectName}
      />
    </Card>
  );
}
