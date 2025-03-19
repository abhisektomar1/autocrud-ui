import React from "react";
import { ExecutionDetailsOverviewProps } from "./types";

export const ExecutionDetailsOverview: React.FC<ExecutionDetailsOverviewProps> = ({
  executionDetails,
  formatDate,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 p-4 rounded-lg border bg-card">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Execution ID</h4>
        <p className="text-sm font-mono bg-muted p-2 rounded">
          {executionDetails?.execId || "N/A"}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Start Time</h4>
        <p className="text-sm">{formatDate(executionDetails?.createdAt)}</p>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">End Time</h4>
        <p className="text-sm">{formatDate(executionDetails?.updatedAt)}</p>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
        <p className="text-sm">
          {executionDetails?.execution?.status?.status || "N/A"}
          {executionDetails?.execution?.status?.message && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({executionDetails.execution.status.message})
            </span>
          )}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Attempt</h4>
        <p className="text-sm">{executionDetails?.execution?.attempt || "N/A"}</p>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Flow ID</h4>
        <p className="text-sm font-mono">{executionDetails?.flowid || "N/A"}</p>
      </div>
    </div>
  );
}; 