import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

const authActionsConfig = {
  [EActionKeys.Register]: {
    serviceToken: ETokens.AuthService,
    methodName: "register",
  },
  [EActionKeys.Authenticate]: {
    serviceToken: ETokens.AuthService,
    methodName: "authenticate",
  },
  [EActionKeys.Logout]: {
    serviceToken: ETokens.AuthService,
    methodName: "logout",
  },
  [EActionKeys.Login]: {
    serviceToken: ETokens.AuthService,
    methodName: "login",
  },
  [EActionKeys.VerifyEmail]: {
    serviceToken: ETokens.AuthService,
    methodName: "verifyEmail",
  },
  [EActionKeys.ResendVerificationEmail]: {
    serviceToken: ETokens.AuthService,
    methodName: "resendVerificationEmail",
  },
  [EActionKeys.ForgotPassword]: {
    serviceToken: ETokens.AuthService,
    methodName: "forgotPassword",
  },
  [EActionKeys.ResetPassword]: {
    serviceToken: ETokens.AuthService,
    methodName: "resetPassword",
  },
} as const;

export const AuthActions = createActions(authActionsConfig);
