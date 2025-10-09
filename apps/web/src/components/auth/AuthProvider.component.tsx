import { useAuthUser } from "@/hooks/auth.hook";
import { useThunks } from "@/hooks/thunks.hook";
import { EThunkFlaggerKeys } from "@/types";
import { PropsWithChildren, useEffect, useRef } from "react";

export function AuthProvider({ children }: PropsWithChildren<{}>) {
	const { authenticate, isInitialized } = useAuthUser();
	const { isLoading } = useThunks([EThunkFlaggerKeys.Authenticate]);
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
