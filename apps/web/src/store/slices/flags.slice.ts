import { EFlagKeys, IFlagDataTypes } from "@/types/flags.types";
import { EStoreSlices } from "@/types/store.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FlagState = {
	[K in EFlagKeys]?: IFlagDataTypes[K] | undefined;
};

const initialState: FlagState = {};

const flagsSlice = createSlice({
	name: EStoreSlices.Flags,
	initialState,
	reducers: {
		setFlag: <T extends EFlagKeys>(
			state: FlagState,
			action: PayloadAction<{ key: T; value: IFlagDataTypes[T] }>
		) => {
			const { key, value } = action.payload;
			state[key] = value;
		},
		clearFlag: (
			state: FlagState,
			action: PayloadAction<{ key: EFlagKeys }>
		) => {
			const { key } = action.payload;
			delete state[key];
		},
	},
});

export const { setFlag, clearFlag } = flagsSlice.actions;
export default flagsSlice.reducer;
