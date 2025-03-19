import {
  createVariable,
  deleteVariable,
  getVariables,
  updateVariable,
  Variable,
} from "@/api/variable";
import { useMutation, useQuery } from "react-query";

export const useGetVariables = (spaceId: string) => {
  return useQuery({
    queryKey: ["variables", spaceId],
    queryFn: () => getVariables(spaceId),
  });
};

export const useCreateVariable = (spaceId: string) => {
  return useMutation({
    mutationFn: (variable: Variable) => createVariable({ spaceId, variable }),
  });
};

export const useUpdateVariable = (spaceId: string) => {
  return useMutation({
    mutationFn: (variable: Variable) => updateVariable({ spaceId, variable }),
  });
};

export const useDeleteVariable = (spaceId: string) => {
  return useMutation({
    mutationFn: (variableId: string) => deleteVariable({ spaceId, variableId }),
  });
};
