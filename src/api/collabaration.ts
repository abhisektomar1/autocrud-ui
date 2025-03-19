import api, { handleResponse } from "@/queries/api";
import { CommentModel } from "@/types/model";

// Component - Comments
export const getComments = (
  spaceId: string,
  tableId: string,
  rowId: string
): Promise<CommentModel[]> =>
  api
    .get<CommentModel[]>(`/api/${spaceId}/v0/table/${tableId}/${rowId}/comment`)
    .then(handleResponse);

export const createComment = (
  spaceId: string,
  tableId: string,
  rowId: string,
  commentData: CommentModel
): Promise<CommentModel> =>
  api
    .post<CommentModel>(
      `/api/${spaceId}/v0/table/${tableId}/${rowId}/comment`,
      commentData
    )
    .then(handleResponse);

export const updateComment = (
  spaceId: string,
  tableId: string,
  rowId: string,
  commentId: string,
  commentData: CommentModel
): Promise<CommentModel> =>
  api
    .post<CommentModel>(
      `/api/${spaceId}/v0/table/${tableId}/${rowId}/comment/${commentId}`,
      commentData
    )
    .then(handleResponse);

export const deleteComment = (
  spaceId: string,
  tableId: string,
  rowId: string,
  commentId: string
): Promise<void> =>
  api
    .delete(`/api/${spaceId}/v0/table/${tableId}/${rowId}/comment/${commentId}`)
    .then(handleResponse);

// Component - Audit
export const getAuditLogs = (
  spaceId: string,
  tableId: string,
  rowId: string
): Promise<any[]> =>
  api
    .get<any[]>(`/api/${spaceId}/v0/table/${tableId}/${rowId}/audit/`)
    .then(handleResponse);

// Component - Attachments
export const getAttachments = (
  spaceId: string,
  tableId: string,
  rowId: string
): Promise<any[]> =>
  api
    .get<any[]>(`/api/${spaceId}/v0/table/${tableId}/${rowId}/attachment`)
    .then(handleResponse);

export const downloadAttachment = (
  spaceId: string,
  tableId: string,
  rowId: string,
  attachmentId: string
): Promise<any[]> =>
  api
    .get<any[]>(
      `/api/${spaceId}/v0/table/${tableId}/${rowId}/attachment/${attachmentId}/download`,
      {
        responseType: "arraybuffer",
      }
    )
    .then(handleResponse);

export const uploadAttachment = async (
  spaceId: string,
  tableId: string,
  rowId: string,
  file: File
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .post(`/api/${spaceId}/v0/table/${tableId}/${rowId}/attachment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(handleResponse);
};
