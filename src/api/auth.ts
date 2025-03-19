import {
  ResetPasswordDetailModel,
  SignUpDetailsModel,
} from "../types/auth";
import api, { handleResponse } from "../queries/api";
import { SignInCredentials } from "@/types/model";

// Auth
export const signIn = (credentials: SignInCredentials): Promise<any> =>
  api.post('/api/auth/signin', credentials).then(handleResponse);

export const signUp = (credentials: SignUpDetailsModel): Promise<any> =>
  api.post('/api/auth/signup', credentials).then(handleResponse);

export const signOut = (): Promise<void> =>
  api.post('/api/auth/signout').then(handleResponse);

export const refreshToken = (refreshToken: string): Promise<any> =>
  api.post<any>('/api/auth/refresh', null, {
    headers: { RefreshToken: refreshToken },
  }).then(handleResponse);


// export async function signUp(
//   signUpDetailsModel: SignUpDetailsModel
// ): Promise<any> {
//   return api.post(`user/signup`, signUpDetailsModel).then((res) => res.data);
// }

export async function resetPassword(
  resetPasswordDetail: ResetPasswordDetailModel
): Promise<any> {
  return api.post(`user/resetPassword`, resetPasswordDetail, {
    headers: { accessToken: `Bearer ${resetPasswordDetail.jwt}` },
  });
}

export async function changePassword(
  resetPasswordDetail: ResetPasswordDetailModel
): Promise<any> {
  return api.post(`user/changePassword`, resetPasswordDetail);
}

export async function changeNewPassword(
  resetPasswordDetail: ResetPasswordDetailModel
): Promise<any> {
  return api.post(`user/changeNewPassword`, resetPasswordDetail);
}

export async function forgotPassword(email: string): Promise<any> {
  return api.post(`user/forgotPassword`, { email });
}
