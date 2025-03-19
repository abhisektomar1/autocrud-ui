import React from "react";
import { Clock, ArrowUp, ArrowDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { ExecutionHistoryListProps } from "./types";
import { ExecutionStatusBadge } from "./ExecutionStatusBadge";
import { getSortedAndFilteredHistory } from "./utils";

export const ExecutionHistoryList: React.FC<ExecutionHistoryListProps> = ({
  executionHistory,
  isLoading,
  selectedExecutionId,
  setSelectedExecutionId,
  searchQuery,
  statusFilter,
  sortDirection,
  toggleSortDirection,
  formatDate,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading execution history...
        </span>
      </div>
    );
  }

  const sortedAndFilteredHistory = getSortedAndFilteredHistory(
    executionHistory,
    statusFilter,
    searchQuery,
    sortDirection
  );

  if (sortedAndFilteredHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Clock className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No execution history found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Execution ID</TableHead>
            <TableHead className="w-[180px]">Start Time</TableHead>
            <TableHead
              className="w-[180px] cursor-pointer"
              onClick={toggleSortDirection}
            >
              <div className="flex items-center">
                End Time
                {sortDirection === "asc" ? (
                  <ArrowUp className="ml-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredHistory.map((execution) => (
            <TableRow
              key={execution?.id || Math.random().toString()}
              className={`cursor-pointer hover:bg-muted/50 py-1 ${
                selectedExecutionId === execution?.id ? "bg-muted" : ""
              }`}
              onClick={() => execution?.id && setSelectedExecutionId(execution.id)}
            >
              <TableCell className="font-medium">
                {execution?.execId || "N/A"}
              </TableCell>
              <TableCell>{formatDate(execution?.execution?.status?.at)}</TableCell>
              <TableCell>{formatDate(execution?.updatedAt)}</TableCell>
              <TableCell>
                <ExecutionStatusBadge status={execution?.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    execution?.id && setSelectedExecutionId(execution.id);
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}; 