/**
 * Memory Card Component
 * Displays a memory with metadata, actions, and preview
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Pencil, Trash2, Eye, Tag, Globe, File } from 'lucide-react';
import type { Memory } from '../../types/context';
import { MEMORY_TYPE_INFO, MEMORY_VISIBILITY_INFO } from '../../types/context';
import { getMemoryType, getMemoryContent, getMemorySummary, getMemoryScope } from '../../lib/memory-adapters';

interface MemoryCardProps {
  memory: Memory;
  onView?: (memory: Memory) => void;
  onEdit?: (memory: Memory) => void;
  onDelete?: (memory: Memory) => void;
  compact?: boolean;
}

export function MemoryCard({ memory, onView, onEdit, onDelete, compact = false }: MemoryCardProps) {
  const memoryType = getMemoryType(memory);
  const typeInfo = MEMORY_TYPE_INFO[memoryType] || MEMORY_TYPE_INFO.knowledge;
  const visibilityInfo = MEMORY_VISIBILITY_INFO[memory.metadata.visibility || 'workspace'];

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className={compact ? 'pb-2' : ''}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{typeInfo.icon}</span>
              <CardTitle className="text-base font-medium">
                {getMemorySummary(memory)}
              </CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="text-xs">
                {typeInfo.label}
              </Badge>
              <span className="flex items-center gap-1">
                {visibilityInfo.icon}
                <span className="text-xs">{visibilityInfo.label}</span>
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(memory)}
                title="View details"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(memory)}
                title="Edit memory"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(memory)}
                title="Delete memory"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="space-y-3">
          {/* Content Preview */}
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {truncateContent(getMemoryContent(memory))}
          </div>

          {/* Tags */}
          {memory.metadata.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {memory.metadata.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Source Provenance (if available) */}
          {memory.metadata.source?.file_path && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <File className="h-3 w-3" />
              <span className="font-mono truncate" title={memory.metadata.source.file_path}>
                {memory.metadata.source.file_path}
              </span>
              {memory.metadata.source.line_start && (
                <span className="text-muted-foreground/70">
                  :{memory.metadata.source.line_start}
                  {memory.metadata.source.line_end && memory.metadata.source.line_end !== memory.metadata.source.line_start
                    ? `-${memory.metadata.source.line_end}`
                    : ''}
                </span>
              )}
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{getMemoryScope(memory)}</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
