import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useCreateTable, useGetAllTable } from "@/queries/table";
import { FormikHelpers } from "formik";

const TableSchema = Yup.object().shape({
  name: Yup.string().required("Table name is required"),
  description: Yup.string()
});

interface CreateTableDialogProps {
  isCollapsed: boolean;
  table?: { id: string; name: string } | null;
  workspaceId: string;
  onClose: () => void;
}

interface FormValues {
  name: string;
  description: string;
}

const CreateTableDialog: React.FC<CreateTableDialogProps> = ({
  isCollapsed,
  table,
  workspaceId,
  onClose,
}) => {
  const [open, setOpen] = React.useState(isCollapsed);
  const [showDescription, setShowDescription] = React.useState(false);
  const isEditing = !!table;
  const { mutate: createTable, isLoading } = useCreateTable();
  const { data: tables } = useGetAllTable(workspaceId);

  React.useEffect(() => {
    setOpen(isCollapsed); // Sync the open state with isCollapsed
  }, [isCollapsed]);

  // Function to get the suggested table name
  const getSuggestedTableName = () => {
    if (!tables || tables.length === 0) return "Table-1";
    
    // Find the highest number in existing table names
    const numbers = tables
      .map(t => {
        const match = t.name.match(/Table-(\d+)/i);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => !isNaN(n));
    
    const highestNumber = Math.max(0, ...numbers);
    return `Table-${highestNumber + 1}`;
  };

  const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    createTable(
      {
        name: values.name,
        space: workspaceId,
        description: showDescription ? values.description : "",
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
          setShowDescription(false);

          toast("Table Created Successfully!", {
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
                <Edit className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
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
                ? "Edit your table details"
                : "Enter the details for your new table"}
            </DialogDescription>
          </VStack>
          <X
            onClick={() => setOpen(false)}
            role="button"
            className="h-6 w-6 absolute right-4 top-4"
          />
        </DialogHeader>
        <Formik
          initialValues={{
            name: isEditing ? table.name : getSuggestedTableName(),
            description: "",
          }}
          validationSchema={TableSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Table Name"
                  className={errors.name && touched.name ? "border-red-500" : ""}
                />
                {errors.name && touched.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              {showDescription && (
                <div className="relative">
                  <Field
                    as={Textarea}
                    name="description"
                    placeholder="Enter view description..."
                    className="min-h-[100px] pr-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-2 p-1 h-auto"
                    onClick={() => setShowDescription(false)}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              )}

              <DialogFooter className="flex justify-between items-center gap-4 sm:justify-between">
                {!showDescription && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDescription(true)}
                    disabled={isLoading}
                  >
                    + Add description
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className={cn(!showDescription && "ml-auto", "min-w-[120px]")}
                  disabled={isLoading}
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