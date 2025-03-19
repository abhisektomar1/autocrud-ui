import React, { useEffect, useState } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  X,
  Loader2,
  Play,
} from "lucide-react";
import { useGetNodeFormDetail } from "@/queries/job";
import { createPortal } from "react-dom";
import { useGetFlow } from "@/queries/flow";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeOutput } from "./NodeOutput";

interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

interface Node {
  id: string;
  name: string;
  jobType: string;
  type?: string;
}

interface AccordionProps {
  onSelect: (response: any) => void;
  onExecuteNode?: (node: Node) => void;
}

const Popover: React.FC<PopoverProps> = ({ children, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={handleToggle}>
        {children}
      </div>
      {isOpen &&
        triggerRect &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999]"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="absolute bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
              style={{
                top: `${triggerRect.top}px`,
                left: `${triggerRect.left - 400}px`, // 380px for width + 20px margin
                width: "380px",
                maxHeight: "80vh",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-2 border-b">
                <X
                  className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                />
              </div>
              <div className="max-h-[calc(80vh-40px)] overflow-hidden flex flex-col">
                {content}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({ onSelect }) => {
  const { id, flowId } = useParams();
  const { data: flow, refetch: refetchFlow } = useGetFlow(
    id ?? "",
    flowId ?? ""
  );
  const [items, setItems] = useState<Node[]>([]);
  const [activeTab, setActiveTab] = useState<string>("select");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    refetchFlow();
  }, []);

  useEffect(() => {
    if (flow) {
      const usedNodes = flow.nodes;
      setItems(usedNodes);
    }
  }, [flow]);

  const [openItem, setOpenItem] = useState<any>(null);
  const { data, isLoading, refetch } = useGetNodeFormDetail(
    openItem?.type ?? ""
  );
  const [showOptions, setShowOptions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const values = data.response;
      if (values?.fields) {
        setShowOptions(values?.fields);
      }
    }
  }, [data]);

  const handleNodeSelect = (item: Node, option: any) => {
    onSelect({
      ...item,
      optionId: option.variable,
      optionName: option.name,
      isJsonPath: false,
    });
  };

  const handleJsonPathSelect = (path: string) => {
    if (selectedNode) {
      onSelect({
        ...selectedNode,
        optionId: path,
        optionName: path,
        isJsonPath: true,
      });
    }
  };

  const handleNodeExecute = (node: Node) => {
    setSelectedNode(node);
    setActiveTab("execute");
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex flex-col h-full"
    >
      <div className="px-4 pt-2 border-b">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">Select Node</TabsTrigger>
          <TabsTrigger value="execute">Execute & Output</TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-grow overflow-auto">
        <TabsContent
          value="select"
          className="p-0 m-0 overflow-auto max-h-[calc(80vh-80px)]"
        >
          <div className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No nodes available in this flow
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50">
                    <button
                      className="flex-grow text-left flex justify-between items-center text-sm font-medium text-gray-700"
                      onClick={() => {
                        setOpenItem(openItem?.id === item.id ? null : item);
                        refetch();
                      }}
                    >
                      <span>{item.name}</span>
                      {openItem?.id === item.id ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-7 px-2"
                      onClick={() => handleNodeExecute(item)}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                  {openItem?.id === item.id && (
                    <div className="bg-gray-50 px-4 py-2">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-4 gap-2">
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                          <span className="text-sm text-gray-500">
                            Loading options...
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {showOptions.length === 0 ? (
                            <div className="text-sm text-gray-500 p-2">
                              No output fields available
                            </div>
                          ) : (
                            showOptions.map(
                              (
                                option: { variable: string; name: string },
                                index: number
                              ) => (
                                <div
                                  key={index}
                                  className="text-sm text-gray-600 hover:bg-gray-100 p-2 rounded transition-colors duration-150 cursor-pointer flex justify-between items-center"
                                  onClick={() => handleNodeSelect(item, option)}
                                >
                                  <span>{option.name}</span>
                                  <span className="text-xs text-gray-400">
                                    {option.variable}
                                  </span>
                                </div>
                              )
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="execute"
          className="p-4 m-0 overflow-auto max-h-[calc(80vh-80px)]"
        >
          <NodeOutput
           isReadOnly={false}
            node={selectedNode}
            flowId={flowId ?? ""}
            spaceId={id ?? ""}
            onCopyPath={handleJsonPathSelect}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

function NodePopover({
  variable,
  onSelect,
}: {
  variable: string;
  onSelect: (response: any) => void;
}) {
  const handleSelect = (response: any) => {
    onSelect({ feildVariable: variable, ...response });
  };

  return (
    <Popover content={<Accordion onSelect={handleSelect} />}>
      <div className="flex z-20 flex-col items-center">
        <div className="flex items-center rounded-full gap-2 px-1 py-1 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors duration-150 font-medium text-sm">
          <Plus className="w-4 h-4" />
        </div>
      </div>
    </Popover>
  );
}

export default NodePopover;
