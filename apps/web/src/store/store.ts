import { Container } from "@/container/Container";
import { createStore } from "./index";

export const container = new Container();
export const store = createStore(container);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
