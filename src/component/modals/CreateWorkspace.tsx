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
import { useCreateSpace, useUpdateSpace } from "@/queries/space";
import { VStack } from "@/component/utils";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Validation schema
const WorkspaceSchema = Yup.object().shape({
  name: Yup.string().required("Workspace name is required"),
  description: Yup.string(),
});

interface CreateEditWorkspaceDialogProps {
  isCollapsed: boolean;
  workspace?: { id: string; name: string } | null;
  onClose: () => void;
  className?: string;
}

const CreateEditWorkspaceDialog: React.FC<CreateEditWorkspaceDialogProps> = ({
  isCollapsed,
  workspace,
  onClose,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [showDescription, setShowDescription] = React.useState(false);
  const isEditing = !!workspace;
  const navigate = useNavigate();

  const { mutate: createSpace, isLoading: isCreating } = useCreateSpace();
  const { mutate: updateSpace, isLoading: isUpdating } = useUpdateSpace();

  // Combine loading states
  const isLoading = isCreating || isUpdating;

  const handleSubmit = (
    values: { name: string; description: string },
    { resetForm }: any
  ) => {
    if (isEditing && workspace) {
      updateSpace(
        {
          id: workspace.id,
          name: values.name,
          description: values.description,
        },
        {
          onSuccess: (data) => {
            toast(`Workspace ${values.name} updated!`, {
              type: "success",
              autoClose: 2000,
            });
            queryClient.invalidateQueries("searchSpaces");
            resetForm();
            setOpen(false);
            onClose();
            if (data?.id) {
              navigate(`/space/${data.id}`);
            }
          },
        }
      );
    } else {
      createSpace(
        { name: values.name, description: values.description },
        {
          onSuccess: (data) => {
            toast(`Workspace ${values.name} created!`, {
              type: "success",
              autoClose: 2000,
            });

            queryClient.invalidateQueries("searchSpaces");
            resetForm();
            setOpen(false);
            onClose();
            if (data?.id) {
              navigate(`/space/${data.id}`);
            }
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <nav
          className={cn(
            "grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 cursor-pointer"
          )}
        >
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
                    {isEditing ? "Edit" : "Create"} Workspace
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {isEditing ? "Edit" : "Create"} Workspace
              </TooltipContent>
            </Tooltip>
          ) : (
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "sm",
                }),
                "justify-start",
                className
              )}
            >
              {isEditing ? (
                <Edit className=" h-4 w-4" />
              ) : (
                <Plus className=" h-4 w-4" />
              )}
              {isEditing ? "Edit" : "Create"} Workspace
            </div>
          )}
        </nav>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <VStack>
            <DialogTitle>
              {isEditing ? "Edit" : "Create New"} Workspace
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit the name of your workspace"
                : "Enter a name for your new workspace"}
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
            name: workspace ? workspace.name : "",
            description: "",
          }}
          validationSchema={WorkspaceSchema}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ errors, touched, setFieldValue, submitCount }) => (
            <Form className="space-y-4">
              <Field
                as={Input}
                name="name"
                placeholder="Workspace Name"
                className={errors.name && (touched.name || submitCount > 0) ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {(errors.name && (touched.name || submitCount > 0)) && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}
              {showDescription && (
                <>
                  <Field
                    as={Input}
                    name="description"
                    placeholder="Workspace Description"
                    className={
                      errors.description && touched.description ? "border-red-500" : ""
                    }
                    disabled={isLoading}
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm">{errors.description}</div>
                  )}
                </>
              )}

              <DialogFooter className="flex justify-between items-center gap-4 sm:justify-between">
                {!showDescription ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDescription(true)}
                    disabled={isLoading}
                  >
                    + Add Description
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDescription(false);
                      setFieldValue('description', '');
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove Description
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
                    <p>{isEditing ? "Update" : "Create"} Workspace</p>
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

export default CreateEditWorkspaceDialog;
