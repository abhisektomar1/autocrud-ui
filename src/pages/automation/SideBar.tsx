// src/components/ThreadNodeBuilder/components/Sidebar.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search, Plus } from "lucide-react";
import { NodeItem } from "./NodeItem";
import { cn } from "@/lib/utils";


interface NodeGroup {
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
  
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
  groups: NodeGroup[];
  filteredNodes: any[];
  onNodeSelect: (node: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  selectedGroup,
  onGroupSelect,
  groups,
  filteredNodes,
  onNodeSelect,
}) => {
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Groups */}
          <ScrollArea className="flex-shrink-0 border-b bg-white">
            <div className="flex p-2 gap-2 overflow-x-auto">
              {groups.map((group) => (
                <Button
                  key={group.name}
                  variant={selectedGroup === group.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => onGroupSelect(group.name)}
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
};
