import { configureStore } from "@reduxjs/toolkit";
import { IContainer } from "@/types";
import entitiesReducer from "./slices/entities.slice";
import loadersReducer from "./slices/loaders.slice";
import flagsReducer from "./slices/flaggers.slice";
import authUserReducer from "./slices/auth-user.slice";

export const createStore = (container: IContainer) => {
	const store = configureStore({
		reducer: {
			entities: entitiesReducer,
			loaders: loadersReducer,
			flaggers: flagsReducer,
			authUser: authUserReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: { container },
				},
				serializableCheck: {},
			}),
		devTools: process.env.NODE_ENV !== "production",
	});

	return store;
};
