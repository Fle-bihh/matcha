import { TReduxStore } from "./store.types";

export enum ETokens {
	ApiService = "ApiService",
	UserService = "UserService",
	AuthService = "AuthService",
	StorageService = "StorageService",
}

export interface IContainer {
	get<T>(token: ETokens): T;
	store: TReduxStore;
}
