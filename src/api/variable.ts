import api from "@/queries/api";

export interface Variable {
  id: string;
  key: string;
  value: string;
}

export const getVariables = async (spaceId: string) => {
  const response = await api.get(`/api/${spaceId}/v0/variable/search?take=100`);
  return response.data;
};

export const createVariable = async ({
  spaceId,
  variable,
}: {
  spaceId: string;
  variable: Variable;
}) => {
  const response = await api.post(
    `/api/${spaceId}/v0/variable`,
    variable
  );
  return response.data;
};

export const updateVariable = async ({
  spaceId,
  variable,
}: {
  spaceId: string;
  variable: Variable;
}) => {
  const response = await api.put(
    `/api/${spaceId}/v0/variable/${variable.id}`,
    variable
  );
  return response.data;
};

export const deleteVariable = async ({
  spaceId,
  variableId,
}: {
  spaceId: string;
  variableId: string;
}) => {
  const response = await api.delete(
    `/api/${spaceId}/v0/variable/${variableId}`
  );
  return response.data;
};
