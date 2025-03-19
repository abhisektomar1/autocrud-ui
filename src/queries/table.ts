/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "react-query";
import { TableModel } from "@/types/table";
import { logEvent } from "@/component/analytics";
import {
  createColumnMetaTable,
  createRecord,
  createTable,
  deleteMetaColumnTable,
  deleteTable,
  deleteTableRow,
  getAllTable,
  getTable,
  getTableManageFilters,
  importTableData,
  searchTableRecord,
  updateMetaColumnTable,
  updateMetaColumnTablePatch,
  updateTableRow,
} from "@/api/table/meta";
import { FieldInputData } from "@/pages/workspace/ColumnAddPopover";

// Assuming you have a function to handle event tracking
export const handleEventForTracking = (event: {
  eventName: string;
  success: boolean;
  eventType: string;
}) => {
  const action = event.eventType + event.success ? "-success" : "-failed";
  logEvent({ category: event.eventType, action: action });
};

// // Meta - Table
export function useCreateTable() {
  return useMutation({
    mutationKey: "createTable",
    mutationFn: createTable,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "createTable",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "createTable",
        success: false,
        eventType: "API",
      }),
  });
}

// export function useAddColumnToTable(): UseMutationResult<
//   ColumnModel,
//   Error,
//   { tableId: string; columnDetails: ColumnModel }
// > {
//   return useMutation({
//     mutationKey: "addColumnToTable",
//     mutationFn: ({ tableId, columnDetails }) =>
//       addColumnToTable(tableId, columnDetails),
//     onSuccess: () =>
//       handleEventForTracking({
//         eventName: "addColumnToTable",
//         success: true,
//         eventType: "API",
//       }),
//     onError: () =>
//       handleEventForTracking({
//         eventName: "addColumnToTable",
//         success: false,
//         eventType: "API",
//       }),
//   });
// }

// // Table Operations
// export function useGetTableRow<T>(
//   spaceId: string,
//   tableId: string,
//   rowId: string
// ): UseQueryResult<T, Error> {
//   return useQuery({
//     queryKey: ["getTableRow", spaceId, tableId, rowId],
//     queryFn: () => getTableRow<T>(spaceId, tableId, rowId),
//   });
// }

export function useCreateRecord<T>(): UseMutationResult<
  T,
  Error,
  { spaceId: string; tableId: string; rowData: T }
> {
  return useMutation({
    mutationKey: "create-record",
    mutationFn: ({ spaceId, tableId, rowData }) =>
      createRecord<T>(spaceId, tableId, rowData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "create-record",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "create-record",
        success: false,
        eventType: "API",
      }),
  });
}

export function useUpdateTableRow<T>(): UseMutationResult<
  T,
  Error,
  { spaceId: string; tableId: string; rowId: string; rowData: T }
> {
  return useMutation({
    mutationKey: "updateTableRow",
    mutationFn: ({ spaceId, tableId, rowId, rowData }) =>
      updateTableRow<T>(spaceId, tableId, rowId, rowData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "updateTableRow",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "updateTableRow",
        success: false,
        eventType: "API",
      }),
  });
}

export function useDeleteTableRow(): UseMutationResult<
  void,
  Error,
  { spaceId: string; tableId: any; rowId: string }
> {
  return useMutation({
    mutationKey: "deleteTableRow",
    mutationFn: ({ spaceId, tableId, rowId }) =>
      deleteTableRow(spaceId, tableId, rowId),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "deleteTableRow",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "deleteTableRow",
        success: false,
        eventType: "API",
      }),
  });
}

export function useImportTableData(): UseMutationResult<
  any,
  Error,
  { spaceId: string; tableId: string; fileData: FormData }
> {
  return useMutation({
    mutationKey: "importTableData",
    mutationFn: ({ spaceId, tableId, fileData }) =>
      importTableData(spaceId, tableId, fileData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "importTableData",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "importTableData",
        success: false,
        eventType: "API",
      }),
  });
}

//data

export function useGetTable(
  spaceId: string,
  tableId: string
): UseQueryResult<TableModel, Error> {
  return useQuery({
    queryKey: ["getTable", spaceId, tableId],
    queryFn: () => getTable(spaceId, tableId),
    select(data: any) {
      return data.data;
    },
  });
}

export function useEditMetaColumnTable<T>(): UseMutationResult<
  T,
  Error,
  { spaceId: string; tableId: string; columnId: string; columnData: T }
> {
  return useMutation({
    mutationKey: "edit-meta-column-table",
    mutationFn: ({ spaceId, tableId, columnId, columnData }) =>
      updateMetaColumnTable<T>(spaceId, tableId, columnId, columnData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "edit-meta-column-table",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "edit-meta-column-table",
        success: false,
        eventType: "API",
      }),
  });
}

export function useEditMetaColumnTablePatch<T>(): UseMutationResult<
  T,
  Error,
  { spaceId: string; tableId: string; columnId: string; columnData: T }
> {
  return useMutation({
    mutationKey: "edit-meta-column-table-patch",
    mutationFn: ({ spaceId, tableId, columnId, columnData }) =>
      updateMetaColumnTablePatch<T>(spaceId, tableId, columnId, columnData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "edit-meta-column-table",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "edit-meta-column-table",
        success: false,
        eventType: "API",
      }),
  });
}

export function useDeleteMetaColumnTable() {
  return useMutation({
    mutationKey: "delete-meta-column-table",
    mutationFn: deleteMetaColumnTable,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "delete-meta-column-table",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "delete-meta-column-table",
        success: false,
        eventType: "API",
      }),
  });
}

export function useDeleteTable() {
  return useMutation({
    mutationKey: "delete-table",
    mutationFn: deleteTable,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "delete-table",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "delete-table",
        success: false,
        eventType: "API",
      }),
  });
}

export function useGetAllTable(
  spaceId: string
): UseQueryResult<TableModel[], Error> {
  return useQuery({
    queryKey: ["getAllTable", spaceId],
    queryFn: getAllTable,
    select(data: any) {
      return data.data;
    },
  });
}
export function useSearchTableRecord<T>(
  spaceId: string,
  tableId: string,
  query?: string | undefined
): UseQueryResult<T, Error> {
  return useQuery({
    queryKey: ["getTableRow", spaceId, tableId, query],
    queryFn: () => searchTableRecord<T>(spaceId, tableId, query),
    select(data: any) {
      return data.data;
    },
  });
}

export function useCreateColumnMetaTable(): UseMutationResult<
  any,
  Error,
  { tableData: FieldInputData }
> {
  return useMutation({
    mutationKey: "create-columns-meta-table",
    mutationFn: ({ tableData }) => createColumnMetaTable(tableData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "create-columns-meta-table",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "create-columns-meta-table",
        success: false,
        eventType: "API",
      }),
  });
}

export function useGetTableManageFiltersData<T>(
  spaceId: string,
  tableId: string
): UseQueryResult<T, Error> {
  return useQuery({
    queryKey: ["table-filters", spaceId, tableId],
    queryFn: () => getTableManageFilters<T>(spaceId, tableId),
    select(data: any) {
      return data.data;
    },
  });
}
