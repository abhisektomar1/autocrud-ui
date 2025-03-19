import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Group type definition
export interface NodeGroup {
  name: string;
  nodes: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    group: string;
    category: string;
    tType?: string[];
  }>;
}

interface SidePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNodeSelect: (node: any) => void;
  data: Record<string, any[]>;
}

const NodeItem = ({ node, onClick }: { node: any; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
    onClick={onClick}
  >
    <h3 className="text-sm font-semibold text-gray-900">{node.name}</h3>
    <p className="text-xs text-gray-500 mt-1">{node.description}</p>
    <div className="flex items-center gap-2 mt-2">
      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
        {node.type}
      </span>
      {node.tType && (
        <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">
          {node.tType.join(", ")}
        </span>
      )}
    </div>
  </motion.div>
);

export default function SidePopover({
  isOpen,
  onClose,
  onNodeSelect,
  data,
}: SidePopoverProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");

  // Process data into grouped format
  const groups: NodeGroup[] = Object.entries(data).map(([key, nodes]) => ({
    name: key,
    nodes: nodes,
  }));

  // Add "All" group
  const allNodes = groups.flatMap((group) => group.nodes);
  groups.unshift({ name: "All", nodes: allNodes });

  // Filter nodes based on search and selected group
  const filteredNodes =
    groups
      .find((g) => g.name === selectedGroup)
      ?.nodes.filter(
        (node) =>
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          className="fixed left-0 top-0 h-screen w-80 bg-gray-50 shadow-xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Node Library</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Group Tabs */}
          <ScrollArea className="flex-shrink-0 border-b bg-white">
            <div className="flex p-2 gap-2 overflow-x-auto">
              {groups.map((group) => (
                <Button
                  key={group.name}
                  variant={selectedGroup === group.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGroup(group.name)}
                  className={cn(
                    "whitespace-nowrap",
                    selectedGroup === group.name
                      ? "bg-primary text-primary-foreground"
                      : ""
                  )}
                >
                  {group.name}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Node List */}
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-3">
              {filteredNodes.length > 0 ? (
                filteredNodes.map((node) => (
                  <NodeItem
                    key={node.id}
                    node={node}
                    onClick={() => onNodeSelect(node)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No nodes found</p>
                  <p className="text-sm">Try adjusting your search</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
