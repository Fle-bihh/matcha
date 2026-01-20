import {
	LoginRequestDto,
	RegisterRequestDto,
	VerifyEmailRequestDto,
	ForgotPasswordRequestDto,
	ResetPasswordRequestDto,
	UpdateProfileDto,
	UpdateProfilePictureDto,
	UpdateLocationDto,
	SendChangeEmailVerificationRequestDto,
	ChangeEmailRequestDto,
	GeocodingResult,
	BrowsingParams,
	BrowsingFilters,
	CreateLikeDto,
	MatchesParams,
	UnlikeUserDto,
	CreateVisitDto,
	SubscribeChannelRequestDto,
	UnsubscribeChannelRequestDto,
	CreateReportDto,
	CreateBlockDto,
	CreateUserMessageDto,
} from "@matcha/shared";
import { PaginationDto } from "./api.types";

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
	UpdateLocation = "updateLocation",
	SendChangeEmailVerification = "sendChangeEmailVerification",
	ChangeEmail = "changeEmail",
	GetCurrentPosition = "getCurrentPosition",
	SearchLocation = "searchLocation",
	CreateManualLocation = "createManualLocation",
	GetUsers = "getUsers",
	ApplyBrowsingFilters = "applyBrowsingFilters",
	ClearBrowsingFilters = "clearBrowsingFilters",
	LoadBrowsingFilters = "loadBrowsingFilters",
	CreateLike = "createLike",
	UnlikeUser = "unlikeUser",
	GetMatches = "getMatches",
	GetUserById = "getUserById",
	CreateVisit = "createVisit",
	GetVisitsReceived = "getVisitsReceived",
	SubscribeToChannel = "subscribeToChannel",
	UnsubscribeFromChannel = "unsubscribeFromChannel",
	CreateReport = "createReport",
	CreateBlock = "createBlock",
	GetMessages = "getMessages",
	CreateMessage = "createMessage",
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
	[EActionKeys.UpdateLocation]: UpdateLocationDto;
	[EActionKeys.SendChangeEmailVerification]: SendChangeEmailVerificationRequestDto;
	[EActionKeys.ChangeEmail]: ChangeEmailRequestDto;
	[EActionKeys.GetCurrentPosition]: null;
	[EActionKeys.SearchLocation]: string;
	[EActionKeys.CreateManualLocation]: GeocodingResult;
	[EActionKeys.GetUsers]: BrowsingParams;
	[EActionKeys.ApplyBrowsingFilters]: BrowsingFilters & {
		currentLimit: number;
	};
	[EActionKeys.ClearBrowsingFilters]: null;
	[EActionKeys.LoadBrowsingFilters]: null;
	[EActionKeys.CreateLike]: CreateLikeDto;
	[EActionKeys.UnlikeUser]: UnlikeUserDto;
	[EActionKeys.GetMatches]: MatchesParams;
	[EActionKeys.GetUserById]: string;
	[EActionKeys.CreateVisit]: CreateVisitDto;
	[EActionKeys.GetVisitsReceived]: PaginationDto;
	[EActionKeys.SubscribeToChannel]: SubscribeChannelRequestDto;
	[EActionKeys.UnsubscribeFromChannel]: UnsubscribeChannelRequestDto;
	[EActionKeys.CreateReport]: CreateReportDto;
	[EActionKeys.CreateBlock]: CreateBlockDto;
	[EActionKeys.GetMessages]: { matchId: string } & PaginationDto;
	[EActionKeys.CreateMessage]: CreateUserMessageDto;
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
