import { createSelector } from "@reduxjs/toolkit";
import { TRootState } from "@/types";
import { BrowsingFilters } from "@matcha/shared";

const selectFiltersState = (state: TRootState) => state.filters;

export const selectFilters = (key: string) =>
	createSelector(
		[selectFiltersState],
		(state): BrowsingFilters | undefined => state[key]
	);

export const selectHasActiveFilters = (key: string) =>
	createSelector([selectFilters(key)], (filters) => {
		if (!filters) return false;
		return Object.values(filters).some(
			(value) =>
				value !== undefined &&
				value !== null &&
				(Array.isArray(value) ? value.length > 0 : true)
		);
	});
