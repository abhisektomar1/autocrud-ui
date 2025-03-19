/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect } from "react";

export const AddRowComponent = ({
  columns,
  newRow,
  handleNewRowInputChange,
  handleAddRow,
  isLoading,
  preSelectedField,
  preSelectedValue,
}: any) => {
  useEffect(() => {
    if (preSelectedField) {
      handleNewRowInputChange(preSelectedField, preSelectedValue);
    }
  }, [preSelectedField, preSelectedValue]);

  return (
    <div className="grid gap-4 py-4">
      {columns.map((column: any) => (
        <div key={column.key} className="grid gap-2">
          <Label htmlFor={column.key}>{column.label}</Label>
          {column.fieldtype === "select" ? (
            <Select
              onValueChange={(value) =>
                handleNewRowInputChange(column.id, value)
              }
              value={newRow[column.id]?.toString() ?? column.default ?? ""}
            >
              <SelectTrigger id={column.key}>
                <SelectValue placeholder={`Select ${column.label}`} />
              </SelectTrigger>
              <SelectContent>
                {column.options?.map((option: any) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : column.fieldtype === "checkbox" ? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={column.id}
                checked={!!newRow[column.id]}
                onCheckedChange={(checked: boolean) =>
                  handleNewRowInputChange(column.id, checked)
                }
              />
              <label
                htmlFor={column.key}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Do you want to select this?
              </label>
            </div>
          ) : column.fieldtype === "radio" ? (
            <RadioGroup
              onValueChange={(value) =>
                handleNewRowInputChange(column.id, value)
              }
              value={newRow[column.id]?.toString() ?? column.default ?? ""}
            >
              {column.options?.map((option: any) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem
                    className="w-4 h-4 bg-white text-primary border-primary focus:ring-primary"
                    value={option}
                    id={`${column.id}-${option}`}
                  />
                  <Label htmlFor={`${column.key}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input
              id={column.id}
              type={column.fieldtype === "float" ? "number" : column.fieldtype}
              value={newRow[column.id]?.toString() || column.default || ""}
              onChange={(e) =>
                handleNewRowInputChange(
                  column.id,
                  column.fieldtype === "number" || column.fieldtype === "float"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
              placeholder={`Enter ${column.label}`}
            />
          )}
        </div>
      ))}
      <Button onClick={handleAddRow} className="mt-4" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add"}
      </Button>
    </div>
  );
};
