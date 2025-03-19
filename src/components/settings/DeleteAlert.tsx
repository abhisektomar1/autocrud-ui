import { Variable } from "@/pages/workspace/settings/GlobalVariables";
import { ResourceModel } from "../ResourceSelector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";




interface DeleteAlertProps {
    resource?: ResourceModel;
    variable?: Variable;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: any;
    handleDelete:any;
    isLoading:boolean;
}


export function DeleteAlert({
    resource,
    variable,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    isLoading,
}:DeleteAlertProps){

    return (
        <>
            <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            >
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will delete the variable{" "}
                    <span className="font-semibold">{variable?.key || resource?.name}</span>.
                    This action cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 min-w-[120px]"
                >
                    {isLoading ? (
                    <div className="flex flex-row items-center gap-2">
                        <p>Deleting...</p>
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                    ) : (
                    "Delete"
                    )}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
