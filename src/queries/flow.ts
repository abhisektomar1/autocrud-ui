import { useMutation, UseMutationResult, useQuery } from "react-query";
import { ConnectModel, FlowModel } from "@/types/model";
import { handleEventForTracking } from "./table";
import {
  AddJobToFlow,
  addNodeToFlow,
  connectNode,
  createFlow,
  deleteFlow,
  deleteNode,
  getFlow,
  getFlows,
  removeConnection,
  runFlow,
  searchFlow,
  updateFlow,
} from "@/api/flow";
import { queryClient } from "./client";

export function useCreateFlow(): UseMutationResult<
  FlowModel,
  Error,
  FlowModel
> {
  return useMutation({
    mutationKey: "createFlow",
    mutationFn: createFlow,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "createFlow",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "createFlow",
        success: false,
        eventType: "API",
      }),
  });
}

export function useAddNodeToFlow(): UseMutationResult<
  AddJobToFlow,
  Error,
  any
> {
  return useMutation({
    mutationKey: "addNodeToFlow",
    mutationFn: addNodeToFlow,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "addNodeToFlow",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "addNodeToFlow",
        success: false,
        eventType: "API",
      }),
  });
}

export function useDeleteFlow() {
  return useMutation({
    mutationKey: "deleteFlow",
    mutationFn: deleteFlow,
    onSuccess: () => {
      handleEventForTracking({
        eventName: "deleteFlow",
        success: true,
        eventType: "API",
      });
      queryClient.invalidateQueries("getFlows");
      queryClient.invalidateQueries("getFlow");
    },
    onError: () =>
      handleEventForTracking({
        eventName: "deleteFlow",
        success: false,
        eventType: "API",
      }),
  });
}

export function useUpdateFlow(): UseMutationResult<
  FlowModel,
  Error,
  FlowModel
> {
  return useMutation({
    mutationKey: "updateFlow",
    mutationFn: updateFlow,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "updateFlow",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "updateFlow",
        success: false,
        eventType: "API",
      }),
  });
}

export function useSearchFlow(spaceId: string, take: number) {
  return useQuery({
    queryKey: ["searchFlow", spaceId, take],
    queryFn: searchFlow,
    select(data) {
      return data.data;
    },
  });
}

export function useGetFlow(spaceId: string, flowId: string) {
  return useQuery({
    queryKey: ["getFlow", spaceId, flowId],
    queryFn: getFlow,
    // enabled: false,
    select(data) {
      return data.data;
    },
  });
}

export function useGetAllFlows(spaceId: string) {
  return useQuery({
    queryKey: ["getFlows", spaceId],
    queryFn: () => getFlows([spaceId]),
    select(data) {
      return data[0].data;
    },
  });
}

export function useConnectNode(): UseMutationResult<
  ConnectModel,
  Error,
  ConnectModel
> {
  return useMutation({
    mutationKey: "connectNode",
    mutationFn: connectNode,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "connectNode",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "connectNode",
        success: false,
        eventType: "API",
      }),
  });
}

export function useRemoveConnection(): UseMutationResult<
  ConnectModel,
  Error,
  ConnectModel
> {
  return useMutation({
    mutationKey: "removeConnection",
    mutationFn: removeConnection,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "removeConnection",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "removeConnection",
        success: false,
        eventType: "API",
      }),
  });
}

export function useRunFlow() {
  return useMutation({
    mutationKey: "runFlow",
    mutationFn: runFlow,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "runFlow",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "runFlow",
        success: false,
        eventType: "API",
      }),
  });
}

export function useDeleteNode(): UseMutationResult<
  ConnectModel,
  Error,
  ConnectModel
> {
  return useMutation({
    mutationKey: "deleteNode",
    mutationFn: deleteNode,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "deleteNode",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "deleteNode",
        success: false,
        eventType: "API",
      }),
  });
}

//get all flow list of spaces by space ID
export const useMultipleSpacesForFlows = (spaceIds: string[]) => {
  return useQuery(
    ["flows", spaceIds],
    async () => {
      if (!spaceIds || spaceIds.length === 0) {
        console.warn("No space IDs provided");
        return [];
      }

      const results = await getFlows(spaceIds);
      // Check for fail
      const allFailed = results.every((result) => !result.success);
      if (allFailed) {
        throw new Error("All space requests failed");
      }

      // Collect success
      let result: any[] = [];
      results
        .filter((data) => data.success)
        .forEach((ele) => {
          ele.data.forEach((res: any) => result.push(res));
        });

      return result;
    },
    {
      enabled: spaceIds.length > 0, // run query if spaceIds available
      retry: 1, // Retry before failing
      onError: (error) => {
        console.error("Failed to fetch spaces:", error);
      },
    }
  );
};
