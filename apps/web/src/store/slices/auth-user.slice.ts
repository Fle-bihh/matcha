import { EStoreSlices } from "@/types";
import { AuthUser } from "@matcha/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthUserState {
	user: AuthUser | null;
}

const initialState: IAuthUserState = {
	user: null,
};

const authUserSlice = createSlice({
	name: EStoreSlices.AuthUser,
	initialState,
	reducers: {
		setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
			state.user = action.payload;
		},
	},
});

export const { setAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
