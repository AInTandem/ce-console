/**
 * Context System Type Definitions (Frontend)
 * Updated for new context-manager integration
 */

export type MemoryScope = 'organization' | 'workspace' | 'project' | 'task';
export type MemoryVisibility = 'organization' | 'workspace' | 'project' | 'task';
export type SourceType = 'file' | 'api' | 'manual' | 'auto-capture';

/**
 * Source provenance information
 */
export interface SourceProvenance {
  type: SourceType;
  file_path?: string;
  line_start?: number;
  line_end?: number;
  file_hash?: string;
  import_timestamp?: string;
  last_sync?: string;
  original_format?: string;
}

/**
 * Hierarchy context (from org → workspace → project → task)
 */
export interface HierarchyContext {
  org_id: string;
  org_name: string;
  workspace_id: string;
  workspace_name: string;
  project_id: string;
  project_name: string;
  task_id?: string;
  task_name?: string;
}

/**
 * Memory metadata
 */
export interface MemoryMetadata {
  hierarchy: HierarchyContext;
  memory_type: string;
  scope: MemoryScope;
  visibility: MemoryVisibility;
  tags: string[];
  source?: SourceProvenance;
  custom?: Record<string, any>;
}

/**
 * Core Memory entity (matches backend structure)
 */
export interface Memory {
  id: string;
  memory: string; // The actual content
  metadata: MemoryMetadata;
  score?: number; // For search results
}

/**
 * Create memory input
 */
export interface CreateMemoryInput {
  content: string;
  scope: MemoryScope;
  scope_id: string;
  memory_type?: string;
  visibility?: MemoryVisibility;
  tags?: string[];
  source?: SourceProvenance;
  custom?: Record<string, any>;
}

/**
 * Update memory input
 */
export interface UpdateMemoryInput {
  content: string;
}

/**
 * Memory search options
 */
export interface MemorySearchOptions {
  query: string;
  scope: MemoryScope;
  scope_id: string;
  limit?: number;
  include_inherited?: boolean;
  memory_type?: string;
}

/**
 * Memory list filters
 */
export interface MemoryListFilters {
  scope?: MemoryScope;
  scope_id?: string;
  memory_type?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Search result
 */
export interface SearchMemoriesResponse {
  results: Memory[];
  count: number;
}

/**
 * List memories response
 */
export interface GetMemoriesResponse {
  memories: Memory[];
  count: number;
}

/**
 * Memory statistics
 */
export interface MemoryStats {
  scope?: MemoryScope;
  scope_id?: string;
  total: number;
  by_type: Record<string, number>;
  context_enabled?: boolean;
  auto_capture_enabled?: boolean;
  provider?: string;
  version?: string;
}

/**
 * Context health response
 */
export interface ContextHealthResponse {
  status: 'healthy' | 'unhealthy' | 'disabled';
  enabled: boolean;
  auto_capture?: boolean;
  provider?: string;
  error?: string;
}

/**
 * Document import request
 */
export interface ImportDocumentRequest {
  file_path: string;
  scope: MemoryScope;
  scope_id: string;
  memory_type?: string;
  visibility?: MemoryVisibility;
  tags?: string[];
  chunk_content?: boolean;
}

/**
 * Folder import request
 */
export interface ImportFolderRequest {
  folder_path: string;
  scope: MemoryScope;
  scope_id: string;
  recursive?: boolean;
  file_extensions?: string[];
  tags?: string[];
}

/**
 * Import result
 */
export interface ImportResult {
  files_imported: number;
  memories_created: number;
  chunks_created: number;
  errors?: string[];
}

/**
 * Sync file request
 */
export interface SyncFileRequest {
  file_path: string;
  scope: MemoryScope;
  scope_id: string;
  tags?: string[];
}

/**
 * Sync folder request
 */
export interface SyncFolderRequest {
  folder_path: string;
  scope: MemoryScope;
  scope_id: string;
  recursive?: boolean;
  file_extensions?: string[];
}

/**
 * Sync result
 */
export interface SyncResult {
  files_synced: number;
  memories_updated: number;
  memories_created: number;
  memories_deleted: number;
  total_changes: {
    modified: number;
    new: number;
    deleted: number;
  };
}

/**
 * Sync statistics
 */
export interface SyncStats {
  total_tracked_files: number;
  last_sync?: string;
  files_by_scope: Record<string, number>;
}

/**
 * Tracked file
 */
export interface TrackedFile {
  file_path: string;
  file_hash: string;
  scope: MemoryScope;
  scope_id: string;
  memory_ids: string[];
  last_import: string;
  last_sync?: string;
}

/**
 * UI filter state
 */
export interface MemoryFilters {
  types: string[];
  tags: string[];
  visibility: MemoryVisibility[];
  searchQuery: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

/**
 * Common memory types (extensible)
 */
export const COMMON_MEMORY_TYPES = [
  'task-dialog',
  'specification',
  'workflow-insight',
  'org-knowledge',
  'documentation',
  'knowledge',
  'configuration',
  'requirement',
] as const;

/**
 * Memory type display info
 */
export const MEMORY_TYPE_INFO: Record<string, { label: string; description: string; color: string; icon: string }> = {
  'task-dialog': {
    label: 'Task Dialog',
    description: 'AI conversation history and debugging sessions',
    color: 'blue',
    icon: '💬',
  },
  'specification': {
    label: 'Specification',
    description: 'Requirements, design docs, API specifications',
    color: 'purple',
    icon: '📋',
  },
  'workflow-insight': {
    label: 'Workflow Insight',
    description: 'Execution patterns and optimization learnings',
    color: 'green',
    icon: '💡',
  },
  'org-knowledge': {
    label: 'Org Knowledge',
    description: 'Team conventions and architectural decisions',
    color: 'orange',
    icon: '🏢',
  },
  'documentation': {
    label: 'Documentation',
    description: 'Imported documentation and markdown files',
    color: 'cyan',
    icon: '📄',
  },
  'knowledge': {
    label: 'Knowledge',
    description: 'General knowledge and information',
    color: 'indigo',
    icon: '🧠',
  },
  'configuration': {
    label: 'Configuration',
    description: 'System and project configuration',
    color: 'gray',
    icon: '⚙️',
  },
  'requirement': {
    label: 'Requirement',
    description: 'Project requirements and constraints',
    color: 'red',
    icon: '✓',
  },
};

/**
 * Memory visibility display info
 */
export const MEMORY_VISIBILITY_INFO: Record<MemoryVisibility, { label: string; description: string; icon: string }> = {
  'task': {
    label: 'Task',
    description: 'Only accessible within this task',
    icon: '🔒',
  },
  'project': {
    label: 'Project',
    description: 'Shared within this project',
    icon: '📁',
  },
  'workspace': {
    label: 'Workspace',
    description: 'Shared with all projects in this workspace',
    icon: '👥',
  },
  'organization': {
    label: 'Organization',
    description: 'Available to all projects in the organization',
    icon: '🌐',
  },
};
