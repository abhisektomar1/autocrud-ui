import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteSpace, useGetSpace, useUpdateSpace } from "@/queries/space";
import { queryClient } from "@/queries/client";
import DeleteConfirmationDialog, {
  DeleteTrigger,
} from "@/component/DeleteDialog";
import { Textarea } from "@/components/ui/textarea";

interface WorkspaceFormValues {
  name: string;
  description: string;
}

const GeneralSettings: React.FC = () => {
  const [workspace, setWorkspace] = useState<WorkspaceFormValues>({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: spaceData, isLoading: isSpaceLoading } = useGetSpace(id ?? "");
  const { mutate: updateSpace, isLoading: isUpdating } = useUpdateSpace();
  const { mutate: deleteSpace } = useDeleteSpace();

  // Update local state when space data is available
  useEffect(() => {
    if (spaceData) {
      setWorkspace({
        name: spaceData.name || "",
        description: spaceData.description || "",
      });
      setIsLoading(false);
    }
  }, [spaceData]);

  // Update loading state based on API loading state
  useEffect(() => {
    setIsLoading(isSpaceLoading);
  }, [isSpaceLoading]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Workspace name is required")
      .min(3, "Name must be at least 3 characters"),
    description: Yup.string(),
  });

  const handleSubmit = (
    values: WorkspaceFormValues,
    { setSubmitting }: FormikHelpers<WorkspaceFormValues>
  ) => {
    updateSpace(
      {
        id: id ?? "",
        name: values.name,
        description: values.description,
      },
      {
        onSuccess: () => {
          // Update the local state
          setWorkspace(values);
          queryClient.invalidateQueries("getSpace");
          toast("Workspace updated successfully!", {
            type: "success",
            autoClose: 2000,
          });

          // Invalidate relevant queries to refresh data
          queryClient.invalidateQueries(["getSpace", id]);
          queryClient.invalidateQueries("searchSpaces");
        },
        onError: () => {
          toast("Failed to update workspace", {
            type: "error",
            autoClose: 2000,
          });
        },
        onSettled: () => {
          setSubmitting(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteSpace(id ?? "", {
      onSuccess() {
        // Batch query invalidations
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "searchSpaces" ||
            query.queryKey[0] === "spaces",
        });

        toast("Workspace deleted successfully!", {
          type: "success",
          autoClose: 2000,
        });

        // Navigate back to workspaces list
        navigate("/");
      },
      onError() {
        toast("Failed to delete workspace", {
          type: "error",
          autoClose: 2000,
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Workspace Details</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Update your workspace information
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <Formik
            initialValues={workspace}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">
                    Workspace Name
                  </Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter workspace name"
                    className={`w-full ${
                      errors.name && touched.name ? "border-red-500" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    placeholder="Enter workspace description"
                    className={`w-full min-h-[100px] ${
                      errors.description && touched.description
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting || isUpdating ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" /> Updating...
                      </>
                    ) : (
                      "Update Workspace"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once deleted, all data will be permanently removed including all
            tables, views, and workflows. This action cannot be undone.
          </p>

          <div className="flex justify-end">
            <DeleteTrigger
              id={`delete-workspace-${id}`}
              itemName={workspace.name}
              onConfirm={handleDelete}
            >
              <Button variant="destructive">Delete Workspace</Button>
            </DeleteTrigger>
          </div>

          {/* Delete confirmation dialog */}
          <DeleteConfirmationDialog
            id={`delete-workspace-${id}`}
            title="Delete Workspace"
            description={`Are you sure you want to delete the workspace "${workspace.name}"? This action cannot be undone and will permanently delete all associated data.`}
            confirmButtonText="Delete Workspace"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
