import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<StatusBadgeProps['status'], { text: string; className: string }> = {
  running: { text: 'Running', className: 'bg-green-500 hover:bg-green-500/80 text-white border-transparent' },
  stopped: { text: 'Stopped', className: 'bg-gray-500 hover:bg-gray-500/80 text-white border-transparent' },
  created: { text: 'Created', className: 'bg-blue-500 hover:bg-blue-500/80 text-white border-transparent' },
  error: { text: 'Error', className: 'bg-red-500 hover:bg-red-500/80 text-white border-transparent' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { text, className } = statusMap[status] || statusMap.stopped;

  return (
    <Badge className={cn(className)}>
      {text}
    </Badge>
  );
}
