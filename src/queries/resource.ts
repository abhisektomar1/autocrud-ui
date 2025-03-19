import { useMutation, useQuery } from "react-query";
import { handleEventForTracking } from "./table";
import {
  createNewResource,
  getAllResource,
  getCallback,
  getIndividualResource,
  getIndividualResourceManageType,
  getResourceType,
  editResource,
  deleteResource,
} from "@/api/resource";

export function useCreateNewResource() {
  return useMutation({
    mutationKey: "createNode",
    mutationFn: createNewResource,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "createResource",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "createResource",
        success: false,
        eventType: "API",
      }),
  });
}

export function useEditResource() {
  return useMutation({
    mutationKey: "editResource",
    mutationFn: editResource,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "editResource",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "editResource",
        success: false,
        eventType: "API",
      }),
  })
}

export function useDeleteResource(spaceId:string){
  return useMutation({
    mutationKey: "deleteResource",
    mutationFn: (resourceId:string) => deleteResource({spaceId,resourceId}),
    onSuccess: () =>
      handleEventForTracking({
        eventName: "deleteResource",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "deleteResource",
        success: false,
        eventType: "API",
      }),
  })
}

export function useGetResourceType() {
  return useQuery({
    queryKey: "getResourceType",
    queryFn: getResourceType,
  });
}

export function useGetIndividualResource(space: string, resourceId: string) {
  return useQuery({
    queryKey: ["getIndividualResource", space, resourceId],
    queryFn: getIndividualResource,
  });
}
export function useGetAllResource(space: string) {
  return useQuery({
    queryKey: ["getAllResource", space],
    queryFn: getAllResource,
    select: (data) => data.data,
  });
}

export function useGetCallback(resourceType: string) {
  return useQuery({
    queryKey: ["getCallback", resourceType],
    queryFn: getCallback,
    enabled: false,
  });
}



export function useGetIndividualResourceManageType(
  space: string,
  resourceType: string,
  resourceCategory: string
) {
  return useQuery({
    queryKey: [
      "getIndividualResourceManageType",
      space,
      resourceType,
      resourceCategory,
    ],
    queryFn: getIndividualResourceManageType,
  });
}
