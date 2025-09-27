export enum EFlagKeys {
	UsersFetched = "usersFetched",
}

export interface IFlagDataTypes {
	[EFlagKeys.UsersFetched]: IUserFetchedFlag;
}

export interface IUserFetchedFlag {
	isFetched: boolean;
	error?: {
		message: string;
		code?: number;
		timestamp: string;
	};
}

export type TFlagData<T extends EFlagKeys> = IFlagDataTypes[T];
