import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { JSONTree } from "./JsonTree";
import { Play, Copy } from "lucide-react";
import { useRunNode } from "@/queries/node";
import { Node } from "./NodeConfigDialog";

export const NodeOutput = ({
  isReadOnly,
  node,
  flowId,
  spaceId,
  onCopyPath,
}: {
  isReadOnly: boolean;
  node: Node | null;
  flowId: string;
  spaceId: string;
  onCopyPath?: (path: string) => void;
}) => {
  const [nodeOutput, setNodeOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: runNode } = useRunNode();

  const handleExecuteNode = () => {
    if (!node) return;

    setIsLoading(true);
    setError(null);

    runNode(
      {
        space: spaceId,
        flowId: flowId,
        nodeId: node.id,
      },
      {
        onSuccess: (data) => {
          setNodeOutput(data);
          setIsLoading(false);
          toast("Node executed successfully", {
            type: "success",
            autoClose: 2000,
          });
        },
        onError: (error: any) => {
          console.error("Node execution failed:", error);
          setIsLoading(false);
          setError(error?.message || "Failed to execute node");
          toast("Failed to execute node", {
            type: "error",
            autoClose: 2000,
          });
        },
      }
    );
  };

  const handleCopyPath = (path: string) => {
    const formattedPath = path;
    if (onCopyPath) {
      onCopyPath(formattedPath);
    } else {
      navigator.clipboard.writeText(formattedPath);
      toast(`Path copied as ${"path"}`, {
        type: "info",
        autoClose: 1000,
      });
    }
  };

  const handleCopyFullJson = () => {
    navigator.clipboard.writeText(JSON.stringify(nodeOutput, null, 2));
    toast("JSON copied to clipboard", {
      type: "info",
      autoClose: 1000,
    });
  };

  if (!node) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a node to view its output
      </div>
    );
  }

  useEffect(() => {
    handleExecuteNode();
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Node: {node.name}</h3>
        <Button
          variant="default"
          size="sm"
          onClick={handleExecuteNode}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <Play className="h-3 w-3" />
          {isLoading ? "Executing..." : "Execute Node"}
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-md border p-4 flex flex-col items-center justify-center min-h-[150px]">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
          <p className="text-sm text-gray-500">Executing node...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-md border border-red-200 p-3">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Execution Error
          </h4>
          <p className="text-sm text-red-700">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExecuteNode}
            className="mt-3 text-xs"
          >
            Try Again
          </Button>
        </div>
      ) : nodeOutput ? (
        <div className="bg-white rounded-md border p-3 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Output</h4>
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
              data={nodeOutput}
              onCopyPath={handleCopyPath}
            />
          </div>

          {/* Example usage instructions */}
          {!isReadOnly && (
            <div className="mt-3 bg-blue-50 p-2 rounded-md border border-blue-100">
              <h5 className="text-xs font-medium text-blue-700 mb-1">
                How to use this output:
              </h5>
              <ol className="text-xs text-blue-600 pl-4 space-y-1">
                <li>
                  Click on any value to expand/collapse objects and arrays
                </li>
               {!isReadOnly ? <li>
                  Hover over a property and click the copy icon to copy its path
                </li> : <li>
                  Hover over a property and click the copy icon to copy its data
                </li>}
                <li>
                  Switch between "Path" and "Template" format (e.g.,
                  "data.results.0.id" vs "{}")
                </li>
                <li>
                  Use the copied path in your form fields to reference this data
                </li>
              </ol>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md border border-dashed p-4 flex items-center justify-center min-h-[150px]">
          <p className="text-gray-500 text-sm text-center">
            Execute the node to see its output here.
            <br />
            <span className="text-xs mt-1 block">
              You can select and copy paths from the JSON output.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
