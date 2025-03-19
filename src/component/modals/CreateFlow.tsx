/* eslint-disable @typescript-eslint/no-explicit-any */
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
  TooltipProvider,
} from "@/components/ui/tooltip";
import { VStack } from "@/component/utils";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import { useCreateFlow, useUpdateFlow } from "@/queries/flow";
import { useNavigate } from "react-router-dom";

// Validation schema
const TableSchema = Yup.object().shape({
  name: Yup.string().required("Flow name is required"),
});

interface CreateFlowDialogProps {
  isCollapsed: boolean;
  table: any;
  workspaceId: string;
  onClose: () => void;
}

const CreateFlowDialog: React.FC<CreateFlowDialogProps> = ({
  isCollapsed,
  table,
  workspaceId,
  onClose,
}) => {
  const [open, setOpen] = React.useState(isCollapsed);
  const isEditing = !!table;
  const { mutate: createFlow, isLoading: isCreating } = useCreateFlow();
  const { mutate: updateFlow, isLoading: isUpdating } = useUpdateFlow();
  const navigate = useNavigate();
  // Combine loading states
  const isLoading = isCreating || isUpdating;
  React.useEffect(() => {
    setOpen(isCollapsed); // Sync the open state with isCollapsed
  }, [isCollapsed]);
  const handleSubmit = (values: { name: string }, { resetForm }: any) => {
    if (isEditing && table) {
      updateFlow(
        {
          id: table.id,
          name: values.name,
          space: workspaceId,
          description: "",
          // nodes: table.nodes || [],
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries("getFlows");
            queryClient.invalidateQueries("getFlow");
            onClose();
            setOpen(false);

            toast("Flow Updated Successfully!", {
              type: "success",
              autoClose: 2000,
            });
            resetForm();
          },
        }
      );
    } else {
      createFlow(
        {
          name: values.name,
          space: workspaceId,
          description: "",
          nodes: [],
        },
        {
          onSuccess: (response: any) => {
            queryClient.invalidateQueries("getFlows");
            queryClient.invalidateQueries("getFlow");

            onClose();
            setOpen(false);

            if (response?.data?.id) {
              const tabId = response.data.id;
              console.log("PRINTING TAB ID:", tabId);

              navigate(`/space/${workspaceId}/flow/${tabId}`);
            } else {
              console.error("Failed to retrieve flow ID from response.");
            }

            toast("Flow Created Successfully!", {
              type: "success",
              autoClose: 2000,
            });
            resetForm();
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 cursor-pointer">
          {isCollapsed ? (
            <TooltipProvider>
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
                      {isEditing ? "Edit" : "Create"} Flow
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {isEditing ? "Edit" : "Create"} Flow
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
              {isEditing ? "Edit" : "Create"} Flow
            </div>
          )}
        </nav>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <VStack>
            <DialogTitle>{isEditing ? "Edit" : "Create New"} Flow</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit the name of your Flow"
                : "Enter a name for your new Flow"}
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
            name: table ? table.name : "",
          }}
          validationSchema={TableSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <Field
                as={Input}
                name="name"
                placeholder="Flow Name"
                className={errors.name && touched.name ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-sm">
                  {String(errors.name)}
                </div>
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
                    <p>{isEditing ? "Update" : "Create"} Flow</p>
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

export default CreateFlowDialog;
