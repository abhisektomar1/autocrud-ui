/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import {
  Edit,
  X,
  MoreVertical,
  Copy,
  Trash2,
  Calendar,
  Star,
  Percent,
  AlignLeft,
  Mail,
  Calculator,
  Clock,
  CheckSquare,
  Phone,
  ListFilter,
  Text,
  UserRound,
} from "lucide-react";
import CommentsAuditTabs from "./CommentsAuditTabs";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateRecord, useUpdateTableRow } from "@/queries/table";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import { TableColumn, TableData } from "@/types/table";

const EditDialog = ({
  isKanban,
  isCreate = false,
  columns,
  row,
  spaceId,
  tableId,
  onEdit,
  onClickEdit,
  editingRow,
  onDelete,
  onClone,
  open,
  setOpen,
  autoCreate,
}: {
  row: any;
  spaceId: string;
  tableId: string;
  columns: any;
  onEdit: ((row: any) => void) | ((key: string, value: any) => void);
  onClickEdit: (row: any) => void;
  editingRow: any;
  onDelete: () => void;
  onClone: () => void;
  isKanban?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  isCreate?: boolean;
  isSaving?: boolean;
  autoCreate?: boolean;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const dialogOpen = open !== undefined ? open : internalOpen;
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const setDialogOpen = setOpen || setInternalOpen;
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dialogOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }

    // Auto-create functionality when dialog opens
    if (dialogOpen && isCreate && autoCreate && editingRow) {
      const timer = setTimeout(() => {
        validateAndCreateRecord(editingRow);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [dialogOpen, isCreate, autoCreate, editingRow]);

  const { mutate: updateRow } = useUpdateTableRow();
  const { mutate: createRow } = useCreateRecord();

  const createValidationSchema = () => {
    return yup.object().shape(
      columns.reduce((acc: any, column: TableColumn) => {
        switch (column.fieldType) {
          case "checkbox":
            acc[column.id] = yup.boolean();
            break;
          case "link":
            acc[column.id] = yup.string().url();
            break;
          case "number":
            acc[column.id] = yup
              .number()
              .typeError(`${column.label} must be a number`);
            break;
          case "float":
            acc[column.id] = yup
              .number()
              .typeError(`${column.label} must be a number`);
            break;
          case "email":
            acc[column.id] = yup
              .string()
              .email(`Invalid email for ${column.label}`);
            break;
          case "select":
            acc[column.id] = yup
              .string()
              .oneOf(
                column.options as string[],
                `Invalid option for ${column.label}`
              );
            break;
          default:
            acc[column.id] = yup.mixed();
        }
        return acc;
      }, {})
    );
  };

  const validateAndCreateRecord = async (data: TableData) => {
    if (isAutoSaving) return;

    const cleanRowData = { ...data };
    delete cleanRowData.hash;
    delete cleanRowData.createdAt;
    delete cleanRowData.createdBy;
    delete cleanRowData.updatedAt;
    delete cleanRowData.updatedBy;

    const schema = createValidationSchema();

    try {
      const hasValues = Object.values(cleanRowData).some(
        (value) => value !== undefined && value !== ""
      );

      if (!hasValues) {
        toast.error("Please fill in at least one field");
        return;
      }
      await schema.validate(cleanRowData, { abortEarly: false });

      setIsAutoSaving(true);
      createRow(
        {
          tableId: tableId ?? "",
          spaceId: spaceId ?? "",
          rowData: cleanRowData,
        },
        {
          onSuccess() {
            queryClient.invalidateQueries("getTableRow");
            toast.success("Record created successfully");
            setIsAutoSaving(false);
            if (autoCreate) {
              setDialogOpen(false);
            }
          },
          onError(error) {
            void error;
            toast.error("Failed to create record");
            setIsAutoSaving(false);
          },
        }
      );
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error("Validation failed");
      }
      setIsAutoSaving(false);
    }
  };

  const autoSave = async (newRow: TableData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const cleanRowData = { ...newRow };
      delete cleanRowData.hash;
      delete cleanRowData.createdAt;
      delete cleanRowData.createdBy;
      delete cleanRowData.updatedAt;
      delete cleanRowData.updatedBy;

      try {
        if (isCreate) {
          validateAndCreateRecord(cleanRowData);
        } else {
          await updateRow(
            {
              tableId: tableId ?? "",
              spaceId: spaceId ?? "",
              rowId: newRow.id ?? "",
              rowData: cleanRowData,
            },
            {
              onSuccess() {
                queryClient.invalidateQueries("getTableRow");
              },
            }
          );
        }
      } catch (error) {
        void error;
      }
    }, 500);
  };

  const handleChange = (key: string, value: any) => {
    if (isCreate) {
      (onEdit as (key: string, value: any) => void)(key, value);
      return;
    }
    const oldValue = editingRow[key];

    if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
      const updatedRow = { ...editingRow, [key]: value };

      (onEdit as (row: any) => void)(updatedRow);

      autoSave(updatedRow);
    }
  };

  const getFieldIcon = (fieldtype: string, size = "h-3.5 w-3.5") => {
    switch (fieldtype?.toLowerCase()) {
      case "date":
        return <Calendar className={`${size}`} />;
      case "number":
        return <Phone className={`${size}`} />;
      case "rating":
        return <Star className={`${size}`} />;
      case "percentage":
        return <Percent className={`${size}`} />;
      case "textarea":
      case "text area":
        return <AlignLeft className={`${size}`} />;
      case "email":
        return <Mail className={`${size}`} />;
      case "decimal":
      case "float":
        return <Calculator className={`${size}`} />;
      case "datetime":
      case "date time":
        return <Clock className={`${size}`} />;
      case "checkbox":
        return <CheckSquare className={`${size}`} />;
      case "phone":
        return <Phone className={`${size}`} />;
      case "select":
        return <ListFilter className={`${size}`} />;
      default:
        return <Text className={`${size}`} />;
    }
  };

  const renderFieldByType = (column: any, editingRow: TableData) => {
    switch (column.fieldtype) {
      case "select":
        return (
          <Select
            onValueChange={(value) => handleChange(column.id, value)}
            value={editingRow[column.id]?.toString() ?? column.default ?? ""}
          >
            <SelectTrigger
              className="w-full pl-3 py-2 bg-white border border-gray-200 rounded-sm text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all duration-200 ease-in-out"
              id={column.id}
            >
              <SelectValue
                className="hover:bg-blue-500"
                placeholder={`select ${column.key}`}
              />
            </SelectTrigger>
            <SelectContent className="rounded-sm border border-gray-200 shadow-none">
              {column.options?.map((option: any) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2 ">
            <Checkbox
              id={column.id}
              checked={!!editingRow[column.id]}
              onCheckedChange={(checked: boolean) =>
                handleChange(column.id, checked)
              }
            />
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            onValueChange={(value) => handleChange(column.id, value)}
            value={editingRow[column.id]?.toString() ?? column.default ?? ""}
          >
            {column.options?.map((option: any) => (
              <div
                key={option}
                className="flex justify-between items-center space-x-2"
              >
                <RadioGroupItem
                  className="w-4 h-4 bg-white text-primary border-primary focus:ring-primary"
                  value={option}
                  id={`${column.id}-${option}`}
                />
                <Label htmlFor={`${column.key}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return (
          <Input
            id={column.id}
            type={
              column.fieldtype === "float"
                ? "number"
                : column.fieldtype === "datetime" ||
                  column.fieldtype === "date time"
                ? "datetime-local"
                : column.fieldtype
            }
            value={editingRow[column.id]?.toString() || ""}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-sm text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all duration-200 ease-in-out"
            onChange={(e) => {
              const value =
                column.fieldtype === "number" || column.fieldtype === "float"
                  ? Number(e.target.value)
                  : e.target.value;
              handleChange(column.id, value);
            }}
            placeholder={`Enter ${column.label}`}
          />
        );
    }
  };

  const nameColumn = columns.find(
    (col: TableColumn) =>
      col.key === "name" || col.id === "name" || col.name === "name"
  );
  const otherColumns = columns.filter(
    (col: TableColumn) =>
      col.key !== "name" && col.id !== "name" && col.name !== "name"
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {!isKanban && (
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="h-8 w-8 bg-transparent text-black"
              onClick={() => {
                setDialogOpen(true);
                onClickEdit(row);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[69rem] h-[90vh] md:h-[86vh] top-[50%] rounded-sm overflow-y-auto flex flex-col gap-0 p-0 bg-white">
        <DialogHeader className="px-6 py-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg text-text font-semibold">
              Details View
            </DialogTitle>
            <div className="flex gap-1">
              {isCreate && (
                <Button
                  onClick={() => {
                    if (isCreate) {
                      validateAndCreateRecord(editingRow);
                    }
                    setDialogOpen(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isCreate ? "Create" : "Done"}
                </Button>
              )}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-full transition-colors"
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                {isMoreMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-md z-50"
                    ref={moreMenuRef}
                  >
                    <div className="flex flex-col p-1 space-y-1">
                      <button
                        onClick={() => {
                          onClone();
                          setIsMoreMenuOpen(false);
                          setDialogOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-gray-100 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        Clone Record
                      </button>
                      <button
                        onClick={() => {
                          onDelete();
                          setIsMoreMenuOpen(false);
                          setDialogOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-sm hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Record
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="p-1.5 text-muted-foreground hover:text-destructive rounded-full transition-colors"
                onClick={() => setDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden w-full">
          <div className="flex flex-col md:flex-row h-full w-full divide-x">
            <div className="relative flex-3 w-[68%] h-full">
              <ScrollArea className="w-full mx-auto h-[calc(100%-60px)]  px-20 ">
                {nameColumn && editingRow && (
                  <div className="pb-2 p-1 pt-10 border-b flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-accent-foreground/60">
                      <UserRound className="w-3.5 h-3.5" />
                      <Label htmlFor={nameColumn.key}>{nameColumn.label}</Label>
                    </div>
                    <Input
                      id={nameColumn.id}
                      value={editingRow[nameColumn.id]?.toString() || ""}
                      onChange={(e) =>
                        handleChange(nameColumn.id, e.target.value)
                      }
                      className="text-xl font-medium text-text border-none shadow-none p-2 rounded-md"
                      placeholder={`Enter ${nameColumn.label || "name"}...`}
                    />
                  </div>
                )}
                <div className="space-y-3 md:space-y-5 pt-10">
                  {editingRow &&
                    otherColumns.map((column: any) => (
                      <motion.div
                        key={column.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-between items-center gap-4"
                      >
                        <div className="basis-3/12 flex items-center gap-2 text-xs text-accent-foreground/60">
                          {getFieldIcon(column.fieldtype)}
                          <Label htmlFor={column.key}>{column.label}</Label>
                        </div>
                        <div className="basis-9/12 w-full px-1 text-accent-foreground/80 font-normal">
                          {renderFieldByType(column, editingRow)}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex-1  flex-shrink-0">
              <div className="h-full overflow-y-auto">
                <CommentsAuditTabs
                  spaceId={spaceId}
                  tableId={tableId}
                  rowId={row?.id}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
