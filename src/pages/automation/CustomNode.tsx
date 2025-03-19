import React, { useState } from "react";
import { NodeProps, Handle, Position } from "@xyflow/react";
import {
  MoreHorizontalIcon,
  Lock,
  Trash,
  UnplugIcon,
  Play,
  Plus,
} from "lucide-react";
import { nodeLibrary } from "./nodeLibrary";
import { useNodeBuilderStore } from "./nodeStore2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDeleteNode, useGetFlow, useUpdateFlow } from "@/queries/flow";
import DeleteConfirmationDialog from "@/component/DeleteNodeDailog";
import { toast } from "react-toastify";
import { queryClient } from "@/queries/client";
import { useTestNode } from "@/queries/node";

export const CustomNode: React.FC<NodeProps<any>> = ({
  data,
  id,
  selected,
}) => {

  const { mutate: updateFlow } = useUpdateFlow();
  const { data: flowData } = useGetFlow(data.space ?? "", data.flowId);
  const store = useNodeBuilderStore();
  const template = nodeLibrary.find((t) => t.type === data.type);
  const isHighlighted = store.highlightedNodeId === id;

  const { mutate: deleteNode } = useDeleteNode();

  const options = [
    {
      id: "Delete",
      label: "Delete",
      locked: false,

      icon: <Trash className="w-4 h-4 mr-2" />,
    },
    {
      id: "Disconnect",
      label: "Disconnect",
      locked: true,
      icon: <UnplugIcon className="w-4 h-4 mr-2" />,
    },
    {
      id: "Run",
      label: "Test",
      locked: false,
      icon: <Play className="w-4 h-4 mr-2" />,
    },
    {
      id: "Make Trigger",
      label: "Make Trigger",
      locked: false,
      icon: <Plus className="w-4 h-4 mr-2" />,
    },
  ];
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: testNode } = useTestNode();

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white bg-blue-500"
        style={{ left: -6 }}
      />
      {showDeleteDialog && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => {
            deleteNode(
              {
                space: data.space ?? "",
                flowId: data.flowId,
                sourceId: data.id,
                nextNodeId: "",
              },
              {
                onSuccess() {
                  toast("Node Deleted Successfully", {
                    type: "success",
                    autoClose: 2000,
                  });
                  queryClient.invalidateQueries("getFlow");
                  queryClient.refetchQueries("getFlow");
                },
              }
            );
            setShowDeleteDialog(false);
          }}
          nodeName={data.label}
        />
      )}

      <div
        className={`p-4 rounded-lg shadow-lg border-2 transition-all duration-200 
            ${selected ? "border-blue-500" : "border-transparent"}
            ${isHighlighted ? "bg-blue-100" : template?.color || "bg-white"}`}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-2"
            onClick={() => store.setActiveNode(id)}
          >
            {template && <template.icon className="h-5 w-5" />}
            <span className="font-medium">{data.label}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <MoreHorizontalIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {options.map((option) => (
                <DropdownMenuItem
                  onClick={() => {
                    if (option.id === "Delete") {
                      setShowDeleteDialog(true);
                    } else if (option.id === "Run") {
                      testNode(
                        {
                          space: data.space ?? "",
                          flowId: data.flowId,
                          nodeId: data.id,
                        },
                        {
                          onSuccess: () => {
                            toast("Node tested successfully", {
                              type: "success",
                              autoClose: 2000,
                            });
                          },
                          onError: (error) => {
                            console.error("Node test failed:", error);
                            toast("Failed to test node", {
                              type: "error",
                              autoClose: 2000,
                            });
                          },
                        }
                      );
                    } else if (option.id === "Make Trigger") {
                      updateFlow(
                        {
                          id: data.flowId,
                          space: data.space ?? "",
                          description: "",
                          name: flowData?.name,
                          trigger: {
                            type: "Scheduled",
                            nodeId: data.id,
                            schedule: "Every 5 minutes",
                          },
                        },
                        {
                          onSuccess: () => {
                            queryClient.invalidateQueries("getFlows");
                            queryClient.invalidateQueries("getFlow");
                            toast("Trigger Updated Successfully!", {
                              type: "success",
                              autoClose: 2000,
                            });
                          },
                        }
                      );
                    }
                  }}
                  key={option.id}
                  className="flex items-center justify-between cursor-pointer"
                  disabled={option.locked}
                >
                  <div className="flex flex-row items-center">
                    {option.icon}
                    {option.label}
                  </div>
                  {option.locked && <Lock className="w-4 h-4 ml-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {data.config && (
          <div className="mt-2 text-xs text-gray-600">
            {Object.entries(data.config).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium">{key}:</span>{" "}
                {typeof value === "string" ? value.slice(0, 20) : String(value)}
                {typeof value === "string" && value.length > 20 ? "..." : ""}
              </div>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white bg-blue-500"
        style={{ right: -6 }}
      />
    </>
  );
};
