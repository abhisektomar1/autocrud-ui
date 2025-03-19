import { useCallback, useState } from "react";
import { CustomEdge } from "./CustomEdge";
import { Trash2 } from "lucide-react";
import { useRemoveConnection } from "@/queries/flow";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { queryClient } from "@/queries/client";

export const CustomEdgeWithDelete = (props: any) => {
  const { id } = useParams();
  const { flowId } = useParams(); 
  let selectedId = flowId ?? ""; 
  const { mutate: removeNode } = useRemoveConnection();
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const onEdgeDelete = useCallback(
    (edge: any) => {
      const sourceId = edge.source;
      const targetId = edge.target;

      // Call your API to disconnect nodes
      removeNode(
        {
          space: id ?? "",
          flowId: selectedId,
          sourceId: sourceId,
          nextNodeId: targetId,
        },
        {
          onSuccess() {
            // Remove edge from local state
            // setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            // store.removeEdge(edge.id);

            queryClient.invalidateQueries("getFlow");
            queryClient.refetchQueries("getFlow");
            toast("Connection removed", {
              type: "success",
              autoClose: 2000,
            });
          },
          onError() {
            toast("Failed to remove connection", {
              type: "error",
              autoClose: 2000,
            });
          },
        }
      );
    },
    [removeNode, id, selectedId]
  );
  return (
    <>
      <CustomEdge {...props} />

      <foreignObject
        width={20}
        height={20}
        x={props.sourceX + (props.targetX - props.sourceX) / 2 - 10}
        y={props.sourceY + (props.targetY - props.sourceY) / 2 - 10}
        className="edge-delete-button"
        onMouseEnter={() => setShowDeleteButton(true)}
        onMouseLeave={() => setShowDeleteButton(false)}
        style={{ cursor: "pointer", opacity: showDeleteButton ? 1 : 0 }}
        onClick={(event) => {
          event.stopPropagation();
          onEdgeDelete(props);
        }}
      >
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200">
          <Trash2 className="w-3 h-3 text-gray-500 hover:text-red-500" />
        </div>
      </foreignObject>
    </>
  );
};
