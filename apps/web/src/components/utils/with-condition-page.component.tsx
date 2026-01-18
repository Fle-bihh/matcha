import { APP_ROUTES } from "@/constants";
import { useAuthUser } from "@/hooks";
import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";

function withConditionPage(
	Component: FunctionComponent,
	condition: boolean,
	redirectTo: string,
) {
	return function InnerComponent(props?: any) {
		return condition ? (
			<Component {...props} />
		) : (
			<Navigate to={redirectTo} replace />
		);
	};
}

export function withLoggedOut(Component: React.FunctionComponent) {
	const { authUser } = useAuthUser();
	return withConditionPage(Component, !authUser, APP_ROUTES.protected);
}

export function withLoggedIn(Component: React.FunctionComponent) {
	const { authUser } = useAuthUser();
	return withConditionPage(Component, !!authUser, APP_ROUTES.entry);
}

export function withEmailVerified(
	Component: React.FunctionComponent,
	redirectTo = APP_ROUTES.protected,
) {
	const { authUser } = useAuthUser();
	return withConditionPage(
		Component,
		!!authUser && authUser.is_email_verified,
		redirectTo,
	);
}
