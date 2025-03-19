import React from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import create from "zustand";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Updated store interface to support multiple dialogs
interface DialogState {
  id: string;
  isOpen: boolean;
  itemToDelete: string | null;
  onConfirm: (() => void) | null;
}

interface DeleteDialogStore {
  dialogs: Record<string, DialogState>;
  openDialog: (id: string, item: string, onConfirm: () => void) => void;
  closeDialog: (id: string) => void;
}

export const useDeleteDialogStore = create<DeleteDialogStore>((set) => ({
  dialogs: {},
  openDialog: (id, item, onConfirm) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [id]: {
          id,
          isOpen: true,
          itemToDelete: item,
          onConfirm,
        },
      },
    })),
  closeDialog: (id) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [id]: {
          ...state.dialogs[id],
          isOpen: false,
          itemToDelete: null,
          onConfirm: null,
        },
      },
    })),
}));

const confirmationSchema = Yup.object().shape({
  confirmText: Yup.string()
    .matches(/^delete$/i, 'Please type "delete" to confirm')
    .required("Confirmation is required"),
});

interface DeleteConfirmationDialogProps {
  id: string; // Added ID prop
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  id,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}) => {
  const dialog = useDeleteDialogStore((state) => state.dialogs[id]);
  const closeDialog = useDeleteDialogStore((state) => state.closeDialog);

  const handleConfirm = () => {
    if (dialog?.onConfirm) {
      dialog.onConfirm();
    }
    closeDialog(id);
  };

  // Return null if dialog doesn't exist yet
  if (!dialog) {
    return null;
  }

  return (
    <AlertDialog open={dialog.isOpen} onOpenChange={() => closeDialog(id)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          <AlertDialogDescription>
            Type <span className="font-bold">delete</span> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Formik
          initialValues={{ confirmText: "" }}
          validationSchema={confirmationSchema}
          onSubmit={handleConfirm}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <Field
                as={Input}
                id={`confirmText-${id}`}
                name="confirmText"
                type="text"
                placeholder="Type 'delete' to confirm"
                className={`w-full ${
                  errors.confirmText && touched.confirmText
                    ? "border-red-500"
                    : ""
                }`}
              />
              {errors.confirmText && touched.confirmText && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm"
                >
                  {errors.confirmText}
                </motion.div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">{cancelButtonText}</Button>
                </AlertDialogCancel>
                <Button type="submit" variant="destructive">
                  {confirmButtonText}
                </Button>
              </AlertDialogFooter>
            </Form>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface DeleteTriggerProps {
  id: string; // Added ID prop
  itemName: string;
  onConfirm: () => void;
  children: React.ReactNode;
}

export const DeleteTrigger: React.FC<DeleteTriggerProps> = ({
  id,
  itemName,
  onConfirm,
  children,
}) => {
  const { openDialog } = useDeleteDialogStore();

  const handleClick = () => {
    openDialog(id, itemName, onConfirm);
  };

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default DeleteConfirmationDialog;
