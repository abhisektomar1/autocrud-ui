import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExecutionStatusBadgeProps } from "./types";

export const ExecutionStatusBadge: React.FC<ExecutionStatusBadgeProps> = ({ status }) => {
  if (!status)
    return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;

  switch (status.toLowerCase()) {
    case "success":
    case "completed":
      return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>;
    case "failed":
      return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
    case "running":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Running</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
    default:
      return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
  }
}; 