import api, { handleResponse } from "@/queries/api";
import { SpaceModel } from "@/types/model";
import { WorkspacePaginatedModel } from "@/types/workspace";
import { QueryFunctionContext } from "react-query";

// Meta - Space
export const createSpace = (spaceDetails: SpaceModel): Promise<SpaceModel> =>
  api.post<SpaceModel>("/api/v0/meta/space", spaceDetails).then(handleResponse);

export const updateSpace = (spaceDetails: SpaceModel): Promise<SpaceModel> =>
  api.put<SpaceModel>("/api/v0/meta/space", spaceDetails).then(handleResponse);

export const patchSpace = ({
  spaceId,
  patchData,
}: {
  spaceId: string;
  patchData: Partial<SpaceModel>;
}): Promise<SpaceModel> =>
  api
    .patch<SpaceModel>(`/api/v0/meta/space/${spaceId}`, patchData)
    .then(handleResponse);

export const getSpace = (
  context: QueryFunctionContext
): Promise<SpaceModel> => {
  const spaceId = context.queryKey[1];
  return api
    .get<SpaceModel>(`/api/v0/meta/space/${spaceId}`)
    .then(handleResponse);
};

export const getSpaces = async (spaceIds: string[]): Promise<any[]> => {
  // Create an array of promises for all API calls
  const promises = spaceIds.map(async (spaceId) => {
    try {
      const response = await api.get<any>(
        `/api/${spaceId}/v0/meta/table/search?take=10`
      );
      const data: any = handleResponse(response);

      return {
        success: !!data.data,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  });

  // Wait for all promises to resolve, regardless of success or failure
  const results = await Promise.allSettled(promises);

  // Map the results to a consistent format
  return results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      success: false,
      error: result.reason?.message || "Request failed",
    };
  });
};

export const deleteSpace = (spaceId: string): Promise<void> =>
  api.delete(`/api/v0/meta/space/${spaceId}`).then(handleResponse);

export const searchSpaces = async (
  context: QueryFunctionContext
): Promise<WorkspacePaginatedModel> => {
  try {
    const params = context.queryKey[1] as string | null;
    const take = Number(context.queryKey[2]) || 100;

    const queryParams = new URLSearchParams();
    if (params) queryParams.set("query", params);
    queryParams.set("take", take.toString());

    const url = `/api/v0/meta/space/search?${queryParams.toString()}`;
    
    const response = await api.get<WorkspacePaginatedModel>(url);
    return handleResponse(response);
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to search spaces");
  }
};
  