import { EFlaggers } from "@/constants/flaggers.constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FlaggersState = {
  [K in EFlaggers]: boolean;
};

const initialState: FlaggersState = {
  [EFlaggers.ChangeEmailDialog]: false,
};

const flaggersSlice = createSlice({
  name: "flaggers",
  initialState,
  reducers: {
    setFlagger: (
      state,
      action: PayloadAction<{ key: EFlaggers; value: boolean }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    toggleFlagger: (state, action: PayloadAction<EFlaggers>) => {
      state[action.payload] = !state[action.payload];
    },
    openFlagger: (state, action: PayloadAction<EFlaggers>) => {
      state[action.payload] = true;
    },
    closeFlagger: (state, action: PayloadAction<EFlaggers>) => {
      state[action.payload] = false;
    },
  },
});

export const { setFlagger, toggleFlagger, openFlagger, closeFlagger } =
  flaggersSlice.actions;
export default flaggersSlice.reducer;
