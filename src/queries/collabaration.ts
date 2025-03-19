import {
  createComment,
  deleteComment,
  downloadAttachment,
  getAttachments,
  getAuditLogs,
  getComments,
  updateComment,
} from "@/api/collabaration";
import { CommentModel } from "@/types/model";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import { handleEventForTracking } from "./table";

// Component - Comments
export function useGetComments(
  spaceId: string,
  tableId: string,
  rowId: string
): UseQueryResult<CommentModel[], Error> {
  return useQuery({
    queryKey: ["getComments", spaceId, tableId, rowId],
    queryFn: () => getComments(spaceId, tableId, rowId),
    select(data: any) {
      return data.data.data;
    },
  });
}

export function useCreateComment(): UseMutationResult<
  CommentModel,
  Error,
  { spaceId: string; tableId: string; rowId: string; commentData: CommentModel }
> {
  return useMutation({
    mutationKey: "createComment",
    mutationFn: ({ spaceId, tableId, rowId, commentData }) =>
      createComment(spaceId, tableId, rowId, commentData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "createComment",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "createComment",
        success: false,
        eventType: "API",
      }),
  });
}

export function useUpdateComment(): UseMutationResult<
  CommentModel,
  Error,
  {
    spaceId: string;
    tableId: string;
    rowId: string;
    commentId: string;
    commentData: CommentModel;
  }
> {
  return useMutation({
    mutationKey: "updateComment",
    mutationFn: ({ spaceId, tableId, rowId, commentId, commentData }) =>
      updateComment(spaceId, tableId, rowId, commentId, commentData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "updateComment",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "updateComment",
        success: false,
        eventType: "API",
      }),
  });
}

export function useDeleteComment(): UseMutationResult<
  void,
  Error,
  { spaceId: string; tableId: string; rowId: string; commentId: string }
> {
  return useMutation({
    mutationKey: "deleteComment",
    mutationFn: ({ spaceId, tableId, rowId, commentId }) =>
      deleteComment(spaceId, tableId, rowId, commentId),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "deleteComment",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "deleteComment",
        success: false,
        eventType: "API",
      }),
  });
}

// Component - Audit
export function useGetAuditLogs(
  spaceId: string,
  tableId: string,
  rowId: string
): UseQueryResult<any[], Error> {
  return useQuery({
    queryKey: ["getAuditLogs", spaceId, tableId, rowId],
    queryFn: () => getAuditLogs(spaceId, tableId, rowId),
    select(data: any) {
      return data.data.data;
    },
  });
}

// Component - Attachments
export function useGetAttachments(
  spaceId: string,
  tableId: string,
  rowId: string
): UseQueryResult<any[], Error> {
  return useQuery({
    queryKey: ["getAttachments", spaceId, tableId, rowId],
    queryFn: () => getAttachments(spaceId, tableId, rowId),
    select(data: any) {
      return data.data.data;
    },
  });
}

export function useDownloadAttachments(
  spaceId: string,
  tableId: string,
  rowId: string,
  attachmentId: string
): UseQueryResult<any[], Error> {
  return useQuery({
    queryKey: ["downloadAttachment", spaceId, tableId, rowId, attachmentId],
    queryFn: () => downloadAttachment(spaceId, tableId, rowId, attachmentId),
    select(data: any) {
      return data;
    },
  });
}
