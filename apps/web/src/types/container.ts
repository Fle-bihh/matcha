import { Store } from "@reduxjs/toolkit";

export enum ETokens {
	// Services
	ApiService = "ApiService",
	UserService = "UserService",
}

export interface IContainer {
	get<T>(token: ETokens): T;
	store: Store<any, any> & { dispatch: any };
}
