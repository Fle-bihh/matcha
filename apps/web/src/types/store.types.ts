import { Store } from "@reduxjs/toolkit";
import { createStore } from "@/store";
import { MatchWithDetails, VisitWithVisitedUser } from "@matcha/shared";
import { StoreUser } from "./user.types";
import { StoreMatch } from "./match.types";

export enum EEntityTypes {
	Users = "users",
	Matches = "matches",
	Visits = "visits",
}

export interface IEntityTypeMap {
	[EEntityTypes.Users]: StoreUser;
	[EEntityTypes.Matches]: StoreMatch;
	[EEntityTypes.Visits]: VisitWithVisitedUser;
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
