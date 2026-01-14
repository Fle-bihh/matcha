import { Store } from "@reduxjs/toolkit";
import { createStore } from "@/store";

export enum EEntityTypes {
	Users = "users",
	Matches = "matches",
}

export enum EStoreSlices {
	Entities = "entities",
	Pagers = "pagers",
	Actions = "actions",
	AuthUser = "auth-user",
	Location = "location",
	Flaggers = "flaggers",
	Snackbar = "snackbar",
	Filters = "filters",
}

export type TRootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type TAppDispatch = ReturnType<typeof createStore>["dispatch"];

export type TReduxStore = Store<TRootState, any> & { dispatch: TAppDispatch };
