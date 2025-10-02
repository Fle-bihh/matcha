import { Store } from "@reduxjs/toolkit";
import { createStore } from "@/store";

export enum EEntityTypes {
	Users = "users",
}

export enum EStoreSlices {
	Entities = "entities",
	Loaders = "loaders",
	Flaggers = "flaggers",
	AuthUser = "auth-user",
}

export enum ELoaderKeys {}

export type TRootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type TAppDispatch = ReturnType<typeof createStore>["dispatch"];

export type TReduxStore = Store<TRootState, any> & { dispatch: TAppDispatch };
