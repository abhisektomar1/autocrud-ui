import { TableCell, TableRow } from "@/components/ui/table";
import DeleteConfirmationDialog, {
  DeleteTrigger,
} from "@/component/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import EditDialog from "@/pages/workspace/EditDialog";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  TableRowComponentProps,
  TableColumn,
  ColumnValue,
} from "@/types/table";
import { FieldInput } from "@/components/fields/FieldInput";
import { FieldDisplay } from "@/components/fields/FieldDisplay";
import { useCreateRecord } from "@/queries/table";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";

export const TableRowComponent = ({
  row,
  index,
  columns,
  columnVisibility,
  handleEdit,
  handleDelete,
  editingRow,
  onSave,
  spaceId,
  tableId,
  columnWidths,
  editingColumn,
  setEditingColumn,
  onInlineEditChange,
  onCancelEditing,
  fieldErrors = {},
}: TableRowComponentProps) => {
  const [localValue, setLocalValue] = useState<ColumnValue>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const latestValueRef = useRef<ColumnValue>(null);
  const { mutate: createRow } = useCreateRecord();

  useEffect(() => {
    if (editingRow?.id === row.id && editingColumn) {
      setLocalValue(editingRow[editingColumn] ?? row[editingColumn] ?? "");
      latestValueRef.current =
        editingRow[editingColumn] ?? row[editingColumn] ?? "";
      setTimeout(() => inputRef?.current?.focus(), 50);
    }
  }, [editingRow, editingColumn, row]);

  const handleLocalChange = (value: ColumnValue) => {
    setLocalValue(value);
    latestValueRef.current = value;

    if (editingColumn) {
      onInlineEditChange(row.id, editingColumn, value);
    }
  };

  const handleSaveWithLatestValue = () => {
    if (onSave && editingColumn) {
      onInlineEditChange(row.id, editingColumn, latestValueRef.current);
      setTimeout(() => {
        onSave();
      }, 100);
    } else if (onSave) {
      onSave();
    }
  };

  const renderCellContent = (column: TableColumn) => {
    const isEditing =
      editingRow?.id === row.id &&
      (editingColumn === column.id || editingColumn === column.key);
    const error =
      fieldErrors[column.id] ||
      fieldErrors[column.key] ||
      (editingColumn && fieldErrors[editingColumn]);
    const currentValue = row[column.id] || row[column.key];

    if (isEditing) {
      return (
        <div className="relative">
          <FieldInput
            column={column}
            value={localValue ?? currentValue}
            onChange={handleLocalChange}
            error={!!error}
            placeholder={`Enter ${column.fieldType || "text"}...`}
            onSave={handleSaveWithLatestValue}
            onCancel={onCancelEditing}
          />
          {error && (
            <div className="absolute top-full left-0 text-destructive text-xs mt-1 font-medium z-50 bg-white/80 backdrop-blur-sm p-1 rounded shadow-sm border border-destructive/10 whitespace-nowrap">
              {error}
            </div>
          )}
        </div>
      );
    }

    // Display mode
    return (
      <div className="text-sm">
        <FieldDisplay column={column} value={currentValue} />
      </div>
    );
  };

  const formatColumnsForEditDialog = (cols: TableColumn[]) => {
    return cols.map((col) => ({
      ...col,
      fieldtype: col.fieldType,
    }));
  };

  const cleanBaseFields = (data: Record<string, unknown>) => {
    const cleanedData = { ...data };

    delete cleanedData.id;
    delete cleanedData.hash;
    delete cleanedData.createdAt;
    delete cleanedData.createdBy;
    delete cleanedData.updatedAt;
    delete cleanedData.updatedBy;

    return cleanedData;
  };

  const handleClone = (itemToClone = row) => {
    if (!itemToClone) return;

    const cleanRowData = cleanBaseFields(itemToClone) as Record<
      string,
      string | number | boolean | null | undefined
    >;

    createRow(
      {
        tableId: tableId ?? "",
        spaceId: spaceId ?? "",
        rowData: cleanRowData,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries("getTableRow");
          queryClient.invalidateQueries("getAllTable");
          toast.success("Row cloned successfully");
        },
        onError() {
          toast.error("Failed to clone row");
        },
      }
    );
  };

  return (
    <TableRow className="modern-table-row group">
      <TableCell className="modern-table-cell sticky-left index-column text-center bg-white">
        <span className="text-sm font-medium text-gray-500">{index + 1}</span>
      </TableCell>
      {columns.map(
        (column) =>
          columnVisibility[column.key] && (
            <TableCell
              key={column.key}
              className={cn(
                "modern-table-cell data-column",
                "transition-colors duration-200 cursor-pointer"
              )}
              style={{
                width: columnWidths[column.key] || column.display?.width || 150,
                minWidth: "150px",
                maxWidth: "400px",
              }}
              onClick={() => {
                handleEdit(row);
                setEditingColumn(column.id);
              }}
            >
              {renderCellContent(column)}
            </TableCell>
          )
      )}
      <TableCell className="modern-table-cell sticky-right action-column bg-white">
        <div className="flex items-center justify-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditDialog
            spaceId={spaceId ?? ""}
            tableId={tableId ?? ""}
            columns={formatColumnsForEditDialog(columns)}
            row={row}
            onEdit={handleEdit}
            editingRow={editingRow}
            onClickEdit={() => handleEdit(row)}
            onDelete={() => handleDelete(row?.id.toString())}
            onClone={() => handleClone(row)}
          />
          <DeleteConfirmationDialog id="deleteTable" />
          <DeleteTrigger
            id="deleteTable"
            itemName={"Delete"}
            onConfirm={() => handleDelete(row?.id.toString())}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </DeleteTrigger>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TableRowComponent;
