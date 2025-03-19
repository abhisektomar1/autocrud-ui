import {
  getAllNodeLibrary,
  getJobExecution,
  getJobExecutionFromFlowId,
  getNodeFormDetail,
  updateJob,
} from "@/api/job";
import { JobExecutionResponse } from "@/types/job";
import { NodeDetailExecution } from "@/types/nodeDetailExecution";
// import { JobDefinition } from "@/pages/automation/FormBuilder";
import { useMutation, useQuery } from "react-query";

export function useGetAllNodeLibrary() {
  return useQuery({
    queryKey: "getAllNodeLibrary",
    queryFn: getAllNodeLibrary,
    select(data) {
      return data.data;
    },
  });
}

export function useGetNodeFormDetail(jobType: string) {
  return useQuery({
    queryKey: ["getNodeFormDetail", jobType],
    queryFn: getNodeFormDetail,
    cacheTime: 0,
    select(data) {
      return data.data as any;
    },
  });
}

export function useUpdateJob() {
  return useMutation({
    mutationKey: "updatejob",
    mutationFn: updateJob,
  });
}

export function useGetJobExecution({
  space,
  flowId,
  executionId,
}: {
  space: string;
  flowId: string;
  executionId: string;
}) {
  return useQuery({
    queryKey: ["getJobExecution", space, flowId, executionId],
    queryFn: getJobExecution,
    select(data) {
      return data.data as NodeDetailExecution;
    },
  });
}

export function useGetJobExecutionFromFlowId({
  space,
  flowId,
}: {
  space: string;
  flowId: string;
}) {
  return useQuery({
    queryKey: ["getJobExecutionFromFlowId", space, flowId],
    queryFn: getJobExecutionFromFlowId,
    select(data) {
      return data.data.data as JobExecutionResponse[];
    },
  });
}
