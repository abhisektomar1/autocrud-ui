import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Edit, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VStack } from "@/component/utils";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import { useCreateTable } from "@/queries/table";

// Validation schema
const TableSchema = Yup.object().shape({
  name: Yup.string().required("Workspace name is required"),
});

interface CreateTableDialogProps {
  isCollapsed: boolean;
  table: any;
  workspaceId: string;
  onClose: () => void;
}

const CreateTableDialog: React.FC<CreateTableDialogProps> = ({
  isCollapsed,
  table,
  workspaceId,
  onClose,
}) => {
  const [open, setOpen] = React.useState(isCollapsed);
  const isEditing = !!table;
  const { mutate: createTable, isLoading: isCreating } = useCreateTable();
  // const { mutate: updateSpace, isLoading: isUpdating } = useUpdateSpace();

  // Combine loading states (when you implement updateSpace)
  const isLoading = isCreating; // || isUpdating;

  const handleSubmit = (values: { name: string }, { resetForm }: any) => {
    createTable(
      {
        name: values.name,
        space: workspaceId,
        description: "",
        columns: [
          {
            name: "name",
            fieldType: "text",
            length: 100,
          },
        ],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("searchSpaces");
          queryClient.invalidateQueries("getAllTable");
          onClose();
          setOpen(false);

          toast("Space Created Successfully!", {
            type: "success",
            autoClose: 2000,
          });
          resetForm();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 cursor-pointer">
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "icon",
                    }),
                    "h-9 w-9"
                  )}
                >
                  {isEditing ? (
                    <Edit className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {isEditing ? "Edit" : "Create"} Table
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {isEditing ? "Edit" : "Create"} Table
              </TooltipContent>
            </Tooltip>
          ) : (
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "sm",
                }),
                "justify-start"
              )}
            >
              {isEditing ? (
                <Edit className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isEditing ? "Edit" : "Create"} Table
            </div>
          )}
        </nav>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <VStack>
            <DialogTitle>{isEditing ? "Edit" : "Create New"} Table</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit the name of your table"
                : "Enter a name for your new table"}
            </DialogDescription>
          </VStack>
          <X
            onClick={() => setOpen(false)}
            role="button"
            className="h-6 w-6 absolute right-6 top-4"
          />
        </DialogHeader>
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={TableSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <Field
                as={Input}
                name="name"
                placeholder="Table Name"
                className={errors.name && touched.name ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-sm">{errors?.name}</div>
              )}

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="min-w-[120px] relative"
                >
                  {isLoading ? (
                    <div className="flex flex-row items-center gap-2">
                      <p>{isEditing ? "Updating..." : "Creating..."}</p>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <p>{isEditing ? "Update" : "Create"} Table</p>
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTableDialog;
