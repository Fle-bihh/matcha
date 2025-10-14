import { TAppDispatch, TRootState } from "@/types";
import { AuthUser } from "@matcha/shared";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import { AuthActions } from "@/store";
import { useActions } from "./actions.hooks";
import { EActionKeys } from "@/types/actions.types";

const TEST_EMAIL = "test@test.com";
const TEST_USERNAME = "testuser";
const TEST_PASSWORD = "password123-";

const selectAuthUserState = (state: TRootState) => state.authUser;

const selectAuthUser = createSelector(
	[selectAuthUserState],
	(state): AuthUser | null => {
		return state.user;
	}
);

const selectIsAuthInitialized = createSelector(
	[selectAuthUserState],
	(state): boolean => {
		return state.isInitialized;
	}
);

export const useAuthUser = () => {
	const dispatch = useDispatch<TAppDispatch>();
	const authUser = useSelector(selectAuthUser);
	const isInitialized = useSelector(selectIsAuthInitialized);

	const { isLoading, error, hasError } = useActions([
		EActionKeys.Register,
		EActionKeys.Logout,
		EActionKeys.Login,
	]);

	const register = useCallback(async () => {
		await dispatch(
			AuthActions.register({
				email: TEST_EMAIL,
				username: TEST_USERNAME,
				password: TEST_PASSWORD,
			})
		);
	}, [dispatch]);

	const authenticate = useCallback(async () => {
		dispatch(AuthActions.authenticate());
	}, [dispatch]);

	const logout = useCallback(async () => {
		await dispatch(AuthActions.logout());
	}, [dispatch]);

	const login = useCallback(async () => {
		await dispatch(
			AuthActions.login({
				email: TEST_EMAIL,
				password: TEST_PASSWORD,
			})
		);
	}, [dispatch]);

	return useMemo(
		() => ({
			authUser,
			isInitialized,
			register,
			authenticate,
			logout,
			login,
			isLoading,
			error,
			hasError,
		}),
		[
			authUser,
			isInitialized,
			register,
			isLoading,
			error,
			hasError,
			authenticate,
			logout,
			login,
		]
	);
};
