import React from "react";
import * as Yup from "yup";
import { Formik, Form, FormikHelpers } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { HStack, VStack } from "@/component/utils";
import DeleteConfirmationDialog from "@/component/DeleteDialog";
import NodePopover from "./NodePopover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export interface BaseField {
  name: string;
  variable: string;
  description?: string;
  type: string;
  default?: any;
  is_required?: boolean;
  is_hidden?: boolean;
  is_read_only?: boolean;
  required_validations?: ValidationRules;
}
export interface ValidationRules {
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
}

export interface SelectOption {
  name: string;
  value: string;
}

export interface DynamicSelectDivide {
  name: string;
  value: string;
  enums: SelectOption[];
}

export interface SelectField extends BaseField {
  select?: SelectOption[];
  dynamic_select?: {
    divide: DynamicSelectDivide[];
    name_column: string;
    value_column: string;
    filter?: {
      source_variable: string;
      key: string;
    };
  };
}

export interface NestedField extends BaseField {
  nested_fields?: Field[];
  set_as_variable?: boolean;
}

export type Field = BaseField & SelectField & NestedField;

export interface Section {
  name: string;
  description?: string;
  fields: Field[];
}

export interface JobInfo {
  id: string;
  name: string;
  description: string;
  version: number;
}

export interface JobDefinition {
  info: JobInfo;
  request: {
    sections: Section[];
  };
}

export interface FormField {
  name: string;
  description?: string;
  variable: string;
  type: string;
  max_length?: number;
  is_required?: boolean;
  Value: any;
  required_validations?: any;
  default?: any;
  enum?: string[];
  nested_fields?: FormField[];
  select?: SelectOption[];
  dynamic_select?: {
    divide: DynamicSelectDivide[];
    name_column: string;
    value_column: string;
  };
}

export interface NewFormField {
  description: string;
  name: string;
  required_validations: any;
  type: string;
  variable: string;
}

interface FormBuilderProps {
  fields: any[];
  spaceId: string;
  flowId: string;
  isNewNode?: boolean;
  nodeId: string;
  onSubmit: (values: any, helpers: FormikHelpers<any>) => void;
  initialValues?: Record<string, any>;
  title?: string;
  description?: string;
}

// Validation schema generator
const generateValidationSchema = (fields: FormField[]): any => {
  const schema: Record<string, any> = {};
  fields.forEach((field) => {
    let fieldSchema: any = Yup.mixed();

    if (field.nested_fields) {
      const nestedSchema = generateValidationSchema(field.nested_fields);
      fieldSchema = Yup.object().shape(nestedSchema);
    } else {
      switch (field.type) {
        case "text":
        case "textarea":
        case "list":
          fieldSchema = Yup.mixed().test(
            "is-valid",
            "Invalid value",
            function (value: any) {
              // Allow empty values if not required
              if (!value) return true;
              // Allow string values containing dots (node selections)
              if (typeof value === "string" && value.includes(".")) return true;
              // For regular text input, ensure it's a string
              return typeof value === "string";
            }
          );
          if (field?.required_validations?.max_length) {
            fieldSchema = fieldSchema.test(
              "max-length",
              `Maximum length is ${field?.required_validations?.max_length}`,
              function (value: any) {
                if (typeof value === "string" && !value.includes(".")) {
                  return (
                    value.length <= field?.required_validations?.max_length!
                  );
                }
                return true;
              }
            );
          }
          break;
        case "number":
          fieldSchema = Yup.mixed().test(
            "is-valid-number",
            "Must be a number or a node reference",
            function (value: any) {
              // Allow empty values if not required
              if (!value) return true;
              // Allow string values containing dots (node selections)
              if (typeof value === "string" && value.includes(".")) return true;
              // For regular number input, ensure it's a number
              return typeof value === "number" && !isNaN(value);
            }
          );
          break;
        case "email":
          fieldSchema = Yup.mixed().test(
            "is-valid-email",
            "Invalid email format",
            function (value: any) {
              if (!value) return true;
              if (typeof value === "string" && value.includes(".")) return true;
              return Yup.string().email().isValidSync(value);
            }
          );
          break;
        case "select":
          fieldSchema = Yup.mixed().test(
            "is-valid-select",
            "Invalid selection",
            function (value: any) {
              if (!value) return true;
              if (typeof value === "string" && value.includes(".")) return true;
              return !!value;
              // !!field.select?.find(selectValue => selectValue.name.toLowerCase() === value.toLowerCase()) ?? false;
            }
          );
          break;
        case "checkbox":
          fieldSchema = field.nested_fields
            ? Yup.object()
            : Yup.boolean().nullable();
          break;
        case "map":
          fieldSchema = Yup.object().nullable();
          break;
        case "datetime":
          fieldSchema = Yup.mixed().test(
            "is-valid-date",
            "Invalid date",
            function (value: any) {
              if (!value) return true;
              if (typeof value === "string" && value.includes(".")) return true;
              return Yup.date().isValidSync(value);
            }
          );
          break;
      }
    }

    if (field.is_required) {
      fieldSchema = fieldSchema.required("This field is required");
    } else {
      fieldSchema = fieldSchema.nullable();
    }

    if (field.default !== undefined) {
      fieldSchema = fieldSchema.default(field.default);
    }

    schema[field.variable] = fieldSchema;
  });

  return schema;
};

// FormField component
const FormField: React.FC<{
  field: FormField;
  values: any;
  setFieldValue: (field: string, value: any) => void;
  errors: any;
  touched: any;
  showDescriptions: boolean;
  setFieldTouched:(field:string, touched: boolean) => void;
  submitCount: number
}> = ({ field, values, setFieldValue, errors, touched, showDescriptions,setFieldTouched,submitCount }) => {
  const fieldError = errors[field.variable];
  const isTouched = touched[field.variable];
  const showError = fieldError && (isTouched || submitCount > 0)

  const handleNestedChange = (isChecked: boolean) => {
    if (isChecked) {
      const defaultValues = field.nested_fields?.reduce(
        (acc, nestedField) => ({
          ...acc,
          [nestedField.variable]:
            nestedField.default ?? getDefaultValueByType(nestedField.type),
        }),
        {}
      );

      setFieldValue(field.variable, defaultValues);
    } else {
      setFieldValue(field.variable, null);
    }
  };
  const getDefaultValueByType = (fieldType: string) => {
    switch (fieldType) {
      case "checkbox":
        return false;
      case "number":
        return 0;
      case "text":
      case "textarea":
      case "list":
        return "";
      default:
        return null;
    }
  };

  const handleSelect = (response: any) => {
    const value = response.isJsonPath
      ? `{{${response.id}.${response.optionId}}}`
      : `{{${response.id}.${response.optionId}}}`;
    setFieldValue(field.variable, value);
  };
  const convertDotNotation = (value: string | undefined) => {
    if (!value || !value.includes(".")) return value;
    const parts = value.split(".");
    return parts.reduce((acc: any, part) => acc?.[part], values);
  };

  const renderField = () => {
    switch (field.type) {
      case "list":
      case "text":
      case "number":
      case "textarea":
        return (
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 relative">
              {values &&
              convertDotNotation(field.variable) &&
              // typeof values[field.variable] === "string" &&
              // values[
              field.variable.includes(".") ? (
                // ].includes(".")
                <Input
                  type="text"
                  value={`{{${convertDotNotation(values[field.variable])}}}`}
                  onChange={(e) => {
                    // Remove the flower brackets and set the value
                    const value = e.target.value.replace(/[{}]/g, "");

                    setFieldValue(field.variable, value);
                  }}
                  onBlur={() => setFieldTouched(field.variable,true)}
                  className={cn("font-mono", showError && "border-red-500")}
                />
              ) : (
                <Input
                  type={
                    field.type === "number"
                      ? "number"
                      : field.type === "textarea"
                      ? "textArea"
                      : "text"
                  }
                  id={field.variable}
                  name={field.variable}
                  value={values[field.variable] || ""}
                  onChange={(e) => {
                    const value =
                      field.type === "number" && e.target.value !== ""
                        ? Number(e.target.value)
                        : e.target.value;

                    setFieldValue(field.variable, value);
                  }}
                  onBlur={() => setFieldTouched(field.variable,true)}
                  maxLength={field.max_length}
                  className={cn(showError && "border-red-500")}
                />
              )}
            </div>
            <div className="flex-shrink-0">
              <NodePopover
                variable={field.variable}
                onSelect={(response) => {
                  handleSelect(response);
                  document.body.click();
                }}
              />
            </div>
          </div>
        );

      case "select": {
        const selectOptions =
          field.select ||
          field.dynamic_select?.divide?.flatMap(
            (provider) =>
              provider.enums || [{ name: provider.name, value: provider.value }]
          ) ||
          [];
        return (
          <Select
            value={values[field.variable] || ""}
            onValueChange={(value) => setFieldValue(field.variable, value)}
          >
            <SelectTrigger className={cn(showError && "border-red-500")}>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case "checkbox":
        return field.nested_fields ? (
          <Checkbox
            checked={Boolean(values[field.variable])}
            onCheckedChange={handleNestedChange}
            className={cn(showError && "border-red-500")}
          />
        ) : (
          <Checkbox
            checked={values[field.variable] || false}
            onCheckedChange={(checked) =>
              setFieldValue(field.variable, checked)
            }
            className={cn(showError && "border-red-500")}
          />
        );

      case "map":
        return (
          <Textarea
            value={
              values[field.variable]
                ? JSON.stringify(values[field.variable], null, 2)
                : ""
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setFieldValue(field.variable, parsed);
              } catch (error) {
                // Handle invalid JSON
              }
            }}
            className={cn("font-mono text-sm", showError && "border-red-500")}
          />
        );
      default:
        return (
          <Input
            type={field.type}
            id={field.variable}
            name={field.variable}
            value={values[field.variable] || ""}
            onChange={(e) => setFieldValue(field.variable, e.target.value)}
            className={cn(showError && "border-red-500")}
            onBlur={() => setFieldTouched(field.variable,true)}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-1 my-1.5"
    >
      <HStack className="gap-2 w-full">
        {field.type === "checkbox" && renderField()}
        <VStack>
          <HStack className="justify-between w-full">
            <Label htmlFor={field.variable} className="flex items-center gap-1">
              {field.name}
              {field.is_required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && !showDescriptions && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-gray-700 transition-colors" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="start"
                    className="max-w-[300px] p-2 bg-white text-gray-800 shadow-lg border z-50"
                  >
                    <p className="text-sm leading-relaxed">
                      {field.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </HStack>

          {/* {field.description && showDescriptions && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )} */}
        </VStack>
      </HStack>

      {field.type !== "checkbox" && renderField()}
      {showError && (
        <p className="text-sm text-red-500">{errors[field.variable]}</p>
      )}

      {field.nested_fields && values[field.variable] && (
        <div className="mt-2 pt-1 pl-2 border-l-2 border-gray-200">
          <AnimatePresence>
            {field.nested_fields.map((nestedField) => (
              <FormField
                key={nestedField.variable}
                field={nestedField}
                values={values[field.variable]}
                setFieldValue={(nestedName, value) => {
                  const updatedValues = {
                    ...values[field.variable],
                    [nestedName]: value,
                  };
                  setFieldValue(field.variable, updatedValues);
                }}
                errors={errors[field.variable] || {}}
                touched={touched[field.variable] || {}}
                showDescriptions={showDescriptions}
                setFieldTouched={setFieldTouched}
                submitCount={submitCount}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

// Main FormBuilder component
export const FormBuilder: React.FC<FormBuilderProps> = ({
  nodeId,
  isNewNode,
  fields,
  onSubmit,
  initialValues = {},
}) => {
  const showDescriptions = false;
  const validationSchema = Yup.object().shape(generateValidationSchema(fields));

  const formDeleteDialogId = `form-builder-${nodeId}-delete-dialog`;

  return (
    <div className="space-y-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(value, helpers) => {
          onSubmit(value, helpers);
        }}
      >
        {({ values, setFieldValue, setFieldTouched, errors, touched ,submitCount }) => (
          <Form className="space-y-6">
            <AnimatePresence>
              {fields.map((field) => (
                <FormField
                  key={field.field_name + field.variable}
                  field={field}
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  showDescriptions={showDescriptions}
                  setFieldTouched={setFieldTouched}
                  submitCount={submitCount}
                />
              ))}
            </AnimatePresence>
            <DeleteConfirmationDialog
              id={formDeleteDialogId}
              title="Delete Node"
              description="Are you sure you want to delete node and connections? This action cannot be undone."
              confirmButtonText="Reset"
            />
            <div className="flex justify-between space-x-2">
              <HStack className="gap-4">
                <Button type="reset" variant="outline">
                  Reset
                </Button>
                <Button type="submit">{isNewNode ? "Submit" : "Update"}</Button>
              </HStack>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormBuilder;
