import { TReduxStore } from "./store.types";

export enum ETokens {
	ApiService = "ApiService",
	UserService = "UserService",
}

export interface IContainer {
	get<T>(token: ETokens): T;
	store: TReduxStore;
}
