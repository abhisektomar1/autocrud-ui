import { useMutation, UseMutationResult } from "react-query";
import {
  changeNewPassword,
  changePassword,
  forgotPassword,
  refreshToken,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "../api/auth";
import { logEvent } from "../component/analytics";
import { handleEventForTracking } from "./table";
import { SignInCredentials } from "@/types/model";

// Auth
export function useSignIn(): UseMutationResult<any, Error, SignInCredentials> {
  return useMutation({
    mutationKey: "signIn",
    mutationFn: signIn,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "signIn",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "signIn",
        success: false,
        eventType: "API",
      }),
  });
}

export function useSignOut(): UseMutationResult<void, Error, void> {
  return useMutation({
    mutationKey: "signOut",
    mutationFn: signOut,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "signOut",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "signOut",
        success: false,
        eventType: "API",
      }),
  });
}

export function useRefreshToken(): UseMutationResult<any, Error, string> {
  return useMutation({
    mutationKey: "refreshToken",
    mutationFn: refreshToken,
    onSuccess: () =>
      handleEventForTracking({
        eventName: "refreshToken",
        success: true,
        eventType: "API",
      }),
    onError: () =>
      handleEventForTracking({
        eventName: "refreshToken",
        success: false,
        eventType: "API",
      }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationKey: "changePassword",
    mutationFn: changePassword,
    onSuccess: () => {
      logEvent({ category: "API", action: "change-password-success" });
    },
    onError: () => {
      logEvent({ category: "API", action: "change-password-failed" });
    },
  });
}

export function useChangeNewPassword() {
  return useMutation({
    mutationKey: "changeNewPassword",
    mutationFn: changeNewPassword,
    onSuccess: () => {
      logEvent({ category: "API", action: "change-new-password-success" });
    },
    onError: () => {
      logEvent({ category: "API", action: "change-new-password-failed" });
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationKey: "resetPassword",
    mutationFn: resetPassword,
    onSuccess: () => {
      logEvent({ category: "API", action: "reset-password-success" });
    },
    onError: () => {
      logEvent({ category: "API", action: "reset-password-failed" });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationKey: "forgotPassword",
    mutationFn: forgotPassword,
    onSuccess: () => {
      logEvent({ category: "API", action: "forgot-password-success" });
    },
    onError: () => {
      logEvent({ category: "API", action: "forgot-password-failed" });
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationKey: "signUp",
    mutationFn: signUp,
    onSuccess: () => {
      logEvent({ category: "API", action: "sign-up-success" });
    },
    onError: () => {
      logEvent({ category: "API", action: "sign-up-failed" });
    },
  });
}
