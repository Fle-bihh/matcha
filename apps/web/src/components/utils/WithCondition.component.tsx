import { ROUTES } from "@/constants";
import { useAuthUser } from "@/hooks/auth.hook";
import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";

export function withCondition(
	Component: FunctionComponent,
	condition: boolean,
	redirectTo: string
) {
	return function InnerComponent(props?: any) {
		return condition ? (
			<Component {...props} />
		) : (
			<Navigate to={redirectTo} replace />
		);
	};
}

export const withLoggedOut = (Component: React.FunctionComponent) =>
	withCondition(Component, !useAuthUser().authUser, ROUTES.protected);

export const withLoggedIn = (Component: React.FunctionComponent) =>
	withCondition(Component, !!useAuthUser().authUser, ROUTES.entry);
