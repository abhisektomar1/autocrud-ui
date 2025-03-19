/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { formatDisplayDate } from "@/utils/string";
import React from "react";
import NoTablesState from "../../component/emptyState/NoTablesState";
import SpaceSkeleton from "@/components/skeletons/spaceSkeleton";
import { useParams } from "react-router-dom";
import { useGetAllTable } from "@/queries/table";

const TableSpacePage: React.FC = () => {
  const { id } = useParams();
  const { data: tableData, isLoading } = useGetAllTable(id ?? "");

  return (
    <div className="grid p-4 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        // Skeleton loading state
        <>
          <SpaceSkeleton />
        </>
      ) : !tableData || tableData.length === 0 ? (
        <div className="col-span-full">
          <NoTablesState workspaceId={id} />
        </div>
      ) : (
        tableData.map((table: any) => (
          <a
            href={`/space/${id}/table/${table.id}`}
            key={table.id}
            className="block no-underline"
          >
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{table.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {table.columns?.length || 0} columns
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-gray-50">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-gray-400 pr-1" />
                    <span className="flex justify-between w-full">
                      <span>Created on</span>{" "}
                      <span>{formatDisplayDate(table.createdAt)}</span>
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
        ))
      )}
    </div>
  );
};

export default TableSpacePage;
