import api, { handleResponse } from "../../queries/api";
import { ColumnModel, TableCreateModel, TableModel } from "@/types/model";
import { FieldInputData } from "@/pages/workspace/ColumnAddPopover";
import { QueryFunctionContext } from "react-query";

// Meta - Table

export const getTable = (
  spaceId: string,
  tableId: string
): Promise<TableModel> =>
  api
    .get<TableModel>(`/api/${spaceId}/v0/meta/table/${tableId}`)
    .then(handleResponse);

export const deleteMetaColumnTable = ({
  spaceId,
  tableId,
  columnId,
}: {
  spaceId: string;
  tableId: any;
  columnId: string;
}): Promise<void> =>
  api
    .delete(`/api/${spaceId}/v0/meta/table/${tableId}/column/${columnId}`)
    .then(handleResponse);

export const updateMetaColumnTable = <T>(
  spaceId: string,
  tableId: string,
  columnId: string,
  columnData: T
): Promise<T> =>
  api
    .put<T>(
      `/api/${spaceId}/v0/meta/table/${tableId}/column/${columnId}`,
      columnData
    )
    .then(handleResponse);

    export const updateMetaColumnTablePatch = <T>(
      spaceId: string,
      tableId: string,
      columnId: string,
      columnData: T
    ): Promise<T> =>
  api
    .patch<T>(
      `/api/${spaceId}/v0/meta/table/${tableId}/column/${columnId}`,
      columnData
    )
        .then(handleResponse);

export const deleteTable = ({
  spaceId,
  tableId,
}: {
  spaceId: string;
  tableId: any;
}): Promise<void> =>
  api.delete(`/api/${spaceId}/v0/meta/table/${tableId}`).then(handleResponse);

export const getAllTable = (context: QueryFunctionContext): Promise<TableModel[]> =>
  api.get(`/api/${context.queryKey[1]}/v0/meta/table/search?take=10`).then(handleResponse);

export const addColumnToTable = (
  tableId: string,
  columnDetails: ColumnModel
): Promise<ColumnModel> =>
  api
    .post<ColumnModel>(`/api/v0/meta/table/${tableId}/column`, columnDetails)
    .then(handleResponse);

// Table Operations
export const getTableRow = <T>(
  spaceId: string,
  tableId: string,
  rowId: string
): Promise<T> =>
  api
    .get<T>(`/api/v0/table/${spaceId}/${tableId}/${rowId}`)
    .then(handleResponse);

export const searchTableRow = <T>(
  spaceId: string,
  tableId: string,
  rowId: string
): Promise<T> =>
  api
    .get<T>(`/api/v0/table/${spaceId}/${tableId}/${rowId}`)
    .then(handleResponse);

export const createRecord = <T>(
  spaceId: string,
  tableId: string,
  rowData: T
): Promise<T> =>
  api
    .post<T>(`/api/${spaceId}/v0/table/${tableId}`, rowData)
    .then(handleResponse);

export const updateTableRow = <T>(
  spaceId: string,
  tableId: string,
  rowId: string,
  rowData: T
): Promise<T> =>
  api
    .put<T>(`/api/${spaceId}/v0/table/${tableId}/${rowId}`, rowData)
    .then(handleResponse);

export const deleteTableRow = (
  spaceId: string,
  tableId: string,
  rowId: string
): Promise<void> =>
  api
    .delete(`/api/${spaceId}/v0/table/${tableId}/${rowId}`)
    .then(handleResponse);

export const importTableData = (
  spaceId: string,
  tableId: string,
  fileData: FormData
): Promise<any> =>
  api
    .post(`/api/v0/table/${spaceId}/${tableId}/upload`, fileData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(handleResponse);

//table data
// {{localhost}}/api/ENGKCLCVM1X1V1KA/v0/table/FS0KIW8FPW8ANRM4/search?limit=100&&offset=10
export const searchTableRecord = <T>(
  spaceId: string,
  tableId: string,
  query?: string | undefined
): Promise<T> => {
  const url = `/api/${spaceId}/v0/table/${tableId}/search${query ? `?query=${query}` : ""}${query ? "&" : "?"}take=100`;
  return api.get<T>(url).then(handleResponse);
};

export const updateTableRecord = <T>(
  spaceId: string,
  tableId: string,
  rowId: string,
  rowData: T
): Promise<T> =>
  api
    .put<T>(`/api/${spaceId}/v0/table/${tableId}/${rowId}`, rowData)
    .then(handleResponse);

export const createColumnMetaTable = (
  tableDetails: FieldInputData
): Promise<TableModel> =>
  api
    .post<TableModel>(
      `/api/${tableDetails?.spaceId}/v0/meta/table/${tableDetails?.tableId}/column`,
      tableDetails
    )
    .then(handleResponse);

// export const

// {{localhost}}/api//v0/meta/table
export const createTable = (tableDetails: TableCreateModel): Promise<any> =>
  api
    .post<TableCreateModel>(
      `/api/${tableDetails.space}/v0/meta/table`,
      tableDetails
    )
    .then(handleResponse);

export const getTableManageFilters = <T>(
  spaceId: string,
  tableId: string
): Promise<T> =>
  api
    .get<T>(`/api/${spaceId}/v0/meta/table/${tableId}/manage/filter`)
    .then(handleResponse);
