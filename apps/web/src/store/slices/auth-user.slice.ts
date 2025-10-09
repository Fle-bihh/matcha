import { EStoreSlices } from "@/types";
import { AuthUser } from "@matcha/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthUserState {
	user: AuthUser | null;
	isInitialized: boolean;
}

const initialState: IAuthUserState = {
	user: null,
	isInitialized: false,
};

const authUserSlice = createSlice({
	name: EStoreSlices.AuthUser,
	initialState,
	reducers: {
		setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
			state.user = action.payload;
			state.isInitialized = true;
		},
		setAuthInitialized: (state, action: PayloadAction<boolean>) => {
			state.isInitialized = action.payload;
		},
	},
});

export const { setAuthUser, setAuthInitialized } = authUserSlice.actions;
export default authUserSlice.reducer;
