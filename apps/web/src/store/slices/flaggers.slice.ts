import {
  EFlaggers,
  FlaggerDataMap,
  FlaggerData,
  FLAGGERS_INITIAL_STATE,
} from "@/constants/flaggers.constants";
import { EStoreSlices } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FlaggersState = FlaggerDataMap;

const initialState: FlaggersState = FLAGGERS_INITIAL_STATE;

export type SetFlaggerPayload<T extends EFlaggers = EFlaggers> = {
  [K in T]: { key: K; value: FlaggerData<K> };
}[T];

const flaggersSlice = createSlice({
  name: EStoreSlices.Flaggers,
  initialState,
  reducers: {
    setFlagger: (state, action: PayloadAction<SetFlaggerPayload>) => {
      const { key, value } = action.payload;
      state[key] = value as any;
    },
    resetFlagger: <T extends EFlaggers>(
      state: FlaggersState,
      action: PayloadAction<T>
    ) => {
      state[action.payload] = initialState[action.payload] as any;
    },
  },
});

export const { setFlagger, resetFlagger } = flaggersSlice.actions;
export default flaggersSlice.reducer;
