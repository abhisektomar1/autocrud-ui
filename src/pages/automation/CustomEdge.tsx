// import React from "react";
// import { EdgeProps } from "@xyflow/react";

// export const CustomEdge: React.FC<EdgeProps<any>> = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   style = {},
// }) => {
//   const path = `M ${sourceX} ${sourceY} C ${sourceX} ${
//     (sourceY + targetY) / 2
//   }, ${targetX} ${(sourceY + targetY) / 2}, ${targetX} ${targetY}`;

//   return (
//     <path
//       id={id}
//       className="react-flow__edge-path transition-all duration-10 ease-in-out"
//       d={path}
//       style={{
//         ...style,
//         strokeWidth: 2,
//         stroke: "#667eea",
//         strokeDasharray: "4 2",
//       }}
//     />
//   );
// };
import React, { useMemo } from "react";
import { EdgeProps, getBezierPath } from "@xyflow/react";

export const CustomEdge: React.FC<EdgeProps<any>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
}) => {
  const [edgePath] = useMemo(() => {
    return getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition]);

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: "#667eea",
        strokeDasharray: "4 2",
        animation: "none", // Remove transition animation
      }}
    />
  );
};

export default React.memo(CustomEdge);