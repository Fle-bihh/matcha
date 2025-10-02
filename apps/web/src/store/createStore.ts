import { configureStore } from "@reduxjs/toolkit";
import { IContainer } from "@/types";
import entitiesReducer from "./slices/entities.slice";
import loadersReducer from "./slices/loaders.slice";
import flagsReducer from "./slices/flaggers.slice";

export const createStore = (container: IContainer) => {
	const store = configureStore({
		reducer: {
			entities: entitiesReducer,
			loaders: loadersReducer,
			flaggers: flagsReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: { container },
				},
			}),
		devTools: process.env.NODE_ENV !== "production",
	});

	return store;
};
