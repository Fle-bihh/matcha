import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VisitsState {
	receivedCount: number;
}

const initialState: VisitsState = {
	receivedCount: 0,
};

const visitsSlice = createSlice({
	name: "visits",
	initialState,
	reducers: {
		setReceivedCount: (state, action: PayloadAction<number>) => {
			state.receivedCount = action.payload;
		},
		incrementReceivedCount: (state) => {
			state.receivedCount += 1;
		},
	},
});

export const { setReceivedCount, incrementReceivedCount } = visitsSlice.actions;
export default visitsSlice.reducer;
