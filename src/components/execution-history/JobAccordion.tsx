import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Copy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { JobAccordionProps } from "./types";
import { JSONTree } from "@/pages/automation/JsonTree";
import { toast } from "react-toastify";

export const JobAccordion: React.FC<JobAccordionProps> = ({
  executionDetails,
  expandedJobs,
  toggleJobOutput,
  formatDate,
}) => {
  // Removed unused copiedPaths state

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    toast(`Path copied: ${path}`, {
      type: "info",
      autoClose: 1000,
    });
  };

  const handleCopyFullJson = (data: any) => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast("JSON copied to clipboard", {
        type: "info",
        autoClose: 1000,
      });
    } else {
      toast("No data to copy", {
        type: "warning",
        autoClose: 1000,
      });
    }
  };

  // Function to safely extract job output data
  const getJobOutput = (job: any) => {
    // Check if job has output property
    if (!job) return null;
    
    // If job has direct output property
    if (job.output) {
      return job.output.Response || job.output;
    }
    
    // If job is the output itself (different structure)
    if (job.Response) {
      return job.Response;
    }
    
    // Return the job itself as fallback
    return job;
  };

  // Function to check if job has error
  const hasJobError = (job: any) => {
    if (!job) return false;
    
    if (job.output && job.output.Error) {
      return true;
    }
    
    if (job.Error) {
      return true;
    }
    
    return false;
  };

  // Function to get job error message
  const getJobError = (job: any) => {
    if (!job) return null;
    
    if (job.output && job.output.Error) {
      return job.output.Error;
    }
    
    if (job.Error) {
      return job.Error;
    }
    
    return null;
  };

  if (!executionDetails?.execution?.jobExecs) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No job execution data available
      </p>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="rounded-lg border bg-card p-4">
        {Object.entries(executionDetails.execution.jobExecs).map(([key, job]) => {
          const isExpanded = expandedJobs[key] || false;
          const jobOutput = getJobOutput(job);
          const hasError = hasJobError(job);
          const errorMessage = getJobError(job);
          
          return (
            <Accordion
              key={key}
              type="single"
              collapsible
              className="mb-4 border rounded-md last:mb-0"
              value={isExpanded ? key : ""}
            >
              <AccordionItem value={key} className="border-0">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      {job.name || `Job ${key}`}{" "}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({key})
                      </span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge className={hasError ? "bg-red-500" : "bg-green-500"}>
                        {hasError ? "Failed" : "Success"}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => toggleJobOutput(key, e)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isExpanded ? "Hide Output" : "View Output"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Start Time
                      </p>
                      <p className="text-xs">{job.at?.Begin ? formatDate(job.at.Begin) : "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        End Time
                      </p>
                      <p className="text-xs">{job.at?.End ? formatDate(job.at.End) : "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Duration
                      </p>
                      <p className="text-xs">{job.at?.TimeTaken ? `${job.at.TimeTaken}ms` : "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-muted-foreground">
                          Response
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyFullJson(jobOutput)}
                          className="h-6 text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      {jobOutput ? (

                        <div className="bg-gray-50 p-2 rounded-md overflow-auto max-h-[300px]">
                          <JSONTree 
                            isReadOnly={true} 
                            data={jobOutput} 
                            onCopyPath={(path) => handleCopyPath(path)} 
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-2 rounded-md text-center text-xs text-muted-foreground">
                          No response data available
                        </div>
                      )}
                      
                      {/* Usage instructions */}
                      {jobOutput && (
                        <div className="mt-2 bg-blue-50 p-2 rounded-md border border-blue-100">
                          <h5 className="text-xs font-medium text-blue-700 mb-1">
                            How to use this view:
                          </h5>
                          <ol className="text-xs text-blue-600 pl-4 space-y-1">
                            <li>
                              Click on any value to expand/collapse objects and arrays
                            </li>
                            <li>
                              Hover over a property and click the copy icon to copy its data
                            </li>
                          </ol>
                        </div>
                      )}
                    </div>
                    {errorMessage && (
                      <div>
                        <p className="text-xs text-destructive mb-1">
                          Error
                        </p>
                        <pre className="text-xs overflow-auto whitespace-pre-wrap bg-destructive/10 text-destructive p-2 rounded">
                          {errorMessage}
                        </pre>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </ScrollArea>
  );
}; 