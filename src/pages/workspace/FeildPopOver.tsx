/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Edit, ChevronDown, Trash, ArrowDownAZ, ArrowUpAZ, EyeOff, Copy, Filter } from "lucide-react";
import FieldEditorPopover from "@/pages/workspace/ColumnAddPopover";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateColumnMetaTable } from "@/queries/table";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";

const FieldOptionsPopover = ({
  onDelete,
  column,
  spaceId,
  sortConfig,
  handleSort,
}: {
  onDelete: () => void;
  column: any;
  spaceId: string;
  sortConfig?: { key: string | null; direction: "ascending" | "descending" };
  handleSort?: (key: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  
  const { mutate: createColumn } = useCreateColumnMetaTable();

  const handleSortClick = () => {
    if (!handleSort) return;
    handleSort(column.id);
    setOpen(false);
  };

  // Determine the current sort state for this column
  const isColumnSorted = sortConfig?.key === column.id;
  const currentDirection = isColumnSorted ? sortConfig?.direction : null;

  // Determine what the next sort will do
  const getSortDisplay = () => {
    if (!isColumnSorted || currentDirection === "descending") {
      return {
        icon: <ArrowUpAZ className="h-4 w-4" />,
        text: "Sort A → Z",
      };
    }
    return {
      icon: <ArrowDownAZ className="h-4 w-4" />,
      text: "Sort Z → A",
    };
  };

  const sortDisplay = getSortDisplay();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setOpen(false);
  };

  const confirmDelete = () => {
    if (deleteConfirmation === "delete") {
      onDelete();
      setDeleteDialogOpen(false);
      setDeleteConfirmation("");
    }
  };
  
  // Handle duplicate field
  const handleDuplicateField = () => {
    // Create a new column with the same properties but a different name
    const duplicateData = {
      tableId: column.tableid,
      spaceId: spaceId,
      name: `${column.label} (copy)`,
      length: column.length || 100,
      fieldtype: column.fieldType,
      default: column.default,
      enum: column.options || [],
      isRequired: column.isRequired,
      validation: {
        pattern: column.validation?.pattern,
        minLength: column.validation?.minLength,
        maxLength: column.validation?.maxLength,
        url: column.fieldtype === "url" || column.fieldtype === "link",
      },
    };

    createColumn(
      { tableData: duplicateData },
      {
        onSuccess() {
          queryClient.invalidateQueries("getTable");
          queryClient.invalidateQueries("getTableRow");
          toast("Field duplicated successfully", {
            type: "success",
            autoClose: 2000,
          });
          setOpen(false);
        },
        onError() {
          toast("Failed to duplicate field", {
            type: "error",
            autoClose: 2000,
          });
        },
      }
    );
  };
  
  // Handle hide field
  const handleHideField = () => {
    // Dispatch an event to toggle column visibility
    const event = new CustomEvent('toggleColumnVisibility', { 
      detail: { columnKey: column.key || column.id }
    });
    window.dispatchEvent(event);
    setOpen(false);
  
  };
  
  // Handle filter by field
  const handleFilterByField = () => {
    // Get the correct field name to use in the filter
    // The filter component expects the column name, not the ID
    const fieldName = column.name || column.label;
    
    // Close this popover first
    setOpen(false);
    
    // Small delay to ensure this popover is fully closed before opening the filter
    setTimeout(() => {
      // Dispatch a custom event to add a filter with this field pre-selected
      const event = new CustomEvent('addFilterWithField', { 
        detail: { 
          fieldId: fieldName, // Use the field name instead of ID
          fieldName: fieldName
        }
      });
      window.dispatchEvent(event);
    
    }, 50);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          onClick={(e) => {
            e.stopPropagation();
          }}
          asChild
        >
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-transparent"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-56 p-0"
        >
          <div className="grid p-2 gap-1">
          <li
              onClick={handleDuplicateField}
              className="w-full h-8 py-2 cursor-pointer px-3 flex items-center gap-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100"
            >
              <Copy className="h-4 w-4" />
              <span className="text-xs text-gray-800">Duplicate field</span>
            </li>
          <li
              onClick={handleHideField}
              className="w-full h-8 py-2 cursor-pointer px-3 flex items-center gap-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100"
            >
              <EyeOff className="h-4 w-4" />
              <span className="text-xs text-gray-800">Hide field</span>
            </li>
            {column.sortable && (
              <li
                className="w-full h-8 py-2 cursor-pointer px-3 flex items-center gap-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100"
                onClick={handleSortClick}
              >
                {sortDisplay.icon}
                <span className="text-xs text-gray-800">
                  {sortDisplay.text}
                </span>
              </li>
            )}
             <li
              onClick={handleFilterByField}
              className="w-full h-8 py-2 cursor-pointer px-3 flex items-center gap-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100"
            >
              <Filter className="h-4 w-4" />
              <span className="text-xs text-gray-800">Filter by field</span>
            </li>
            <div className="h-px bg-gray-200 my-1 mx-2"></div>
            <FieldEditorPopover
              tableId={column.tableid}
              spaceId={spaceId}
              onSave={() => {}}
              columnId={column.id}
              trigger={
                <li className="w-full h-8 py-2 cursor-pointer px-3 flex items-center gap-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100">
                  <div className="flex items-center gap-2 w-full">
                    <Edit className="h-4 w-4" />
                    <span className="text-xs text-gray-800">Edit</span>
                  </div>
                </li>
              }
              initialData={{
                tableId: column.tableid,
                spaceId: spaceId,
                headerName: column.label,
                fieldType: column.fieldtype,
                defaultValue: column.default,
                hasDefaultValue: column.isRequired,
                options: column.options,
              }}
            />
            <li
              onClick={handleDeleteClick}
              className="w-full h-8 py-2 cursor-pointer px-3 flex items-center gap-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100"
            >
              <Trash className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-500">Delete</span>
            </li>
          </div>
        </PopoverContent>
      </Popover>
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteConfirmation("");
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{column.label}" field? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Type <span className="font-medium">delete</span> to confirm.
            </p>
            <Input
              id="delete-confirmation"
              placeholder="delete"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteConfirmation !== "delete"}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FieldOptionsPopover;
