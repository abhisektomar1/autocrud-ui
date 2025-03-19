export const createEdgeObject = ({
  sourceId,
  targetId,
}: {
  sourceId: string;
  targetId: string;
}) => {
  return {
    animated: true,
    id: `${sourceId}-${targetId}`,
    markerEnd: {
      color: "#667eea",
      height: 20,
      type: "arrowclosed",
      width: 20,
    },
    source: sourceId,
    style: {
      strokeWidth: 3,
      stroke: "#667eea",
    },
    target: targetId,
    type: "custom",
  };
};
