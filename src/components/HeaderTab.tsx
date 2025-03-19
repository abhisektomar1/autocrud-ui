/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {  Trash2, Pencil, ChevronUp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import CreateTableDialog from "@/component/modals/CreateTable";
import CreateFlowDialog from "@/component/modals/CreateFlow";
import { useDeleteFlow } from "@/queries/flow";
import { useDeleteTable } from "@/queries/table";
import DeleteConfirmationDialog, {
  DeleteTrigger,
} from "@/component/DeleteDialog";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";

interface HeaderTabsProps {
  className?: string;
  tableData: any;
  isFlow: boolean;
}

export function HeaderTabs({ className, tableData, isFlow }: HeaderTabsProps) {
  const [activeTab, setActiveTab] = React.useState<any>("");
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState<any>(null);
  const { mutate: deleteFlow } = useDeleteFlow();
  const { mutate: deleteTable } = useDeleteTable();
  const { id, tableId, flowId } = useParams();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleDelete = (tabId: string) => {
    const deleteAction = isFlow ? deleteFlow : deleteTable;
    const entityName = isFlow ? "automation" : "table";

    deleteAction(
      //@ts-expect-error
      {
        spaceId: id ?? "",
        ...(isFlow ? { flowId: tabId } : { tableId: tabId }),
      },
      {
        onSuccess: () => {
          const queriesToInvalidate = isFlow
            ? ["searchFlow", "getFlows", "getFlow"]
            : ["searchTable", "getTables", "getTable"];

          queriesToInvalidate.forEach((queryKey) =>
            queryClient.invalidateQueries(queryKey)
          );

          navigate(`/space/${id}`);
          toast(`${entityName} deleted successfully`, {
            type: "success",
            autoClose: 2000,
          });
        },
        onError: (error) => {
          toast(`Failed to delete ${entityName}`, {
            type: "error",
            autoClose: 2000,
          });
          console.error("Delete error:", error);
        },
      }
    );
  };

  const handleRename = (tab: any) => {
    setSelectedTab(tab);
    setIsRenaming(true);
  };

  React.useEffect(() => {
    if (tableId) setActiveTab(tableId);
    if (flowId) setActiveTab(flowId);
  }, [tableId, flowId]);

  return (
    <div
      className={cn("flex h-12 items-cente gap-1 bg-white border-b", className)}
    >
      <nav className="flex h-full items-center">
        {tableData?.map((tab: any) => (
          <div
            key={tab.id}
            className="group relative flex h-full w-[120px] hover:bg-primary/10 justify-center border-r"
          >
            <button
              onClick={() => {
                setActiveTab(tab.id);
                if (isFlow) {
                  navigate(`/space/${id}/flow/${tab.id}`);
                } else {
                  navigate(`/space/${tab.space}/table/${tab.id}`);
                }
              }}
              className={cn(
                "flex h-full items-center gap-1 px-3 text-xs font-medium text-black/90 w-full",
                activeTab === tab.id && "bg-primary/10 text-primary border-t border-primary/50"
              )}
            >
              {tab.name}
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "flex h-full items-center justify-center px-1 cursor-pointer transition-opacity",
                    activeTab === tab.id && "bg-primary/10 text-primary border-t border-primary/50"
                  )}
                >
                  <ChevronUp className="h-4 w-4 opacity-70" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1" align="start">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-start gap-2"
                    onClick={() => handleRename(tab)}
                  >
                    <Pencil className="h-4 w-4" />
                    Rename
                  </Button>
                  <DeleteTrigger
                    id={`delete-automation-${tab.id}`}
                    itemName={tab.name}
                    onConfirm={() => handleDelete(tab.id)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-50 w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </DeleteTrigger>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))}
        <>
          {isRenaming && (
            <CreateFlowDialog
              isCollapsed={isRenaming}
              table={selectedTab}
              workspaceId={id ?? ""}
              onClose={() => {
                setIsRenaming(false);
              }}
            />
          )}
          {isFlow ? (
            <CreateFlowDialog
              isCollapsed={isCollapsed}
              table={null}
              workspaceId={id ?? ""}
              onClose={() => {
                setIsCollapsed(false);
              }}
            />
          ) : (
            <TooltipProvider>
              <CreateTableDialog
                isCollapsed={isCollapsed}
                table={null}
                workspaceId={id ?? ""}
                onClose={() => {
                  setIsCollapsed(false);
                }}
              />
            </TooltipProvider>
          )}
        </>
      </nav>

      <DeleteConfirmationDialog
        id={`delete-automation-${activeTab}`}
        title={`Delete ${isFlow ? "Automation" : "Table"}`}
        description={`Are you sure you want to delete this ${
          isFlow ? "automation" : "table"
        }? This action cannot be undone.`}
        confirmButtonText="Delete"
      />
    </div>
  );
}
