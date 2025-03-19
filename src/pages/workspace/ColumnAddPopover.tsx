import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useCreateColumnMetaTable,
  useEditMetaColumnTable,
} from "@/queries/table";
import { toast } from "react-toastify";
import { queryClient } from "@/queries/client";
import { Loader2, Plus, Search } from "lucide-react";
import { FieldType } from "@/types/table";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlignLeft,
  AlignJustify,
  Hash,
  CircleDollarSign,
  Percent,
  Star,
  List,
  CheckSquare,
  CircleDot,
  Calendar,
  CalendarClock,
  AtSign,
  Phone,
  Link,
} from "lucide-react";

// Base interfaces for the component
interface FieldEditorPopoverProps {
  tableId: string;
  spaceId: string;
  trigger: React.ReactNode;
  columnId?: string | undefined;
  onSave: (fieldData: FieldData) => void;
  initialData?: FieldData;
  kanban?: boolean;
}

export interface ValidationRules {
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  url?: boolean;
}

export interface FieldData {
  headerName: string;
  fieldType: FieldType;
  defaultValue: string;
  hasDefaultValue: boolean;
  options?: string[];
  tableId: string;
  spaceId: string;
  maxLength?: number;
  rows?: number;
  validation?: ValidationRules;
}

export interface FieldInputData {
  name: string;
  id?: string | undefined;
  spaceId: string;
  tableId: string;
  fieldtype: FieldType;
  default: string | boolean | number | null;
  length: number;
  dataType?:
    | "string"
    | "bool"
    | "url"
    | "int"
    | "float"
    | "date"
    | "time"
    | "datetime"
    | "file";
  enum: string[];
  isRequired: boolean;
  validation?: ValidationRules;
  display?: {
    width: number;
  };
}

interface ValidationErrors {
  headerName?: string;
  fieldType?: string;
}

// Reusable field components
const InputField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  error?: string;
  className?: string;
}> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  className,
}) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(error ? "border-red-500" : "", className)}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

const TextAreaField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}> = ({ id, label, value, onChange, placeholder, rows = 3 }) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Textarea
      id={id}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const FieldTypeList: React.FC<{
  value: string;
  onValueChange: (value: FieldType) => void;
  error?: string;
}> = ({ value, onValueChange, error }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // All field types in a single list
  const fieldTypes = [
    { value: "text", label: "Single Line Text", icon: AlignLeft },
    { value: "textarea", label: "Long Text", icon: AlignJustify },
    { value: "number", label: "Number", icon: Hash },
    { value: "decimal", label: "Decimal", icon: Hash },
    { value: "currency", label: "Currency", icon: CircleDollarSign },
    { value: "percentage", label: "Percentage", icon: Percent },
    { value: "rating", label: "Rating", icon: Star },
    { value: "select", label: "Single Select", icon: List },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "radio", label: "Radio", icon: CircleDot },
    { value: "date", label: "Date", icon: Calendar },
    { value: "datetime", label: "Date & Time", icon: CalendarClock },
    { value: "email", label: "Email", icon: AtSign },
    { value: "phonenumber", label: "Phone", icon: Phone },
    { value: "link", label: "URL", icon: Link },
  ];

  // Filter field types based on search query
  const filteredTypes = fieldTypes.filter((type) =>
    type.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-2">
      <div className="relative w-full">
        <Search
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={15}
        />
        <Input
          placeholder="Search field types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "h-8 text-xs rounded-[6px] pl-7 w-full",
            error && "border-red-500"
          )}
        />
      </div>

      <div className="max-h-[200px] overflow-y-auto border rounded-[6px] bg-white">
        {filteredTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onValueChange(type.value as FieldType)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 transition-colors duration-200",
              "border-b last:border-b-0",
              value === type.value && "bg-primary/5 hover:bg-primary/5"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-md shrink-0",
                "w-6 h-6 transition-colors duration-200",
                value === type.value ? "bg-primary/10" : "bg-gray-50"
              )}
            >
              <type.icon
                className={cn(
                  "h-3.5 w-3.5",
                  value === type.value ? "text-primary" : "text-gray-600"
                )}
              />
            </div>
            <span className="text-xs font-medium text-gray-700">
              {type.label}
            </span>
          </button>
        ))}
        {filteredTypes.length === 0 && (
          <div className="p-2 text-center text-xs text-gray-500">
            No field types match your search
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const SwitchField: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}> = ({ id, label, checked, onCheckedChange }) => (
  <div className="flex items-center space-x-2">
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-primary"
    />
    <Label htmlFor={id}>{label}</Label>
  </div>
);

const OptionsList: React.FC<{
  options: string[];
  onChange: (options: string[]) => void;
}> = ({ options, onChange }) => {
  const handleAddOption = () => {
    onChange([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange(newOptions);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="max-h-[180px] overflow-y-auto pr-2">
        <div>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-grow relative p-1">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="pr-8 h-7 rounded-[6px] text-xs"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddOption}
        className="w-full text-xs h-8"
      >
        Add option
      </Button>
    </div>
  );
};

// Main component
const FieldEditorPopover: React.FC<FieldEditorPopoverProps> = ({
  tableId,
  spaceId,
  columnId,
  trigger,
  initialData,
  kanban,
}) => {
  const [open, setOpen] = useState(false);
  const [fieldData, setFieldData] = useState<FieldData>(
    initialData || {
      headerName: "",
      tableId,
      spaceId,
      fieldType: "text" as FieldType,
      defaultValue: "",
      hasDefaultValue: false,
      options: [],
      validation: {
        required: true,
        minLength: 0,
        maxLength: 100,
      },
    }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const { mutate: createColumn } = useCreateColumnMetaTable();
  const { mutate: editColumn } = useEditMetaColumnTable();

  const handleInputChange = (
    key: keyof FieldData,
    value: string | boolean | string[] | number | ValidationRules
  ) => {
    setFieldData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!fieldData.headerName.trim()) {
      errors.headerName = "Header name is required";
    } else if (fieldData.headerName.length < 3) {
      errors.headerName = "Must be at least 3 characters";
    }

    if (!kanban && !fieldData.fieldType) {
      errors.fieldType = "Field type is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const columnData: FieldInputData = {
        name: fieldData.headerName,
        id: columnId,
        spaceId: fieldData.spaceId,
        tableId: fieldData.tableId,
        fieldtype: fieldData.fieldType,
        default: fieldData.hasDefaultValue ? fieldData.defaultValue : null,
        length: fieldData.maxLength || 100,
        enum: fieldData.options || [],
        isRequired: fieldData.hasDefaultValue,
        validation: {
          minLength: 0,
          maxLength: fieldData.maxLength || 100,
        },
        display: {
          width: fieldData.fieldType === "date" || fieldData.fieldType === "datetime" || fieldData.fieldType === "textarea" ? 250 : 150,
        }
      };

      if (columnId) {
        editColumn(
          { spaceId, tableId, columnId, columnData: columnData },
          {
            onSuccess() {
              queryClient.invalidateQueries("edit-meta-column-table");
              queryClient.invalidateQueries("getTable");
              queryClient.invalidateQueries("getTableRow");
              setOpen(false);
              toast("Column added successfully", {
                type: "success",
                autoClose: 2000,
              });
              setFieldData({
                headerName: "",
                tableId,
                spaceId,
                fieldType: "text",
                defaultValue: "",
                hasDefaultValue: false,
                options: [],
                validation: {
                  required: true,
                  minLength: 0,
                  maxLength: 100,
                },
              });
            },
            onError() {
              toast("failed to edit column", {
                type: "error",
                autoClose: 2000,
              });
            },
          }
        );
      } else {
        createColumn(
          { tableData: columnData },
          {
            onSuccess() {
              queryClient.invalidateQueries("getTable");
              queryClient.invalidateQueries("getTableRow");
              setOpen(false);
              toast("Column added successfully", {
                type: "success",
                autoClose: 2000,
              });
              setFieldData({
                headerName: "",
                tableId,
                spaceId,
                fieldType: "text",
                defaultValue: "",
                hasDefaultValue: false,
                options: [],
                validation: {
                  required: true,
                  minLength: 0,
                  maxLength: 100,
                },
              });
            },
          }
        );
      }
    } catch (error) {
      void error;
      toast.error("Failed to add column", {
        autoClose: 2000,
      });
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {kanban ? (
        <div className="h-full flex items-center justify-center">
          <DialogTrigger onClick={() => setOpen(true)} asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-10 h-10 hover:bg-muted-foreground/10 hover:text-black"
            >
              <Plus size={20} />
            </Button>
          </DialogTrigger>
        </div>
      ) : (
        <DialogTrigger>{trigger}</DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[400px] p-4 max-h-[90vh] flex flex-col">
        <div className="grid gap-1 px-1">
          <h4 className="font-medium leading-none text-base text-gray-900 sticky top-0 bg-white pb-2 border-b mx-1">
            {kanban ? "Add Column" : "Add Field"}
          </h4>
          <div className="grid gap-2 overflow-y-auto px-1">
            <InputField
              id="headerName"
              label=""
              value={fieldData.headerName}
              onChange={(value) => {
                handleInputChange("headerName", value);
                setValidationErrors((prev) => ({
                  ...prev,
                  headerName: undefined,
                }));
              }}
              placeholder={
                kanban ? "Column name (optional)" : "Field name (optional)"
              }
              error={validationErrors.headerName}
              className="h-8 text-xs rounded-[6px]"
            />
            {!kanban && (
              <>
                <div className="grid gap-2">
                  {/* <Label htmlFor="fieldType">Field Type *</Label> */}
                  <FieldTypeList
                    value={fieldData.fieldType}
                    onValueChange={(value) => {
                      handleInputChange("fieldType", value);
                      setValidationErrors((prev) => ({
                        ...prev,
                        fieldType: undefined,
                      }));
                    }}
                    error={validationErrors.fieldType}
                  />
                </div>
                {fieldData.fieldType === "textarea" && (
                  <div className="grid gap-4">
                    <InputField
                      id="rows"
                      label="Number of Rows"
                      type="number"
                      value={fieldData.rows?.toString() || "3"}
                      onChange={(value) =>
                        handleInputChange("rows", parseInt(value))
                      }
                      placeholder="Enter number of rows"
                      className="text-xs h-7 rounded-[6px]"
                    />
                    <InputField
                      id="maxLength"
                      label="Maximum Length"
                      type="number"
                      value={fieldData.maxLength?.toString() || "1000"}
                      onChange={(value) =>
                        handleInputChange("maxLength", parseInt(value))
                      }
                      placeholder="Enter maximum length"
                      className="text-xs h-7 rounded-[6px]"
                    />
                  </div>
                )}

                {fieldData.fieldType === "link" && (
                  <InputField
                    id="pattern"
                    label=""
                    value={fieldData.validation?.pattern || ""}
                    onChange={(value) =>
                      handleInputChange("validation", {
                        ...fieldData.validation,
                        pattern: value,
                      })
                    }
                    placeholder="Enter URL pattern (e.g., https?://.*)"
                    className="h-7 text-xs rounded-[6px]"
                  />
                )}

                {!["checkbox", "radio"].includes(fieldData.fieldType) && (
                  <div className="flex items-center gap-2 py-1">
                    <SwitchField
                      id="hasDefaultValue"
                      label="Enable Default Value"
                      checked={fieldData.hasDefaultValue}
                      onCheckedChange={(checked) =>
                        handleInputChange("hasDefaultValue", checked)
                      }
                    />

                    {fieldData.hasDefaultValue && fieldData.defaultValue && (
                      <span className="text-sm text-gray-600">
                        {fieldData.defaultValue}
                      </span>
                    )}
                  </div>
                )}

                {fieldData.hasDefaultValue &&
                  (fieldData.fieldType === "textarea" ? (
                    <TextAreaField
                      id="defaultValue"
                      label=""
                      value={fieldData.defaultValue}
                      onChange={(value) =>
                        handleInputChange("defaultValue", value)
                      }
                      placeholder="Enter default value"
                      rows={fieldData.rows || 3}
                    />
                  ) : (
                    <InputField
                      id="defaultValue"
                      label=""
                      value={fieldData.defaultValue}
                      onChange={(value) =>
                        handleInputChange("defaultValue", value)
                      }
                      placeholder="Enter default value"
                      type={
                        fieldData.fieldType === "number"
                          ? "number"
                          : fieldData.fieldType === "float"
                          ? "float"
                          : "text"
                      }
                      className="h-7 rounded-[6px]"
                    />
                  ))}
              </>
            )}

            {(fieldData.fieldType === "select" ||
              fieldData.fieldType === "radio") && (
              <div className="grid gap-2">
                <Label>Options</Label>
                <OptionsList
                  options={fieldData.options || []}
                  onChange={(options) => handleInputChange("options", options)}
                />
              </div>
            )}

            <Button
              onClick={handleSave}
              className="w-full min-w-[120px] sticky bottom-0  pt-2 border-t"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex flex-row items-center gap-2">
                  <p>Saving...</p>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <p>{kanban ? "Add Column" : "Save"}</p>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldEditorPopover;

