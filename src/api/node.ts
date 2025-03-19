import { NodePosition } from "@/pages/automation/automationType";
import api, { handleResponse } from "@/queries/api";

export interface TriggerModel {
  Type: string;
  schedule: string;
  nodeId: string;
}

export const createNode = (nodeDetails: any): Promise<any> =>
  api
    .post(
      `/api/${nodeDetails.space}/v0/meta/flow/${nodeDetails.flowId}/node?skip_request=true`,
      nodeDetails
    )
    .then(handleResponse);

export const updateNodePosition = (nodeDetails: {
  space: string;
  flowId: string;
  nodeId: string;
  node: NodePosition;
}): Promise<any> => {
 
  return api
    .post(
      `/api/${nodeDetails.space}/v0/meta/flow/${nodeDetails.flowId}/node/${nodeDetails.nodeId}/position/add`,
      nodeDetails.node
    )
    .then(handleResponse);
};

export const postNodeTrigger = (nodeDetails: {
  space: string;
  flowId: string;
  nodeId: string;
  node: TriggerModel;
}): Promise<any> => {
 
  return api
    .post(
      `/api/${nodeDetails.space}/v0/meta/flow/${nodeDetails.flowId}/trigger`,
      nodeDetails.node
    )
    .then(handleResponse);
};

  export const testNode = (nodeDetails: {
    space: string;
    flowId: string;
    nodeId: string;
  }): Promise<any> => {
    return api
      .post(
        `/api/${nodeDetails.space}/v0/flow/${nodeDetails.flowId}/run/${nodeDetails.nodeId}`,
        {}
      )
      .then(handleResponse);
  };

  export const runNode = (nodeDetails: {
    space: string;
    flowId: string;
    nodeId: string;
  }): Promise<any> => {
    return api
      .post(
        `/api/${nodeDetails.space}/v0/flow/${nodeDetails.flowId}/node/${nodeDetails.nodeId}`,
        {}
      )
      .then(handleResponse);
  };
