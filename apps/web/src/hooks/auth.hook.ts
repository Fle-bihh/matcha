import { useSelector } from "react-redux";
import { AuthActions } from "@/store";
import {
	selectAuthUser,
	selectIsAuthInitialized,
} from "@/store/selectors/auth.selectors";
import { useActions, useCreateAction } from "./actions.hooks";
import { EActionKeys } from "@/types/actions.types";

// TODO: Remove test constants when UI is implemented
const TEST_CREDENTIALS = {
	email: "test@test.com",
	username: "testuser",
	password: "password123-",
} as const;

const AUTH_ACTION_KEYS = [
	EActionKeys.Register,
	EActionKeys.Logout,
	EActionKeys.Login,
];

export const useAuthUser = () => {
	const createAction = useCreateAction();
	const authUser = useSelector(selectAuthUser);
	const isInitialized = useSelector(selectIsAuthInitialized);
	const { isLoading, error, hasError } = useActions(AUTH_ACTION_KEYS);

	const actions = {
		register: createAction(() =>
			AuthActions.register({
				email: TEST_CREDENTIALS.email,
				username: TEST_CREDENTIALS.username,
				password: TEST_CREDENTIALS.password,
			})
		),
		authenticate: createAction(() => AuthActions.authenticate()),
		logout: createAction(() => AuthActions.logout()),
		login: createAction(() =>
			AuthActions.login({
				email: TEST_CREDENTIALS.email,
				password: TEST_CREDENTIALS.password,
			})
		),
	};

	return {
		authUser,
		isInitialized,

		...actions,

		isLoading,
		error,
		hasError,
	};
};
