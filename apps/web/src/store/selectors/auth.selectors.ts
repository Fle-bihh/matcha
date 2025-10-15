import { createSelector } from "@reduxjs/toolkit";
import { TRootState } from "@/types";
import { AuthUser } from "@matcha/shared";

const selectAuthUserState = (state: TRootState) => state.authUser;

export const selectAuthUser = createSelector(
	[selectAuthUserState],
	(state): AuthUser | null => state.user
);

export const selectIsAuthInitialized = createSelector(
	[selectAuthUserState],
	(state): boolean => state.isInitialized
);
