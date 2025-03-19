/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableHead } from "@/components/ui/table";
import FieldOptionsPopover from "@/pages/workspace/FeildPopOver";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import {
  // Text types
  AlignLeft,
  AlignJustify,

  // Number types
  Hash,
  Percent,
  CircleDollarSign,
  Star,

  // Contact types
  AtSign,
  Phone,
  Link as LinkIcon,

  // Selection types
  CheckSquare,
  CircleDot,
  List,
  ListChecks,

  // Date & Time types
  Calendar,
  Clock,
  CalendarDays,
  Timer,
  CalendarClock,

  // File types
  FileText,
  Map,

  // Misc
  HelpCircle,
} from "lucide-react";
import { FieldType, TableHeaderProps } from "@/types/table";
// Icon mapping object with colors
const TYPE_ICONS: Record<
  FieldType,
  { icon: any; color: string; bgColor: string }
> = {
  // Text types
  text: { icon: AlignLeft, color: "text-blue-600", bgColor: "bg-blue-100" },
  textarea: {
    icon: AlignJustify,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },

  // Number types
  number: { icon: Hash, color: "text-purple-600", bgColor: "bg-purple-100" },
  decimal: { icon: Hash, color: "text-indigo-600", bgColor: "bg-indigo-100" },
  currency: {
    icon: CircleDollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  percentage: { icon: Percent, color: "text-teal-600", bgColor: "bg-teal-100" },
  rating: { icon: Star, color: "text-amber-600", bgColor: "bg-amber-100" },
  float: { icon: Hash, color: "text-indigo-600", bgColor: "bg-indigo-100" },

  // Contact types
  email: { icon: AtSign, color: "text-pink-600", bgColor: "bg-pink-100" },
  phonenumber: { icon: Phone, color: "text-blue-600", bgColor: "bg-blue-100" },
  url: { icon: LinkIcon, color: "text-cyan-600", bgColor: "bg-cyan-100" },
  link: { icon: LinkIcon, color: "text-cyan-600", bgColor: "bg-cyan-100" },

  // Selection types
  checkbox: {
    icon: CheckSquare,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  radio: { icon: CircleDot, color: "text-rose-600", bgColor: "bg-rose-100" },
  select: { icon: List, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  multiselect: {
    icon: ListChecks,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },

  // Date & Time types
  date: { icon: Calendar, color: "text-orange-600", bgColor: "bg-orange-100" },
  time: { icon: Clock, color: "text-blue-600", bgColor: "bg-blue-100" },
  year: {
    icon: CalendarDays,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  datetime: {
    icon: CalendarClock,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  duration: { icon: Timer, color: "text-teal-600", bgColor: "bg-teal-100" },

  // File types
  file: { icon: FileText, color: "text-blue-600", bgColor: "bg-blue-100" },
  map: { icon: Map, color: "text-emerald-600", bgColor: "bg-emerald-100" },

  // Default/Unknown
  "": { icon: HelpCircle, color: "text-gray-600", bgColor: "bg-gray-100" },
};

export const TableHeaderComponent = ({
  column,
  sortConfig,
  handleSort,
  deleteMetaColumn,
  spaceId,
  tableId,
  columnWidths,
  startResizing,
  onDragStart,
  onDragEnd,
  onDragOver,
  isDragging,
  draggedColumn,
  dragOverColumn,
}: TableHeaderProps) => {
  const width = columnWidths[column.key] || column.display?.width || 150;
  const IconComponent =
    TYPE_ICONS[column.fieldType as FieldType]?.icon || AlignLeft;
  const iconColor =
    TYPE_ICONS[column.fieldType as FieldType]?.color || "text-gray-600";
  const iconBgColor =
    TYPE_ICONS[column.fieldType as FieldType]?.bgColor || "bg-gray-100";

  return (
    <TableHead
      key={column.key}
      draggable
      onDragStart={(e) => onDragStart(e, column.key)}
      onDragOver={(e) => onDragOver(e, column.key)}
      onDragEnd={onDragEnd}
      className={cn(
        "modern-table-header group relative",
        isDragging && draggedColumn === column.key && "opacity-50",
        isDragging &&
          dragOverColumn === column.key &&
          "border-l-2 border-l-primary"
      )}
      style={{
        width: `${width}px`,
        minWidth: "150px",
      }}
    >
      <div className="flex justify-between items-center h-full px-1 py-1">
        <div className="flex items-center gap-1.5 group-hover:text-gray-900">
          <div
            className={cn(
              "flex items-center justify-center rounded-md",
              "w-5 h-5 transition-colors duration-200",
              iconBgColor
            )}
          >
            <IconComponent className={cn("h-3 w-3", iconColor)} />
          </div>
          <span className="text-xs font-medium text-gray-700 truncate group-hover:text-gray-900">
            {column.label}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <FieldOptionsPopover
            spaceId={spaceId}
            column={column}
            sortConfig={sortConfig}
            handleSort={handleSort}
            onDelete={() => {
              deleteMetaColumn(
                {
                  spaceId: spaceId,
                  tableId,
                  columnId: column.id,
                },
                {
                  onSuccess() {
                    queryClient.invalidateQueries("getTable");
                    toast("Column Deleted Successfully!", {
                      type: "success",
                      autoClose: 2000,
                    });
                  },
                }
              );
            }}
          />
        </div>
      </div>
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-1 cursor-col-resize",
          "opacity-0 group-hover:opacity-100 hover:opacity-100",
          "bg-primary/10 hover:bg-primary/30",
          "transition-all duration-200 z-20"
        )}
        onMouseDown={(e) => {
          e.preventDefault();
          startResizing(column.key, e.clientX);
        }}
      />
    </TableHead>
  );
};
