import { useActions } from "@/hooks/actions.hooks";
import { useAuthUser } from "@/hooks/auth.hook";
import { EThunkFlaggerKeys } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { PropsWithChildren, useEffect, useRef } from "react";

export function AuthProvider({ children }: PropsWithChildren<{}>) {
	const { authenticate, isInitialized } = useAuthUser();
	const { isLoading } = useActions([EActionKeys.Authenticate]);
	const hasAttemptedAuth = useRef(false);

	useEffect(() => {
		if (!hasAttemptedAuth.current && !isInitialized) {
			hasAttemptedAuth.current = true;
			authenticate();
		}
	}, [authenticate, isInitialized]);

	if (!isInitialized || isLoading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
