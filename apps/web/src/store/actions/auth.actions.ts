import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

export const AuthActions = createActions(ETokens.AuthService, [
  EActionKeys.Register,
  EActionKeys.Authenticate,
  EActionKeys.Logout,
  EActionKeys.Login,
  EActionKeys.VerifyEmail,
  EActionKeys.ResendVerificationEmail,
  EActionKeys.ForgotPassword,
  EActionKeys.ResetPassword,
  EActionKeys.SendChangeEmailVerification,
  EActionKeys.ChangeEmail,
] as const);
