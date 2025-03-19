/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, ChevronDown, Filter, Plus, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useDeleteView, useGetView } from "@/queries/view";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const TableHeaderCard = ({
  filterText,
  handleFilter,
  isViewSidebarOpen,
  setIsViewSidebarOpen,
  columns,
  columnVisibility,
  toggleColumnVisibility,
  conditions,
  filterFields,
  updateFilter,
  removeFilter,
  addFilter,
  applyFilter,
  deleteTable,
  filterLoading,
  viewId,
}: any) => {
  const [open, setOpen] = React.useState(false);
  const [deleteViewDialogOpen, setDeleteViewDialogOpen] = React.useState(false);
  const [deleteTableDialogOpen, setDeleteTableDialogOpen] =
    React.useState(false);
  const [deleteViewConfirmation, setDeleteViewConfirmation] =
    React.useState("");
  const [deleteTableConfirmation, setDeleteTableConfirmation] =
    React.useState("");

  const { mutate: deleteView } = useDeleteView();
  const { id: spaceId, tableId } = useParams();
  const { data: viewData } = useGetView(
    viewId ? (spaceId || "") : "", 
    viewId ? (tableId || "") : "", 
    viewId || ""
  );
  const viewName = viewId ? (viewData?.name || "Loading...") : "Grid View";

  // Auto-open filter popover when conditions change and a new filter is added
  React.useEffect(() => {
    // Only open if conditions were added from outside (like from "Filter by field")
    const shouldOpen =
      conditions.length > 0 &&
      conditions.some(
        (condition: any) =>
          (condition.field && !condition.operator) || condition.isNew
      );

    // Use a timeout to ensure this doesn't conflict with other state changes
    if (shouldOpen && !open) {
      // Small delay to avoid conflicts with other state updates
      const timer = setTimeout(() => {
        setOpen(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [conditions, open]);

  function deleteViewHandler() {
    deleteView(
      {
        tableId: tableId as any,
        spaceId: spaceId ?? "",
        viewId: viewId as any,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries("getView");
          toast("View Deleted Successfully!", {
            type: "success",
            autoClose: 2000,
          });
          setDeleteViewDialogOpen(false);
          setDeleteViewConfirmation("");
        },
      }
    );
  }

  function handleDeleteTable() {
    deleteTable();
    setDeleteTableDialogOpen(false);
    setDeleteTableConfirmation("");
  }

  return (
    <Card className="rounded-none shadow-none border-y border-t-0 bg-white/60 backdrop-blur-sm">
      <CardContent className="p-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 px-2.5 text-xs font-medium gap-1.5",
                " transition-colors duration-200"
              )}
              onClick={() => setIsViewSidebarOpen(!isViewSidebarOpen)}
            >
              <Eye className="h-3.5 w-3.5" />
              {viewName}
            </Button>
            <Input
              placeholder="Search records..."
              value={filterText}
              onChange={handleFilter}
              className="modern-input max-w-[220px] h-7 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-7 px-2.5 text-xs font-medium gap-1.5",
                    "transition-colors duration-200"
                  )}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                  Fields
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {columns.map((column: any) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={columnVisibility[column.key]}
                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                    className="text-xs"
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-7 px-2.5 text-xs font-medium gap-1.5",
                    "transition-colors duration-200"
                  )}
                  data-filter-button="true"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                  {conditions.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-3.5 text-[10px] px-1"
                    >
                      {conditions.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[520px] p-0 filter-section"
                align="end"
                onInteractOutside={(e) => {
                  // Prevent closing when interacting with elements outside
                  // but only if we have incomplete filter conditions or new filters
                  if (
                    conditions.some(
                      (condition: any) =>
                        (condition.field && !condition.operator) ||
                        condition.isNew
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="p-3 space-y-3">
                  {conditions.length === 0 ? (
                    <div className="text-xs text-muted-foreground py-3 text-center">
                      No filters added
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conditions.map((condition: any, index: any) => (
                        <div key={index} className="flex items-center gap-2">
                          <Select
                            value={condition.field}
                            onValueChange={(value) =>
                              updateFilter(index, "field", value)
                            }
                          >
                            <SelectTrigger className="modern-input w-[120px] h-7 text-xs">
                              <SelectValue placeholder="Where" />
                            </SelectTrigger>
                            <SelectContent>
                              {filterFields?.map((field: any, idx: any) => (
                                <SelectItem
                                  key={idx}
                                  value={field.column}
                                  className="text-xs"
                                >
                                  {field.column}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            onValueChange={(value) =>
                              updateFilter(index, "operator", value)
                            }
                          >
                            <SelectTrigger className="modern-input w-[140px] h-7 text-xs">
                              <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {filterFields
                                .find(
                                  (field: any) =>
                                    field.column === condition.field
                                )
                                ?.filters.map((item: any) => (
                                  <SelectItem
                                    key={item.filter}
                                    value={item.urlQuery}
                                    className="text-xs"
                                  >
                                    {item.displayText}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Enter a value"
                            value={condition.value}
                            onChange={(e) =>
                              updateFilter(index, "value", e.target.value)
                            }
                            className="modern-input flex-1 h-7 text-xs"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => removeFilter(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-7 px-2.5 text-xs font-medium gap-1.5",
                        " transition-colors duration-200"
                      )}
                      onClick={addFilter}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add filter
                    </Button>
                    {conditions.length > 0 && (
                      <Button
                        variant="default"
                        size="sm"
                        className="h-7 px-2.5 text-xs font-medium"
                        onClick={() => applyFilter(conditions)}
                      >
                        {filterLoading ? (
                          <div className="flex items-center gap-2">
                            <span>Applying...</span>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          </div>
                        ) : (
                          "Apply Filter"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
              <Dialog
                open={deleteTableDialogOpen}
                onOpenChange={setDeleteTableDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-3 text-xs font-medium hover:bg-destructive/90"
                  >
                    Delete Table
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Table</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this table? This action
                      cannot be undone and will permanently delete all
                      associated data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Type <span className="font-medium">delete</span> to
                      confirm.
                    </p>
                    <Input
                      id="delete-table-confirmation"
                      placeholder="delete"
                      value={deleteTableConfirmation}
                      onChange={(e) =>
                        setDeleteTableConfirmation(e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDeleteTableDialogOpen(false);
                        setDeleteTableConfirmation("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteTable}
                      disabled={deleteTableConfirmation !== "delete"}
                    >
                      Delete Table
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {viewId && (
                <Dialog
                  open={deleteViewDialogOpen}
                  onOpenChange={setDeleteViewDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 px-3 text-xs font-medium hover:bg-destructive/90"
                    >
                      Delete View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete View</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this view? This action
                        cannot be undone and will permanently delete all
                        associated data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Type <span className="font-medium">delete</span> to
                        confirm.
                      </p>
                      <Input
                        id="delete-view-confirmation"
                        placeholder="delete"
                        value={deleteViewConfirmation}
                        onChange={(e) =>
                          setDeleteViewConfirmation(e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDeleteViewDialogOpen(false);
                          setDeleteViewConfirmation("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={deleteViewHandler}
                        disabled={deleteViewConfirmation !== "delete"}
                      >
                        Delete View
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableHeaderCard;
