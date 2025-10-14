import { EStoreSlices } from "@/types";
import { EActionKeys, IActionData } from "@/types/actions.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ActionState = {
	[K in EActionKeys]?: IActionData | undefined;
};

const initialState: ActionState = {};

const actionsSlice = createSlice({
	name: EStoreSlices.Actions,
	initialState,
	reducers: {
		setAction: <T extends EActionKeys>(
			state: ActionState,
			action: PayloadAction<{ key: T; value: IActionData }>
		) => {
			const { key, value } = action.payload;
			state[key] = value;
		},
		clearAction: (
			state: ActionState,
			action: PayloadAction<{ key: EActionKeys }>
		) => {
			const { key } = action.payload;
			delete state[key];
		},
	},
});

export const { setAction, clearAction } = actionsSlice.actions;
export default actionsSlice.reducer;
