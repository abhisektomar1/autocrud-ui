import { useState } from "react";
import { Copy, ChevronDown, ChevronRight, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";

// JSON Tree component for displaying nested JSON data
export const JSONTree = ({
  isReadOnly,
  data,
  path = "",
  onCopyPath,
}: {
  isReadOnly: boolean;
  data: any;
  path?: string;
  onCopyPath: (path: string) => void;
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCopyPath = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyPath(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1500);
  };

  const handleCopyFullJson = (path: any) => {
    navigator.clipboard.writeText(JSON.stringify(path, null, 2));
    toast("JSON copied to clipboard", {
      type: "info",
      autoClose: 1000,
    });
  };

  const renderValue = (value: any, currentPath: string) => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (value === undefined)
      return <span className="text-gray-500">undefined</span>;

    if (typeof value === "object" && value !== null) {
      const isArray = Array.isArray(value);
      const isEmpty = Object.keys(value).length === 0;

      if (isEmpty) {
        return <span className="text-gray-500">{isArray ? "[]" : "{}"}</span>;
      }

      const keyPath = currentPath;
      const isExpanded = expanded[keyPath] !== false; // Default to expanded

      return (
        <div>
          <div
            className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-1"
            onClick={() => toggleExpand(keyPath)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-1 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1 text-gray-500" />
            )}
            <span className="text-gray-700">{isArray ? "[" : "{"}</span>
            {!isExpanded && (
              <span className="text-gray-500 ml-1">
                {isArray
                  ? `${Object.keys(value).length} items`
                  : `${Object.keys(value).length} keys`}
              </span>
            )}
            {!isExpanded && (
              <span className="text-gray-700 ml-1">{isArray ? "]" : "}"}</span>
            )}
          </div>

          {isExpanded && (
            <div className="pl-4 border-l border-gray-200">
              {Object.entries(value).map(([key, val], index) => {
                const childPath = currentPath ? `${currentPath}.${key}` : key;
                return (
                  <div key={key} className="my-1 group">
                    <div className="flex items-start gap-2">
                      {/* {!isReadOnly && ( */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) =>
                                !isReadOnly
                                  ? handleCopyPath(childPath, e)
                                  : handleCopyFullJson(value[key])
                              }
                              className="ml-2 text-gray-500 hover:text-gray-700 pt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedPath === childPath ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {!isReadOnly ? (
                              <p className="text-xs">Copy path: {childPath}</p>
                            ) : (
                              <p className="text-xs">Copy Data</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {/* )} */}
                      <div className="flex items-start flex-1">
                        <span className="text-blue-600 font-medium mr-1">
                          {isArray ? index : key}:
                        </span>
                        <div className="flex-1">
                          {renderValue(val, childPath)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="text-gray-700">{isArray ? "]" : "}"}</div>
            </div>
          )}
        </div>
      );
    }

    // Primitive values
    if (typeof value === "string")
      return <span className="text-green-600">"{value}"</span>;
    if (typeof value === "number")
      return <span className="text-purple-600">{value}</span>;
    if (typeof value === "boolean")
      return <span className="text-orange-600">{String(value)}</span>;

    return <span>{String(value)}</span>;
  };

  return (
    <div className="font-mono text-sm overflow-auto">
      {renderValue(data, path)}
    </div>
  );
};
