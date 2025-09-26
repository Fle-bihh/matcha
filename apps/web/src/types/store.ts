import { Store } from "@reduxjs/toolkit";
import { createStore } from "@/store";

export enum EEntityTypes {
	User = "user",
}

export enum EStoreSlices {
	Entities = "entities",
	Loaders = "loaders",
	Flags = "flags",
}

export type TRootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type TAppDispatch = ReturnType<typeof createStore>["dispatch"];

export type TReduxStore = Store<TRootState, any> & { dispatch: TAppDispatch };
