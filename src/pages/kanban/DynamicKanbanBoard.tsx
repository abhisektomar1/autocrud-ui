/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetAllTable,
  useGetTable,
  useSearchTableRecord,
  useUpdateTableRow,
} from "@/queries/table";
import { StatusColumn } from "./StatusColumn";
import { colorPalette } from "./KanbanTypes";
import CustomHelmet from "@/component/CustomHelmet";
import { TableSidebar } from "../workspace/TableSidebar";
import { cn } from "@/lib/utils";
import { HeaderTabs } from "@/components/HeaderTab";
import KanbanHeaderCard from "@/components/kanban/KanbanHeaderCard";
import { useGetView } from "@/queries/view";
import KanbanSkeleton from "@/components/skeletons/KanbanSkeleton";
import FieldEditorPopover from "../workspace/ColumnAddPopover";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { DragDropContext } from "@hello-pangea/dnd";
import { queryClient } from "@/queries/client";

const DynamicKanbanBoard: React.FC = () => {
  const { id, tableId, viewId } = useParams();
  const { id: spaceId } = useParams();
  const { data: tableData, isLoading: isTableLoading } = useGetTable(
    spaceId ?? "",
    tableId ?? ""
  );
  const [columns, setColumns] = useState<any[]>([]);
  const { mutate: updateRow } = useUpdateTableRow();
  const [data, setData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tables, isLoading: isTablesLoading } = useGetAllTable(id ?? "");
  const {
    data: tableRecord,
    refetch: getTableRecord,
    isLoading: isRecordsLoading,
  } = useSearchTableRecord(spaceId ?? "", tableId ?? "", "");
  const { data: viewData, isLoading: isViewLoading } = useGetView(
    spaceId ?? "",
    tableId ?? "",
    viewId ?? ""
  );

  useEffect(() => {
    getTableRecord();
  }, [tableId, spaceId, getTableRecord]);

  useEffect(() => {
    if (tableRecord) {
      const data: any = tableRecord;
      setData(data.data);
    }
  }, [tableRecord]);

  const [items, setItems] = useState<any[]>(data);
  const [groupByField, setGroupByField] = useState<string>("Status");
  const [column, setColumn] = useState<any>([]);
  const [editingRow, setEditingRow] = useState<any>(null);
  // const [editingColumn, setEditingColumn] = useState<string | null>(null);

  const [displayFields, setDisplayFields] = useState<string[]>(() => {
    const saved = localStorage.getItem(`kanbanDisplayFields-${tableId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const availableFields = columns
    .map((col) => ({
      id: col.id,
      label: col.label || col.name,
    }))
    .filter((field) => !["id", "hash", "createdAt"].includes(field.id));

  const [groups, setGroup] = useState<any>([]);

  useEffect(() => {
    if (groupByField) {
      const column = columns.find((ele) => ele.id === groupByField);
      setColumn(column);
      const columnOptions =
        column?.fieldtype === "select"
          ? ["Uncategorized", ...(column?.options ?? [])]
          : column?.options ?? [];
      setGroup(columnOptions);
    }
  }, [columns, groupByField]);

  useEffect(() => {
    const updatedItems = (data ?? []).map((item: any) => {
      const column = columns.find((col) => col.id === groupByField);
      return {
        ...item,
        groupBy: column?.id || groupByField,
        [column?.id || groupByField]:
          item[column?.id || groupByField] || "Uncategorized",
      };
    });
    setItems(updatedItems);
  }, [data, groupByField, columns]);

  useEffect(() => {
    if (tableData) setColumns(getColumnsForActiveTable());
  }, [tableId, tableData, setColumns]);

  const [isViewSidebarOpen, setIsViewSidebarOpen] = useState(true);

  useEffect(() => {
    if (viewData && viewData.stackbycolumn) {
      setGroupByField(viewData.stackbycolumn);
    }
  }, [viewData]);

  useEffect(() => {
    if (columns.length > 0 && displayFields.length === 0) {
      const defaultFields = [
        "name",
        ...availableFields
          .filter((f) => f.id !== groupByField)
          .slice(0, 2)
          .map((f) => f.id),
      ];
      const validFields = defaultFields.filter((f) =>
        columns.some((c) => c.id === f || c.key === f)
      );
      setDisplayFields(validFields);
    }
  }, [columns, groupByField, availableFields, displayFields]);

  useEffect(() => {
    localStorage.setItem(
      `kanbanDisplayFields-${tableId}`,
      JSON.stringify(displayFields)
    );
  }, [displayFields, tableId]);

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

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const previousItems = [...items];

    const draggedItem = items.find((item) => item.id === draggableId);
    if (!draggedItem) return;

    const newGroupValue = destination.droppableId;

    const updatedItems = items.map((item) => {
      if (item.id === draggableId) {
        const column = columns.find((col) => col.id === groupByField);
        const fieldKey = column?.id || groupByField;
        const updatedValue =
          newGroupValue === "Uncategorized" ? null : newGroupValue;
        return {
          ...item,
          [fieldKey]: updatedValue,
        };
      }
      return item;
    });

    setItems(updatedItems);
    setData(updatedItems);

    const targetItem = updatedItems.find((item) => item.id === draggableId);
    if (!targetItem) return;

    const cleanRowData = cleanBaseFields(targetItem);

    updateRow(
      {
        tableId: tableId ?? "",
        spaceId: spaceId ?? "",
        rowId: draggableId,
        rowData: cleanRowData,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries("getTable");
          queryClient.invalidateQueries("getAllTable");
        },
        onError(error) {
          void error;
          setItems(previousItems);
        },
      }
    );
  };

  const toggleDisplayField = (field: string) => {
    setDisplayFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const getColumnsForActiveTable = () => {
    return tableData
      ? tableData?.columns.map((column: any) => ({
          key: column.name,
          isRequired: column.isrequired,
          fieldtype: column.fieldType,
          id: column.id,
          datatype: column.datatype,
          label: column.name,
          sortable: true,
          default: column.default,
          tableid: column.tableid,
          options: column.enum,
        }))
      : [];
  };

  const handleEdit = (row: any) => {
    setEditingRow({ ...row });
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;

    const searchLower = searchQuery.toLowerCase();
    return items.filter((item: any) => {
      // Search in all displayed fields
      return (
        displayFields.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchLower);
        }) ||
        // Also search in name field if it exists
        (item.name && item.name.toLowerCase().includes(searchLower))
      );
    });
  }, [items, searchQuery, displayFields]);

  const isLoading =
    isTableLoading || isTablesLoading || isRecordsLoading || isViewLoading;

  if (isLoading) {
    return (
      <div className="h-full w-full bg-white darkk:bg-gray-900 text-gray-900 darkk:text-white">
        <CustomHelmet
          title="AutoCRUD"
          description="Automate your tasks, hassle-free"
          keywords="AutoCRUD, Automate, tasks, activity"
        />
        <main className="mx-auto">
          <HeaderTabs tableData={[]} isFlow={false} />
          <KanbanSkeleton isViewSidebarOpen={isViewSidebarOpen} />
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full bg-white darkk:bg-gray-900 text-gray-900 darkk:text-white">
        <CustomHelmet
          title="AutoCRUD"
          description="Automate your tasks, hassle-free"
          keywords="AutoCRUD, Automate, tasks, activity"
        />
        <main className="mx-auto">
          <KanbanHeaderCard
            groupByField={groupByField}
            setGroupByField={setGroupByField}
            columns={columns}
            availableFields={availableFields}
            displayFields={displayFields}
            toggleDisplayField={toggleDisplayField}
            setIsViewSidebarOpen={setIsViewSidebarOpen}
            onSearch={setSearchQuery}
          />
          <div className="flex flex-1 overflow-hidden h-[calc(100vh-170px)]">
            {/* Sidebar */}
            <TableSidebar
              isOpen={isViewSidebarOpen}
              spaceId={spaceId ?? ""}
              tableId={tableId}
            />
            {/* Main Table */}
            <div
              className={cn(
                "flex-1 overflow-auto transition-all duration-300 ease-in-out",
                isViewSidebarOpen ? "ml-[250px]" : "ml-0"
              )}
            >
              {groups.length === 0 ? (
                <div className="p-4">
                  <div className="flex flex-col items-center justify-center text-center p-8">
                    <div className="text-gray-400 mb-3">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No group type selected
                    </h3>
                    <p className="text-gray-500">
                      Please select a grouping option from above to organize
                      your items
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 overflow-x-auto p-4 bg-gray-100 h-full">
                      {groups.map((group: any, index: number) => {
                        const isUncategorized = group === "Uncategorized";
                        const groupItems = filteredItems.filter((item) =>
                          isUncategorized
                            ? !item[groupByField] ||
                              item[groupByField] === "Uncategorized"
                            : item[groupByField] === group
                        );
                        return (
                          <StatusColumn
                            key={group}
                            id={group}
                            title={isUncategorized ? "Uncategorized" : group}
                            items={groupItems}
                            displayFields={displayFields}
                            colorClass={
                              colorPalette[index % colorPalette.length].bg
                            }
                            isUncategorized={isUncategorized}
                            columns={columns}
                            spaceId={spaceId ?? ""}
                            tableId={tableId ?? ""}
                            // onSave={handleSave}
                            handleEdit={handleEdit}
                            editingRow={editingRow}
                            groupByField={groupByField}
                          />
                        );
                      })}
                      <FieldEditorPopover
                        kanban={true}
                        tableId={column.tableid}
                        spaceId={spaceId ?? ""}
                        onSave={() => {}}
                        columnId={column.id}
                        trigger={
                          <Button
                            variant="outline"
                            className="flex gap-2 w-full border-none justify-start"
                          >
                            <Edit className="h-4 w-4" /> <span>Edit</span>
                          </Button>
                        }
                        initialData={{
                          tableId: column.tableid,
                          spaceId: spaceId ?? "",
                          headerName: column.label,
                          fieldType: column.fieldtype,
                          defaultValue: column.default,
                          hasDefaultValue: column.isRequired,
                          options: column.options,
                        }}
                      />
                    </div>
                  </DragDropContext>
                </>
              )}
            </div>
          </div>
          <HeaderTabs tableData={tables} isFlow={false} />

        </main>
      </div>
    </>
  );
};

export default DynamicKanbanBoard;
