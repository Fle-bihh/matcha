import { EStoreSlices } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginationMeta } from "@matcha/shared";
import { EPagerKeys } from "@/constants";

export interface PagerState {
	meta: PaginationMeta;
	entityKeys: string[];
}

export interface PagersState {
	[pagerKey: string]: PagerState;
}

const initialState: PagersState = {};

const pagersSlice = createSlice({
	name: EStoreSlices.Pagers,
	initialState,
	reducers: {
		setPager: (
			state,
			action: PayloadAction<{
				pagerKey: EPagerKeys;
				meta: PaginationMeta;
				entityKeys: string[];
			}>,
		) => {
			const { pagerKey, meta, entityKeys } = action.payload;
			state[pagerKey] = {
				meta,
				entityKeys,
			};
		},
		updatePagerMeta: (
			state,
			action: PayloadAction<{
				pagerKey: EPagerKeys;
				meta: Partial<PaginationMeta>;
			}>,
		) => {
			const { pagerKey, meta } = action.payload;
			if (state[pagerKey]) {
				state[pagerKey].meta = {
					...state[pagerKey].meta,
					...meta,
				};
			}
		},
		appendToPager: (
			state,
			action: PayloadAction<{
				pagerKey: EPagerKeys;
				meta: PaginationMeta;
				entityKeys: string[];
			}>,
		) => {
			const { pagerKey, meta, entityKeys } = action.payload;
			if (state[pagerKey]) {
				state[pagerKey].meta = meta;
				const existingKeys = new Set(state[pagerKey].entityKeys);
				const newUniqueKeys = entityKeys.filter(
					(key) => !existingKeys.has(key),
				);
				state[pagerKey].entityKeys = [
					...state[pagerKey].entityKeys,
					...newUniqueKeys,
				];
			} else {
				state[pagerKey] = {
					meta,
					entityKeys,
				};
			}
		},
		clearPager: (state, action: PayloadAction<string>) => {
			delete state[action.payload];
		},
		resetPagers: () => initialState,
	},
});

export const {
	setPager,
	appendToPager,
	updatePagerMeta,
	clearPager,
	resetPagers,
} = pagersSlice.actions;
export default pagersSlice.reducer;
