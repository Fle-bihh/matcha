import { EStoreSlices, ISetLoaderPayload, TLoaderState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TLoaderState = {};

const loadersSlice = createSlice({
	name: EStoreSlices.Loaders,
	initialState,
	reducers: {
		setLoader: (state, action: PayloadAction<ISetLoaderPayload>) => {
			const { key, loading } = action.payload;
			if (state[key] === undefined) {
				state[key] = false;
			}
			state[key] = loading;
		},
	},
});

export const { setLoader } = loadersSlice.actions;
export default loadersSlice.reducer;
