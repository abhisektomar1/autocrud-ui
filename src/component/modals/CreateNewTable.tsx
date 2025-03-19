import { cn } from "@/lib/utils";
import { queryClient } from "@/queries/client";
import { useCreateTable } from "@/queries/table";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, X, Edit, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VStack } from "../utils";
import { Formik, Form, Field, FieldInputProps, FormikHelpers } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { WorkspaceItem } from "@/types/workspace";

// Validation schema
const WorkspaceSchema = Yup.object().shape({
  name: Yup.string().required("Table name is required"),
  workspaceId: Yup.string().required("Workspace is required"),
});

interface CreateEditTableProps {
  tableIsCollapsed: boolean;
  table?: { workspaceId: string; workspacename: string } | null;
  onClose: () => void;
  className?: string;
  memoizedWorkSpace: WorkspaceItem[];
}

const CreateEditTableSpaceDialog: React.FC<CreateEditTableProps> = ({
  tableIsCollapsed,
  table,
  memoizedWorkSpace,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const isEditing = !!table;
  const navigate = useNavigate();

  const { mutate: createTable, isLoading: isCreating } = useCreateTable();
  const isLoading = isCreating;
  const handleCreateTable = (
    values: { name: string; workspaceId: string },
    { resetForm }: FormikHelpers<{ name: string; workspaceId: string }>
  ) => {
    createTable(
      {
        name: values.name,
        space: values.workspaceId,
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
          navigate(`/space/${values.workspaceId}/table`);
          toast("Space Created Successfully!", {
            type: "success",
            autoClose: 2000,
          });

          resetForm();
        },
        onError: () => {
          toast.error("Failed to create table");
        },
      }
    );
  };

  // Custom input component that can receive a ref
  const CustomInput = React.forwardRef<HTMLInputElement, any>((props, ref) => (
    <Input {...props} ref={ref} />
  ));

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <nav
            className={cn(
              "grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 cursor-pointer"
            )}
          >
            {tableIsCollapsed ? (
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
                    <span className="sr-only">
                      {isEditing ? "Edit" : "Create New "} Table
                    </span>
                    {isEditing ? (
                      <Edit className="ml-2 h-5 w-5" />
                    ) : (
                      <Plus className="ml-2 h-5 w-5" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {isEditing ? "Edit" : "Create New "} Table
                </TooltipContent>
              </Tooltip>
            ) : (
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "lg",
                  }),
                  "items-center text-amber-900",
                  className
                )}
              >
                {isEditing ? "Edit" : "Create New"} Table
                {isEditing ? (
                  <Edit className="ml-1 h-5 w-5" />
                ) : (
                  <Plus className="ml-1 h-5 w-5" />
                )}
              </div>
            )}
          </nav>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
            <VStack className={"pr-1"}>
              <DialogTitle>{isEditing ? "Edit" : "Create "} Table</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Edit the name of your table"
                  : "Create a new table for your data collection and management needs"}
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
              workspaceId: "",
            }}
            validationSchema={WorkspaceSchema}
            onSubmit={handleCreateTable}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Field
                    name="name"
                    validate={(value: string) => {
                      if (!value) return "Table name is required";
                    }}
                    disabled={isLoading}
                  >
                    {({
                      field,
                      meta,
                    }: {
                      field: FieldInputProps<string>;
                      meta: any;
                    }) => (
                      <CustomInput
                        {...field}
                        ref={inputRef}
                        placeholder="Enter table name"
                        className={cn(
                          "bg-white/80 border-violet-200 focus:border-violet-300 focus:ring-violet-200/50 transition-all duration-200",
                          meta.error && meta.touched && "border-destructive"
                        )}
                        onBlur={(e: React.FocusEvent) => {
                          field.onBlur(e);
                          if (!field.value) {
                            setFieldValue("name", "");
                          }
                        }}
                        disabled={isLoading}
                      />
                    )}
                  </Field>
                  {errors.name && touched.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Select
                    name="workspaceId"
                    onValueChange={(value) =>
                      setFieldValue("workspaceId", value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-white/80 border-violet-200 focus:border-violet-300 focus:ring-violet-200/50 transition-all duration-200">
                      <SelectValue placeholder="Select workspace" />
                    </SelectTrigger>
                    <SelectContent>
                      {memoizedWorkSpace &&
                        memoizedWorkSpace.map((workspace) => (
                          <SelectItem
                            key={workspace.id}
                            value={workspace.id}
                            className="hover:bg-violet-50 focus:bg-violet-50 transition-colors duration-150"
                          >
                            {workspace.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.workspaceId && touched.workspaceId && (
                    <p className="text-xs text-destructive">
                      {errors.workspaceId}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white transition-colors duration-200"
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
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEditTableSpaceDialog;
