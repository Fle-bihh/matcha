export enum EThunkFlaggerKeys {
	Authenticate = "authenticate",
	Register = "register",
	FetchUsers = "fetch-users",
	Logout = "logout",
	Login = "login",
}

export enum EFlaggerKeys {}

export type EAllFlaggerKeys = EFlaggerKeys | EThunkFlaggerKeys;

type ThunkFlaggerDataTypes = {
	[K in EThunkFlaggerKeys]: IThunkFlagger;
};

type OtherFlaggerDataTypes = {
	[K in EFlaggerKeys]: IThunkFlagger;
};

export type IFlaggerDataTypes = ThunkFlaggerDataTypes & OtherFlaggerDataTypes;

export interface IThunkFlagger {
	isLoading: boolean;
	success?: boolean;
	error?: {
		message: string;
		code?: number;
		timestamp: string;
	};
}

export type TFlaggerData<T extends EFlaggerKeys | EThunkFlaggerKeys> =
	IFlaggerDataTypes[T];
