import { ELoaderKeys } from "./store.types";

export type TLoaderState = Partial<Record<ELoaderKeys, boolean>>;

export interface ISetLoaderPayload {
	key: ELoaderKeys;
	loading: boolean;
}
