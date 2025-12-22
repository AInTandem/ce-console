/**
 * Context API Client
 * HTTP client for context/memory management endpoints
 * Updated for new context-manager integration
 */

import type {
  Memory,
  CreateMemoryInput,
  UpdateMemoryInput,
  MemorySearchOptions,
  MemoryListFilters,
  MemoryScope,
  GetMemoriesResponse,
  SearchMemoriesResponse,
  MemoryStats,
  ContextHealthResponse,
  ImportDocumentRequest,
  ImportFolderRequest,
  ImportResult,
  SyncFileRequest,
  SyncFolderRequest,
  SyncResult,
  SyncStats,
  TrackedFile,
} from '../types/context';
import { buildApiUrl } from './config';
import { authenticatedFetch } from '@/lib/utils/authenticated-fetch';

/**
 * Create a new memory
 */
export async function createMemory(input: CreateMemoryInput): Promise<Memory> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/memories'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create memory' }));
    throw new Error(error.error || 'Failed to create memory');
  }

  return response.json();
}

/**
 * Get memory by ID
 */
export async function getMemory(id: string): Promise<Memory> {
  const response = await authenticatedFetch(buildApiUrl(`/api/context/memories/${id}`));

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get memory' }));
    throw new Error(error.error || 'Failed to get memory');
  }

  return response.json();
}

/**
 * Update memory
 */
export async function updateMemory(id: string, updates: UpdateMemoryInput): Promise<Memory> {
  const response = await authenticatedFetch(buildApiUrl(`/api/context/memories/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update memory' }));
    throw new Error(error.error || 'Failed to update memory');
  }

  return response.json();
}

/**
 * Delete memory
 */
export async function deleteMemory(id: string): Promise<void> {
  const response = await authenticatedFetch(buildApiUrl(`/api/context/memories/${id}`), {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete memory' }));
    throw new Error(error.error || 'Failed to delete memory');
  }
}

/**
 * Search memories with semantic search
 */
export async function searchMemories(options: MemorySearchOptions): Promise<SearchMemoriesResponse> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/search'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Search failed' }));
    throw new Error(error.error || 'Search failed');
  }

  return response.json();
}

/**
 * List memories with filters
 */
export async function listMemories(filters?: MemoryListFilters): Promise<GetMemoriesResponse> {
  const params = new URLSearchParams();

  if (filters?.scope) params.append('scope', filters.scope);
  if (filters?.scope_id) params.append('scope_id', filters.scope_id);
  if (filters?.memory_type) params.append('memory_type', filters.memory_type);
  if (filters?.tags) params.append('tags', filters.tags.join(','));
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const url = buildApiUrl(`/api/context/memories?${params.toString()}`);
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to list memories' }));
    throw new Error(error.error || 'Failed to list memories');
  }

  return response.json();
}

/**
 * Get memories for a specific scope with optional hierarchical inheritance
 */
export async function getMemoriesForScope(
  scope: MemoryScope,
  scopeId: string,
  options?: {
    memory_type?: string;
    tags?: string[];
    limit?: number;
    include_inherited?: boolean;
  }
): Promise<GetMemoriesResponse | SearchMemoriesResponse> {
  const params = new URLSearchParams();

  if (options?.memory_type) params.append('memory_type', options.memory_type);
  if (options?.tags) params.append('tags', options.tags.join(','));
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.include_inherited) params.append('include_inherited', 'true');

  const url = buildApiUrl(`/api/context/${scope}/${scopeId}/memories?${params.toString()}`);
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get memories' }));
    throw new Error(error.error || 'Failed to get memories');
  }

  return response.json();
}

/**
 * Get similar memories
 */
export async function getSimilarMemories(
  memoryId: string,
  limit: number = 10
): Promise<SearchMemoriesResponse> {
  const response = await authenticatedFetch(buildApiUrl(`/api/context/memories/${memoryId}/similar?limit=${limit}`));

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get similar memories' }));
    throw new Error(error.error || 'Failed to get similar memories');
  }

  return response.json();
}

/**
 * Batch create memories
 */
export async function batchCreateMemories(memories: CreateMemoryInput[]): Promise<any> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/memories/batch'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memories }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Batch create failed' }));
    throw new Error(error.error || 'Batch create failed');
  }

  return response.json();
}

/**
 * Batch update memories
 */
export async function batchUpdateMemories(
  updates: Array<{ id: string; content: string }>
): Promise<any> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/memories/batch'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Batch update failed' }));
    throw new Error(error.error || 'Batch update failed');
  }

  return response.json();
}

/**
 * Get memory statistics
 */
export async function getMemoryStats(scope?: { type: MemoryScope; id: string }): Promise<MemoryStats> {
  const url = scope
    ? buildApiUrl(`/api/context/stats/${scope.type}/${scope.id}`)
    : buildApiUrl('/api/context/stats');

  const response = await authenticatedFetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get stats' }));
    throw new Error(error.error || 'Failed to get stats');
  }

  return response.json();
}

/**
 * Check context system health
 */
export async function getContextHealth(): Promise<ContextHealthResponse> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/health'));

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Health check failed' }));
    throw new Error(error.error || 'Health check failed');
  }

  return response.json();
}

/**
 * Get context system information
 */
export async function getContextInfo(): Promise<{
  enabled: boolean;
  auto_capture: boolean;
  provider: string;
  version: string;
  features: Record<string, boolean>;
}> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/info'));

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get info' }));
    throw new Error(error.error || 'Failed to get info');
  }

  return response.json();
}

/**
 * Get hierarchical context (with full hierarchy information)
 */
export async function getHierarchicalContext(
  scope: MemoryScope,
  scopeId: string
): Promise<any> {
  const url = buildApiUrl(`/api/context/hierarchical/${scope}/${scopeId}`);
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get hierarchical context' }));
    throw new Error(error.error || 'Failed to get hierarchical context');
  }

  return response.json();
}

/**
 * Import a single document file
 */
export async function importDocument(request: ImportDocumentRequest): Promise<ImportResult> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/import/document'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to import document' }));
    throw new Error(error.error || 'Failed to import document');
  }

  return response.json();
}

/**
 * Import all documents from a folder
 */
export async function importFolder(request: ImportFolderRequest): Promise<ImportResult> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/import/folder'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to import folder' }));
    throw new Error(error.error || 'Failed to import folder');
  }

  return response.json();
}

/**
 * Sync a single file (re-import if changed)
 */
export async function syncFile(request: SyncFileRequest): Promise<SyncResult> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/sync/file'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to sync file' }));
    throw new Error(error.error || 'Failed to sync file');
  }

  return response.json();
}

/**
 * Sync all files in a folder
 */
export async function syncFolder(request: SyncFolderRequest): Promise<SyncResult> {
  const response = await authenticatedFetch(buildApiUrl('/api/context/sync/folder'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to sync folder' }));
    throw new Error(error.error || 'Failed to sync folder');
  }

  return response.json();
}

/**
 * Get file sync statistics
 */
export async function getSyncStats(scope?: { type: MemoryScope; id: string }): Promise<SyncStats> {
  const params = new URLSearchParams();
  if (scope) {
    params.set('scope', scope.type);
    params.set('scope_id', scope.id);
  }

  const url = buildApiUrl(`/api/context/sync/stats?${params.toString()}`);
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get sync stats' }));
    throw new Error(error.error || 'Failed to get sync stats');
  }

  return response.json();
}

/**
 * List all tracked files
 */
export async function getTrackedFiles(scope?: { type: MemoryScope; id: string }): Promise<TrackedFile[]> {
  const params = new URLSearchParams();
  if (scope) {
    params.set('scope', scope.type);
    params.set('scope_id', scope.id);
  }

  const url = buildApiUrl(`/api/context/sync/files?${params.toString()}`);
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get tracked files' }));
    throw new Error(error.error || 'Failed to get tracked files');
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Capture task dialog to context
 */
export async function captureTaskDialog(
  taskId: string,
  projectId: string,
  content: string,
  metadata?: Record<string, any>
): Promise<Memory> {
  const response = await authenticatedFetch(buildApiUrl(`/api/context/capture/task/${taskId}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, content, metadata }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to capture task dialog' }));
    throw new Error(error.error || 'Failed to capture task dialog');
  }

  return response.json();
}
