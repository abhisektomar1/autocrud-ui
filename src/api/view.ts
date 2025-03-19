import api, { handleResponse } from "@/queries/api";

export const getView = (
  spaceId: string,
  tableId: string,
  viewId: string
): Promise<any> =>
  api
    .get<any>(`/api/${spaceId}/v0/meta/table/${tableId}/view/${viewId}`)
    .then(handleResponse);

export const getAllView = (spaceId: string, tableId: string): Promise<any[]> =>
  api
    .get(`/api/${spaceId}/v0/meta/table/${tableId}/view/search?take=10`)
    .then(handleResponse);

export const createView = (view: any): Promise<any> =>
  api
    .post<any>(`/api/${view.space}/v0/meta/table/${view.tableId}/view`, {
      name: view.name,
      type: view.type,
      stackbycolumn: view.stackbycolumn,
    })
    .then(handleResponse);

export const deleteView = ({
  spaceId,
  viewId,
  tableId,
}: {
  spaceId: string;
  viewId: string;
  tableId: string;
}): Promise<void> =>
  api
    .delete(`/api/${spaceId}/v0/meta/table/${tableId}/view/${viewId}`)
    .then(handleResponse);

export const editView = (
  spaceId: string,
  tableId: string,
  viewId: string,
  updateData: string
): Promise<any> =>
  api
    .patch<any>(`/api/${spaceId}/v0/meta/table/${tableId}/view/${viewId}`, {
      add: {
        name: updateData,
      },
    })
    .then(handleResponse);
