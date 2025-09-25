import { configureStore } from "@reduxjs/toolkit";
import userReducer, { setContainer } from "./slices/userSlice";
import { Container } from "../container/Container";

const container = new Container();

setContainer(container);

export const store = configureStore({
	reducer: {
		users: userReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
