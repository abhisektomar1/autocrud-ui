import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { ResourceModel } from "../ResourceSelector";
import { GlobalVariableModel } from "@/pages/workspace/settings/GlobalVariables";

interface OptionMenuProps {
    resource?: ResourceModel;
    variable?: GlobalVariableModel;
    openEditDialog: any;
    openDeleteDialog: any;
}


export function OptionMenu({
    variable,
    resource,
    openEditDialog, 
    openDeleteDialog,
}: OptionMenuProps) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0">
          <div className="flex flex-col">

            {(!variable?.isSecret || resource?.authType !== "OAuth" )&& (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start px-3 py-2 text-sm"
                onClick={() => openEditDialog(variable || resource)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start px-3 py-2 text-sm text-destructive hover:text-destructive"
              onClick={() => openDeleteDialog(variable || resource)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
