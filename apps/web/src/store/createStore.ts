import { configureStore } from "@reduxjs/toolkit";
import { IContainer } from "@/types/container.types";
import entitiesReducer from "./slices/entities.slice";
import loadersReducer from "./slices/loaders.slice";
import flagsReducer from "./slices/flags.slice";

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
