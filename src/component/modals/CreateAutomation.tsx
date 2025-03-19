import React, { useMemo } from "react";
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
import { Plus, X, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchSpaces } from "@/queries/space";
import { VStack } from "@/component/utils";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceItem } from "@/types/workspace";
import { useCreateFlow, useUpdateFlow } from "@/queries/flow";

// Validation schema
const AutomationSchema = Yup.object().shape({
  name: Yup.string().required("Automation name is required"),
  description: Yup.string(),
  workspaceId: Yup.string().required("Automation name is required"),
});

interface CreateEditAutomationDialogProps {
  isCollapsed: boolean;
  workspaceId?: string;
  automation?: { id: string; name: string } | null;
  onClose: () => void;
}

const CreateEditAutomationDialog: React.FC<CreateEditAutomationDialogProps> = ({
  isCollapsed,
  automation,
  workspaceId,
  onClose,
}) => {
  const [open, setOpen] = React.useState(false);
  const isEditing = !!automation;

  const { mutate: createFlow } = useCreateFlow();
  const { mutate: updateFlow } = useUpdateFlow();

  const handleSubmit = (
    values: { name: string; description: string; workspaceId: string },
    { resetForm }: any
  ) => {
    if (isEditing && automation) {
      updateFlow(
        {
          id: automation.id,
          name: values.name,
          description: values.description,
          space: values.workspaceId ?? workspaceId,
          nodes: [],
        },
        {
          onSuccess: () => {
            toast(`Automation ${values.name} created!`, {
              type: "success",
              autoClose: 2000,
            });
            queryClient.invalidateQueries("searchFlow");
            resetForm();
            setOpen(false);
            onClose();
          },
        }
      );
    } else {
      createFlow(
        {
          name: values.name,
          description: values.description,
          space: values.workspaceId,
          nodes: [],
        },
        {
          onSuccess: () => {
            toast(`Automation ${values.name} created!`, {
              type: "success",
              autoClose: 2000,
            });

            queryClient.invalidateQueries("searchFlow");
            resetForm();
            setOpen(false);
            onClose();
          },
        }
      );
    }
  };
  const { data: workspace } = useSearchSpaces("", 100);
  const memoizedWorkspace: WorkspaceItem[] = useMemo(() => {
    if (!workspace?.data) return [];

    return [...workspace.data];
  }, [workspace]);
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
                    {isEditing ? "Edit" : "Create"} Automation
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {isEditing ? "Edit" : "Create"} Automation
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
              {isEditing ? "Edit" : "Create"} Automation
            </div>
          )}
        </nav>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <VStack>
            <DialogTitle>
              {isEditing ? "Edit" : "Create New"} Automation
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit the name of your automation"
                : "Enter a name for your new automation"}
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
            name: automation ? automation.name : "",
            description: "",
            workspaceId: "",
          }}
          validationSchema={AutomationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, setFieldValue, touched }) => (
            <Form className="space-y-4">
              <Field
                as={Input}
                name="name"
                placeholder="Automation Name"
                className={errors.name && touched.name ? "border-red-500" : ""}
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}
              <Field
                as={Input}
                name="description"
                placeholder="Automation Description"
                className={
                  errors.description && touched.description
                    ? "border-red-500"
                    : ""
                }
              />
              {errors.description && touched.description && (
                <div className="text-red-500 text-sm">{errors.description}</div>
              )}

              {!workspaceId && <Select
                name="workspaceId"
                onValueChange={(value) => setFieldValue("workspaceId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Workspace Type" />
                </SelectTrigger>
                <SelectContent>
                  {memoizedWorkspace.map((workspace) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={workspace.id}
                      value={workspace.id}
                    >
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>}
              {errors.workspaceId && touched.workspaceId && (
                <div className="text-red-500 text-sm">{errors.workspaceId}</div>
              )}
              <DialogFooter>
                <Button type="submit">
                  {isEditing ? "Update" : "Create"} Automation
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditAutomationDialog;
