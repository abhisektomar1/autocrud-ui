/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionMode,
  useReactFlow,
} from "@xyflow/react";
import * as _ from "lodash";
import { AnimatePresence } from "framer-motion";
import { Trash, Play, History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./flow.css";
import { CustomNode } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { connectionLineStyle, defaultEdgeOptions } from "./edge";
import { NodeConfigSidebar } from "./NodeConfigDialog";
import NodeLibrarySideBar from "./NodeLibrarySideBar";
import { PlaceholderNode } from "./PlaceholderName";
import { CustomEdgeWithDelete } from "./CustomDeleteEdge";
import { HeaderTabs } from "@/components/HeaderTab";

// Query & Store Imports
import {
  useConnectNode,
  useDeleteNode,
  useGetAllFlows,
  useGetFlow,
  useRunFlow,
} from "@/queries/flow";
import { useParams } from "react-router-dom";
import { useNodeBuilderStore } from "./nodeStore2";
import {
  useCreateNode,
  usePostNodeTrigger,
  useUpdateNodePosition,
} from "@/queries/node";

// Utility Imports
import { toast } from "react-toastify";
import { createEdgeObject } from "./ConnectUtils";
import DeleteConfirmationDialog, {
  DeleteTrigger,
} from "@/component/DeleteDialog";
import { queryClient } from "@/queries/client";

// Types
import { FlowInterface, NodeInterface, NodePosition } from "./automationType";
import FlowSkeleton from "@/components/skeletons/flowSkeleton";
import { useGetAllNodeLibrary } from "@/queries/job";
import {
  useGetJobExecutionFromFlowId,
} from "@/queries/job";
import { ExecutionHistoryDialog } from "./ExecutionHistoryDialog";

const edgeTypes = {
  custom: CustomEdge,
};

const updatedEdgeTypes = {
  ...edgeTypes,
  custom: CustomEdgeWithDelete,
};

export default function ThreadNodeBuilder() {
  // URL Parameters & State
  const { id, flowId: selectedId } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExecutionHistoryOpen, setIsExecutionHistoryOpen] = useState(false);

  // Refs & Store
  const reactFlowWrapper = useRef<any>(null);
  const store = useNodeBuilderStore();
  const { data: nodeData } = useGetAllNodeLibrary();
  // Queries

  const { mutate: deleteNode } = useDeleteNode();
  const {
    data: flow,
    refetch,
    isLoading,
  } = useGetFlow(id ?? "", selectedId ?? "");
  const { data: flowData } = useGetAllFlows(id ?? "");
  const { mutate: connectNode } = useConnectNode();
  const { mutate: updateNodePosition } = useUpdateNodePosition();
  const { mutate: runFlow } = useRunFlow();

  // Execution history data
  const {
    data: executionHistory,
    isLoading: isExecutionHistoryLoading,
    refetch: refetchExecutionHistory,
  } = useGetJobExecutionFromFlowId({
    space: id ?? "",
    flowId: selectedId ?? "",
  });

  // Get execution details when an execution is selected

  // Effects
  useEffect(() => {
    setNodes([]);
    setEdges([]);
    store.clearNode();

    if (selectedId) {
      refetch();
    }
  }, [selectedId, refetch]);

  useEffect(() => {
    if (flow?.nodes && flow && flow.nodes.length > 0) {
      const nodes: FlowInterface = flow;
      const allNodes: any = [];
      const allEdge: any = [];
      store.addEdges([]);
      store.addNodes([]);

      nodes.nodes.forEach((node: NodeInterface, index) => {
        const positionPlaceholder = {
          x: index * 0.5 * 500,
          y: index * 0 * 500,
        };
        const measuredPlaceholder = { width: 195, height: 60 };
        const position = {
          x: node?.position?.Coordinates?.x ?? index * 0.5 * 500,
          y: node?.position?.Coordinates?.y ?? index * 0 * 500,
        };
        const measured = {
          width: node?.position?.Measured?.width ?? 195,
          height: node?.position?.Measured?.height ?? 60,
        };

        const newNode = {
          id: `${node.id}`,
          type: "custom",
          flowid: selectedId,
          space: nodes.space,
          jobType: node.type,
          position: position ?? positionPlaceholder,
          measured: measured ?? measuredPlaceholder,
          links: node.links,
          data: {
            id: `${node.id}`,
            space: id ?? "",
            flowId: selectedId,
            description: node.description,
            createdBy: node.createdBy,
            label: node.name,
            type: "custom",
            nodeType: node.type,
            inputs: node.inputs,
            icon: node?.display?.icon,
            color: node?.display?.color,
          },
        };
        if (node.links) {
          node.links.forEach((link: any) => {
            const edges = createEdgeObject({
              sourceId: node.id,
              targetId: link?.nextNodeId,
            });
            allEdge.push(edges);
          });
        }

        allNodes.push(newNode);
      });

      store.addNodes(allNodes);
      store.addEdges(allEdge);
      setNodes(allNodes);
      setEdges(allEdge);
    }
    // add else later
  }, [flow, id, selectedId]);
  useEffect(() => {
    const updatePlaceholders = () => {
      const newNodes = [...nodes.filter((node) => node.type === "custom")];
      const existingNodes = nodes.filter((node) => node.type === "custom");

      // If no nodes exist, show only trigger placeholder
      if (existingNodes.length === 0) {
        newNodes.push({
          id: "trigger-placeholder",
          type: "placeholder",
          position: { x: 100, y: 150 },
          data: { label: "Add Trigger", type: "trigger", setIsSidebarOpen }, // Pass the setter to the node data },
        });
      }
      // If exactly one node exists, show action placeholder
      else if (existingNodes.length === 1) {
        // Calculate position based on the existing node
        const existingNode = existingNodes[0];
        newNodes.push({
          id: "action-placeholder",
          type: "placeholder",
          position: {
            x: existingNode.position.x + 300,
            y: existingNode.position.y,
          },
          data: { label: "Add Action", type: "action", setIsSidebarOpen },
        });
      }
      // If more than one node, no placeholders needed

      setNodes(newNodes);
      store.addNodes(newNodes);
    };

    updatePlaceholders();
  }, [nodes.filter((node) => node.type === "custom").length, setIsSidebarOpen]);

  // Callbacks
  const onConnect = useCallback(
    (params: any) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: "custom",
        animated: true,
      };
      connectNode(
        {
          space: id ?? "",
          flowId: selectedId!,
          sourceId: params.source,
          nextNodeId: params.target,
        },
        {
          onSuccess() {
            toast("Node Connected", {
              type: "success",
              autoClose: 2000,
            });
          },
          onError() {
            toast("Node Connection Failed", {
              type: "error",
              autoClose: 2000,
            });
          },
        }
      );

      setEdges((eds: any) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handlePositionUpdate = _.debounce(
    (nodeId: string, position: NodePosition) => {
      updateNodePosition({
        space: id ?? "",
        flowId: selectedId!,
        nodeId,
        node: position,
      });
    },
    300
  );

  const onNodeDragStop = (_: any, node: any) => {
    const dataPostion: NodePosition = {
      Measured: {
        width: node.measured.width,
        height: node.measured.height,
      },
      Coordinates: {
        x: node.position.x,
        y: node.position.y,
      },
    };

    handlePositionUpdate(node.id, dataPostion);
  };

  const { screenToFlowPosition } = useReactFlow();
  const { mutate: createNode } = useCreateNode();
  const { mutate: postTrigger } = usePostNodeTrigger();
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (type && reactFlowBounds) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const datatype = type.split(":")[0];

        const typeNode = nodeData.find(
          (t: any) => t.id.toLowerCase() === datatype.toLowerCase()
        );

        const template = typeNode.jobs.find((t: any) => t.id === type);

        if (template) {
          const data1 = {
            space: id,
            flowId: selectedId,
            name: template.name,
            description: template.description,
            type: template.id,
            position: { Coordinates: position, Measured: null },
            display:{
              icon: typeNode?.icon,
              color: typeNode?.color,
            }
            
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

              queryClient.invalidateQueries("getFlow");
              queryClient.refetchQueries("getFlow");
              toast("New Node Added Successfully", {
                type: "success",
                autoClose: 2000,
              });
            },
          });

          const existingNodes = nodes.filter((node) => node.type === "custom");

          setNodes([...existingNodes, data1]);
          store.addNodes([...existingNodes, data1]);
        }
      }
    },
    [reactFlowWrapper, nodes]
  );

  const onNodeDelete = useCallback(
    (node: any) => {
      const nodeToDelete = nodes.find((n) => n.id === node.id);
      if (nodeToDelete && nodeToDelete.type === "custom") {
        const remainingNodes = nodes.filter(
          (n) => n.id !== node.id && n.type === "custom"
        );
        setNodes(remainingNodes);
        store.addNodes(remainingNodes);
      }
    },
    [nodes, setNodes, store]
  );

  // Create memoized nodeTypes with the correct setIsSidebarOpen
  const memoizedNodeTypes = React.useMemo(
    () => ({
      custom: CustomNode,
      placeholder: (props: any) => (
        <PlaceholderNode {...props} setIsSidebarOpen={setIsSidebarOpen} />
      ),
    }),
    [setIsSidebarOpen]
  );

  return (
    <div className="dndflow">
      <div
        className="w-full h-screen bg-gray-50 relative reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <HeaderTabs tableData={flowData} isFlow={true} />
        {isLoading ? (
          <FlowSkeleton />
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onNodeDragStop={onNodeDragStop}
            onDrop={onDrop}
            onNodesDelete={onNodeDelete}
            maxZoom={1}
            connectionMode={ConnectionMode.Loose}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineStyle={connectionLineStyle}
            nodeTypes={memoizedNodeTypes as any}
            edgeTypes={updatedEdgeTypes}
            fitView
          >
            <Background />
            <Controls />

            <Panel position="top-center" className="flex space-x-2">
              <DeleteConfirmationDialog
                id={"workspace"}
                title="Reset Automation Workspace"
                description="Are you sure you want to reset all node and connections? This action cannot be undone."
                confirmButtonText="Reset"
              />
              <DeleteTrigger
                id={"workspace"}
                itemName={"Delete"}
                onConfirm={() => {
                  nodes.forEach((node) => {
                    deleteNode(
                      {
                        space: id ?? "",
                        flowId: selectedId!,
                        sourceId: node.id,
                        nextNodeId: "",
                      },
                      {
                        onSuccess() {
                          queryClient.invalidateQueries("getFlow");
                          queryClient.refetchQueries("getFlow");
                        },
                      }
                    );
                  });
                  setNodes([]);
                  setEdges([]);
                  // handleDelete(row?.id.toString()
                }}
              >
                <Button variant="outline" size="sm">
                  <Trash className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </DeleteTrigger>
              <Button
                onClick={() => {
                  runFlow({
                    space: id ?? "",
                    flowId: selectedId,
                   
                  });
                }}
                variant="default"
                size="sm"
              >
                <Play className="h-4 w-4 mr-1" />
                RUN
              </Button>
              <Button
                onClick={() => {
                  refetchExecutionHistory();
                  setIsExecutionHistoryOpen(true);
                }}
                variant="outline"
                size="sm"
              >
                <History className="h-4 w-4 mr-1" />
                Execution History
              </Button>
            </Panel>

            <Panel position="top-left" className="m-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-white hover:bg-gray-100 z-20"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </Panel>

            <AnimatePresence>
              {isSidebarOpen && (
                <div className="absolute inset-0 z-10">
                  <NodeLibrarySideBar setIsSidebarOpen={setIsSidebarOpen} />
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {store.activeNodeId &&
                nodes.find((n: any) => n.id === store.activeNodeId) && (
                  <div className="absolute inset-0 z-10">
                    <NodeConfigSidebar
                      node={nodes.find((n: any) => n.id === store.activeNodeId)}
                      onClose={() => store.setActiveNode(null)}
                      flowId={selectedId!}
                    />
                  </div>
                )}
            </AnimatePresence>
          </ReactFlow>
        )}

        {/* Execution History Dialog */}
        {isExecutionHistoryOpen && (
          <ExecutionHistoryDialog
            isOpen={isExecutionHistoryOpen}
            onClose={() => {
              setIsExecutionHistoryOpen(false);
            }}
            executionHistory={executionHistory ?? []}
            isLoading={isExecutionHistoryLoading || false}
            spaceId={id ?? ""}
            flowId={selectedId ?? ""}
          />
        )}
      </div>
    </div>
  );
}
