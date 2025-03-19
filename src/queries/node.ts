import { createNode, postNodeTrigger, updateNodePosition, testNode, runNode } from "@/api/node";
import { useMutation } from "react-query";
import { handleEventForTracking } from "./table";

export function useCreateNode() {
  return useMutation({
    mutationKey: "createNode",
    mutationFn: createNode,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "createNode",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "createNode",
        success: false,
        eventType: "API",
      }),
  });
}

export function useUpdateNodePosition() {
  return useMutation({
    mutationKey: "updateNodePosition",
    mutationFn: updateNodePosition,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "updateNodePosition",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "updateNodePosition",
        success: false,
        eventType: "API",
      }),
  });
}

export function usePostNodeTrigger() {
  return useMutation({
    mutationKey: "postNodeTrigger",
    mutationFn: postNodeTrigger,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "postNodeTrigger",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "postNodeTrigger",
        success: false,
        eventType: "API",
      }),
  });
}

export function useTestNode() {
  return useMutation({
    mutationKey: "testNode",
    mutationFn: testNode,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "testNode",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "testNode",
        success: false,
        eventType: "API",
      }),
  });
}

export function useRunNode() {
  return useMutation({
    mutationKey: "runNode",
    mutationFn: runNode,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "runNode",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "runNode",
        success: false,
        eventType: "API",
      }),
  });
}



