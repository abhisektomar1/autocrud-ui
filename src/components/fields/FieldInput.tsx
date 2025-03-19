import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { FieldInputProps, isMapValue, MapValue, toInputValue } from "./FieldTypes";



export const FieldInput: React.FC<FieldInputProps> = ({
  column,
  value,
  onChange,
  error,
  placeholder,
  className,
  onSave,
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && onSave) {
      e.preventDefault();
      onSave();
    }
    if (e.key === "Escape" && onCancel) {
      e.preventDefault();
      onCancel();
    }
  };

  // Checkbox
  if (column.fieldType === "checkbox") {
    return (
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onSave}
          className="h-5 w-5 rounded-md border-gray-300"
        />
      </div>
    );
  }

  // Select
  if (column.fieldType === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(e) => {
          const selectedValue = e.target.value;
          onChange(selectedValue);
        }}
        onBlur={() => {
          // When the select loses focus, trigger the save with the latest value
          if (onSave) {
            onSave();
          }
        }}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          error && "border-red-500",
          className
        )}
      >
        <option value="">Select...</option>
        {column.options?.map((option, index) => (
          <option
            key={`${option}-${index}`}
            value={option}
            className={cn("rounded-none", `select-option-${(index % 5) + 1}`)}
          >
            {option}
          </option>
        ))}
      </select>
    );
  }

  // Radio
  if (column.fieldType === "radio") {
    return (
      <div className="flex flex-col gap-2">
        {column.options?.map((option, index) => (
          <div key={`${option}-${index}`} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${column.id}-${option}-${index}`}
              name={column.id}
              value={option}
              checked={String(value) === option}
              onChange={(e) => {
                const selectedValue = e.target.value;
                console.log("Selected radio value:", selectedValue); // Debug log
                onChange(selectedValue);
                
                // Trigger save after a short delay to ensure state is updated
                if (onSave) {
                  setTimeout(() => {
                    onSave();
                  }, 100);
                }
              }}
              className="h-4 w-4 border-gray-300"
            />
            <label htmlFor={`${column.id}-${option}-${index}`} className="text-sm">
              {option}
            </label>
          </div>
        ))}
      </div>
    );
  }

  // Multiselect
  if (column.fieldType === "multiselect") {
    return (
      <select
        multiple
        value={Array.isArray(value) ? value : [String(value ?? "")]}
        onChange={(e) => {
          const selectedValues = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          console.log("Selected multiselect values:", selectedValues); // Debug log
          onChange(selectedValues);
        }}
        onBlur={() => {
          // When the select loses focus, trigger the save with the latest value
          if (onSave) {
            onSave();
          }
        }}
        className={cn(
          "flex h-auto min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          error && "border-red-500",
          className
        )}
      >
        {column.options?.map((option, index) => (
          <option
            key={`${option}-${index}`}
            value={option}
            className={cn(
              "rounded-none py-1",
              `select-option-${(index % 5) + 1}`
            )}
          >
            {option}
          </option>
        ))}
      </select>
    );
  }

  // Textarea
  if (column.fieldType === "textarea") {
    return (
      <Textarea
        value={toInputValue(value) || ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onSave}
        className="min-h-[100px] w-full"
        placeholder={placeholder || "Enter text..."}
      />
    );
  }

  // Date & Time Types
  if (column.fieldType === "date" || column.fieldType === "datetime") {
    return (
      <Input
        type="datetime-local"
        value={toInputValue(value) || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        className="w-full"
      />
    );
  }

  if (column.fieldType === "time") {
    return (
      <Input
        type="time"
        value={toInputValue(value) || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        className="w-full"
      />
    );
  }

  if (column.fieldType === "year") {
    return (
      <Input
        type="number"
        min="1900"
        max="2100"
        step="1"
        value={toInputValue(value) || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        className="w-full"
        placeholder="YYYY"
      />
    );
  }

  if (column.fieldType === "duration") {
    return (
      <Input
        type="text"
        pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
        value={toInputValue(value) || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        className="w-full"
        placeholder="HH:MM:SS"
      />
    );
  }

  // Number Types
  if (column.fieldType === "decimal" || column.fieldType === "float") {
    return (
      <Input
        type="number"
        step="0.01"
        value={toInputValue(value) || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        onKeyDown={handleKeyDown}
        className="w-full"
        placeholder="0.00"
      />
    );
  }

  if (column.fieldType === "currency") {
    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
        <Input
          type="number"
          step="0.01"
          value={toInputValue(value) || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onSave}
          className="pl-7 w-full"
          placeholder="0.00"
        />
      </div>
    );
  }

  if (column.fieldType === "percentage") {
    return (
      <div className="relative">
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={toInputValue(value) || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onSave}
          className="pr-7 w-full"
          placeholder="0"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
      </div>
    );
  }

  if (column.fieldType === "rating") {
    return (
      <Input
        type="number"
        min="0"
        max="5"
        step="0.5"
        value={toInputValue(value) || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        className="w-full"
        placeholder="0-5"
      />
    );
  }

  // Contact Types
  if (["email", "phonenumber", "url", "link"].includes(column.fieldType)) {
    const inputType =
      column.fieldType === "email"
        ? "email"
        : column.fieldType === "phonenumber"
        ? "tel"
        : "url";
    return (
      <Input
        type={inputType}
        value={toInputValue(value) || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        onKeyDown={handleKeyDown}
        className="w-full"
        placeholder={placeholder}
      />
    );
  }

  // File
  if (column.fieldType === "file") {
    return (
      <Input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onChange(file);
            onSave?.();
          }
        }}
        className="w-full"
        accept="*/*"
      />
    );
  }

  // Map
  if (column.fieldType === "map") {
    const coordinates = isMapValue(value) ? value : { lat: 0, lng: 0 };
    return (
      <div className="flex gap-2">
        <Input
          type="number"
          step="0.000001"
          placeholder="Latitude"
          value={coordinates.lat}
          onChange={(e) => {
            const newValue: MapValue = {
              ...coordinates,
              lat: Number(e.target.value),
            };
            onChange(newValue);
          }}
          className="w-1/2"
        />
        <Input
          type="number"
          step="0.000001"
          placeholder="Longitude"
          value={coordinates.lng}
          onChange={(e) => {
            const newValue: MapValue = {
              ...coordinates,
              lng: Number(e.target.value),
            };
            onChange(newValue);
          }}
          className="w-1/2"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            // TODO: Open map picker
          }}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Default text input
  return (
    <Input
      ref={inputRef}
      type={column.fieldType === "number" ? "number" : "text"}
      value={toInputValue(value) || ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onSave}
      onKeyDown={handleKeyDown}
      className={cn(
        "modern-input w-full",
        error && "border-red-500",
        className
      )}
      placeholder={placeholder || `Enter ${column.fieldType || "text"}...`}
    />
  );
};
