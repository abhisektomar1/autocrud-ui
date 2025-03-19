import {
  createView,
  deleteView,
  editView,
  getAllView,
  getView,
} from "@/api/view";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import { handleEventForTracking } from "./table";

export function useGetView(
  spaceId: string,
  tableId: string,
  viewId: string
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["getView", spaceId, tableId, viewId],
    queryFn: () => getView(spaceId, tableId, viewId),
    select(data: any) {
      return data.data;
    },
  });
}

export function useGetAllView(
  spaceId: string,
  tableId: string
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["getView", spaceId, tableId],
    queryFn: () => getAllView(spaceId, tableId),
    select(data: any) {
      return data.data;
    },
  });
}

export function useCreateView(): UseMutationResult<
  any,
  Error,
  { viewData: any }
> {
  return useMutation({
    mutationKey: "create-view",
    mutationFn: ({ viewData }) => createView(viewData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "create-view",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "create-view",
        success: false,
        eventType: "API",
      }),
  });
}

export function useDeleteView(): UseMutationResult<
  void,
  Error,
  { spaceId: string; tableId: string; viewId: string }
> {
  return useMutation({
    mutationKey: "delete-view",
    mutationFn: ({ spaceId, tableId, viewId }) =>
      deleteView({ spaceId, tableId, viewId }),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "delete-view",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "delete-view",
        success: false,
        eventType: "API",
      }),
  });
}

export function useEditView(): UseMutationResult<
  any,
  Error,
  {
    spaceId: string;
    tableId: string;
    viewId: string;
    updateData: string;
  }
> {
  return useMutation({
    mutationKey: "edit-view",
    mutationFn: ({ spaceId, tableId, viewId, updateData }) =>
      editView(spaceId, tableId, viewId, updateData),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "edit-view",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "edit-view",
        success: false,
        eventType: "API",
      }),
  });
}
