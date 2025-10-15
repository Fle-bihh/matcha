import { LoginRequestDto, RegisterRequestDto } from "@matcha/shared";

export enum EActionKeys {
	Authenticate = "authenticate",
	Register = "register",
	Logout = "logout",
	Login = "login",
	FetchUsers = "fetch-users",
}

export interface IActionDtoMap {
	[EActionKeys.Authenticate]: null;
	[EActionKeys.Register]: RegisterRequestDto;
	[EActionKeys.Logout]: null;
	[EActionKeys.Login]: LoginRequestDto;
	[EActionKeys.FetchUsers]: null;
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
