import { TableColumn, ColumnValue } from "@/types/table";

export interface BaseFieldProps {
  column: TableColumn;
  value: ColumnValue;
  onChange?: (value: ColumnValue) => void;
  error?: boolean;
  className?: string;
}

export interface FieldInputProps extends BaseFieldProps {
  onChange: (value: ColumnValue) => void;
  error: boolean;
  placeholder?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export interface FieldDisplayProps extends BaseFieldProps {
  className?: string;
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

export type FieldValidator = (value: ColumnValue) => FieldValidationResult;

export interface FieldOption {
  label: string;
  value: string;
}

export interface MapValue {
  lat: number;
  lng: number;
  address?: string;
}

// Helper functions
export const isMapValue = (value: unknown): value is MapValue => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'lat' in value &&
    'lng' in value &&
    typeof (value as MapValue).lat === 'number' &&
    typeof (value as MapValue).lng === 'number'
  );
};

export const formatFieldValue = (value: ColumnValue): string => {
  if (value === null || value === undefined) return "";
  if (value instanceof File) return value.name;
  if (Array.isArray(value)) return value.join(", ");
  if (isMapValue(value)) return value.address || `${value.lat}, ${value.lng}`;
  return String(value);
};

// UI component value converters
export const toInputValue = (value: ColumnValue): string | number | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value instanceof File) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (isMapValue(value)) return `${value.lat}, ${value.lng}`;
  return String(value);
};

export const toSelectValue = (value: ColumnValue): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value instanceof File) return value.name;
  if (Array.isArray(value)) return value[0] || "";
  if (isMapValue(value)) return value.address || "";
  return String(value);
}; 