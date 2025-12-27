import {
  LoginRequestDto,
  RegisterRequestDto,
  VerifyEmailRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  UpdateProfileDto,
  UpdateProfilePictureDto,
  SendChangeEmailVerificationRequestDto,
  ChangeEmailRequestDto,
  GeocodingResult,
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
  UpdateProfile = "updateProfile",
  UpdateProfilePicture = "updateProfilePicture",
  SendChangeEmailVerification = "sendChangeEmailVerification",
  ChangeEmail = "changeEmail",
  GetCurrentPosition = "getCurrentPosition",
  SearchLocation = "searchLocation",
  CreateManualLocation = "createManualLocation",
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
  [EActionKeys.UpdateProfile]: UpdateProfileDto;
  [EActionKeys.UpdateProfilePicture]: UpdateProfilePictureDto;
  [EActionKeys.SendChangeEmailVerification]: SendChangeEmailVerificationRequestDto;
  [EActionKeys.ChangeEmail]: ChangeEmailRequestDto;
  [EActionKeys.GetCurrentPosition]: null;
  [EActionKeys.SearchLocation]: string;
  [EActionKeys.CreateManualLocation]: GeocodingResult;
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
