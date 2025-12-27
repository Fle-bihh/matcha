import { createSelector } from "@reduxjs/toolkit";
import { TRootState } from "@/types";
import { GeocodingResult, UserLocation } from "@matcha/shared";

const selectLocationState = (state: TRootState) => state.location;

export const selectSelectedLocation = createSelector(
  [selectLocationState],
  (state): UserLocation | null => state.selectedLocation
);

export const selectSearchResults = createSelector(
  [selectLocationState],
  (state): GeocodingResult[] => state.searchResults
);

export const selectIsGettingGPS = createSelector(
  [selectLocationState],
  (state): boolean => state.isGettingGPS
);

export const selectIsSearching = createSelector(
  [selectLocationState],
  (state): boolean => state.isSearching
);

export const selectLocationError = createSelector(
  [selectLocationState],
  (state): string | null => state.error
);
