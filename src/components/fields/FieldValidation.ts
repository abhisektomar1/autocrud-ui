import * as yup from "yup";
import type { FieldType, TableColumn } from "@/types/table";

// Validation schema for each field type
export const getFieldValidator = (column: TableColumn) => {
  if (!column) return yup.mixed();

  switch (column.fieldType) {
    case "checkbox":
      return column.isRequired ? yup.boolean().required() : yup.boolean();

    case "number": {
      const validator = yup
        .number()
        .typeError("Must be a valid number")
        .transform((value) => (isNaN(value) ? undefined : value));
      return column.isRequired
        ? validator.required("Number is required")
        : validator;
    }

    case "float":
    case "decimal": {
      const validator = yup
        .number()
        .typeError("Must be a valid decimal number")
        .test(
          "is-float",
          "Must be a decimal number",
          (value) =>
            value === undefined ||
            value === null ||
            value.toString().includes(".")
        );
      return column.isRequired
        ? validator.required("Decimal number is required")
        : validator;
    }

    case "email": {
      const validator = yup
        .string()
        .email("Must be a valid email address")
        .max(255, "Email is too long");
      return column.isRequired
        ? validator.required("Email is required")
        : validator;
    }

    case "url":
    case "link": {
      const validator = yup
        .string()
        .test(
          'is-any-link',
          'Must be a valid link or URL',
          (value) => !value || Boolean(value.match(/^(https?:\/\/|\/\/|\/|mailto:|tel:|file:|[a-zA-Z0-9-]+:).+/))
        )
        .max(2048, "URL is too long");
      return column.isRequired
        ? validator.required("URL is required")
        : validator;
    }

    case "select":
    case "radio": {
      let validator = yup.string();
      if (column.options) {
        validator = validator.oneOf(
          column.options,
          `Must be one of: ${column.options.join(", ")}`
        );
      }
      return column.isRequired
        ? validator.required("Selection is required")
        : validator;
    }

    case "multiselect": {
      let validator = yup.array().of(yup.string());
      if (column.options) {
        validator = validator.test(
          "valid-options",
          "Invalid options selected",
          (value) => !value || value.every((v) => column.options && column.options.includes(v || ""))
        );
      }
      return column.isRequired
        ? validator.required("Selection is required").min(1, "Select at least one option")
        : validator;
    }

    case "textarea": {
      const validator = yup.string().max(65535, "Text is too long");
      return column.isRequired
        ? validator.required("Text is required")
        : validator;
    }

    case "date":
    case "datetime": {
      const validator = yup.date().typeError("Must be a valid date");
      return column.isRequired
        ? validator.required("Date is required")
        : validator;
    }

    case "time": {
      const validator = yup
        .string()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be a valid time (HH:MM)");
      return column.isRequired
        ? validator.required("Time is required")
        : validator;
    }

    case "year": {
      const validator = yup
        .number()
        .integer()
        .min(1900, "Year must be 1900 or later")
        .max(2100, "Year must be 2100 or earlier");
      return column.isRequired
        ? validator.required("Year is required")
        : validator;
    }

    case "duration": {
      const validator = yup
        .string()
        .matches(
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
          "Must be a valid duration (HH:MM:SS)"
        );
      return column.isRequired
        ? validator.required("Duration is required")
        : validator;
    }

    case "percentage": {
      const validator = yup
        .number()
        .min(0, "Percentage must be between 0 and 100")
        .max(100, "Percentage must be between 0 and 100");
      return column.isRequired
        ? validator.required("Percentage is required")
        : validator;
    }

    case "rating": {
      const validator = yup
        .number()
        .min(0, "Rating must be between 0 and 5")
        .max(5, "Rating must be between 0 and 5")
        .test(
          "valid-step",
          "Rating must be in steps of 0.5",
          (value) => !value || value % 0.5 === 0
        );
      return column.isRequired
        ? validator.required("Rating is required")
        : validator;
    }

    case "currency": {
      const validator = yup
        .number()
        .typeError("Must be a valid amount")
        .test(
          "two-decimals",
          "Amount can't have more than 2 decimal places",
          (value) => !value || value.toString().split(".")[1]?.length <= 2
        );
      return column.isRequired
        ? validator.required("Amount is required")
        : validator;
    }

    case "file": {
      const validator = yup.mixed();
      return column.isRequired
        ? validator.required("File is required")
        : validator;
    }

    case "map": {
      const validator = yup.object().shape({
        lat: yup.number().required("Latitude is required"),
        lng: yup.number().required("Longitude is required"),
      });
      return column.isRequired ? validator.required() : validator;
    }

    default: {
      const validator = yup.string().max(255, "Text is too long");
      return column.isRequired
        ? validator.required("This field is required")
        : validator;
    }
  }
};
// Simple value validation without schema
export const validateFieldValue = (value: unknown, fieldtype: FieldType): boolean => {
  if (value == null) return true;
  
  const strValue = String(value);
  switch (fieldtype) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue);
    case "float":
    case "decimal":
      return !isNaN(parseFloat(strValue)) && strValue.includes('.');
    case "number":
    case "currency":
      return !isNaN(Number(strValue));
    case "percentage": {
      const num = Number(strValue);
      return !isNaN(num) && num >= 0 && num <= 100;
    }
    case "rating": {
      const rating = Number(strValue);
      return !isNaN(rating) && rating >= 0 && rating <= 5;
    }
    case "phonenumber":
      return /^\d{5,14}$/.test(strValue);
    case "year": {
      const year = Number(strValue);
      return !isNaN(year) && year >= 1900 && year <= 2100;
    }
    case "time":
      return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(strValue);
    case "duration":
      return /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(strValue);
    case "date":
    case "datetime":
      return !isNaN(Date.parse(strValue));
    case "multiselect":
      return Array.isArray(value) && value.every(v => typeof v === 'string');
    case "select":
    case "radio":
      return typeof value === 'string';
    case "checkbox":
      return typeof value === 'boolean';
    case "file":
      return value instanceof File;
    case "map":
      try {
        if (typeof value !== 'object' || !value) return false;
        return typeof (value as {lat?: unknown, lng?: unknown}).lat === 'number' && 
               typeof (value as {lat?: unknown, lng?: unknown}).lng === 'number';
      } catch {
        return false;
      }
    default:
      return true;
  }
}; 