/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated color palette to grayscale theme
export const colorPalette = [
  { bg: "bg-gray-50", header: "bg-gray-600 text-white" },
  { bg: "bg-gray-50", header: "bg-gray-600 text-white" },
  { bg: "bg-gray-50", header: "bg-gray-600 text-white" },
  { bg: "bg-gray-50", header: "bg-gray-600 text-white" },
  { bg: "bg-gray-50", header: "bg-gray-600 text-white" },
  { bg: "bg-gray-50", header: "bg-gray-600 text-white" },
  { bg: "bg-gray-50", header: "bg-gray-600 text-white" },
  { bg: "bg-gray-50", header: "bg-gray-600 text-white" },
];

export interface KanbanItemProps {
  item: any;
  displayFields: string[];
  columns: any[];
  onClick?: (item: any) => void;
}

export interface StatusColumnProps {
  id: string;
  title: string;
  items: any[];
  // onDrop: (itemId: string, newGroup: string) => void;
  displayFields: string[];
  colorClass: string;
  isUncategorized: boolean;
  columns: any[];
  spaceId: string;
  tableId: string;
  onSave?: () => void;
  handleEdit: any;
  editingRow: any[];
  groupByField?: string;
}

export interface DragItem {
  id: string;
  currentGroup: string;
}
