import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useUpdateSpace } from "@/queries/space";
import { VStack } from "@/component/utils";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";

// Validation schema
const WorkspaceSchema = Yup.object().shape({
  name: Yup.string().required("Workspace name is required"),
  description: Yup.string(),
});

interface EditWorkspaceDialogProps {
  isCollapsed: boolean;
  workspace: { id: string; name: string; description: string };
  onClose: () => void;
}

const EditWorkspaceDialog: React.FC<EditWorkspaceDialogProps> = ({
  isCollapsed,
  workspace,
  onClose,
}) => {
  const { mutate: updateSpace } = useUpdateSpace();

  const handleSubmit = (
    values: { name: string; description: string },
    { resetForm }: FormikHelpers<{ name: string; description: string }>
  ) => {
    updateSpace(
      { id: workspace.id, name: values.name, description: values.description },
      {
        onSuccess: () => {
          toast("Workspace name updated!", {
            type: "success",
            autoClose: 2000,
          });
          queryClient.invalidateQueries("searchSpaces");
          resetForm();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isCollapsed} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <VStack>
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>
              Edit the name of your workspace
            </DialogDescription>
          </VStack>
          <X
            onClick={onClose}
            role="button"
            className="h-6 w-6 absolute right-6 top-4"
          />
        </DialogHeader>
        <Formik
          initialValues={{
            name: workspace.name,
            description: workspace.description,
          }}
          validationSchema={WorkspaceSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <Field
                as={Input}
                name="name"
                placeholder="Workspace Name"
                className={errors.name && touched.name ? "border-red-500" : ""}
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}
              <Field
                as={Input}
                name="description"
                placeholder="Workspace Description"
                className={errors.name && touched.name ? "border-red-500" : ""}
              />
              {errors.description && touched.description && (
                <div className="text-red-500 text-sm">{errors.description}</div>
              )}
              <DialogFooter>
                <Button type="submit">Update Workspace</Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkspaceDialog;
