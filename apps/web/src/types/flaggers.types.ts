export enum EFlaggerKeys {
	FetchUsersThunk = "usersFetched",
}

export interface IFlaggerDataTypes {
	[EFlaggerKeys.FetchUsersThunk]: IThunkFlagger;
}

export interface IThunkFlagger {
	isLoading: boolean;
	success?: boolean;
	error?: {
		message: string;
		code?: number;
		timestamp: string;
	};
}

export type TFlaggerData<T extends EFlaggerKeys> = IFlaggerDataTypes[T];
