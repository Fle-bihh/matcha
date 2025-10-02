import {
	EAllFlaggerKeys,
	EFlaggerKeys,
	EThunkFlaggerKeys,
	IFlaggerDataTypes,
} from "@/types";
import { EStoreSlices } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FlaggerState = {
	[K in EFlaggerKeys | EThunkFlaggerKeys]?: IFlaggerDataTypes[K] | undefined;
};

const initialState: FlaggerState = {};

const flaggersSlice = createSlice({
	name: EStoreSlices.Flaggers,
	initialState,
	reducers: {
		setFlagger: <T extends EAllFlaggerKeys>(
			state: FlaggerState,
			action: PayloadAction<{ key: T; value: IFlaggerDataTypes[T] }>
		) => {
			const { key, value } = action.payload;
			state[key] = value;
		},
		clearFlagger: (
			state: FlaggerState,
			action: PayloadAction<{ key: EAllFlaggerKeys }>
		) => {
			const { key } = action.payload;
			delete state[key];
		},
	},
});

export const { setFlagger, clearFlagger } = flaggersSlice.actions;
export default flaggersSlice.reducer;
