import React, { useState } from "react";
import { RawDataViewProps } from "./types";
import { JSONTree } from "@/pages/automation/JsonTree";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export const RawDataView: React.FC<RawDataViewProps> = ({ executionDetails }) => {
  const [isReadOnly] = useState(true);

  // Handle copying full JSON data
  const handleCopyFullJson = () => {
    if (executionDetails) {
      navigator.clipboard.writeText(JSON.stringify(executionDetails, null, 2));
      toast("JSON copied to clipboard", {
        type: "info",
        autoClose: 1000,
      });
    }
  };

  // Direct callback for the JSONTree component
  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    toast(`Path copied: ${path}`, {
      type: "info",
      autoClose: 1000,
    });
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      {executionDetails ? (
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Execution Details</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyFullJson}
                className="h-6 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md overflow-auto max-h-[400px]">
            <JSONTree 
              isReadOnly={isReadOnly} 
              data={executionDetails} 
              onCopyPath={handleCopyPath} 
            />
          </div>
          
          {/* Usage instructions */}
          <div className="mt-3 bg-blue-50 p-2 rounded-md border border-blue-100">
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
              <li>
                Use the copied paths for debugging or referencing data
              </li>
              <li>
                Click "Copy" to copy the entire JSON object
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-6 bg-gray-50 rounded-md border border-dashed">
          No execution data available
        </div>
      )}
    </div>
  );
}; 