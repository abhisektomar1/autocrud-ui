export interface WorkspacePaginatedModel {
  count: number;
  data: WorkspaceItem[];
  status: string;
  total: number;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  description?: string;
  type?: string;
  status?: string;
  parentId?: string;
  ownerId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  permissions?: string[];
  url?: string;
  size?: number;
  version?: string;
  isArchived?: boolean;
  lastAccessedAt?: string;
}
