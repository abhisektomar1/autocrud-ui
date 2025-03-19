import React, { useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  Plus,
  Search,
  Lock,
  X,
  Loader2,
} from "lucide-react";
import {
  useGetVariables,
  useCreateVariable,
  useUpdateVariable,
  useDeleteVariable,
} from "@/queries/variable";
import { Checkbox } from "@/components/ui/checkbox";
import { VStack } from "@/component/utils";
import { OptionMenu } from "@/components/settings/OptionMenu";
import { DeleteAlert } from "@/components/settings/DeleteAlert";

interface GlobalVariablesProps {
  spaceId: string;
}

export interface Variable {
  id: string;
  key: string;
  value: string;
  encrypted?: boolean;
}

export interface GlobalVariableModel {
  createdAt: string;
  createdBy: string;
  id: string;
  isSecret: boolean;
  key: string;
  notes: string;
  space: string;
  value: string;
}

interface VariableFormValues {
  key: string;
  value: string;
  encrypted?: boolean;
}

const GlobalVariables: React.FC<GlobalVariablesProps> = ({ spaceId }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const pageSize = 10;
  // Fetch variables with React Query
  const { data: variablesData, isLoading, error } = useGetVariables(spaceId);

  // Set filtered/paginated variables and total pages
  const [displayedVariables, setDisplayedVariables] = useState<
    GlobalVariableModel[]
  >([]);

  useEffect(() => {
    if (variablesData) {
      // Filter by search term if provided
      const filteredData = searchTerm
        ? variablesData.data.filter((variable: Variable) =>
            variable.key.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : variablesData.data;
      if (filteredData) {
        // Calculate total pages
        setTotalPages(Math.ceil(filteredData?.length / pageSize));

        // Get current page data
        const startIndex = (page - 1) * pageSize;
        const paginatedData = filteredData.slice(
          startIndex,
          startIndex + pageSize
        );

        setDisplayedVariables(paginatedData);
      }
    }
  }, [variablesData, page, searchTerm]);

  // Add new variable using React Query
  const createVariableMutation = useCreateVariable(spaceId);

  // Update variable using React Query
  const updateVariableMutation = useUpdateVariable(spaceId);

  // Delete variable using React Query
  const deleteVariableMutation = useDeleteVariable(spaceId);

  const validationSchema = Yup.object({
    key: Yup.string()
      .required("Key is required")
      .min(2, "Key must be at least 2 characters"),
    value: Yup.string().required("Value is required"),
    encrypted: Yup.boolean(),
  });

  const handleAddVariable = (
    values: VariableFormValues,
    { resetForm }: any
  ) => {
    createVariableMutation.mutate(
      {
        id: "",
        isSecret: values.encrypted,
        ...values,
      } as Variable,
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["variables", spaceId]);
          setIsAddDialogOpen(false);
          resetForm();
          toast("Variable added successfully!", {
            type: "success",
            autoClose: 2000,
          });
        },
        onError: (error) => {
          toast("Failed to add variable", {
            type: "error",
            autoClose: 2000,
          });
          console.error("Error adding variable:", error);
        },
      }
    );
  };

  const handleUpdateVariable = (values: VariableFormValues) => {
    if (selectedVariable) {
      updateVariableMutation.mutate(
        {
          id: selectedVariable.id,
          isSecret: values.encrypted,
          ...values,
        } as Variable,
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["variables", spaceId]);
            setIsEditDialogOpen(false);
            setSelectedVariable(null);
            toast("Variable updated successfully!", {
              type: "success",
              autoClose: 2000,
            });
          },
          onError: (error) => {
            toast("Failed to update variable", {
              type: "error",
              autoClose: 2000,
            });
            console.error("Error updating variable:", error);
          },
        }
      );
    }
  };

  const handleDeleteVariable = () => {
    if (selectedVariable) {
      deleteVariableMutation.mutate(selectedVariable.id, {
        onSuccess: () => {
          queryClient.invalidateQueries(["variables", spaceId]);
          setIsDeleteDialogOpen(false);
          setSelectedVariable(null);
          toast("Variable deleted successfully!", {
            type: "success",
            autoClose: 2000,
          });
        },
        onError: (error) => {
          toast("Failed to delete variable", {
            type: "error",
            autoClose: 2000,
          });
          console.error("Error deleting variable:", error);
        },
      });
    }
  };

  const openEditDialog = (variable: Variable) => {
    setSelectedVariable(variable);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (variable: Variable) => {
    setSelectedVariable(variable);
    setIsDeleteDialogOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  if (error) {
    return <div className="text-red-500">Error loading variables</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 className="text-lg font-medium">Variables</h3>
            <p className="text-sm text-muted-foreground">
              Define and manage your global variables
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Variable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
                <VStack>
                  <DialogTitle>Add New Variable</DialogTitle>
                  <DialogDescription>
                    Create a new global variable for your workspace
                  </DialogDescription>
                </VStack>
                <X
                  onClick={() => setIsAddDialogOpen(false)}
                  role="button"
                  className="h-6 w-6 absolute right-6 top-4"
                />
              </DialogHeader>
              <Formik
                initialValues={{ key: "", value: "", encrypted: false }}
                validationSchema={validationSchema}
                onSubmit={handleAddVariable}
              >
                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                  <Form className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="key" className="text-sm font-medium">
                        Key
                      </label>
                      <Field
                        as={Input}
                        id="key"
                        name="key"
                        placeholder="Enter variable key"
                        className={
                          errors.key && touched.key ? "border-red-500" : ""
                        }
                      />
                      <ErrorMessage
                        name="key"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="value" className="text-sm font-medium">
                        Value
                      </label>
                      <Field
                        as={Input}
                        id="value"
                        name="value"
                        placeholder="Enter variable value"
                        className={
                          errors.value && touched.value ? "border-red-500" : ""
                        }
                      />
                      <ErrorMessage
                        name="value"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="encrypted"
                        checked={values.encrypted}
                        onCheckedChange={(checked) =>
                          setFieldValue("encrypted", checked)
                        }
                      />
                      <label
                        htmlFor="encrypted"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                      >
                        <Lock className="h-3.5 w-3.5 mr-1.5" />
                        Encrypt this variable
                      </label>
                    </div>

                    <DialogFooter className="mt-6">
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting || createVariableMutation.isLoading
                        }
                        className="min-w-[140px]"
                      >
                        {createVariableMutation.isLoading ? (
                          <div className="flex flex-row items-center gap-2">
                            <p>Creating...</p>
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          "Create Variable"
                        )}
                      </Button>
                    </DialogFooter>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search variables..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Key</TableHead>
                    <TableHead className="w-[40%]">Value</TableHead>

                    <TableHead className="text-right w-[10%]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedVariables && displayedVariables.length > 0 ? (
                    displayedVariables.map((variable) => (
                      <TableRow key={variable.id}>
                        <TableCell className="font-medium">
                          {variable.key}
                        </TableCell>
                        <TableCell>
                          {variable.isSecret ? "********" : variable.value}
                        </TableCell>

                        <TableCell className="text-right">
                          <OptionMenu
                            variable={variable}
                            openEditDialog={openEditDialog}
                            openDeleteDialog={openDeleteDialog}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No variables found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Variable Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
            <VStack>
              <DialogTitle>Edit Variable</DialogTitle>
              <DialogDescription>
                Modify the details of your global variable
              </DialogDescription>
            </VStack>
            <X
              onClick={() => setIsEditDialogOpen(false)}
              role="button"
              className="h-6 w-6 absolute right-6 top-4"
            />
          </DialogHeader>
          {selectedVariable && (
            <Formik
              initialValues={{
                key: selectedVariable.key,
                value: selectedVariable.value,
                encrypted: selectedVariable.encrypted || false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdateVariable}
            >
              {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                <Form className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="key" className="text-sm font-medium">
                      Key
                    </label>
                    <Field
                      as={Input}
                      id="key"
                      name="key"
                      placeholder="Enter variable key"
                      className={
                        errors.key && touched.key ? "border-red-500" : ""
                      }
                    />
                    <ErrorMessage
                      name="key"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="value" className="text-sm font-medium">
                      Value
                    </label>
                    <Field
                      as={Input}
                      id="value"
                      name="value"
                      placeholder="Enter variable value"
                      className={
                        errors.value && touched.value ? "border-red-500" : ""
                      }
                    />
                    <ErrorMessage
                      name="value"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="encrypted-edit"
                      checked={values.encrypted}
                      onCheckedChange={(checked) =>
                        setFieldValue("encrypted", checked)
                      }
                    />
                    <label
                      htmlFor="encrypted-edit"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                    >
                      <Lock className="h-3.5 w-3.5 mr-1.5" />
                      Encrypt this variable
                    </label>
                  </div>

                  <DialogFooter className="mt-6">
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting || updateVariableMutation.isLoading
                      }
                      className="min-w-[140px]"
                    >
                      {updateVariableMutation.isLoading ? (
                        <div className="flex flex-row items-center gap-2">
                          <p>Updating...</p>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        "Update Variable"
                      )}
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Variable Dialog */}
      {
        selectedVariable && 
        <DeleteAlert
        variable={selectedVariable}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDelete={handleDeleteVariable}
        isLoading={deleteVariableMutation.isLoading}
        />
      }
      
    </div>
  );
};

export default GlobalVariables;
