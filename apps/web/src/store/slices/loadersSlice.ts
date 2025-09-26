import { EStoreSlices } from "@/types/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoaderState {
	[key: string]: boolean;
}

const initialState: LoaderState = {};

const loadersSlice = createSlice({
	name: EStoreSlices.Loaders,
	initialState,
	reducers: {
		setLoader: (
			state,
			action: PayloadAction<{ key: string; loading: boolean }>
		) => {
			const { key, loading } = action.payload;
			state[key] = loading;
		},
	},
});

export const { setLoader } = loadersSlice.actions;
export default loadersSlice.reducer;
