import api, { handleResponse } from "@/queries/api";
import { QueryFunctionContext } from "react-query";

export type AuthType = "custom" | "key" | "gmail" | "apikey";

export interface AuthConfig {
  custom?: Record<string, any>;
  basic?: Record<string, any>;
  apikey?: Record<string, any>;
}

export interface ResourceModel {
  id: string;
  createdAt: string;
  createdBy: string;
  space: string;
  name: string;
  type: string;
  authType: string;
  auth: {
    oauth: {
      access_token: string;
      expiry: string;
    };
    apikey: {
      key: string;
    };
    basic: {
      username: string;
      password: string;
    };
  };
  profile: null;
}

export interface ResourceDetails {
  space: string;
  name: string;
  type: string;
  authType: "custom" | "basic" | "apikey";
  auth: AuthConfig;
}

export const getResourceType = (): Promise<any> => {
  return api.get<any>(`/api/v0/manage/resource/typ/all`).then(handleResponse);
};

export const getGmailCallback = (): Promise<any> => {
  return api.get<any>(`/api/v0/resource/gmail/callback`).then(handleResponse);
};

export const getIndividualResource = (
  context: QueryFunctionContext
): Promise<any> => {
  const key = context.queryKey;
  return api
    .get<any>(`/api/${key[1]}/v0/resource/${key[2]}`)
    .then(handleResponse);
};

export const getIndividualResourceManageType = (
  context: QueryFunctionContext
): Promise<any> => {
  const key = context.queryKey;
  return api
    .get<any>(`/api/v0/manage/resource/typ/${key[2]}/${key[3]}`)
    .then(handleResponse);
};

export const getAllResource = (context: QueryFunctionContext): Promise<any> => {
  const key = context.queryKey;
  return api
    .get<any>(`/api/${key[1]}/v0/resource/search?take=100`)
    .then(handleResponse);
};

export const getCallback = (context: QueryFunctionContext): Promise<any> => {
  const key = context.queryKey;
  return api
    .get<any>(`/api/v0/resource/${key[1]}/callback`)
    .then(handleResponse);
};

export const createNewResource = (
  resourceDetails: ResourceDetails
): Promise<any> =>
  api.post<any>(`/api/${resourceDetails.space}/v0/resource`, resourceDetails).then(handleResponse);

export const deleteResource = ({
  spaceId,
  resourceId,
}:{
  spaceId:string,
  resourceId:string,
}
): Promise<any> =>
  api.delete<string>(`/api/${spaceId}/v0/resource/${resourceId}`).then(handleResponse);


export const editResource = (
  resourceDetails: ResourceDetails
): Promise<any> =>
  api.put<any>(`/api/${resourceDetails.space}/v0/resource`, resourceDetails).then(handleResponse);
