/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Settings } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useDeleteView } from "@/queries/view";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const KanbanHeaderCard = ({
  groupByField,
  setGroupByField,
  columns,
  availableFields,
  displayFields,
  toggleDisplayField,
  setIsViewSidebarOpen,
  onSearch,
}: {
  groupByField: string;
  setGroupByField: (value: string) => void;
  columns: any[];
  availableFields: any[];
  displayFields: string[];
  toggleDisplayField: (field: string) => void;
  setIsViewSidebarOpen: (open: boolean) => void;
  onSearch: (searchText: string) => void;
}) => {
  const [searchText, setSearchText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const { id, tableId, viewId } = useParams();
  const { mutate: deleteView } = useDeleteView();

  function deleteViewHandler() {
    deleteView(
      {
        tableId: tableId as any,
        spaceId: id ?? "",
        viewId: viewId as any,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries("getView");
          toast("View Deleted Successfully!", {
            type: "success",
            autoClose: 2000,
          });
        },
      }
    );
  }

  const filteredAvailableFields = availableFields.filter((field) => {
    const isNameField = field.id === "name" || field.label === "name";

    const isGroupByField = field.id === groupByField;

    return !isNameField && !isGroupByField;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <Card className="rounded-none shadow-none border-y border-t-0">
      <CardContent className="p-2">
        <div className="flex flex-col space-y-2 gap-2 md:flex-row md:items-start md:justify-start md:space-y-0">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-normal gap-1.5"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-expect-error
              onClick={() => setIsViewSidebarOpen((prev) => !prev)}
            >
              <Eye className="h-3.5 w-3.5" />
              Views
            </Button>
            <Input
              placeholder="Search records..."
              className="max-w-[240px] h-8 text-sm"
              value={searchText}
              onChange={handleSearch}
            />
            <div className="flex items-center gap-2">
              <Label className="text-sm">Group:</Label>
              <Select value={groupByField} onValueChange={setGroupByField}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {columns
                    .filter((col) => col.fieldtype === "select")
                    .map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <Settings className="h-3 w-3 mr-1" />
                  Fields
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid gap-3">
                  <h4 className="font-medium text-sm">Display Fields</h4>
                  <div className="grid gap-2">
                    {filteredAvailableFields.map((field: any) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={field.id}
                          checked={displayFields.includes(field.id)}
                          onCheckedChange={() => toggleDisplayField(field.id)}
                        />
                        <Label htmlFor={field.id} className="text-sm">
                          {field.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-3 text-xs font-normal"
              >
                Delete View
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete View</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this view? This action cannot
                  be undone and will permanently delete all associated data.
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
                  onClick={() => {
                    if (deleteConfirmation === "delete") {
                      deleteViewHandler();
                      setDeleteDialogOpen(false);
                      setDeleteConfirmation("");
                    }
                  }}
                  disabled={deleteConfirmation !== "delete"}
                >
                  Delete View
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanHeaderCard;
