export interface ResetPasswordDetailModel {
  newPassword: string;
  jwt: string;
}

export interface ChangePasswordDetailModel {
  newPassword: string;
  currentPassword: string;
}

export interface SignInDetailsModel {
  email: string;
  password: string;
}

export interface SignUpDetailsModel {
  email: string;
  name: string;
  password?: string;
  clientId: string;
  user_metadata: {
    username: string;
  };
  role?: string;
  phone?: string;
  email_confirm?: boolean;
  phone_confirm?: boolean;
  provider?: "email" | "github";
}

export interface SignUpDetailsModelOAuth {
  email: string;
  username: string;
  // clientId: string;
}

export interface ChangePasswordDetailModelAuth {
  password: string;
  id: string;
}

export interface LogoutFromAllDevicesModel {
  id: string;
}


export interface UserEmailModel {
  email: string;
}

export interface SignResponseModel {
  id: string;
  token: string;
}
