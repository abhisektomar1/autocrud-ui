/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NodeItem } from "./NodeItem";
import { cn } from "@/lib/utils";
import { useGetAllNodeLibrary } from "@/queries/job";
import { useNodeBuilderStore } from "./nodeStore2";
import { useCreateNode, usePostNodeTrigger } from "@/queries/node";
import { useParams } from "react-router-dom";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Updated interfaces to match server-side structs
interface JobInfo {
  id: string;
  name: string;
  description: string;
  type?: string;
  allowed_trigger_types?: string[];
  version: number;
}

interface GroupInfo {
  name: string;
  description: string;
  jobs: JobInfo[];
  category?: string;
}

const NodeLibrarySideBar = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const { id, flowId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: nodeData } = useGetAllNodeLibrary();
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const store = useNodeBuilderStore();

  const [groupedNodes, setGroupedNodes] = useState<{
    [key: string]: JobInfo[];
  }>({});
  const [nodeTypes, setNodeTypes] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    if (nodeData) {
      // Extract all unique node types
      const types = new Set<string>();
      types.add("ALL");

      // Use GroupInfo directly without transformation
      const organizedNodes: { [key: string]: JobInfo[] } = {};

      (Object.values(nodeData) as GroupInfo[]).forEach((groupInfo) => {
        // Add all trigger types to the types Set
        groupInfo.jobs.forEach((job) => {
          job.allowed_trigger_types?.forEach((type) => types.add(type));
        });

        // Filter jobs based on search and type
        const filteredJobs = groupInfo.jobs.filter((job) => {
          const searchMatch =
            (job.name
              ? job.name.toLowerCase().includes(searchTerm.toLowerCase())
              : false) ||
            (job.description
              ? job.description.toLowerCase().includes(searchTerm.toLowerCase())
              : false);

          const typeMatch =
            selectedType === "ALL" ||
            job.allowed_trigger_types?.includes(selectedType);

          return searchMatch && typeMatch;
        });

        if (filteredJobs.length > 0) {
          organizedNodes[groupInfo.name] = filteredJobs;
        }
      });

      setNodeTypes(Array.from(types));
      setGroupedNodes(organizedNodes);
      
      // If search term is provided, expand all groups
      if (searchTerm) {
        setExpandedGroups(Object.keys(organizedNodes));
      }
    }
  }, [nodeData, searchTerm, selectedType]);

  const { mutate: createNode } = useCreateNode();
  const { mutate: postTrigger } = usePostNodeTrigger();

  return (
    <>
      {/* Overlay to capture clicks outside the sidebar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 z-0"
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        className="absolute left-0 top-0 h-full w-80 bg-gray-50 shadow-xl z-10 flex flex-col"
      >
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait" initial={false}>
              {!isSearchOpen && (
                <motion.h2 
                  key="title"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ 
                    opacity: { duration: 0.2 },
                    width: { duration: 0.2 }
                  }}
                  className="text-lg font-semibold overflow-hidden whitespace-nowrap"
                >
                  Node Library
                </motion.h2>
              )}
            </AnimatePresence>
            
            <div className="flex items-center ml-auto">
              <AnimatePresence initial={false}>
                {isSearchOpen && (
                  <motion.div
                    key="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "180px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ 
                      width: { duration: 0.25, ease: "easeOut" },
                      opacity: { duration: 0.15, delay: 0.1 }
                    }}
                    className="overflow-hidden w-full"
                  >
                    <Input
                      placeholder="Search nodes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8 w-full"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="h-8 w-8 mr-1 flex-shrink-0"
              >
                <Search className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="h-8 w-8 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {nodeTypes.length > 1 && (
          <ScrollArea className="flex-shrink-0 border-b bg-white p-2">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {nodeTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "whitespace-nowrap text-xs px-2 py-0 h-7",
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : ""
                  )}
                >
                  {type}
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}

        <ScrollArea className="flex-grow p-4">
          {Object.entries(groupedNodes).length > 0 ? (
            <Accordion
              type="multiple"
              value={expandedGroups}
              onValueChange={setExpandedGroups}
              className="space-y-2"
            >
              {Object.entries(groupedNodes).map(([group, jobs]) => (
                <AccordionItem
                  key={group}
                  value={group}
                  className="border rounded-md bg-white shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800">{group}</span>
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        ({jobs.length})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pt-1 pb-3">
                    <div className="space-y-2">
                      {jobs.map((job: JobInfo) => (
                        <NodeItem
                          key={job.id}
                          node={job}
                          onClick={() => {
                            const data1 = {
                              space: id,
                              flowId: flowId,
                              name: job.name,
                              description: job.description,
                              type: job.id,
                            };

                            createNode(data1, {
                              onSuccess(data) {
                                if (
                                  store.nodes.length === 1 &&
                                  store.nodes[0].id === "trigger-placeholder"
                                ) {
                                  const triggerNode = {
                                    Type: "Scheduled",
                                    schedule: "Every 5 minutes",
                                    nodeId: data.data.id,
                                  };
                                  postTrigger({
                                    space: data1.space ?? "",
                                    flowId: data1.flowId as any,
                                    nodeId: data.data.id,
                                    node: triggerNode,
                                  });
                                }
                                
                                // Set the newly created node as highlighted and active
                                store.setHighlightedNode(data.data.id);
                                store.setActiveNode(data.data.id);
                                
                                // Close the sidebar after node selection
                                setIsSidebarOpen(false);
                                
                                queryClient.invalidateQueries("getFlow");
                                queryClient.refetchQueries("getFlow");
                                toast("New Node Added Successfully", {
                                  type: "success",
                                  autoClose: 2000,
                                });
                              },
                            });
                          }}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm p-6 mt-4">
              <Plus className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No nodes found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </ScrollArea>
      </motion.div>
    </>
  );
};

export default NodeLibrarySideBar;
