import { NodeDetailExecution } from "@/types/nodeDetailExecution";
import { JobExecutionResponse } from "@/types/job";

export type SortDirection = "asc" | "desc";

export interface ExecutionHistoryFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortDirection: SortDirection;
  toggleSortDirection: () => void;
}

export interface ExecutionHistoryListProps {
  executionHistory: JobExecutionResponse[];
  isLoading: boolean;
  selectedExecutionId: string | null;
  setSelectedExecutionId: (id: string | null) => void;
  searchQuery: string;
  statusFilter: string;
  sortDirection: SortDirection;
  toggleSortDirection: () => void;
  formatDate: (dateString?: string) => string;
}

export interface ExecutionDetailsOverviewProps {
  executionDetails: NodeDetailExecution;
  formatDate: (dateString?: string) => string;
}

export interface VariableAccordionProps {
  executionDetails: NodeDetailExecution;
  expandedVariables: Record<string, boolean>;
  toggleVariableOutput: (key: string, e: React.MouseEvent) => void;
  formatDate: (dateString?: string) => string;
}

export interface JobAccordionProps {
  executionDetails: NodeDetailExecution;
  expandedJobs: Record<string, boolean>;
  toggleJobOutput: (key: string, e: React.MouseEvent) => void;
  formatDate: (dateString?: string) => string;
}

export interface RawDataViewProps {
  executionDetails: NodeDetailExecution | null;
}

export interface ExecutionStatusBadgeProps {
  status?: string;
} 