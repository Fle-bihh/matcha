import { configureStore } from "@reduxjs/toolkit";
import { createUserSlice } from "./slices/userSlice";
import { IContainer } from "@/types/container";

export const createStore = (container: IContainer) => {
	const store = configureStore({
		reducer: {
			users: createUserSlice(container).reducer,
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

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
