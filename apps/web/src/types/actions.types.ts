import {
  LoginRequestDto,
  RegisterRequestDto,
  VerifyEmailRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
} from "@matcha/shared";

export enum EActionKeys {
  Authenticate = "authenticate",
  Register = "register",
  Logout = "logout",
  Login = "login",
  VerifyEmail = "verifyEmail",
  ResendVerificationEmail = "resendVerificationEmail",
  ForgotPassword = "forgotPassword",
  ResetPassword = "resetPassword",
}

export interface IActionDtoMap {
  [EActionKeys.Authenticate]: null;
  [EActionKeys.Register]: RegisterRequestDto;
  [EActionKeys.Logout]: null;
  [EActionKeys.Login]: LoginRequestDto;
  [EActionKeys.VerifyEmail]: VerifyEmailRequestDto;
  [EActionKeys.ResendVerificationEmail]: null;
  [EActionKeys.ForgotPassword]: ForgotPasswordRequestDto;
  [EActionKeys.ResetPassword]: ResetPasswordRequestDto;
}

export type ActionDto<K extends EActionKeys> = IActionDtoMap[K];

export enum EActionStatus {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

export interface IActionData {
  status: EActionStatus;
  error?: {
    message: string;
    code?: number;
    timestamp: string;
  };
}
