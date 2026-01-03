import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EStoreSlices } from "@/types";
import { BrowsingFilters } from "@matcha/shared";

export interface FiltersState {
	[key: string]: BrowsingFilters;
}

const initialState: FiltersState = {};

const filtersSlice = createSlice({
	name: EStoreSlices.Filters,
	initialState,
	reducers: {
		setFilters: (
			state,
			action: PayloadAction<{ key: string; filters: BrowsingFilters }>
		) => {
			const { key, filters } = action.payload;
			state[key] = filters;
		},
		updateFilters: (
			state,
			action: PayloadAction<{
				key: string;
				filters: Partial<BrowsingFilters>;
			}>
		) => {
			const { key, filters } = action.payload;
			state[key] = { ...state[key], ...filters };
		},
		clearFilters: (state, action: PayloadAction<string>) => {
			delete state[action.payload];
		},
		resetFilters: () => initialState,
	},
});

export const { setFilters, updateFilters, clearFilters, resetFilters } =
	filtersSlice.actions;
export default filtersSlice.reducer;
