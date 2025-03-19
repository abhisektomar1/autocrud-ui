import { useParams } from "react-router-dom";
import { useGetNodeFormDetail } from "@/queries/job";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetFlow } from "@/queries/flow";
import { Loader2 } from "lucide-react";
import { NodeOutput } from "./NodeOutput";
import { Node } from "./NodeConfigDialog";

export const NodeSelectionPanel = ({
  onSelect,
  variable,
}: {
  onSelect: (response: any) => void;
  variable: string;
}) => {
  const { id, flowId } = useParams();
  const { data: flow, refetch: refetchFlow } = useGetFlow(
    id ?? "",
    flowId ?? ""
  );
  const [items, setItems] = useState<Node[]>([]);
  const [activeTab, setActiveTab] = useState<string>("select");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [openItem, setOpenItem] = useState<any>(null);
  const { data, isLoading, refetch } = useGetNodeFormDetail(
    openItem?.type ?? ""
  );
  const [showOptions, setShowOptions] = useState<any[]>([]);

  useEffect(() => {
    refetchFlow();
  }, []);

  useEffect(() => {
    if (flow) {
      const usedNodes = flow.nodes;
      setItems(usedNodes);
    }
  }, [flow]);

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
      feildVariable: variable,
      ...item,
      optionId: option.variable,
      optionName: option.name,
    });
  };

  const [showExecute, setShowExecute] = useState(false);

  const handleNodeExecute = (node: Node) => {
    setSelectedNode(node);
    // setActiveTab("execute");
    setShowExecute(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        <div className="px-4 pt-2 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Available Node</TabsTrigger>
            <TabsTrigger value="execute">Global Variables</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-grow overflow-auto">
          <TabsContent value="select" className="p-0 m-0 overflow-auto h-full">
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
                                    onClick={() =>
                                      handleNodeSelect(item, option)
                                    }
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
              {showExecute && (
                <div className="px-4 py-3">
                  <NodeOutput
                   isReadOnly={false}
                    node={selectedNode}
                    flowId={flowId ?? ""}
                    spaceId={id ?? ""}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="execute"
            className="p-4 m-0 overflow-auto h-full"
          ></TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
