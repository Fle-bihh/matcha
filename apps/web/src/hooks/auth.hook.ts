import { EThunkFlaggerKeys, TAppDispatch, TRootState } from "@/types";
import { AuthUser } from "@matcha/shared";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useThunks } from "./thunks.hook";
import {
	authenticateThunk,
	loginThunk,
	logoutThunk,
	registerThunk,
} from "@/store/thunks";
import { useCallback, useMemo } from "react";

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

export interface IUseAuthUserReturn {
	authUser: AuthUser | null;
	register: () => Promise<void>;
	isLoading: boolean;
	error: string | null;
	hasError: boolean;
	authenticate: () => Promise<void>;
	logout: () => Promise<void>;
	login: () => Promise<void>;
}

export const useAuthUser = (): IUseAuthUserReturn => {
	const dispatch = useDispatch<TAppDispatch>();
	const authUser = useSelector(selectAuthUser);

	const { isLoading, error, hasError } = useThunks([
		EThunkFlaggerKeys.Register,
		EThunkFlaggerKeys.Logout,
		EThunkFlaggerKeys.Login,
	]);

	const register = useCallback(async () => {
		await dispatch(
			registerThunk({
				email: TEST_EMAIL,
				username: TEST_USERNAME,
				password: TEST_PASSWORD,
			})
		);
	}, [dispatch]);

	const authenticate = useCallback(async () => {
		await dispatch(authenticateThunk());
	}, [dispatch]);

	const logout = useCallback(async () => {
		await dispatch(logoutThunk());
	}, [dispatch]);

	const login = useCallback(async () => {
		await dispatch(
			loginThunk({
				email: TEST_EMAIL,
				password: TEST_PASSWORD,
			})
		);
	}, [dispatch]);

	return useMemo(
		() => ({
			authUser,
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
