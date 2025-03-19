import api, { handleResponse } from "@/queries/api";
import { QueryFunctionContext } from "react-query";

export const getAllNodeLibrary = (): Promise<any> => {
  return api.get<any>(`/api/v0/manage/job/typ/all`).then(handleResponse);
};

type JobType = [string, string];
export const getNodeFormDetail = (
  context: QueryFunctionContext<JobType>
): Promise<any> => {
  const [jobType, jobTypeId] = context.queryKey[1].split(":");
  return api
    .get<any>(`/api/v0/manage/job/${jobType}/${jobTypeId}`)
    .then(handleResponse);
};

export const getNodeFormDetailFromNodeType = (type: string): Promise<any> => {
  const [jobTypeId, jobId] = type.split(":");
  return api
    .get<any>(`/api/v0/manage/job/${jobTypeId}/${jobId}`)
    .then(handleResponse);
};

export const getJobExecution = (
  context: QueryFunctionContext
): Promise<any> => {
  const space = context.queryKey[1];
  const flowId = context.queryKey[2];
  const executionId = context.queryKey[3];
  return api
    .get<any>(`/api/${space}/v0/flow/${flowId}/${executionId}`)
    .then(handleResponse);
};

export const getJobExecutionFromFlowId = (
  context: QueryFunctionContext
): Promise<any> => {
  const space = context.queryKey[1];
  const flowId = context.queryKey[2];
  return api
    .get<any>(`/api/${space}/v0/flow/${flowId}/search?take=100`)
    .then(handleResponse);
};

export const updateJob = (nodeDetails: any): Promise<any> =>
  api
    .put<any>(
      `/api/${nodeDetails.space}/v0/meta/flow/${nodeDetails.flowId}/node/${nodeDetails.id}`,
      nodeDetails
    )
    .then(handleResponse);
