export enum EActionKeys {
	Authenticate = "authenticate",
	Register = "register",
	Logout = "logout",
	Login = "login",
	FetchUsers = "fetch-users",
}

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
