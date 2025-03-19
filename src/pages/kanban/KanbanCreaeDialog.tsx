/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateColumnMetaTable, useGetTable } from "@/queries/table";
import { useCreateView } from "@/queries/view";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { queryClient } from "@/queries/client";
import { useNavigate } from "react-router-dom";
// Create View Dialog Component
export const CreateViewDialog = ({
  open,
  onOpenChange,
  viewType,
  spaceId,
  tableId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewType: "grid" | "kanban";
  spaceId: string;
  tableId: string;
}) => {
  const { data: tableData } = useGetTable(spaceId, tableId);
  const { mutate: createView } = useCreateView();
  const { mutateAsync: createColumn } = useCreateColumnMetaTable(); //
  const [currentStep, setCurrentStep] = useState<"selectField" | "createField">(
    "selectField"
  );
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [viewName, setViewName] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldOptions, setNewFieldOptions] = useState("");
  const navigate = useNavigate();
  const selectColumns =
    tableData?.columns?.filter((col: any) => col.fieldType === "select") || [];

  const handleCreateNewField = async () => {
    if (!newFieldName || !newFieldOptions) {
      toast.error("Field name and options are required");
      return;
    }

    setIsCreating(true);
    try {
      const options = newFieldOptions.split(",").map((opt) => opt.trim());

      const columnData = {
        name: newFieldName,
        fieldType: "select",
        enum: options,
        tableId,
        spaceId,
        dataType: "string",
        length: 100,
        isRequired: false,
      };

      const response = await createColumn({ tableData: columnData as any });

      if (!response?.data?.id) {
        throw new Error("Failed to create column - no ID returned");
      }

      // Invalidate correct query keys based on your table.ts
      await Promise.all([
        queryClient.invalidateQueries(["getTable", spaceId, tableId]),
        queryClient.invalidateQueries(["getAllTable", spaceId]),
        queryClient.invalidateQueries(["table-filters", spaceId, tableId]),
        queryClient.invalidateQueries(["getTableRow", spaceId, tableId]),
      ]);

      setSelectedColumnId(response.data.id);
      setCurrentStep("selectField");
      toast.success("Field created successfully");
    } catch (error) {
      void error;
      toast.error("Failed to create field");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateView = async () => {
    if (!viewName) {
      toast.error("View name is required");
      return;
    }
    if (viewType === "kanban" && !selectedColumnId) {
      toast.error("Please select a grouping field");
      return;
    }
    createView(
      {
        viewData: {
          name: viewName,
          type: viewType,
          tableId,
          space: spaceId,
          ...(viewType === "kanban" && { stackbycolumn: selectedColumnId }),
        },
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries("getView");
          toast.success("View created successfully");
          onOpenChange(false);
          if (viewType === "kanban") {
            navigate(`/space/${spaceId}/table/${tableId}/view/${data.data.id}`);
          } else {
            const initialVisibility = tableData?.columns?.reduce(
              (acc: any, col: any) => {
                acc[col.key] = true;
                return acc;
              },
              {}
            );
            localStorage.setItem(
              `viewConfig-${data.data.id}`,
              JSON.stringify({
                columnVisibility: initialVisibility || {},
                filterText: "",
                conditions: [],
              })
            );
            navigate(`/space/${spaceId}/table/${tableId}/grid/${data.data.id}`);
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create {viewType.charAt(0).toUpperCase() + viewType.slice(1)} View
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">View Name</Label>
            <Input
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder={`e.g., Project ${
                viewType === "kanban" ? "Board" : "Table"
              }`}
            />
          </div>

          {viewType === "kanban" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Stack by Field</Label>
                <p className="text-sm text-muted-foreground">
                  Group records using a select, collaborator, or linked record
                  field
                </p>

                <div className="space-y-2">
                  {selectColumns.map((col: any) => (
                    <div
                      key={col.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => setSelectedColumnId(col.id)}
                    >
                      <div
                        className={`h-4 w-4 rounded-full border-2 
                          ${
                            selectedColumnId === col.id
                              ? "border-blue-500 bg-blue-100"
                              : "border-gray-300"
                          }`}
                      />
                      <span className="text-sm">{col.name}</span>
                    </div>
                  ))}
                </div>

                {currentStep === "selectField" ? (
                  <>
                    <div className="space-y-2 pt-2">
                      <div
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => setCurrentStep("createField")}
                      >
                        <Plus className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-blue-500">
                          Create new Single select field
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Field Name</Label>
                      <Input
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="e.g., Status"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Options</Label>
                      <Input
                        value={newFieldOptions}
                        onChange={(e) => setNewFieldOptions(e.target.value)}
                        placeholder="Comma separated values (e.g., Todo, In Progress, Done)"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep("selectField")}
                        className="text-sm"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleCreateNewField}
                        disabled={isCreating}
                        className="text-sm"
                      >
                        {isCreating ? "Creating..." : "Create Field"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={handleCreateView}
            disabled={
              isCreating || (viewType === "kanban" && !selectedColumnId)
            }
            className="w-full"
          >
            {isCreating ? "Creating View..." : "Create View"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
