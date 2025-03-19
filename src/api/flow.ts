import api, { handleResponse } from "@/queries/api";
import { ConnectModel, FlowModel } from "@/types/model";
import { QueryFunctionContext } from "react-query";

export interface AddJobToFlow {
  flowId: string;
  space: string;
  jobId: string;
  jobType: string;
}

export const createFlow = (flow: FlowModel): Promise<any> =>
  api.post<any>(`/api/${flow.space}/v0/meta/flow`, flow).then(handleResponse);

export const addNodeToFlow = (node: AddJobToFlow): Promise<any> =>
  api
    .post<any>(`/api/${node.space}/v0/meta/flow/${node.flowId}/node`, node)
    .then(handleResponse);

export const updateFlow = (flow: FlowModel): Promise<any> =>
  api
    .put<FlowModel>(`/api/${flow.space}/v0/meta/flow/${flow.id}`, flow)
    .then(handleResponse);

export const connectNode = (flow: ConnectModel): Promise<any> =>
  api
    .post<ConnectModel>(
      `/api/${flow.space}/v0/meta/flow/${flow.flowId}/node/${flow.sourceId}/link/add`,
      flow
    )
    .then(handleResponse);

export const removeConnection = (flow: ConnectModel): Promise<any> =>
  api
    .post<ConnectModel>(
      `/api/${flow.space}/v0/meta/flow/${flow.flowId}/node/${flow.sourceId}/link/remove`,
      flow
    )
    .then(handleResponse);

export const deleteNode = (flow: ConnectModel): Promise<any> =>
  api
    .delete<ConnectModel>(
      `/api/${flow.space}/v0/meta/flow/${flow.flowId}/node/${flow.sourceId}`
    )
    .then(handleResponse);

// {{localhost}}/api/ENGKCLCVM1X1V1KA/v0/meta/flow/search?take=10

export const searchFlow = (context: QueryFunctionContext): Promise<any> => {
  const spaceId = context.queryKey[1];
  const take = context.queryKey[2] ?? 100;
  return api
    .get(`/api/${spaceId}/v0/meta/flow/search?take=${take}`)
    .then(handleResponse);
};

export const getFlows = async (spaceIds: string[]): Promise<any[]> => {
  // Create an array of promises for all API calls
  const promises = spaceIds.map(async (spaceId) => {
    try {
      const response = await api.get<any>(
        `/api/${spaceId}/v0/meta/flow/search?take=10`
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


export const deleteFlow = (flow: {
  spaceId: string;
  flowId: string;
}): Promise<void> =>
  api
    .delete(`/api/${flow.spaceId}/v0/meta/flow/${flow.flowId}`)
    .then(handleResponse);

export const getFlow = (context: QueryFunctionContext): Promise<any> => {
  const spaceId = context.queryKey[1];
  const flowId = context.queryKey[2] ?? 100;
  return api.get(`/api/${spaceId}/v0/meta/flow/${flowId}`).then(handleResponse);
};



export const runFlow = (data: any): Promise<any> =>
  api
    .post<ConnectModel>(
      `/api/${data.space}/v0/flow/${data.flowId}`,
      data.data
    )
    .then(handleResponse);
