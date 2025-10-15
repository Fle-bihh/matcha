import { configureStore } from "@reduxjs/toolkit";
import { IContainer } from "@/types";
import entitiesReducer from "./slices/entities.slice";
import authUserReducer from "./slices/auth-user.slice";
import actionsReducer from "./slices/actions.slice";

export const createStore = (container: IContainer) => {
	const store = configureStore({
		reducer: {
			entities: entitiesReducer,

			actions: actionsReducer,

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
