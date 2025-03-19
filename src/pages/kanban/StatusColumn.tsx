import type React from "react";
import type { StatusColumnProps } from "./KanbanTypes";
import { KanbanItem } from "./KanbanItem";
import { Copy, Plus, Trash } from "lucide-react";
import EditDialog from "../workspace/EditDialog";
import { useEffect, useRef, useState } from "react";
import { useCreateRecord, useDeleteTableRow } from "@/queries/table";
import { toast } from "react-toastify";
import { queryClient } from "@/queries/client";
import { TableData } from "@/types/table";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface NewRow {
  [key: string]: string | number | boolean | undefined;
}

export const StatusColumn: React.FC<StatusColumnProps> = ({
  id,
  title,
  items = [],
  displayFields,
  columns = [],
  spaceId,
  tableId,
  // onSave,
  handleEdit,
  editingRow,
  // groupByField,
}) => {
  const { mutate: createRow } = useCreateRecord();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRow, setNewRow] = useState<NewRow>({});
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const groupByColumn = columns.find((col) => col.fieldType === "select")?.id;

  const handleCreateNewCard = () => {
    const initialRow: NewRow = {};

    if (groupByColumn) {
      initialRow[groupByColumn] = title;
    }

    setNewRow(initialRow);
    setIsCreateOpen(true);
  };

  const handleNewRowInputChange = (
    key: string,
    value: string | number | boolean
  ) => {
    setNewRow((prev) => {
      const updated = { ...prev, [key]: value };

      if (groupByColumn && key !== groupByColumn) {
        updated[groupByColumn] = title;
      }

      return updated;
    });
  };

  const handleRightClick = (e: React.MouseEvent, item: TableData) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
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

  const handleCopyItem = (itemToCopy = selectedItem) => {
    if (!itemToCopy) return;

    const cleanRowData = cleanBaseFields(itemToCopy);

    createRow(
      {
        tableId: tableId ?? "",
        spaceId: spaceId ?? "",
        rowData: cleanRowData,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries("getTableRow");
          toast.success("Item copied successfully");
          setShowContextMenu(false);
        },
        onError() {
          toast.error("Failed to copy item");
          setShowContextMenu(false);
        },
      }
    );
  };

  const { mutate: deleteTableRow } = useDeleteTableRow();
  const handleDelete = (itemToDelete: TableData) => {
    if (!itemToDelete || !itemToDelete.id) {
      toast.error("Invalid item selected for deletion");
      return;
    }

    const rowId = itemToDelete.id.toString();

    deleteTableRow(
      {
        spaceId: spaceId ?? "",
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
          setShowContextMenu(false);
        },
        onError(error) {
          toast.error(`Failed to delete: ${error}`);
          setShowContextMenu(false);
        },
      }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`flex-shrink-0 flex flex-col w-[280px] h-full transition-colors duration-200 rounded-md bg-white 
        // isOver ? "bg-opacity-50" : ""
      `}
    >
      <div className="px-3 py-2.5 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-medium text-black">{title}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-200/80 text-black">
            {items.length}
          </span>
        </div>
        <button
          className="h-6 w-6 rounded-full hover:bg-gray-200/80 inline-flex items-center justify-center"
          onClick={handleCreateNewCard}
        >
          <Plus className="h-4 w-4 text-black" />
        </button>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={cn(
              "px-2 p-2 h-full overflow-y-auto scrollbar-thin",
              snapshot.isDraggingOver ? "bg-secondary/20" : ""
            )}
            {...provided.droppableProps}
          >
            {items.length === 0 ? (
              <div
                className={cn(
                  "flex h-full items-center justify-center rounded-md border border-gray-200 border-dashed p-4 text-center text-sm text-muted-foreground",
                  snapshot.isDraggingOver ? "hidden" : ""
                )}
              >
                Drop items here
                {provided.placeholder}
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => {
                  return (
                    <Draggable
                      draggableId={item.id}
                      key={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          className={cn(
                            "relative",
                            snapshot.isDragging ? "opacity-70" : ""
                          )}
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditOpen(true);
                            handleEdit(item);
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onContextMenu={(e) => handleRightClick(e, item)}
                        >
                          <KanbanItem
                            key={item.id}
                            item={item}
                            displayFields={displayFields}
                            columns={columns}
                            onClick={() => {
                              setSelectedItem(item);
                              setIsEditOpen(true);
                              handleEdit(item);
                            }}
                          />
                          {showContextMenu && selectedItem && (
                            <div
                              ref={contextMenuRef}
                              style={{
                                position: "fixed",
                                top: `${contextMenuPosition.y}px`,
                                left: `${contextMenuPosition.x}px`,
                                zIndex: 50,
                              }}
                              className="bg-white rounded-sm shadow-md border border-gray-200 py-1 min-w-[180px] p-2"
                            >
                              <button
                                className="w-full text-left px-3 py-2 text-xs  flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyItem();
                                }}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate record
                              </button>
                              <button
                                className="w-full text-left px-3 py-2 text-xs text-red-600 flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(selectedItem);
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete record
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Droppable>
      {editingRow && (
        <EditDialog
          isKanban={true}
          spaceId={spaceId}
          tableId={tableId}
          columns={columns}
          row={editingRow}
          onEdit={handleEdit}
          editingRow={editingRow}
          onClickEdit={handleEdit}
          onDelete={() => {
            handleDelete(selectedItem || editingRow);
          }}
          onClone={() => handleCopyItem(selectedItem || editingRow)}
          open={isEditOpen}
          setOpen={setIsEditOpen}
        />
      )}
      <EditDialog
        isKanban={true}
        isCreate={true}
        spaceId={spaceId}
        tableId={tableId}
        columns={columns}
        row={newRow}
        onEdit={handleNewRowInputChange}
        onClickEdit={() => {}}
        editingRow={newRow}
        onDelete={() => handleDelete(selectedItem)}
        onClone={() => handleCopyItem(editingRow)}
        open={isCreateOpen}
        setOpen={setIsCreateOpen}
        autoCreate={false}
      />
    </div>
  );
};
