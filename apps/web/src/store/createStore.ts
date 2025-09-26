import { configureStore } from "@reduxjs/toolkit";
import { IContainer } from "@/types/container";
import entitiesReducer from "./slices/entitiesSlice";
import loadersReducer from "./slices/loadersSlice";
import flagsReducer from "./slices/flagsSlice";

export const createStore = (container: IContainer) => {
	const store = configureStore({
		reducer: {
			entities: entitiesReducer,
			loaders: loadersReducer,
			flags: flagsReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: { container },
				},
			}),
	});

	return store;
};
