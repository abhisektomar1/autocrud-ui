import type React from "react";
import { Card } from "@/components/ui/card";
import type { KanbanItemProps } from "./KanbanTypes";
import { cn } from "@/lib/utils";

export const KanbanItem: React.FC<KanbanItemProps> = ({
  item,
  displayFields,
  columns,
  onClick,
}) => {
  const hasNameField = displayFields.some((fieldId) => {
    const col = columns.find((c) => c.id === fieldId || c.key === fieldId);
    return col && (col.id === "name" || col.key === "name");
  });

  // Check if there's a name field with a value in the item
  const nameColumn = columns.find(
    (col) => col.id === "name" || col.key === "name"
  );
  const hasNameValue =
    nameColumn && (item[nameColumn.id] || item[nameColumn.key]);

  let nameRendered = false;

  return (
    <div
      // ref={drag}
      className={`cursor-grab hover:cursor-pointer transition-all  rounded-none duration-200`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(item);
      }}
    >
      <Card className="w-full bg-white shadow-none hover:shadow-md transition-shadow duration-200 border-gray-200 rounded-md">
        <div className="p-2.5">
          <div className="flex items-start gap-2">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="space-y-1">
                {(!hasNameField || !hasNameValue) && (
                  <div className="text-md font-medium text-gray-600 truncate mb-1">
                    Unnamed record
                  </div>
                )}
                {displayFields.map((fieldId) => {
                  const column =
                    columns.find((col) => col.id === fieldId) ||
                    columns.find((col) => col.key === fieldId);

                  if (!column) return null;

                  const value = item[column.id] || item[column.key];

                  const isGroupField =
                    column.id === item.groupBy || column.key === item.groupBy;

                  // Explicitly check if this is the name field being used as group
                  const isNameFieldGroup =
                    (column.id === "name" || column.key === "name") &&
                    item.groupBy === "name";

                  if (isGroupField || isNameFieldGroup || !value) return null;

                  const isNameField =
                    column.id === "name" || column.key === "name";

                  if (isNameField && nameRendered) return null;

                  if (isNameField) {
                    nameRendered = true;
                    return (
                      <div
                        key={column.id}
                        className="text-md font-medium text-black truncate"
                      >
                        {value?.toString()}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={column.id}
                      className="flex items-center gap-6 py-1"
                    >
                      <span className="text-[13px] text-gray-600 basis-2/5">
                        {column.label} :
                      </span>
                      {column.fieldtype === "select" ? (
                        <span className={cn(" basis-3/5 p-0")}>
                          <span className="text-[13px] truncate  px-2 py-0.5 rounded-md  w-fit bg-accent-foreground/5 ">
                            {value?.toString() || "Not selected"}
                          </span>
                        </span>
                      ) : column.fieldtype === "checkbox" ? (
                        <span className="text-[13px] truncate basis-3/5 ">
                          {value ? "✓ Yes" : "✗ No"}
                        </span>
                      ) : (
                        <span className="text-[13px] text-black truncate basis-3/5">
                          {value?.toString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
