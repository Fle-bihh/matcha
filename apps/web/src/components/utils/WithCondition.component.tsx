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

export function withLoggedOut(Component: React.FunctionComponent) {
	return function WrappedComponent(props?: any) {
		const { authUser } = useAuthUser();
		return !authUser ? (
			<Component {...props} />
		) : (
			<Navigate to={ROUTES.protected} />
		);
	};
}

export function withLoggedIn(Component: React.FunctionComponent) {
	return function WrappedComponent(props?: any) {
		const { authUser } = useAuthUser();
		return authUser ? (
			<Component {...props} />
		) : (
			<Navigate to={ROUTES.entry} />
		);
	};
}
