import { EThunkFlaggerKeys, TAppDispatch, TRootState } from "@/types";
import { AuthUser, logger } from "@matcha/shared";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useFlagger } from "./flaggers.hook";
import { registerThunk } from "@/store/thunks/auth.thunks";
import { useCallback, useMemo } from "react";

const selectAuthUserState = (state: TRootState) => state.authUser;

const selectAuthUser = createSelector(
	[selectAuthUserState],
	(state): AuthUser | null => {
		return state.user;
	}
);

export const useAuthUser = () => {
	const dispatch = useDispatch<TAppDispatch>();

	const authUser = useSelector(selectAuthUser);

	const { data: thunk } = useFlagger({
		flagger: EThunkFlaggerKeys.Register,
	});

	const register = useCallback(async () => {
		await dispatch(registerThunk());
	}, [dispatch, registerThunk]);

	return useMemo(
		() => ({
			authUser,
			register,
			isLoading: thunk?.isLoading || false,
			error: thunk?.error?.message || null,
		}),
		[authUser, thunk, register]
	);
};
