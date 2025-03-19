import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FieldEditorPopover, { FieldData } from "./ColumnAddPopover";
import { useParams } from "react-router-dom";
import {
  useCreateRecord,
  useDeleteMetaColumnTable,
  useDeleteTable,
  useDeleteTableRow,
  useGetTable,
  useGetTableManageFiltersData,
  useSearchTableRecord,
  useUpdateTableRow,
  useEditMetaColumnTablePatch,
} from "@/queries/table";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import * as yup from "yup";
import { cn } from "@/lib/utils";
import { TableSidebar } from "./TableSidebar";
import { HeaderTabs } from "@/components/HeaderTab";
import TableHeaderCard from "@/components/table/TableHeafCard";
import NoTablesState from "../../component/emptyState/NoTablesState";
import { LoadingSkeleton } from "@/components/table/LoadingSkeleton";
import { TableHeaderComponent } from "@/components/table/TableHeaderComponent";
import { TableRowComponent } from "@/components/table/TableRowComponent";
import { useGetAllTable } from "@/queries/table";
import type { 
  TableManageFiltersData, 
  TableRecord, 
  ColumnModel,
  TableColumn,
  TableData,
  FilterCondition,
  FilterField,
  SortConfig,
  ColumnWidths,
  ColumnValue,
  FieldType
} from "@/types/table";
import { FieldInput } from "@/components/fields/FieldInput";
import { getFieldValidator } from "@/components/fields/FieldValidation";
import { debounce } from "lodash";

// =============================================================================
// INTERFACES / TYPES
// =============================================================================

// Interface for a table column
export interface Column {
  key: string;
  label: string;
  sortable: boolean;
  type: "" | "text" | "number" | "email" | "select";
  options?: string[];
}

// Interface for a filter condition
// =============================================================================
// DYNAMIC TABLE COMPONENT
// =============================================================================
function DynamicTable() {
  // ---------------------------------------------------------------------------
  // URL Params and Initial States
  // ---------------------------------------------------------------------------
  const { id = "", tableId = "", viewId } = useParams();
  const { data: tableData1 } = useGetAllTable(id);

  // Data & Table States
  const [data, setData] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [filterText, setFilterText] = useState<string>("");
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [filterFields, setFilterFields] = useState<FilterField[]>([]);
  const [query, setQuery] = useState("");

  // Editing / Inline States
  const [editingRow, setEditingRow] = useState<TableData | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [inlineNewRow, setInlineNewRow] = useState<boolean>(false);
  const [inlineRowData, setInlineRowData] = useState<Record<string, ColumnValue>>(
    { id: "" }
  );

  // Sidebar and Hover States
  const [isViewSidebarOpen, setIsViewSidebarOpen] = useState(false);
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);

  // Resizing States
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizingStartX, setResizingStartX] = useState(0);
  const [resizingStartWidth, setResizingStartWidth] = useState(0);

  // Drag & Drop States for Columns
  const [isDragging, setIsDragging] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const { data: filtersData } =
    useGetTableManageFiltersData<TableManageFiltersData>(id!, tableId!);
  const { data: tableData, isLoading } = useGetTable(id ?? "", tableId ?? "");
  const { data: tableRecord, isLoading: filterLoading } = useSearchTableRecord(
    id || "",
    tableId || "",
    query || undefined
  );
  const { mutate: updateColumnPatch } = useEditMetaColumnTablePatch();

  // ---------------------------------------------------------------------------
  // EFFECT HOOKS
  // ---------------------------------------------------------------------------
  // Set filter fields on change of filtersData
  useEffect(() => {
    if (filtersData && Array.isArray(filtersData) && filtersData.length > 0) {
      setFilterFields([...filtersData]);
    }
    return () => {
      setFilterFields([]);
      setConditions([]);
    };
  }, [filtersData]);

  // Reset query when tableId changes
  useEffect(() => {
    setQuery("");
  }, [tableId]);

  // Update table data when tableRecord changes
  useEffect(() => {
    if (tableRecord) {
      const data = tableRecord as TableRecord;
      setData(data.data);
    }
  }, [tableRecord]);

  // Modify the view config useEffect
  useEffect(() => {
    if (viewId) {
      const savedConfig = localStorage.getItem(`viewConfig-${viewId}`);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (columns.length > 0) {
          // Set visibility first
          setColumnVisibility(() => ({
            ...columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {}),
            ...config.columnVisibility,
          }));

          // Then set conditions and apply filters
          setConditions(config.conditions);
          setFilterText(config.filterText);

          // Use timeout to ensure state updates before applying
          setTimeout(() => {
            applyFilter(config.conditions);
          }, 50);
        }
      }
    }
  }, [viewId, tableId, columns]);

  // Add this new useEffect to handle initial filter application
  useEffect(() => {
    if (viewId && conditions.length > 0) {
      applyFilter(conditions);
    }
  }, [viewId, tableId]); // Run only once when viewId changes

  // Update the persistence useEffect to stringify safely
  useEffect(() => {
    if (viewId && columns.length > 0) {
      const config = {
        columnVisibility,
        filterText,
        conditions,
      };
      localStorage.setItem(`viewConfig-${viewId}`, JSON.stringify(config));
    }
  }, [columnVisibility, filterText, conditions, viewId, columns]);

  // Modify the existing column visibility useEffect
  useEffect(() => {
    if (columns.length > 0 && !viewId) {
      // Only initialize if not in view mode
      const initialVisibility = columns.reduce((acc, column) => {
        acc[column.key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setColumnVisibility(initialVisibility);
    }
  }, [columns, viewId]);

  // Map active table columns when tableData is fetched
  useEffect(() => {
    if (tableData) {
      const columnsWithOrder = ensureColumnOrdersExist(getColumnsForActiveTable());
      setColumns(columnsWithOrder);
    }
  }, [tableId, tableData]);

  // Update the useEffect for column widths
  useEffect(() => {
    if (!tableData?.columns || !columns.length) return;
    
    const widths: Record<string, number> = {};
    const typedColumns = tableData.columns as unknown as ColumnModel[];
    
    // Map column IDs to keys for quick lookup
    const columnKeyMap = columns.reduce((acc, col) => {
      acc[col.id] = col.key;
      return acc;
    }, {} as Record<string, string>);
    
    // First set widths from backend data
    typedColumns.forEach((column) => {
      const columnKey = columnKeyMap[column.id];
      if (columnKey && column.display?.width) {
        widths[columnKey] = column.display.width;
      }
    });
    
    // Then set default widths for columns without backend width
    typedColumns.forEach((column) => {
      const columnKey = columnKeyMap[column.id];
      if (columnKey && !widths[columnKey]) {
        if (column.fieldType === "date" || column.fieldType === "datetime" || column.fieldType === "textarea") {
          widths[columnKey] = 300;
        } else {
          widths[columnKey] = 150;
        }
      }
    });
    
    // Update column widths state
    setColumnWidths(widths);
  }, [tableData?.columns, columns]);

  // ----- COLUMN VISIBILITY HANDLERS -----
  const toggleColumnVisibility = (columnKey: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // Add event listener for column visibility toggle from FieldOptionsPopover
  useEffect(() => {
    const handleToggleColumnVisibility = (event: CustomEvent) => {
      const { columnKey } = event.detail;
      if (columnKey) {
        toggleColumnVisibility(columnKey);
      }
    };

    window.addEventListener(
      "toggleColumnVisibility",
      handleToggleColumnVisibility as EventListener
    );

    return () => {
      window.removeEventListener(
        "toggleColumnVisibility",
        handleToggleColumnVisibility as EventListener
      );
    };
  }, []);

  // Add event listener for adding a filter with a pre-selected field
  useEffect(() => {
    const handleAddFilterWithField = (event: CustomEvent) => {
      const { fieldId } = event.detail;
      if (fieldId) {
        // Add a new filter condition with the field pre-selected
        // We'll add a special flag to indicate this is a new filter that should keep the popover open
        setConditions((prev) => [
          ...prev,
          { field: fieldId, operator: "", value: "", isNew: true },
        ]);

        // We don't need to manually click the filter button anymore
        // The TableHeafCard component will automatically open the filter popover
        // when it detects a new filter condition with an empty operator
      }
    };

    window.addEventListener(
      "addFilterWithField",
      handleAddFilterWithField as EventListener
    );

    return () => {
      window.removeEventListener(
        "addFilterWithField",
        handleAddFilterWithField as EventListener
      );
    };
  }, []);

  // ---------------------------------------------------------------------------
  // HANDLER FUNCTIONS
  // ---------------------------------------------------------------------------

  // ----- DRAG & DROP HANDLERS FOR COLUMNS -----
  const handleDragStart = (_e: React.DragEvent, columnKey: string) => {
    setIsDragging(true);
    setDraggedColumn(columnKey);
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    if (columnKey !== draggedColumn) {
      setDragOverColumn(columnKey);
    }
  };

  // Calculate new order values for columns
  const calculateNewOrderValues = (columnsArray: TableColumn[]): TableColumn[] => {
    // Start with a base order value and increment
    const baseIncrement = 1;
    
    return columnsArray.map((column, index) => {
      // New order is simply the index + 1 (to avoid 0-based indexing)
      const newOrder = (index + 1) * baseIncrement;
      
      return {
        ...column,
        display: {
          ...column.display,
          order: newOrder
        }
      };
    });
  };

  // Update column orders in the backend
  const updateColumnOrdersInBackend = (columnsArray: TableColumn[]) => {
    // For each column, update its order in the backend
    columnsArray.forEach(column => {
      // Only update the order property, not the width
      updateColumnPatch({
        spaceId: id,
        tableId,
        columnId: column.id,
        columnData: {
          add: {
            display: {
              order: column.display?.order || 0
            }
          }
        }
      });
    });
  };

  const handleDragEnd = () => {
    if (draggedColumn && dragOverColumn) {
      const fromIndex = columns.findIndex((col) => col.key === draggedColumn);
      const toIndex = columns.findIndex((col) => col.key === dragOverColumn);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        // Create a new array with the moved column
        const newColumns = [...columns];
        const [movedColumn] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, movedColumn);
        
        // Update the order values for all affected columns
        const updatedColumns = calculateNewOrderValues(newColumns);
        
        // Update state
        setColumns(updatedColumns);
        
        // Persist the new order to the backend
        updateColumnOrdersInBackend(updatedColumns);
      }
    }
    
    setIsDragging(false);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // ----- INLINE EDIT HANDLERS -----
  const handleInlineEditChange = useCallback(
    (rowId: string, columnId: string, value: ColumnValue) => {
      setData((prevData) =>
        prevData.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [columnId]: value as
                  | string
                  | number
                  | boolean
                  | null
                  | undefined,
              }
            : row
        )
      );
      setEditingRow((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [columnId]: value as string | number | boolean | null | undefined,
        };
      });
    },
    []
  );

  // ----- COLUMN RESIZING HANDLERS -----
  const startResizing = useCallback((columnKey: string, startX: number) => {
    setResizingColumn(columnKey);
    setResizingStartX(startX);
    setResizingStartWidth(columnWidths[columnKey] || 150);
  }, [columnWidths]);

  const resizeColumn = useCallback((clientX: number) => {
    if (!resizingColumn) return;

    const deltaX = clientX - resizingStartX;
    const newWidth = Math.max(150, resizingStartWidth + deltaX);
    
    setColumnWidths((prev) => ({
      ...prev,
      [resizingColumn]: newWidth,
    }));
  }, [resizingColumn, resizingStartX, resizingStartWidth]);

  // Add back the debounced column width update function
  const debouncedUpdateColumnWidth = useCallback(
    debounce((columnId: string, width: number) => {
      if (!id || !tableId) return;

      updateColumnPatch({
        spaceId: id,
        tableId,
        columnId,
        columnData: {
          add: {
            display: {
              width
            }
          }
        }
      });
    }, 500),
    [id, tableId, updateColumnPatch]
  );

  // Update the stopResizing function to use the debounced approach for width
  const stopResizing = useCallback(() => {
    if (resizingColumn) {
      // Find the column ID from the key
      const column = columns.find(col => col.key === resizingColumn);
      if (column?.id) {
        const width = columnWidths[resizingColumn];
        // Use the debounced function for width updates
        debouncedUpdateColumnWidth(column.id, width);
      }
    }
    setResizingColumn(null);
  }, [resizingColumn, columnWidths, columns, debouncedUpdateColumnWidth]);

  // Handle mouse move/up for column resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => resizeColumn(e.clientX);
    const handleMouseUp = () => stopResizing();
    if (resizingColumn) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColumn, resizeColumn, stopResizing]);

  // ----- FILTER HANDLERS -----
  const addFilter = () => {
    setConditions([...conditions, { field: "", operator: "", value: "" }]);
  };

  const applyFilter = (conditionsToApply = conditions) => {
    const validConditions = conditionsToApply.filter(
      (c: FilterCondition) => c.field && c.operator && c.value
    );

    // Always update local storage when applying filters
    if (viewId) {
      const config = {
        columnVisibility,
        filterText,
        conditions: validConditions,
      };
      localStorage.setItem(`viewConfig-${viewId}`, JSON.stringify(config));
    }

    // Rest of existing logic
    if (validConditions.length === 0) {
      setQuery("");
      return;
    }

    const queryString = validConditions
      .map(({ operator, value }) => {
        const formattedOperator = String(operator)
          .replace("{{Value}}", String(value))
          .replace("{{value}}", String(value));
        return `${formattedOperator}`;
      })
      .join(" and ");
    setQuery(queryString);
  };

  const updateFilter = (
    index: number,
    field: keyof FilterCondition,
    value: string
  ) => {
    if (field === "field") {
      // Reset operator and value if field changes
      setConditions((prev) => {
        const newConditions = [...prev];
        // Remove the isNew flag when updating the field
        newConditions[index] = { field: value, operator: "", value: "" };
        return newConditions;
      });
    } else {
      setConditions((prev) => {
        const newConditions = [...prev];
        // Remove the isNew flag when updating any part of the filter
        // Use object spread to only keep the standard filter properties
        newConditions[index] = {
          field: newConditions[index].field,
          operator: newConditions[index].operator,
          value: newConditions[index].value,
          [field]: value,
        };
        return newConditions;
      });
    }
  };

  const removeFilter = (index: number) => {
    setConditions((prevConditions) => {
      const newConditions = prevConditions.filter((_, i) => i !== index);
      applyFilter(newConditions);
      return newConditions;
    });
  };

  // ----- SORTING AND FILTERING DATA -----
  const sortedAndFilteredData = React.useMemo(() => {
    if (!data) return [];
    const sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        // Handle missing values
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        // Numeric comparison if possible
        const numA = parseFloat(aValue.toString());
        const numB = parseFloat(bValue.toString());
        const isNumeric = !isNaN(numA) && !isNaN(numB);
        if (isNumeric) {
          return sortConfig.direction === "ascending"
            ? numA - numB
            : numB - numA;
        }
        // Otherwise, string comparison
        const stringA = aValue.toString().toLowerCase();
        const stringB = bValue.toString().toLowerCase();
        return sortConfig.direction === "ascending"
          ? stringA.localeCompare(stringB)
          : stringB.localeCompare(stringA);
      });
    }
    return sortableItems.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [data, sortConfig, filterText]);

  // ----- SORT HANDLER -----
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction:
            prev.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { key, direction: "ascending" };
    });
  };

  // ----- FILTER INPUT HANDLER -----
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  // ----- ROW EDIT & DELETE HANDLERS -----
  const handleEdit = (row: TableData) => {
    setEditingRow({ ...row });
  };

  const { mutate: deleteTableRow } = useDeleteTableRow();
  const handleDelete = (rowId: string) => {
    deleteTableRow(
      {
        spaceId: id ?? "",
        tableId: tableId,
        rowId: rowId,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries("getTable");
          queryClient.invalidateQueries("getAllTable");
          queryClient.clear();
          toast("Row Record Deleted Successfully", {
            autoClose: 2000,
            type: "success",
          });
        },
      }
    );
  };

  // ----- ROW SAVE (EDIT) HANDLER -----
  const { mutate: updateRow } = useUpdateTableRow();
  const handleSave = async () => {
    if (editingRow) {
      // Clean row data by removing server-managed fields
      const cleanRowData = { ...editingRow };
      delete cleanRowData.hash;
      delete cleanRowData.createdAt;
      delete cleanRowData.createdBy;
      delete cleanRowData.updatedAt;
      delete cleanRowData.updatedBy;

      try {
        const editedColumn = columns.find(
          (c) => c.id === editingColumn || c.key === editingColumn
        );

        if (!editedColumn) {
          throw new Error("Column not found");
        }

        // Create validation schema for the specific field
        const fieldSchema = yup.object().shape({
          [editingColumn as string]: getFieldValidator(editedColumn),
        });

        try {
          // Validate just the edited field
          await fieldSchema.validate(
            {
              [editingColumn as string]: editingRow[editingColumn as string],
            },
            { abortEarly: false }
          );

          // Clear errors if validation passes
          setFieldErrors({});

          // Proceed with update
          updateRow(
            {
              tableId: tableId ?? "",
              spaceId: id ?? "",
              rowId: editingRow.id ?? "",
              rowData: cleanRowData,
            },
            {
              onSuccess() {
                setData(
                  data.map((item) =>
                    item.id === editingRow.id ? editingRow : item
                  )
                );
                setEditingRow(null);
                setEditingColumn(null);
                setFieldErrors({});
              },
              onError(error) {
                toast(error.message, { type: "error" });
              },
            }
          );
        } catch (validationError) {
          if (validationError instanceof yup.ValidationError) {
            // Set error for the specific field being edited
            setFieldErrors({
              [editingColumn as string]: validationError.message,
            });
            // Show error in toast
            toast.error(validationError.message);
          }
        }
      } catch (error) {
        void error;
        toast.error("An unexpected error occurred");
      }
    }
  };

  // ----- COLUMN MANAGEMENT HANDLER -----
  const { mutate: createRow } = useCreateRecord();
  const handleSavePopUp = (fieldData: FieldData) => {
    const newColumnKey = `column${columns.length + 1}${fieldData.headerName}${
      fieldData.fieldType
    }`;
    const fieldType = fieldData.fieldType as FieldType;
    const newColumn: TableColumn = {
      id: newColumnKey,
      name: fieldData.headerName,
      fieldType: fieldType,
      type: fieldType,
      key: newColumnKey,
      label: fieldData.headerName,
      sortable: true,
      options: fieldData.options,
      isRequired: false,
      datatype: fieldType,
      value: undefined,
    };
    setColumns([...columns, newColumn]);
    // Update each existing row with the new column (default empty)
    setData(data.map((item) => ({ ...item, [newColumnKey]: undefined })));
  };

  // ----- INLINE ROW ADDITION HANDLERS -----
  const handleAddInlineRow = () => {
    setInlineNewRow(true);
    setInlineRowData({ id: "" });
  };

  const handleInlineFieldChange = (key: string, value: ColumnValue) => {
    setInlineRowData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveInlineRow = async () => {
    try {
      // Create validation schema for all fields
      const schema = yup.object().shape(
        columns.reduce((acc, column) => {
          acc[column.id] = getFieldValidator(column);
          return acc;
        }, {} as Record<string, yup.Schema>)
      );

      // Validate all fields
      const validatedData = await schema.validate(inlineRowData, {
        abortEarly: false,
        stripUnknown: true,
      });

      // Clean the validated data
      const cleanData = Object.keys(validatedData).reduce((acc, key) => {
        const value = validatedData[key];
        // Convert empty strings to null for optional fields
        acc[key] = value === "" ? null : value;
        return acc;
      }, {} as Record<string, ColumnValue>);

      createRow(
        {
          tableId: tableId ?? "",
          spaceId: id ?? "",
          rowData: cleanData,
        },
        {
          onSuccess() {
            queryClient.invalidateQueries("getTableRow");
            setInlineNewRow(false);
            setInlineRowData({ id: "" });
            toast.success("Added new entry");
          },
          onError(error: Error) {
            toast.error(error.message || "Failed to add entry");
          },
        }
      );
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.reduce((acc, err) => {
          acc[err.path!] = err.message;
          return acc;
        }, {} as Record<string, string>);

        setFieldErrors(errors);

        // Show first error in toast
        if (error.inner.length > 0) {
          toast.error(error.inner[0].message);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleCancelInlineRow = () => {
    setInlineNewRow(false);
    setInlineRowData({ id: "" });
  };

  // ----- TABLE COLUMNS MAPPING -----
  const getColumnsForActiveTable = () => {
    if (!tableData?.columns) return [];

    const mappedColumns = (tableData.columns as unknown as ColumnModel[]).map(
      (column): TableColumn => ({
        ...column,
        key: column.id,
        label: column.name,
        sortable: true,
        type: column.fieldType,
        isRequired: column.isrequired,
        datatype: column.fieldType,
        options: Array.isArray(column.enum)
          ? column.enum.map(String)
          : undefined,
        value: undefined,
        display: {
          ...column.display,
          order: column.display?.order || 0
        }
      })
    );
    
    // Sort columns by their order value
    return mappedColumns.sort((a, b) => 
      (a.display?.order || 0) - (b.display?.order || 0)
    );
  };

  // Ensure all columns have order values
  const ensureColumnOrdersExist = (columns: TableColumn[]) => {
    let needsUpdate = false;
    
    const columnsWithOrder = columns.map((column, index) => {
      if (!column.display?.order) {
        needsUpdate = true;
        return {
          ...column,
          display: {
            ...column.display,
            order: index + 1
          }
        };
      }
      return column;
    });
    
    if (needsUpdate) {
      // Update columns with missing order values
      updateColumnOrdersInBackend(columnsWithOrder);
    }
    
    return columnsWithOrder;
  };

  // ----- TABLE DELETION HANDLER -----
  const { mutate: deleteMetaColumn } = useDeleteMetaColumnTable();
  const { mutate: deleteTableFromSpace } = useDeleteTable();
  function deleteTable() {
    deleteTableFromSpace(
      {
        tableId: tableId,
        spaceId: id ?? "",
      },
      {
        onSuccess() {
          queryClient.invalidateQueries("getAllTable");
          toast("Table Deleted Successfully!", {
            type: "success",
            autoClose: 2000,
          });
        },
      }
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER COMPONENT
  // ---------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
    
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Table Header Card */}
        <div className="sticky top-0 z-20">
          <TableHeaderCard
            filterText={filterText}
            filterLoading={filterLoading}
            handleFilter={handleFilter}
            isViewSidebarOpen={isViewSidebarOpen}
            setIsViewSidebarOpen={setIsViewSidebarOpen}
            columns={columns}
            columnVisibility={columnVisibility}
            toggleColumnVisibility={toggleColumnVisibility}
            conditions={conditions}
            filterFields={filterFields}
            updateFilter={updateFilter}
            removeFilter={removeFilter}
            addFilter={addFilter}
            applyFilter={applyFilter}
            deleteTable={deleteTable}
            viewId={viewId}
          />
        </div>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <TableSidebar
            isOpen={isViewSidebarOpen}
            spaceId={id}
            tableId={tableId}
          />
          {/* Main Table */}
          <div
            className={cn(
              "flex-1 overflow-auto transition-all duration-300 ease-in-out",
              isViewSidebarOpen ? "ml-[250px]" : "ml-0"
            )}
          >
            {isLoading ? (
              <LoadingSkeleton />
            ) : tableData ? (
              <div className="h-full flex flex-col">
                <div className="overflow-auto flex-1">
                  <Table className="w-full border bg-white">
                    <TableHeader className="sticky top-0 bg-neutral-100 z-10 shadow-sm">
                      <TableRow className="text-left text-xs font-medium text-black">
                        <TableHead className="w-14 border-r text-center">
                          #
                        </TableHead>
                        {columns
                          ?.filter((column) => columnVisibility[column.key])
                          ?.map((column) => (
                            <TableHeaderComponent
                              key={column.key}
                              column={column}
                              columnWidths={columnWidths}
                              startResizing={startResizing}
                              sortConfig={sortConfig}
                              handleSort={handleSort}
                              hoveredHeader={hoveredHeader}
                              setHoveredHeader={setHoveredHeader}
                              deleteMetaColumn={deleteMetaColumn}
                              spaceId={id!}
                              tableId={tableId}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                              onDragOver={handleDragOver}
                              isDragging={isDragging}
                              draggedColumn={draggedColumn}
                              dragOverColumn={dragOverColumn}
                            />
                          ))}
                        <TableHead className="border-r w-[150px]">
                          <FieldEditorPopover
                            tableId={tableId}
                            spaceId={id ?? ""}
                            trigger={
                              <Button
                                variant="outline"
                                className="border-none bg-transparent"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            }
                            onSave={handleSavePopUp}
                            initialData={{
                              tableId: tableId,
                              spaceId: id ?? "",
                              headerName: "",
                              fieldType: "",
                              defaultValue: "",
                              hasDefaultValue: false,
                            }}
                          />
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {sortedAndFilteredData?.map(
                        (row: TableData, index: number) => (
                          <TableRowComponent
                            key={row.id}
                            row={row}
                            index={index}
                            columns={columns}
                            columnVisibility={columnVisibility}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            editingRow={editingRow}
                            onSave={handleSave}
                            spaceId={id}
                            tableId={tableId}
                            columnWidths={columnWidths}
                            editingColumn={editingColumn}
                            setEditingColumn={setEditingColumn}
                            onInlineEditChange={handleInlineEditChange}
                            fieldErrors={fieldErrors}
                            onCancelEditing={() => {
                              setEditingRow(null);
                              setEditingColumn(null);
                            }}
                          />
                        )
                      )}
                      {/* Inline New Row for quick addition */}
                      {inlineNewRow && (
                        <TableRow className="hover:bg-gray-50">
                          <TableCell className="w-14 text-center text-gray-500 font-medium border-r">
                            {sortedAndFilteredData.length + 1}
                          </TableCell>
                          {columns.map(
                            (column) =>
                              columnVisibility[column.key] && (
                                <TableCell
                                  key={column.key}
                                  className="px-4 py-2 border-r"
                                  style={{
                                    width: `${columnWidths[column.key]}px`,
                                    minWidth: "100px",
                                    maxWidth: "400px",
                                  }}
                                >
                                  <FieldInput
                                    column={column}
                                    value={inlineRowData[column.id]}
                                    onChange={(value) =>
                                      handleInlineFieldChange(column.id, value)
                                    }
                                    error={!!fieldErrors[column.id]}
                                    placeholder={`Enter ${
                                      column.fieldType || "text"
                                    }...`}
                                  />
                                  {fieldErrors[column.id] && (
                                    <div className="text-xs text-destructive mt-1">
                                      {fieldErrors[column.id]}
                                    </div>
                                  )}
                                </TableCell>
                              )
                          )}
                          <TableCell className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={handleSaveInlineRow}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelInlineRow}
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {/* Add Inline Row Button */}
                      <div className="py-[4px] flex flex-row items-center justify-start border-r transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <TableRow>
                          <TableCell colSpan={columns.length + 2}>
                            <Button
                              variant="ghost"
                              onClick={handleAddInlineRow}
                              className="w-full flex items-center justify-center gap-2"
                              disabled={inlineNewRow}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </div>
                    </TableBody>
                  </Table>
                </div>
                {/* Footer with Record Count and Add Record Button */}
                <div className="sticky bottom-0 bg-white border-t">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{sortedAndFilteredData.length} records</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        disabled={inlineNewRow}
                        onClick={handleAddInlineRow}
                      >
                        <Plus className="h-4 w-4" />
                        Add record
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>View: Grid</span>
                      <span>Sort: {sortConfig.key || "None"}</span>
                      <span>Filters: {conditions.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <NoTablesState workspaceId={id} />
            )}
          </div>
        </div>
      </div>
        {/* Header Tabs */}
        <HeaderTabs tableData={tableData1} isFlow={false} className="border-t" />
    </div>
  );
}

export default DynamicTable;
