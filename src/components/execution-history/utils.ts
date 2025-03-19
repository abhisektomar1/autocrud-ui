import { format } from "date-fns";
import { JobExecutionResponse } from "@/types/job";
import { SortDirection } from "./types";

export const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm:ss");
  } catch (error) {
    return "Invalid date";
  }
};

export const getSortedAndFilteredHistory = (
  executionHistory: JobExecutionResponse[],
  statusFilter: string,
  searchQuery: string,
  sortDirection: SortDirection
) => {
  if (!Array.isArray(executionHistory) || executionHistory.length === 0) {
    return [];
  }

  // First filter by status if needed
  let filtered = [...executionHistory];

  if (statusFilter !== "all") {
    filtered = filtered.filter(
      (execution) => execution.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  // Then filter by search query if present
  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (execution) =>
        execution.execId?.toLowerCase().includes(query) ||
        execution.status?.toLowerCase().includes(query)
    );
  }

  // Sort by end time (updatedAt)
  return filtered.sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });
}; 