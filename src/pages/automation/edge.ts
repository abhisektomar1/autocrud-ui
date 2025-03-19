import { Edge, MarkerType } from "@xyflow/react";

export const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "#667eea",
  strokeDasharray: "5 5",
  animation: "flowAnimation 30s linear infinite",
};

export const defaultEdgeOptions = {
  type: "smoothstep",
  animated: true,
  style: {
    strokeWidth: 3,
    stroke: "#667eea",
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#667eea",
  },
};

export function createConnection(
  source: string,
  target: string,
  animated: boolean = true
): Edge {
  return {
    id: `edge-${source}-${target}`,
    source,
    target,
    type: "smoothstep",
    animated,
    style: {
      ...defaultEdgeOptions.style,
      strokeDasharray: "5 5",
      animation: "flowAnimation 30s linear infinite",
    },
    markerEnd: defaultEdgeOptions.markerEnd,
  };
}