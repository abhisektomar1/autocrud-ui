import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Info, Zap } from "lucide-react";
import { formatDisplayDate } from "@/utils/string";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { useGetAllFlows } from "@/queries/flow";

const FlowSpacePage: React.FC = () => {
  const { id } = useParams();
  const { data: flowData } = useGetAllFlows(id ?? "");
  return (
    <div className="p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {(flowData ?? [])?.map((flow: any) => (
        <a
          href={`/space/${id}/flow/${flow.id}`}
          key={flow.id}
          className="block no-underline"
        >
          <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{flow.name}</span>
                <Badge variant="outline" className="text-xs">
                  {flow.nodeCount} nodes
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-gray-50">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-gray-400" />
                  {flow.description || "No description available"}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="w-full flex justify-between">
                    <span>Created on:</span>
                    <span>{formatDisplayDate(flow.createdAt)}</span>
                  </span>
                </p>
                {flow.Trigger && (
                  <>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="w-full flex justify-between">
                        <span>Trigger:</span>
                        <span>{flow.Trigger.type || "Not specified"}</span>
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="w-full flex justify-between">
                        <span>Schedule:</span>
                        <span>{flow.Trigger.schedule || "Not specified"}</span>
                      </span>
                    </p>
                  </>
                )}
                {!flow.Trigger && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-gray-400" />
                    No trigger configured
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
};

export default FlowSpacePage;
