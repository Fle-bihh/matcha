import { EStoreSlices } from "@/types";
import { GeocodingResult, UserLocation } from "@matcha/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILocationState {
  selectedLocation: UserLocation | null;
  searchResults: GeocodingResult[];
  isGettingGPS: boolean;
  isSearching: boolean;
  error: string | null;
}

const initialState: ILocationState = {
  selectedLocation: null,
  searchResults: [],
  isGettingGPS: false,
  isSearching: false,
  error: null,
};

const locationSlice = createSlice({
  name: EStoreSlices.Location,
  initialState,
  reducers: {
    setSelectedLocation: (
      state,
      action: PayloadAction<UserLocation | null>
    ) => {
      state.selectedLocation = action.payload;
      state.error = null;
    },
    setSearchResults: (state, action: PayloadAction<GeocodingResult[]>) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setIsGettingGPS: (state, action: PayloadAction<boolean>) => {
      state.isGettingGPS = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearLocationError: (state) => {
      state.error = null;
    },
    resetLocationState: () => initialState,
  },
});

export const {
  setSelectedLocation,
  setSearchResults,
  clearSearchResults,
  setIsGettingGPS,
  setIsSearching,
  setError,
  clearLocationError,
  resetLocationState,
} = locationSlice.actions;

export default locationSlice.reducer;
