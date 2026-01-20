import { EStoreSlices } from "@/types";
import { AuthUser } from "@matcha/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthUserState {
	user: AuthUser | null;
	isInitialized: boolean;
	unreadMatchesCount?: number;
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
		setEmailToVerified: (state) => {
			if (state.user) {
				state.user.is_email_verified = true;
			}
		},
		setAuthInitialized: (state, action: PayloadAction<boolean>) => {
			state.isInitialized = action.payload;
		},
		changeEmail: (state, action: PayloadAction<string>) => {
			if (state.user) {
				state.user.email = action.payload;
			}
		},
		setUnreadMatchesCount: (
			state,
			action: PayloadAction<number | undefined>
		) => {
			state.unreadMatchesCount = action.payload;
		},
	},
});

export const {
	setAuthUser,
	setAuthInitialized,
	setEmailToVerified,
	changeEmail,
	setUnreadMatchesCount,
} = authUserSlice.actions;
export default authUserSlice.reducer;
