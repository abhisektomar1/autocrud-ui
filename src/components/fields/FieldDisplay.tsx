import React from "react";
import { cn } from "@/lib/utils";
import { validateFieldValue } from "./FieldValidation";
import { CheckIcon, XIcon, Star, FileText, Map, Link as LinkIcon } from "lucide-react";
import { FieldDisplayProps, formatFieldValue, isMapValue } from "./FieldTypes";

export const FieldDisplay: React.FC<FieldDisplayProps> = ({
  column,
  value,
  className
}) => {
  const displayValue = formatFieldValue(value);
  const isValid = validateFieldValue(value, column.fieldType);

  // Checkbox
  if (column.fieldType === "checkbox") {
    return (
      <div className="flex justify-center">
        {value ? (
          <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
            <CheckIcon className="h-3.5 w-3.5 text-primary" />
          </div>
        ) : (
          <div className="h-5 w-5 rounded-md bg-gray-100 flex items-center justify-center">
            <XIcon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        )}
      </div>
    );
  }

  // Select/Radio
  if (column.fieldType === "select" || column.fieldType === "radio") {
    return (
      <div className="flex items-center">
        <span className={cn(
          "select-option-label",
          `select-option-${((column.options?.indexOf(displayValue) ?? 0) % 5) + 1}`
        )}>
          {displayValue || "Not selected"}
        </span>
      </div>
    );
  }

  // Multiselect
  if (column.fieldType === "multiselect") {
    const values = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-wrap gap-1">
        {values.length > 0 ? values.map((val, index) => (
          <span key={index} className={cn(
            "px-2 py-0.5 rounded-full text-xs",
            `select-option-${(index % 5) + 1}`
          )}>
            {String(val)}
          </span>
        )) : "Not selected"}
      </div>
    );
  }

  // URL/Link
  if (column.fieldType === "url" || column.fieldType === "link") {
    return (
      <div className="flex items-center gap-1.5">
        <LinkIcon className="h-3.5 w-3.5 text-blue-500" />
        <a 
          href={displayValue} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline truncate"
          onClick={(e) => e.stopPropagation()}
        >
          {displayValue}
        </a>
      </div>
    );
  }

  // Rating
  if (column.fieldType === "rating") {
    const rating = Number(value) || 0;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={cn(
              "h-4 w-4",
              index < rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  }

  // File
  if (column.fieldType === "file") {
    return (
      <div className="flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5 text-blue-500" />
        <span className="truncate">{displayValue}</span>
      </div>
    );
  }

  // Map
  if (column.fieldType === "map") {
    return (
      <div className="flex items-center gap-1.5">
        <Map className="h-3.5 w-3.5 text-emerald-500" />
        <span className="truncate">
          {isMapValue(value) 
            ? formatFieldValue(value)
            : "No location"}
        </span>
      </div>
    );
  }

  // Textarea
  if (column.fieldType === "textarea") {
    return (
      <div className="max-h-[100px] overflow-y-auto whitespace-pre-wrap">
        {displayValue}
      </div>
    );
  }

  // Percentage
  if (column.fieldType === "percentage") {
    return <span>{displayValue}%</span>;
  }

  // Currency
  if (column.fieldType === "currency") {
    const numValue = Number(value) || 0;
    return <span>${numValue.toFixed(2)}</span>;
  }

  // Default display
  return (
    <span className={cn(
      "truncate block",
      !isValid && "text-red-500",
      className
    )}>
      {displayValue}
    </span>
  );
}; 