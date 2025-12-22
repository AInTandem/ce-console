/**
 * Sync Status Indicator Component
 * Shows file sync statistics and allows triggering manual sync
 */

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  File,
  Folder,
  AlertCircle,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { getSyncStats, getTrackedFiles, syncFolder } from '../../lib/context-api';
import type { SyncStats, TrackedFile, MemoryScope } from '../../types/context';
import { formatDistanceToNow } from 'date-fns';

interface SyncStatusIndicatorProps {
  scope?: { type: MemoryScope; id: string };
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function SyncStatusIndicator({
  scope,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: SyncStatusIndicatorProps) {
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [trackedFiles, setTrackedFiles] = useState<TrackedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  const loadSyncData = async () => {
    if (!scope) {
      // Sync status requires a scope - show a message
      setError('Sync status requires a scope (project/workspace/organization)');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [statsData, filesData] = await Promise.all([
        getSyncStats(scope),
        getTrackedFiles(scope),
      ]);

      setStats(statsData);

      // Filter by scope
      const filteredFiles = filesData.filter(
        (file) => file.scope === scope.type && file.scope_id === scope.id
      );

      setTrackedFiles(filteredFiles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sync data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSyncData();

    if (autoRefresh) {
      const interval = setInterval(loadSyncData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [scope?.type, scope?.id, autoRefresh, refreshInterval]);

  const handleManualSync = async (filePath?: string) => {
    if (!scope) return;

    setIsSyncing(true);
    setLastSyncResult(null);

    try {
      if (filePath) {
        // Sync single file - not implemented in this component
        // Would need syncFile function
        return;
      }

      // Sync entire folder
      const result = await syncFolder({
        folder_path: '/', // Root path - adjust based on your needs
        scope: scope.type,
        scope_id: scope.id,
        recursive: true,
      });

      const message = `Synced ${result.files_synced} files: ${result.memories_created} created, ${result.memories_updated} updated, ${result.memories_deleted} deleted`;
      setLastSyncResult(message);

      // Reload data to show updated stats
      await loadSyncData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed';
      setError(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading sync status...
          </>
        ) : error ? (
          <>
            <AlertCircle className="h-4 w-4 text-destructive" />
            {error}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync Status
          <Badge variant="secondary" className="ml-1">
            {trackedFiles.length}
          </Badge>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            File Sync Status
          </DialogTitle>
          <DialogDescription>
            Track and manage file synchronization with the context system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <File className="h-4 w-4" />
                  Tracked Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_tracked_files}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Files being monitored
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {stats.last_sync
                    ? formatDistanceToNow(new Date(stats.last_sync), { addSuffix: true })
                    : 'Never'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last synchronization
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  By Scope
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {stats.files_by_scope && Object.entries(stats.files_by_scope).map(([scopeType, count]) => (
                    <div key={scopeType} className="flex justify-between text-xs">
                      <span className="capitalize">{scopeType}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                  {(!stats.files_by_scope || Object.keys(stats.files_by_scope).length === 0) && (
                    <div className="text-xs text-muted-foreground">No files tracked yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Sync Result */}
          {lastSyncResult && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">{lastSyncResult}</div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={() => loadSyncData()} disabled={isLoading} variant="outline" size="sm">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
            {scope && (
              <Button
                onClick={() => handleManualSync()}
                disabled={isSyncing}
                size="sm"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Tracked Files List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Tracked Files ({trackedFiles.length})</h3>
            <ScrollArea className="h-[300px] border rounded-md">
              {trackedFiles.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tracked files</p>
                  <p className="text-xs mt-1">
                    Import files or folders to start tracking
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {trackedFiles.map((file) => (
                    <div
                      key={file.file_path}
                      className="border rounded-md p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-mono truncate" title={file.file_path}>
                              {file.file_path}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs capitalize">
                              {file.scope}
                            </Badge>
                            <span>•</span>
                            <span>{file.memory_ids.length} memories</span>
                            <span>•</span>
                            <span>
                              Imported{' '}
                              {formatDistanceToNow(new Date(file.last_import), {
                                addSuffix: true,
                              })}
                            </span>
                            {file.last_sync && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                                  Synced{' '}
                                  {formatDistanceToNow(new Date(file.last_sync), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Compact Sync Status Badge
 * Lightweight version for displaying in headers/toolbars
 */
export function SyncStatusBadge({
  scope,
  className,
}: {
  scope?: { type: MemoryScope; id: string };
  className?: string;
}) {
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      if (!scope) return;

      setIsLoading(true);
      try {
        const data = await getSyncStats(scope);
        setStats(data);
      } catch (err) {
        console.error('Failed to load sync stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [scope?.type, scope?.id]);

  if (isLoading) {
    return (
      <Badge variant="outline" className={className}>
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Loading...
      </Badge>
    );
  }

  if (!stats) return null;

  return (
    <Badge variant="secondary" className={className}>
      <RefreshCw className="h-3 w-3 mr-1" />
      {stats.total_tracked_files} files tracked
    </Badge>
  );
}
