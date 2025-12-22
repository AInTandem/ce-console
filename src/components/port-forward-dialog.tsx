import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

interface PortForwardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onForward: (port: number, routingType?: 'path' | 'subdomain') => void;
  sandboxId: string;
  sandboxName: string;
  projectName: string;
}

export function PortForwardDialog({ isOpen, onClose, onForward, sandboxId, sandboxName, projectName }: PortForwardDialogProps) {
  const [port, setPort] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [routingType, setRoutingType] = useState<'path' | 'subdomain'>('subdomain');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const portNumber = parseInt(port, 10);

    // Validate port number
    if (isNaN(portNumber)) {
      setError('Please enter a valid port number');
      return;
    }

    if (portNumber < 1 || portNumber > 65535) {
      setError('Port must be between 1 and 65535');
      return;
    }

    onForward(portNumber, routingType);
    handleClose();
  };

  const handleClose = () => {
    setPort('');
    setError('');
    onClose();
  };

  const handleQuickPort = (quickPort: number) => {
    onForward(quickPort, routingType);
    handleClose();
  };

  const handleRoutingTypeChange = (type: 'path' | 'subdomain') => {
    setRoutingType(type);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Port Forwarding</DialogTitle>
          <DialogDescription>
            Forward HTTP traffic from {projectName} (ID: {sandboxId.substring(0, 8)})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Routing type selector */}
          <div className="space-y-2">
            <Label>Routing Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={routingType === 'subdomain' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRoutingTypeChange('subdomain')}
              >
                Subdomain-based
              </Button>
              <Button
                type="button"
                variant={routingType === 'path' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRoutingTypeChange('path')}
              >
                Path-based
              </Button>
            </div>
          </div>

          {/* Quick port buttons */}
          <div className="space-y-2">
            <Label>Quick Access</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickPort(3000)}
              >
                :3000
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickPort(5173)}
              >
                :5173
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickPort(8080)}
              >
                :8080
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickPort(8000)}
              >
                :8000
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickPort(4200)}
              >
                :4200
              </Button>
            </div>
          </div>

          {/* Custom port input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="port">Custom Port</Label>
              <Input
                id="port"
                type="number"
                min="1"
                max="65535"
                placeholder="Enter port number (1-65535)"
                value={port}
                onChange={(e) => {
                  setPort(e.target.value);
                  setError('');
                }}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            {/* URL Preview */}
            {port && (
              <div className="space-y-2">
                <Label>URL Preview</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-md">
                  <code className="text-sm break-all flex-1">
                    {routingType === 'subdomain'
                      ? `${sandboxName}.${port}.ainkai.127-0-0-1.sslip.io`
                      : `/flexy/${sandboxId}/port/${port}/`}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const url = routingType === 'subdomain'
                        ? `${sandboxName}.${port}.ainkai.127-0-0-1.sslip.io`
                        : `/flexy/${sandboxId}/port/${port}/`;
                      navigator.clipboard.writeText(url);
                      toast.success('URL copied to clipboard');
                    }}
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!port}>
                Open Port
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
