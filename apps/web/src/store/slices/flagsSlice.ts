import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FlagState {
	[key: string]: boolean;
}

const initialState: FlagState = {};

const flagsSlice = createSlice({
	name: "flags",
	initialState,
	reducers: {
		setFlag: (
			state,
			action: PayloadAction<{ key: string; value: boolean }>
		) => {
			const { key, value } = action.payload;
			state[key] = value;
		},
	},
});

export const { setFlag } = flagsSlice.actions;
export default flagsSlice.reducer;
