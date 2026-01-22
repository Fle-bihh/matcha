import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ECounterKeys } from "@/constants/counter.constants";

export type CountersState = {
	[key in ECounterKeys]: number;
};

const initialState: CountersState = {
	[ECounterKeys.VisitsReceived]: 0,
};

const countersSlice = createSlice({
	name: "counters",
	initialState,
	reducers: {
		setCounter: (
			state,
			action: PayloadAction<{ key: ECounterKeys; value: number }>,
		) => {
			state[action.payload.key] = action.payload.value;
		},
		incrementCounter: (state, action: PayloadAction<ECounterKeys>) => {
			state[action.payload] += 1;
		},
		decrementCounter: (state, action: PayloadAction<ECounterKeys>) => {
			state[action.payload] -= 1;
		},
		resetCounter: (state, action: PayloadAction<ECounterKeys>) => {
			state[action.payload] = 0;
		},
	},
});

export const { setCounter, incrementCounter, decrementCounter, resetCounter } =
	countersSlice.actions;
export default countersSlice.reducer;
