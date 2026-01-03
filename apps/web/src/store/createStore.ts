import { configureStore } from "@reduxjs/toolkit";
import { IContainer } from "@/types";
import entitiesReducer from "./slices/entities.slice";
import pagersReducer from "./slices/pagers.slice";
import authUserReducer from "./slices/auth-user.slice";
import locationReducer from "./slices/location.slice";
import actionsReducer from "./slices/actions.slice";
import snackbarReducer from "./slices/snackbar.slice";
import flaggersReducer from "./slices/flaggers.slice";
import filtersReducer from "./slices/filters.slice";

export const createStore = (container: IContainer) => {
	const store = configureStore({
		reducer: {
			entities: entitiesReducer,

			pagers: pagersReducer,

			actions: actionsReducer,

			authUser: authUserReducer,

			location: locationReducer,

			snackbar: snackbarReducer,

			flaggers: flaggersReducer,

			filters: filtersReducer,
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
