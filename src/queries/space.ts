import { useQuery, useMutation, UseMutationResult } from "react-query";
import { SpaceModel } from "@/types/model";
import {
  createSpace,
  deleteSpace,
  getSpace,
  getSpaces,
  patchSpace,
  searchSpaces,
  updateSpace,
} from "@/api/space";
import { handleEventForTracking } from "./table";

// Meta - Space
export function useCreateSpace(): UseMutationResult<
  SpaceModel,
  Error,
  SpaceModel
> {
  return useMutation({
    mutationKey: "createSpace",
    mutationFn: createSpace,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "createSpace",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "createSpace",
        success: false,
        eventType: "API",
      }),
  });
}

export function useUpdateSpace(): UseMutationResult<
  SpaceModel,
  Error,
  SpaceModel
> {
  return useMutation({
    mutationKey: "updateSpace",
    mutationFn: updateSpace,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "updateSpace",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "updateSpace",
        success: false,
        eventType: "API",
      }),
  });
}

export function usePatchSpace() {
  return useMutation({
    mutationKey: "patchSpace",
    mutationFn: patchSpace,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "patchSpace",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "patchSpace",
        success: false,
        eventType: "API",
      }),
  });
}

export function useGetSpace(spaceId: string) {
  return useQuery({
    queryKey: ["getSpace", spaceId],
    queryFn: getSpace,
    select(data: any) {
      return data.data;
    },
  });
}

export const useMultipleSpaces = (spaceIds: string[]) => {
  return useQuery(
    ["spaces", spaceIds],
    async () => {
      if (!spaceIds || spaceIds.length === 0) {
        console.warn("No space IDs provided");
        return [];
      }

      const results = await getSpaces(spaceIds);

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

export function useDeleteSpace() {
  return useMutation({
    mutationKey: "deleteSpace",
    mutationFn: deleteSpace,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "deleteSpace",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "deleteSpace",
        success: false,
        eventType: "API",
      }),
  });
}

export function useSearchSpaces(params: string, take: number) {
  return useQuery({
    queryKey: ["searchSpaces", params, take],
    queryFn: searchSpaces,
  });
}
