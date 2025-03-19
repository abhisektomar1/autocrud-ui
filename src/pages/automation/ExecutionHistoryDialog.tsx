import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, XCircle, X } from "lucide-react";
import { useGetJobExecution } from "@/queries/job";
import { JobExecutionResponse } from "@/types/job";
import { useQueryClient } from "react-query";
import { ExecutionDetailsOverview, ExecutionHistoryFilter, ExecutionHistoryList, ExecutionStatusBadge, formatDate, JobAccordion, RawDataView, SortDirection } from "@/components/execution-history";


interface ExecutionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  executionHistory: JobExecutionResponse[];
  isLoading: boolean;
  spaceId: string;
  flowId: string;
}

export const ExecutionHistoryDialog: React.FC<ExecutionHistoryDialogProps> = ({
  isOpen,
  onClose,
  executionHistory = [],
  isLoading = false,
  spaceId,
  flowId,
}) => {
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

  const queryClient = useQueryClient();

  const {
    data: executionDetails,
    isLoading: isExecutionDetailsLoading,
    refetch: refetchExecutionDetails,
  } = useGetJobExecution({
    space: spaceId ?? "",
    flowId: flowId ?? "",
    executionId: selectedExecutionId ?? "",
  });

  useEffect(() => {
    if (selectedExecutionId) {
      refetchExecutionDetails();
    }
  }, [selectedExecutionId, refetchExecutionDetails]);

  // Reset expanded state when execution details change
  useEffect(() => {
    if (executionDetails) {
      setExpandedJobs({});
    }
  }, [executionDetails]);

  const handleClose = () => {
    setSelectedExecutionId(null);
    setActiveTab("overview");
    setSortDirection("desc");
    setStatusFilter("all");
    setSearchQuery("");

    setExpandedJobs({});

    // Invalidate any relevant queries
    queryClient.invalidateQueries({
      queryKey: ["jobExecution", spaceId, flowId],
    });

    onClose();
  };

  // Toggle job output visibility
  const toggleJobOutput = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedJobs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Function to toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Render execution details
  const renderExecutionDetails = () => {
    if (!selectedExecutionId) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            Select an execution to view details
          </p>
        </div>
      );
    }

    if (isExecutionDetailsLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading execution details...
          </span>
        </div>
      );
    }

    if (!executionDetails) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <XCircle className="h-12 w-12 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground">
            Failed to load execution details
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedExecutionId(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <div>
            <ExecutionStatusBadge status={executionDetails?.status} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>

            <TabsTrigger value="jobs">Job Executions</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ExecutionDetailsOverview
              executionDetails={executionDetails}
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <JobAccordion
              executionDetails={executionDetails}
              expandedJobs={expandedJobs}
              toggleJobOutput={toggleJobOutput}
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="raw" className="space-y-4">
            <RawDataView executionDetails={executionDetails} />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Execution History</DialogTitle>
            <DialogDescription>
              View the execution history and details for this flow
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {selectedExecutionId ? (
            renderExecutionDetails()
          ) : (
            <>
              <ExecutionHistoryFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortDirection={sortDirection}
                toggleSortDirection={toggleSortDirection}
              />
              <ExecutionHistoryList
                executionHistory={executionHistory}
                isLoading={isLoading}
                selectedExecutionId={selectedExecutionId}
                setSelectedExecutionId={setSelectedExecutionId}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                sortDirection={sortDirection}
                toggleSortDirection={toggleSortDirection}
                formatDate={formatDate}
              />
            </>
          )}
        </div>

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
