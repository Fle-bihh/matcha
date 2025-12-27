import { EStoreSlices } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

const initialState: SnackbarState = {
  open: false,
  message: "",
  severity: "info",
};

export interface ShowSnackbarPayload {
  message: string;
  severity?: SnackbarSeverity;
}

const snackbarSlice = createSlice({
  name: EStoreSlices.Snackbar,
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<ShowSnackbarPayload>) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || "info";
    },
    hideSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
