export enum EFlaggerKeys {
	UsersFetched = "usersFetched",
}

export interface IFlaggerDataTypes {
	[EFlaggerKeys.UsersFetched]: IUserFetchedFlagger;
}

export interface IUserFetchedFlagger {
	isFetched: boolean;
	error?: {
		message: string;
		code?: number;
		timestamp: string;
	};
}

export type TFlaggerData<T extends EFlaggerKeys> = IFlaggerDataTypes[T];
