import { Store } from "@reduxjs/toolkit";
import { createStore } from "@/store";

export enum EEntityTypes {
	Users = "users",
}

export enum EStoreSlices {
	Entities = "entities",
	Actions = "actions",
	AuthUser = "auth-user",
}

export type TRootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type TAppDispatch = ReturnType<typeof createStore>["dispatch"];

export type TReduxStore = Store<TRootState, any> & { dispatch: TAppDispatch };
