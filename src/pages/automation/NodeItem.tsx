import { motion } from "framer-motion";
import { DragEvent } from "react";
import { PlusCircle } from "lucide-react";
// import { JobInfo } from "./FormBuilder";

export const NodeItem = ({ node, onClick }: { node: any; onClick: () => void }) => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(249, 250, 251, 1)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="p-2.5 bg-white rounded-md hover:bg-gray-50 transition-all cursor-pointer border border-gray-100 flex items-start gap-2"
        draggable
        onDragStart={(event: React.DragEvent<HTMLDivElement>) => onDragStart(event, node.id)}
        onClick={onClick}
      >
        <div className="mt-0.5 text-blue-500 flex-shrink-0">
          <PlusCircle className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-800 truncate">{node.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{node.description}</p>
          
          <div className="flex flex-wrap items-center gap-1 mt-1.5">
            {node.type && (
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                {node.type}
              </span>
            )}
            {node.allowed_trigger_types && node.allowed_trigger_types.length > 0 && (
              <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                {node.allowed_trigger_types.slice(0, 1).join(", ")}
                {node.allowed_trigger_types.length > 1 && "..."}
              </span>
            )}
            <span className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full">
              v{node.version || "1.0"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};