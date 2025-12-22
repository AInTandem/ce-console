import { useState, useEffect } from 'react';
import type { TaskExecution, TaskFilter } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RefreshCw,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  MinusCircle,
  Search,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { getProjectTasks } from '@/lib/api/tasks';

interface EnhancedTaskHistoryProps {
  projectId: string;
  onTaskClick?: (task: TaskExecution) => void;
}

export function EnhancedTaskHistory({ projectId, onTaskClick }: EnhancedTaskHistoryProps) {
  const [tasks, setTasks] = useState<TaskExecution[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [typeFilter, setTypeFilter] = useState<'all' | 'workflow' | 'adhoc'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: TaskFilter = {};
      if (typeFilter !== 'all') {
        filters.type = typeFilter;
      }
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const result = await getProjectTasks(projectId, filters);
      setTasks(result.tasks);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Set up a timer to refresh tasks periodically
    const interval = setInterval(fetchTasks, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [projectId, typeFilter, searchQuery]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Play className="h-4 w-4 text-blue-500" />;
      case 'queued': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <MinusCircle className="h-4 w-4 text-gray-500" />;
      case 'cancelled': return <MinusCircle className="h-4 w-4 text-gray-400" />;
      default: return <MinusCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'running': return 'secondary';
      case 'queued': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    const seconds = Math.floor(duration / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card>
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Task History {total > 0 && <span className="text-muted-foreground">({total})</span>}
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={fetchTasks} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="workflow">Workflow</SelectItem>
              <SelectItem value="adhoc">Ad-hoc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-sm text-destructive">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No tasks found</p>
            <p className="text-xs mt-1">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Execute a task to see history here'}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 border rounded-md bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onTaskClick?.(task)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">
                          {task.title || task.stepId}
                        </span>
                        <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(task.status)}
                            <span className="capitalize">{task.status}</span>
                          </div>
                        </Badge>
                        {task.isAdhoc && (
                          <Badge variant="outline" className="text-xs">
                            Ad-hoc
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {task.prompt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Started: {formatDate(task.startTime)}</span>
                    {task.duration && <span>Duration: {formatDuration(task.duration)}</span>}
                  </div>

                  {/* Artifacts inline preview */}
                  {task.artifacts && task.artifacts.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground">
                          Artifacts:
                        </span>
                        {task.artifacts.slice(0, 3).map((artifact, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {artifact.path.split('/').pop()}
                          </Badge>
                        ))}
                        {task.artifacts.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{task.artifacts.length - 3} more
                          </span>
                        )}
                        <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                      </div>
                    </div>
                  )}

                  {task.error && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs font-medium text-destructive mb-1">Error:</p>
                      <div className="text-xs bg-destructive/10 text-destructive p-2 rounded line-clamp-2">
                        {task.error}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
