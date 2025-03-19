import { LucideIcon } from "lucide-react";

// Map coordinates interface
export interface MapCoordinates {
  lat: number;
  lng: number;
}

// Field types matching backend enum.FieldType
export type FieldType =
  | "text" // SingleLine Text
  | "textarea" // Long Text
  | "number"
  | "decimal"
  | "currency"
  | "percentage"
  | "rating"
  | "email"
  | "phonenumber"
  | "url"
  | "link" // URL/Link type
  | "checkbox"
  | "radio" // Select
  | "select" // SingleSelect
  | "multiselect" // MultiSelect
  | "map"
  | "file"
  | "date"
  | "time"
  | "year"
  | "datetime"
  | "duration"
  | "" // UNKNOWN
  | "float"; // Additional type for float numbers

// Base model from backend
export interface BaseModel {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// Column interface matching backend Column struct
export interface Column extends BaseModel {
  name: string;
  description?: string;
  fieldtype: FieldType; // The single source of truth for field type
  length?: number;
  default?: unknown;
  enum?: unknown[];
  tableid?: string;
  space?: string;
  isrequired?: boolean;
  isinternal?: boolean;
  meta?: Record<string, unknown>;
}

// Column model from backend API response
export interface ColumnModel {
  id: string;
  name: string;
  description?: string;
  fieldType: FieldType;
  length?: number;
  default?: unknown;
  enum?: unknown[];
  tableid?: string;
  space?: string;
  isrequired?: boolean;
  isinternal?: boolean;
  meta?: Record<string, unknown>;
  display?: {
    width?: number;
    order?: number;
    icon?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// Table column with UI properties
export interface TableColumn extends Omit<ColumnModel, "enum"> {
  key: string;
  label: string;
  sortable: boolean;
  options?: string[];
  type?: FieldType;
  isRequired?: boolean;
  datatype?: string;
  value?: string | number | boolean | null | undefined;
}

// Column widths interface
export interface ColumnWidths {
  [key: string]: number;
}

// Table data interface
export interface TableData {
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

// Filter condition interface
export interface FilterCondition {
  field: string;
  operator: string;
  value: string | number | boolean | null | undefined;
}

// Filter field interface
export interface FilterField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
}

// Sort configuration
export interface SortConfig {
  key: string | null;
  direction: "ascending" | "descending";
}

// View configuration
export interface ViewConfig {
  id: string;
  name: string;
  filters: FilterCondition[];
  sorts: SortConfig[];
  columnVisibility: Record<string, boolean>;
}

// Table state interface
export interface TableState {
  selectedRows: string[];
  editingRow: TableData | null;
  columnWidths: ColumnWidths;
  filters: FilterCondition[];
  sorts: SortConfig[];
  query: string;
  page: number;
  pageSize: number;
  totalRows: number;
  loading: boolean;
  error: Error | null;
}

// Table model interface
export interface TableModel {
  name: string;
  columns: ColumnModel[];
  meta?: Record<string, unknown>;
}

// Table response interface
export interface TableResponse {
  columns: ColumnModel[];
  data: TableData[];
  meta?: Record<string, unknown>;
}

// Icon configuration
export interface IconConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// Table header component props
export interface TableHeaderProps {
  column: TableColumn;
  sortConfig: SortConfig;
  handleSort: (key: string) => void;
  deleteMetaColumn: (
    params: DeleteMetaColumnParams,
    options?: { onSuccess?: () => void }
  ) => void;
  spaceId: string;
  tableId: string;
  columnWidths: Record<string, number>;
  startResizing: (columnKey: string, clientX: number) => void;
  onDragStart: (e: React.DragEvent, columnKey: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, columnKey: string) => void;
  isDragging: boolean;
  draggedColumn: string | null;
  dragOverColumn: string | null;
  hoveredHeader?: string | null;
  setHoveredHeader?: (key: string | null) => void;
}

// Delete meta column parameters
export interface DeleteMetaColumnParams {
  spaceId: string;
  tableId: string;
  columnId: string;
}

// Field data interface
export interface FieldData {
  headerName: string;
  fieldType: string;
  options?: string[];
  defaultValue?: string;
  hasDefaultValue?: boolean;
  tableId?: string;
  spaceId?: string;
}

// Table header card props
export interface TableHeaderCardProps {
  filterText: string;
  handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isViewSidebarOpen: boolean;
  setIsViewSidebarOpen: (open: boolean) => void;
  columns: TableColumn[];
  columnVisibility: Record<string, boolean>;
  toggleColumnVisibility: (key: string) => void;
  conditions: FilterCondition[];
  filterFields: FilterField[];
  updateFilter: (
    index: number,
    field: keyof FilterCondition,
    value: string
  ) => void;
  removeFilter: (index: number) => void;
  addFilter: () => void;
  applyFilter: (conditions?: FilterCondition[]) => void;
  deleteTable: () => void;
  filterLoading?: boolean;
  viewId?: string;
}

// Column value type
export type ColumnValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | File
  | MapCoordinates;

// Table row component props
export interface TableRowComponentProps {
  row: TableData;
  index: number;
  columns: TableColumn[];
  columnVisibility: Record<string, boolean>;
  handleEdit: (row: TableData) => void;
  handleDelete: (id: string) => void;
  editingRow: TableData | null;
  onSave: () => void;
  spaceId?: string;
  tableId?: string;
  columnWidths: Record<string, number>;
  editingColumn: string | null;
  setEditingColumn: (key: string | null) => void;
  onInlineEditChange: (
    rowId: string,
    columnId: string,
    value: ColumnValue
  ) => void;
  onCancelEditing: () => void;
  fieldErrors?: Record<string, string>;
}

// Table record response interface
export interface TableRecord {
  data: TableData[];
  meta?: Record<string, unknown>;
}

// Table manage filters data interface
export interface TableManageFiltersData {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
}
