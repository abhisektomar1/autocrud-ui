import { Handle, Position } from "@xyflow/react";
import { Plus } from "lucide-react";

export const PlaceholderNode = ({
  data,
  setIsSidebarOpen,
}: {
  data: any;
  setIsSidebarOpen: any;
}) => {
  return (
    <div
      className="w-64 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-blue-400 transition-colors duration-200 cursor-pointer"
      onClick={() => setIsSidebarOpen(true)}
    >
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <Plus className="w-6 h-6 text-gray-400" />
        </div>
        <span className="text-gray-500 font-medium text-sm">{data.label}</span>
        {data.type === "trigger" ? (
          <Handle type="source" position={Position.Right} className="w-3 h-3" />
        ) : (
          <Handle type="target" position={Position.Left} className="w-3 h-3" />
        )}
      </div>
    </div>
  );
};
