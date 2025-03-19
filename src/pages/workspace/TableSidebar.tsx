/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Plus,
  ChevronDown,
  Search,
  Table2,
  KanbanSquare,
  Calendar,
  BarChart3,
  ListFilter,
  Pencil,
  Trash2,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useDeleteView, useEditView, useGetAllView } from "@/queries/view";
import { CreateViewDialog } from "../kanban/KanbanCreaeDialog";
import { useNavigate, useParams } from "react-router-dom";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewSidebarProps {
  isOpen: boolean;
  spaceId: any;
  tableId: any;
}

const VIEW_ICONS = {
  grid: Table2,
  kanban: KanbanSquare,
  calendar: Calendar,
  chart: BarChart3,
  filter: ListFilter,
} as const;

const viewOptions = [
  {
    id: "grid",
    name: "Grid view",
    icon: Table2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "kanban",
    name: "Kanban view",
    icon: KanbanSquare,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
];

export function TableSidebar({ isOpen, spaceId, tableId }: ViewSidebarProps) {
  const [selectedViewId, setSelectedViewId] = React.useState<string | null>();
  const { data: views = [] } = useGetAllView(spaceId, tableId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedViewType, setSelectedViewType] = useState<"grid" | "kanban">(
    "grid"
  );
  const [searchText, setSearchText] = useState("");
  const [deleteViewDialogOpen, setDeleteViewDialogOpen] = React.useState(false);
  const [deleteViewConfirmation, setDeleteViewConfirmation] =
    React.useState("");
  const [viewToDelete, setViewToDelete] = React.useState<string | null>(null);

  const [editingViewId, setEditingViewId] = useState<string | null>(null);
  const [editingViewName, setEditingViewName] = useState("");

  const isTable = location.pathname.includes("/view");
  const isGrid = location.pathname.includes("/grid");
  const navigate = useNavigate();
  const { viewId } = useParams();
  const { mutate: deleteView } = useDeleteView();
  const { mutate: editView } = useEditView();

  useEffect(() => {
    if (views?.length > 0 && viewId) {
      setSelectedViewId(viewId);
    }
  }, [views, viewId]);

  const filteredViews = useMemo(() => {
    if (!views) return [];
    if (!searchText) return views;

    const searchLower = searchText.toLowerCase();
    return views.filter((view: any) =>
      view.name.toLowerCase().includes(searchLower)
    );
  }, [views, searchText]);

  const handleRenameView = (viewId: string) => {
    const view = views.find((v: any) => v.id === viewId);
    if (view) {
      setEditingViewId(viewId);
      setEditingViewName(view.name);
    }
  };

  const handleSaveRename = () => {
    if (editingViewId && editingViewName.trim()) {
      editView(
        {
          spaceId: spaceId,
          tableId: tableId,
          viewId: editingViewId,
          updateData: editingViewName.trim(),
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["getView", spaceId, tableId]);
            toast("View renamed successfully!", {
              type: "success",
              autoClose: 2000,
            });
            setEditingViewId(null);
            setEditingViewName("");
          },
          onError: () => {
            toast("Failed to rename view", {
              type: "error",
              autoClose: 2000,
            });
          },
        }
      );
    }
  };

  const cancelRename = () => {
    setEditingViewId(null);
    setEditingViewName("");
  };

  const openDeleteDialog = (viewId: string) => {
    setViewToDelete(viewId);
    setDeleteViewDialogOpen(true);
  };

  const deleteViewHandler = () => {
    if (viewToDelete) {
      deleteView(
        {
          tableId: tableId as any,
          spaceId: spaceId ?? "",
          viewId: viewToDelete as any,
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
            setViewToDelete(null);
            navigate(`/space/${spaceId}/table/${tableId}`);
            setSelectedViewId(null);
          },
        }
      );
    }
  };

  return (
    <div
      className={cn(
        "absolute w-[250px] bg-white border-r shadow-sm h-[calc(100vh-162px)] transition-transform duration-300 ease-in-out z-30",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="px-2 py-1.5 border-b bg-gray-50/80">
        <div className="relative">
          <Search className="h-5 w-5 absolute right-2 top-[7px] text-gray-400" />
          <Input
            placeholder="Find a view..."
            className="h-6 border-0 bg-white shadow-sm p-4 text-xs placeholder:text-gray-400 focus-visible:ring-1"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-120px)]">
        <div className="py-3">
          <div className="px-3 py-1 text-[11px] font-medium text-gray-500 tracking-wider uppercase">
            All Views
          </div>
          <div className="mt-1 space-y-0.5 px-2">
            <div
              onClick={() => {
                navigate(`/space/${spaceId}/table/${tableId}`);
                setSelectedViewId(null);
              }}
              className={cn(
                "w-full px-2 py-1.5 text-xs font-medium flex items-center gap-2 rounded-md",
                "hover:bg-gray-50 cursor-pointer transition-colors duration-150",
                !isTable && !isGrid && "bg-blue-50 text-blue-700"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-md",
                  "w-5 h-5 transition-colors duration-200"
                  // !isTable && !isGrid ? "bg-blue-100" : "bg-gray-100"
                )}
              >
                <Table2
                  className={cn(
                    "h-3 w-3",
                    !isTable && !isGrid ? "text-blue-600" : "text-gray-600"
                  )}
                />
              </div>
              <span className="truncate">Grid View</span>
            </div>

            {filteredViews?.map((view: any) => {
              const IconComponent =
                VIEW_ICONS[
                  view.type.toLowerCase() as keyof typeof VIEW_ICONS
                ] || Table2;
              const isActive = selectedViewId === view.id;
              const baseColor =
                view.type.toLowerCase() === "grid" ? "blue" : "emerald";
              const isEditing = editingViewId === view.id;

              return (
                <ContextMenu key={view.id}>
                  <ContextMenuTrigger>
                    <div
                      key={view.id}
                      onClick={() => {
                        if (isEditing) return;
                        if (view.type === "grid") {
                          navigate(
                            `/space/${spaceId}/table/${tableId}/grid/${view.id}`
                          );
                        } else {
                          setSelectedViewId(view.id);
                          navigate(
                            `/space/${spaceId}/table/${tableId}/view/${view.id}`
                          );
                        }
                      }}
                      className={cn(
                        "w-full px-2 py-1.5 text-xs font-medium flex items-center gap-2 rounded-md",
                        "hover:bg-gray-50 cursor-pointer transition-colors duration-150",
                        isActive && `bg-${baseColor}-50 text-${baseColor}-700`
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-md",
                          "w-5 h-5 transition-colors duration-200",
                          isActive ? `bg-${baseColor}-100` : "bg-gray-100"
                        )}
                      >
                        <IconComponent
                          className={cn(
                            "h-3 w-3",
                            isActive ? `text-${baseColor}-600` : "text-gray-600"
                          )}
                        />
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            autoFocus
                            value={editingViewName}
                            onChange={(e) => setEditingViewName(e.target.value)}
                            className="h-5 text-xs w-full rounded-[6px]"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveRename();
                              } else if (e.key === "Escape") {
                                cancelRename();
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveRename();
                            }}
                            className="text-green-600 p-0.5 hover:bg-green-50 rounded-sm"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelRename();
                            }}
                            className="text-red-600 p-0.5 hover:bg-red-50 rounded-sm"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="truncate">{view.name}</span>
                      )}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-52">
                    <ContextMenuItem onClick={() => handleRenameView(view.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename view
                    </ContextMenuItem>

                    <ContextMenuSeparator />
                    <ContextMenuItem
                      className="text-red-600"
                      onClick={() => openDeleteDialog(view.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete view
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </div>
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0 p-1.5 border-t bg-white">
        <Collapsible defaultOpen>
          <CollapsibleTrigger
            className={cn(
              "flex w-full items-center justify-between py-1.5 px-2",
              "text-xs font-medium bg-gray-50/80 hover:bg-gray-100",
              "rounded-md transition-colors duration-150"
            )}
          >
            Create view
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {viewOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "w-full px-2 py-1.5 mt-1 text-xs font-medium",
                  "flex justify-between items-center cursor-pointer",
                  "hover:bg-gray-50 rounded-md transition-colors duration-150"
                )}
                onClick={() => {
                  setSelectedViewType(option.id as "grid" | "kanban");
                  setDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-md",
                      "w-5 h-5 transition-colors duration-200",
                      option.bgColor
                    )}
                  >
                    <option.icon className={cn("h-3 w-3", option.color)} />
                  </div>
                  <span>{option.name}</span>
                </div>
                <Plus className="h-3 w-3 text-gray-400" />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
      <Dialog
        open={deleteViewDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteViewConfirmation("");
          }
          setDeleteViewDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete View
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this view? This action cannot be
              undone and will permanently delete all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Type <span className="font-medium">delete</span> to confirm.
            </p>
            <Input
              id="delete-view-confirmation"
              placeholder="delete"
              value={deleteViewConfirmation}
              onChange={(e) => setDeleteViewConfirmation(e.target.value)}
              className="w-full"
              autoComplete="off"
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
      <CreateViewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        viewType={selectedViewType}
        spaceId={spaceId}
        tableId={tableId}
      />
    </div>
  );
}
